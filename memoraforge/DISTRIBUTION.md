# How To Get MemoraForge

## 5 Ways Consumers Can Get It

---

### 1. One-Line Install (Recommended for individuals)

Open a terminal and paste:

```bash
curl -fsSL https://raw.githubusercontent.com/astickleyid/agent-builder-framework/main/memoraforge/install.sh | bash
```

**What happens:**
- Checks you have Docker, Python, and Git
- Downloads MemoraForge
- Installs the `memoraforge` CLI command
- Starts all services
- Downloads an AI model

**After install, you get:**
```
memoraforge status               # Is everything running?
memoraforge agent create MyBot   # Create an AI agent
memoraforge agent chat mybot     # Talk to it (it remembers everything)
memoraforge memory store "..."   # Store a fact manually
memoraforge memory search "..."  # Search stored memories
memoraforge stop                 # Shut down
memoraforge start                # Start again
```

**Requirements:** Docker Desktop + Python 3.12+ + 16GB RAM + 20GB disk

---

### 2. pip install (For Python developers)

```bash
pip install memoraforge
```

Then in your code:

```python
from memoraforge.sdk.python.memoraforge_sdk import MemoraForge

mf = MemoraForge()
agent = await mf.create_agent(name="my-agent")
await agent.store("The capital of France is Paris.")
memories = await agent.claw("What is the capital of France?")
```

You still need the services running — start them with:
```bash
memoraforge start
```

---

### 3. Docker Pull (For DevOps / self-hosting)

Pre-built images for each service:

```bash
# Pull all services
docker pull ghcr.io/astickleyid/memoraforge-api-server:latest
docker pull ghcr.io/astickleyid/memoraforge-mcp-server:latest
docker pull ghcr.io/astickleyid/memoraforge-memory-hub:latest
docker pull ghcr.io/astickleyid/memoraforge-acp-handler:latest
```

Or use our Docker Compose (starts everything including databases):

```bash
git clone https://github.com/astickleyid/agent-builder-framework.git
cd agent-builder-framework/memoraforge
docker compose up -d
```

---

### 4. Helm Chart (For Kubernetes / enterprise)

```bash
# Add the chart repo
helm repo add memoraforge https://astickleyid.github.io/agent-builder-framework/charts

# Install with defaults
helm install memoraforge memoraforge/memoraforge

# Install with custom values
helm install memoraforge memoraforge/memoraforge \
  --set apiServer.replicaCount=4 \
  --set memoryHub.autoscaling.maxReplicas=20 \
  --set postgresql.auth.password=YOUR_PASSWORD
```

Includes: auto-scaling, network policies, pod security, Prometheus monitoring.

---

### 5. GitHub Source (For contributors / custom builds)

```bash
git clone https://github.com/astickleyid/agent-builder-framework.git
cd agent-builder-framework/memoraforge

# Install dev dependencies
pip install -r requirements.txt

# Run individual services
uvicorn memory_hub.app:app --port 8200
uvicorn mcp_server.server:app --port 8100
uvicorn acp_handler.handler:app --port 8300
uvicorn api_server.server:app --port 8000
```

---

## Which Option Should I Choose?

```
Are you technical?
├── No → Option 1 (one-line install)
│
├── Yes, I write Python → Option 2 (pip install)
│
├── Yes, I manage servers → Option 3 (Docker)
│
├── Yes, I run Kubernetes → Option 4 (Helm)
│
└── Yes, I want to modify the code → Option 5 (Source)
```

---

## Pricing Plans

| Plan | For | Includes | Price |
|------|-----|----------|-------|
| **Community** | Individual developers | Full platform, local models, unlimited agents | Free |
| **Pro** | Small teams | + Priority support, cloud model access, team sharing | $29/user/mo |
| **Enterprise** | Organizations | + SSO, audit compliance, SLA, dedicated support | Custom |

All plans include:
- Unlimited agents
- Unlimited memory storage (limited by your hardware)
- All 5 services (API, MCP, Memory Hub, ACP, Visual Builder)
- Python + TypeScript SDKs
- CLI tool

---

## Support Channels

| Channel | Response Time | Availability |
|---------|---------------|-------------|
| GitHub Issues | 24-48 hours | Community + Pro + Enterprise |
| Documentation | Self-service | All plans |
| Discord Community | Community-driven | All plans |
| Email Support | 4-hour SLA | Pro + Enterprise |
| Dedicated Slack | 1-hour SLA | Enterprise |
| Phone/Video | Scheduled | Enterprise |

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────┐
│              MEMORAFORGE QUICK REFERENCE                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  INSTALL:  curl -fsSL .../install.sh | bash             │
│                                                         │
│  START:    memoraforge start                            │
│  STOP:     memoraforge stop                             │
│  STATUS:   memoraforge status                           │
│                                                         │
│  AGENTS:   memoraforge agent create <name>              │
│            memoraforge agent list                       │
│            memoraforge agent chat <id>                  │
│                                                         │
│  MEMORY:   memoraforge memory store "text"              │
│            memoraforge memory search "query"            │
│            memoraforge memory stats                     │
│                                                         │
│  UI:       memoraforge ui                               │
│  LOGS:     memoraforge logs -f                          │
│                                                         │
│  SERVICES:                                              │
│    API Server:   http://localhost:8000                   │
│    MCP Server:   http://localhost:8100                   │
│    Memory Hub:   http://localhost:8200                   │
│    ACP Handler:  http://localhost:8300                   │
│    Visual Builder: http://localhost:3000                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```
