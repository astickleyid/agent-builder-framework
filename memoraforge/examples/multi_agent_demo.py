"""
Multi-Agent Demo — two agents that share knowledge.

Agent 1 ("Researcher") stores facts.
Agent 2 ("Writer") retrieves those facts and generates content.

This shows how agents can collaborate through shared memory.

Run:  python3 multi_agent_demo.py
Requires: pip3 install httpx
"""

import asyncio
import httpx

ACP_URL = "http://localhost:8300"
MEMORY_URL = "http://localhost:8200"
API_URL = "http://localhost:8000"


async def register_agent(client: httpx.AsyncClient, agent_id: str, name: str):
    """Register an agent with the platform."""
    await client.post(f"{ACP_URL}/rpc", json={
        "jsonrpc": "2.0",
        "method": "agent.register",
        "params": {
            "agent_id": agent_id,
            "agent_name": name,
            "capabilities": ["memory_claw", "memory_store"],
        },
        "id": 1,
    })
    print(f"   Registered: {name} ({agent_id})")


async def store_memory(client: httpx.AsyncClient, agent_id: str, content: str):
    """Store a memory for an agent."""
    await client.post(f"{MEMORY_URL}/ingest/store", json={
        "agent_id": agent_id,
        "content": content,
        "memory_type": "fact",
        "auto_summarize": False,
    })


async def claw_memories(client: httpx.AsyncClient, agent_id: str, query: str) -> list:
    """Retrieve memories for an agent."""
    resp = await client.post(f"{MEMORY_URL}/retrieve/claw", json={
        "query": query,
        "agent_id": agent_id,
        "top_k": 10,
        "max_tokens": 10000,
    })
    return resp.json().get("results", [])


async def main():
    async with httpx.AsyncClient(timeout=120.0) as client:

        # ── Setup ───────────────────────────────────────────────
        print("\n🤝 Multi-Agent Demo\n")
        print("📝 Registering agents...")
        await register_agent(client, "researcher", "Research Agent")
        await register_agent(client, "writer", "Writer Agent")
        print()

        # ── Researcher stores knowledge ─────────────────────────
        print("🔬 Researcher is gathering facts...\n")
        research_facts = [
            "Solar panels convert sunlight into electricity using photovoltaic cells.",
            "The global solar energy market is expected to reach $1 trillion by 2030.",
            "Solar panels have an average lifespan of 25-30 years.",
            "China produces over 80% of the world's solar panels.",
            "The cost of solar energy has dropped 90% in the last decade.",
            "Solar farms can be built on non-arable land, preserving farmland.",
            "Battery storage technology is key to making solar energy reliable 24/7.",
        ]

        for fact in research_facts:
            await store_memory(client, "researcher", fact)
            print(f"   📌 {fact[:65]}...")
        print()

        # ── Writer claws the research and creates content ───────
        print("✍️  Writer is pulling research and drafting...\n")

        memories = await claw_memories(client, "researcher", "solar energy market and technology")
        context = "\n".join(f"- {m['content']}" for m in memories)

        print(f"   Clawed {len(memories)} research memories\n")

        resp = await client.post(f"{API_URL}/v1/chat", json={
            "model": "llama3.1:8b",
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are a professional writer. Use ONLY the research "
                        "facts provided to write a short blog paragraph. "
                        "Do not make up statistics.\n\n"
                        f"Research facts:\n{context}"
                    ),
                },
                {
                    "role": "user",
                    "content": "Write a 3-sentence blog intro about the solar energy boom.",
                },
            ],
            "max_tokens": 300,
        })

        article = resp.json()["choices"][0]["message"]["content"]
        print(f"   📰 Generated article:\n")
        print(f"   {article}\n")

        # ── Writer stores the output ────────────────────────────
        await store_memory(client, "writer", f"Blog article draft: {article}")
        print("   💾 Writer saved the article to memory.\n")

        # ── Show collaboration stats ────────────────────────────
        stats = (await client.get(f"{MEMORY_URL}/stats")).json()
        print(f"📊 Platform stats:")
        print(f"   Total memories: {stats['total_memories']}")
        print(f"   Total tokens: {stats['total_tokens']}")
        print(f"   Types: {stats['type_breakdown']}\n")

    print("✅ Demo complete — agents collaborated through shared memory!\n")


asyncio.run(main())
