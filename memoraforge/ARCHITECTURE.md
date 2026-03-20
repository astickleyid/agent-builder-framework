# MemoraForge — Production Architecture

## High-Level System Diagram

```mermaid
graph TB
    subgraph Clients["Client Layer"]
        SDK_PY["Python SDK"]
        SDK_TS["TypeScript SDK"]
        VB["Visual Builder<br/>(React + Flow)"]
        CLI["CLI Tools"]
    end

    subgraph ACP_Layer["Agent Client Protocol (ACP)"]
        ACP["ACP Gateway<br/>JSON-RPC 2.0<br/>Schema Validation"]
    end

    subgraph Agents["Agent Layer"]
        OCA["Open Claw Agent<br/>(LangGraph/LlamaIndex)"]
        UA1["User Agent 1"]
        UA2["User Agent N"]
        ORCH["Multi-Agent<br/>Orchestrator"]
    end

    subgraph MCP_Layer["Model Context Protocol (MCP)"]
        MCP["MCP Server<br/>gRPC + WebSocket"]
        CS["Context Streams"]
        CC["LZ4 Compression<br/>+ Semantic Chunking"]
        CV["Context Versioning"]
    end

    subgraph API_Layer["Headless API Servers"]
        API1["FastAPI + vLLM<br/>(GPU Instance 1)"]
        API2["FastAPI + Ollama<br/>(GPU Instance 2)"]
        APILB["Load Balancer<br/>(Nginx/Envoy)"]
    end

    subgraph Memory["Memory Hub (Standalone Microservice)"]
        MH["Memory Hub API<br/>(FastAPI)"]
        RAG["Hierarchical RAG<br/>Engine"]
        KG["Knowledge Graph<br/>(Neo4j)"]
        VS["Vector Store<br/>(Weaviate)"]
        AS["Auto-Summarizer<br/>(Small Models)"]
        EV["Eviction Engine<br/>(LRU + Relevance)"]
    end

    subgraph Infra["Infrastructure"]
        PG["PostgreSQL"]
        RD["Redis Cache"]
        K8S["Kubernetes"]
        PROM["Prometheus<br/>+ Grafana"]
    end

    SDK_PY & SDK_TS & VB & CLI --> ACP
    ACP --> OCA & UA1 & UA2 & ORCH
    ORCH --> OCA & UA1 & UA2
    OCA & UA1 & UA2 --> MCP
    MCP --> CS & CC & CV
    MCP --> APILB --> API1 & API2
    OCA & UA1 & UA2 --> MH
    MH --> RAG & KG & VS & AS & EV
    MH --> PG & RD
    MCP --> RD
    ACP --> PG

    style Memory fill:#1a1a2e,stroke:#e94560,color:#fff
    style MCP_Layer fill:#16213e,stroke:#0f3460,color:#fff
    style ACP_Layer fill:#0f3460,stroke:#533483,color:#fff
    style Agents fill:#533483,stroke:#e94560,color:#fff
```

## Context Flow — How Agents See 5M+ Tokens

```mermaid
sequenceDiagram
    participant Agent as Open Claw Agent
    participant MCP as MCP Server
    participant Hub as Memory Hub
    participant VS as Vector Store
    participant KG as Knowledge Graph
    participant LLM as Headless API (LLM)

    Agent->>MCP: Subscribe to context stream
    MCP-->>Agent: Stream ID + version token

    Agent->>Hub: memory.claw(query, top_k=50)
    Hub->>VS: Semantic search (embedding)
    Hub->>KG: Graph traversal (2-hop)
    VS-->>Hub: Top 50 chunks (ranked)
    KG-->>Hub: Related entities + edges
    Hub->>Hub: Merge + deduplicate + rank
    Hub-->>Agent: Compressed context bundle (≤100ms)

    Agent->>MCP: push_context(bundle, priority=HIGH)
    MCP->>MCP: LZ4 compress + semantic chunk
    MCP->>MCP: Version context (v42 → v43)
    MCP-->>Agent: Context injected (stream updated)

    Agent->>LLM: Generate(prompt + injected context)
    LLM-->>Agent: Response

    Agent->>Hub: memory.store(response, metadata)
    Hub->>VS: Index new embedding
    Hub->>KG: Update graph relations
    Hub-->>Agent: Stored (memory_id)
```

## Memory Clawing — Retrieval Pipeline

```mermaid
flowchart LR
    Q["Query"] --> EMB["Embed Query<br/>(384-dim)"]
    EMB --> PAR{Parallel Retrieval}
    PAR --> VS["Vector Store<br/>ANN Search<br/>Top-K=100"]
    PAR --> KG["Knowledge Graph<br/>2-hop Traversal"]
    PAR --> FTS["Full-Text Search<br/>PostgreSQL"]
    VS --> MERGE["Merge + Deduplicate"]
    KG --> MERGE
    FTS --> MERGE
    MERGE --> RANK["Re-Rank<br/>(Cross-Encoder)"]
    RANK --> FILT["Filter by Relevance<br/>Score > 0.3"]
    FILT --> COMP["LZ4 Compress"]
    COMP --> INJ["Inject into<br/>Context Window"]
```

## Component Specifications

### 1. Headless API Server
- **Runtime**: FastAPI 0.115+ on Uvicorn (Python 3.12)
- **Model backends**: vLLM (GPU), Ollama (CPU/edge)
- **Scaling**: Horizontal via K8s HPA (CPU/GPU metrics)
- **Endpoints**: `/v1/completions`, `/v1/chat`, `/v1/embeddings`
- **Latency target**: P99 < 200ms for embeddings, < 2s for generation

### 2. MCP Server (Model Context Protocol)
- **Transport**: gRPC (inter-service) + WebSocket (agent-facing)
- **Compression**: LZ4 real-time + semantic chunking (512-token windows)
- **Versioning**: Append-only log, snapshot every 100 versions
- **Stream model**: Pub/sub — agents subscribe to named streams
- **Max stream size**: 5M tokens (effective), 128K injected per LLM call

### 3. ACP Handler (Agent Client Protocol)
- **Protocol**: JSON-RPC 2.0 over WebSocket
- **Schema**: JSON Schema validation on every request/response
- **Methods**: `agent.register`, `agent.invoke`, `memory.claw`, `memory.store`, `context.subscribe`, `orchestrator.dispatch`
- **Auth**: JWT + API key dual authentication
- **Rate limits**: Token bucket per agent (configurable)

### 4. Memory Hub
- **Type**: Standalone FastAPI microservice
- **Vector store**: Weaviate (self-hosted) — 384-dim embeddings
- **Knowledge graph**: Neo4j 5.x — entities + relations
- **Relational**: PostgreSQL 16 — metadata, audit logs
- **Cache**: Redis 7 — hot path caching, LRU eviction
- **Retrieval**: Hierarchical RAG (document → section → chunk)
- **Summarization**: Runs smaller model (Phi-3 / Mistral-7B) for auto-summarization
- **Eviction**: Combined LRU + relevance decay scoring
- **SLA**: P99 retrieval < 100ms for 5M token corpus

### 5. Open Claw Agent
- **Framework**: LangGraph (state machine) + LlamaIndex (retrieval)
- **Shadow memory**: Each agent maintains persistent state in Memory Hub
- **Capabilities**: Web scraping, file ingestion, API calls, code execution
- **Extensibility**: Plugin system for custom tools

## Security Architecture

```mermaid
flowchart TB
    REQ["Incoming Request"] --> TLS["TLS 1.3<br/>End-to-End"]
    TLS --> AUTH["Auth Layer"]
    AUTH --> JWT["JWT Validation"]
    AUTH --> API_KEY["API Key Check"]
    JWT & API_KEY --> RBAC["RBAC Engine"]
    RBAC --> RATE["Rate Limiter<br/>(Token Bucket)"]
    RATE --> AUDIT["Audit Logger<br/>(PostgreSQL)"]
    AUDIT --> SERVICE["Service Handler"]
    SERVICE --> ENCRYPT["At-Rest Encryption<br/>(AES-256)"]
```

## Kubernetes Deployment

```mermaid
graph TB
    subgraph K8s["Kubernetes Cluster"]
        subgraph NS_API["namespace: memoraforge-api"]
            API_DEP["API Server<br/>Deployment<br/>2-8 replicas"]
            API_HPA["HPA<br/>CPU: 70%"]
        end
        subgraph NS_MCP["namespace: memoraforge-mcp"]
            MCP_DEP["MCP Server<br/>StatefulSet<br/>3 replicas"]
        end
        subgraph NS_MEM["namespace: memoraforge-memory"]
            MH_DEP["Memory Hub<br/>Deployment<br/>3-10 replicas"]
            MH_HPA["HPA<br/>RPS: 1000"]
        end
        subgraph NS_DATA["namespace: memoraforge-data"]
            PG["PostgreSQL<br/>HA (Patroni)"]
            REDIS["Redis Sentinel<br/>3 nodes"]
            NEO["Neo4j Cluster<br/>3 cores"]
            WV["Weaviate<br/>3 replicas"]
        end
    end
    API_HPA --> API_DEP
    MH_HPA --> MH_DEP
```

## Cost Estimates (Monthly, Production)

| Component | Spec | Est. Cost |
|-----------|------|-----------|
| API Servers (2x A100 GPU) | vLLM inference | $6,000 |
| MCP Server (3x c6i.2xlarge) | gRPC + streaming | $900 |
| Memory Hub (3x r6i.2xlarge) | RAG + retrieval | $1,200 |
| Neo4j (3-core cluster) | Knowledge graph | $800 |
| Weaviate (3x r6i.xlarge) | Vector search | $600 |
| PostgreSQL (db.r6g.xlarge HA) | Metadata | $500 |
| Redis (r6g.large sentinel) | Caching | $300 |
| K8s control plane + networking | EKS | $400 |
| **Total** | | **~$10,700/mo** |

## 4-Week Implementation Roadmap

### Week 1: Foundation
- [ ] Memory Hub core: vector store integration, basic CRUD
- [ ] MCP Server: WebSocket transport, LZ4 compression
- [ ] ACP Handler: JSON-RPC 2.0 skeleton, schema validation
- [ ] Docker Compose for local dev stack

### Week 2: Intelligence
- [ ] Hierarchical RAG pipeline in Memory Hub
- [ ] Knowledge graph integration (Neo4j)
- [ ] Context versioning in MCP
- [ ] Auto-summarization pipeline
- [ ] Headless API server with vLLM/Ollama backends

### Week 3: Agents & Orchestration
- [ ] Open Claw Agent with LangGraph state machine
- [ ] Shadow memory integration
- [ ] Multi-agent orchestrator
- [ ] Python SDK (core methods)
- [ ] TypeScript SDK (core methods)

### Week 4: Production Hardening
- [ ] End-to-end encryption + RBAC
- [ ] Rate limiting + audit logging
- [ ] Kubernetes manifests + Helm charts
- [ ] Load testing (target: 1000 RPS retrieval)
- [ ] Visual Builder UI (React + Flow)
- [ ] Documentation + examples

## Edge Cases & Error Handling

| Scenario | Handling |
|----------|----------|
| Context overflow (>128K for LLM call) | MCP auto-truncates by priority score, keeps system prompt + recent context |
| Stale memory | Relevance decay: score *= 0.95^(days_since_access); evict below 0.1 |
| Vector store timeout | Circuit breaker (3 failures → fallback to FTS-only for 30s) |
| Neo4j partition | Read from nearest replica; queue writes for reconciliation |
| Embedding model drift | Version all embeddings; re-index pipeline on model change |
| Agent crash mid-memory-write | Write-ahead log in Redis; replay on agent restart |
| Concurrent memory updates | Optimistic locking with version vectors per memory shard |
| LLM rate limit hit | Exponential backoff + queue with priority (paid > free tier) |

## Optimization Tricks

1. **Quantization**: GPTQ/AWQ 4-bit for inference models; full precision only for embedding
2. **Caching layers**: Redis L1 (hot, 1min TTL) → PostgreSQL L2 (warm) → Weaviate L3 (cold)
3. **Parallel retrieval**: Fan-out to VS + KG + FTS simultaneously, merge results
4. **Semantic chunking**: Sentence-boundary aware splitting (not fixed-size)
5. **Embedding cache**: Hash query → cached embedding (Redis, 24h TTL)
6. **Batch embedding**: Accumulate queries, batch embed every 50ms
7. **Connection pooling**: asyncpg pool (min=10, max=50) for PostgreSQL
8. **Pre-fetch**: Predict next likely queries from conversation flow, pre-warm cache
