"""Knowledge graph service — Neo4j integration for entity/relation traversal."""

from __future__ import annotations

import logging
import time
from typing import Any

logger = logging.getLogger(__name__)


class KnowledgeGraphService:
    """Neo4j-backed knowledge graph for entity relationships.

    Stores entities and relations extracted from memories, enabling
    graph traversal during "memory clawing" for richer context.
    """

    def __init__(self, neo4j_uri: str = "bolt://neo4j:7687", user: str = "neo4j", password: str = "memoraforge"):
        self.neo4j_uri = neo4j_uri
        self._user = user
        self._password = password
        self._driver = None
        # In-memory fallback
        self._entities: dict[str, dict[str, Any]] = {}
        self._relations: list[dict[str, Any]] = []

    async def initialize(self):
        """Connect to Neo4j and create constraints."""
        try:
            from neo4j import AsyncGraphDatabase
            self._driver = AsyncGraphDatabase.driver(
                self.neo4j_uri,
                auth=(self._user, self._password),
            )
            await self._ensure_constraints()
            logger.info("Connected to Neo4j at %s", self.neo4j_uri)
        except ImportError:
            logger.warning("Neo4j driver not installed, using in-memory fallback")
        except Exception as e:
            logger.warning("Neo4j unavailable (%s), using in-memory fallback", e)

    async def _ensure_constraints(self):
        """Create uniqueness constraints on entity IDs."""
        if not self._driver:
            return
        async with self._driver.session() as session:
            await session.run(
                "CREATE CONSTRAINT IF NOT EXISTS FOR (e:Entity) REQUIRE e.entity_id IS UNIQUE"
            )

    async def add_entity(
        self,
        entity_id: str,
        name: str,
        entity_type: str,
        properties: dict[str, Any] | None = None,
        memory_ids: list[str] | None = None,
    ) -> str:
        """Add or update an entity in the knowledge graph."""
        props = properties or {}

        if self._driver:
            async with self._driver.session() as session:
                await session.run(
                    """
                    MERGE (e:Entity {entity_id: $entity_id})
                    SET e.name = $name,
                        e.entity_type = $entity_type,
                        e.properties = $properties,
                        e.memory_ids = $memory_ids,
                        e.updated_at = timestamp()
                    """,
                    entity_id=entity_id,
                    name=name,
                    entity_type=entity_type,
                    properties=str(props),
                    memory_ids=memory_ids or [],
                )
        else:
            self._entities[entity_id] = {
                "entity_id": entity_id,
                "name": name,
                "entity_type": entity_type,
                "properties": props,
                "memory_ids": memory_ids or [],
            }

        return entity_id

    async def add_relation(
        self,
        source_id: str,
        target_id: str,
        relation_type: str,
        weight: float = 1.0,
        metadata: dict[str, Any] | None = None,
    ):
        """Add a directed relation between two entities."""
        if self._driver:
            async with self._driver.session() as session:
                await session.run(
                    f"""
                    MATCH (a:Entity {{entity_id: $source_id}})
                    MATCH (b:Entity {{entity_id: $target_id}})
                    MERGE (a)-[r:{relation_type.upper().replace(' ', '_')}]->(b)
                    SET r.weight = $weight,
                        r.metadata = $metadata
                    """,
                    source_id=source_id,
                    target_id=target_id,
                    weight=weight,
                    metadata=str(metadata or {}),
                )
        else:
            self._relations.append({
                "source_id": source_id,
                "target_id": target_id,
                "relation_type": relation_type,
                "weight": weight,
                "metadata": metadata or {},
            })

    async def traverse(
        self,
        start_entity_id: str,
        max_depth: int = 2,
        relation_types: list[str] | None = None,
        max_nodes: int = 50,
    ) -> dict[str, Any]:
        """Traverse the graph from a starting entity.

        Returns entities and relations within max_depth hops.
        This is the core "graph clawing" operation.
        """
        start = time.time()

        if self._driver:
            result = await self._neo4j_traverse(start_entity_id, max_depth, max_nodes)
        else:
            result = self._inmemory_traverse(start_entity_id, max_depth, max_nodes)

        elapsed_ms = (time.time() - start) * 1000
        logger.debug("Graph traversal from %s: %d entities, %d relations in %.1fms",
                      start_entity_id, len(result.get("entities", [])),
                      len(result.get("relations", [])), elapsed_ms)
        return result

    async def find_entities_by_name(self, query: str, limit: int = 10) -> list[dict[str, Any]]:
        """Find entities by name (fuzzy match)."""
        if self._driver:
            async with self._driver.session() as session:
                result = await session.run(
                    """
                    MATCH (e:Entity)
                    WHERE toLower(e.name) CONTAINS toLower($query)
                    RETURN e
                    LIMIT $limit
                    """,
                    query=query,
                    limit=limit,
                )
                records = await result.data()
                return [dict(r["e"]) for r in records]
        else:
            query_lower = query.lower()
            return [
                e for e in self._entities.values()
                if query_lower in e["name"].lower()
            ][:limit]

    async def get_memory_entities(self, memory_id: str) -> list[dict[str, Any]]:
        """Get all entities linked to a specific memory."""
        if self._driver:
            async with self._driver.session() as session:
                result = await session.run(
                    """
                    MATCH (e:Entity)
                    WHERE $memory_id IN e.memory_ids
                    RETURN e
                    """,
                    memory_id=memory_id,
                )
                records = await result.data()
                return [dict(r["e"]) for r in records]
        else:
            return [
                e for e in self._entities.values()
                if memory_id in e.get("memory_ids", [])
            ]

    async def _neo4j_traverse(
        self, start_id: str, max_depth: int, max_nodes: int,
    ) -> dict[str, Any]:
        """Neo4j graph traversal using variable-length path matching."""
        async with self._driver.session() as session:
            result = await session.run(
                f"""
                MATCH path = (start:Entity {{entity_id: $start_id}})-[*1..{max_depth}]-(connected)
                WITH connected, relationships(path) as rels, length(path) as depth
                ORDER BY depth
                LIMIT $max_nodes
                RETURN collect(DISTINCT connected) as entities,
                       collect(DISTINCT rels) as all_relations
                """,
                start_id=start_id,
                max_nodes=max_nodes,
            )
            record = await result.single()
            if not record:
                return {"entities": [], "relations": []}

            return {
                "entities": [dict(e) for e in record["entities"]],
                "relations": [],  # Simplified
            }

    def _inmemory_traverse(
        self, start_id: str, max_depth: int, max_nodes: int,
    ) -> dict[str, Any]:
        """In-memory BFS traversal fallback."""
        visited: set[str] = set()
        queue: list[tuple[str, int]] = [(start_id, 0)]
        found_entities: list[dict[str, Any]] = []
        found_relations: list[dict[str, Any]] = []

        while queue and len(found_entities) < max_nodes:
            current_id, depth = queue.pop(0)
            if current_id in visited or depth > max_depth:
                continue
            visited.add(current_id)

            entity = self._entities.get(current_id)
            if entity:
                found_entities.append(entity)

            # Find connected entities
            for rel in self._relations:
                neighbor_id = None
                if rel["source_id"] == current_id:
                    neighbor_id = rel["target_id"]
                elif rel["target_id"] == current_id:
                    neighbor_id = rel["source_id"]

                if neighbor_id and neighbor_id not in visited:
                    found_relations.append(rel)
                    queue.append((neighbor_id, depth + 1))

        return {"entities": found_entities, "relations": found_relations}

    async def close(self):
        """Close Neo4j driver connection."""
        if self._driver:
            await self._driver.close()
