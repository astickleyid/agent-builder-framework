# MemoraForge — Complete Setup Guide (Non-Technical)

## What Is MemoraForge?

MemoraForge is a platform that lets you create **AI assistants ("agents") that never forget**.

Normal AI chatbots lose their memory after ~30 pages of conversation. MemoraForge agents
can remember the equivalent of **~10,000 pages** — across conversations, days, weeks, months.

Think of it like giving an AI a permanent notebook, a filing cabinet, and a research library
that it can search instantly.

---

## What You'll Need Before Starting

| Item | Why | How to Get It | Cost |
|------|-----|---------------|------|
| A computer (Mac, Windows, or Linux) | Runs everything locally | You probably have one | Free |
| Docker Desktop | Runs all the services in containers (like mini virtual machines) | [docker.com/get-started](https://www.docker.com/get-started/) | Free |
| Git | Downloads the code | Comes with Mac/Linux. Windows: [git-scm.com](https://git-scm.com/) | Free |
| A terminal/command prompt | Where you type commands | Already on your computer (see below) | Free |
| 16 GB RAM minimum | The AI models need memory | Check your system specs | — |
| ~20 GB free disk space | For AI models and databases | — | — |

### How to Open Your Terminal
- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter
- **Windows**: Press `Win + R`, type "cmd", press Enter (or search "PowerShell")
- **Linux**: Press `Ctrl + Alt + T`

---

## Step-by-Step Setup

### Step 1: Install Docker Desktop

Docker is like a box that contains everything MemoraForge needs — databases, AI models,
search engines — so you don't have to install them individually.

1. Go to [docker.com/get-started](https://www.docker.com/get-started/)
2. Click "Download for Mac" or "Download for Windows"
3. Run the installer, follow the prompts
4. Open Docker Desktop — you should see a whale icon in your system tray
5. **Verify it works** — open your terminal and type:

```bash
docker --version
```

You should see something like `Docker version 27.x.x`. If you see an error, restart
Docker Desktop and try again.

### Step 2: Download MemoraForge

Open your terminal and type these commands one at a time:

```bash
# Go to your home folder
cd ~

# Download MemoraForge
git clone https://github.com/astickleyid/agent-builder-framework.git

# Go into the MemoraForge folder
cd agent-builder-framework/memoraforge
```

### Step 3: Start Everything

This one command starts ALL the services (AI server, memory system, databases, everything):

```bash
docker compose up -d
```

**What to expect:**
- First time: This downloads ~5-10 GB of data. Go get coffee. ☕ (15-30 minutes)
- The `-d` flag means "run in background" so you get your terminal back
- You'll see lines like `Creating memoraforge-redis-1 ... done` for each service

**Verify everything is running:**

```bash
docker compose ps
```

You should see 8 services, all showing "Up":

```
NAME                STATUS
api-server          Up
mcp-server          Up
memory-hub          Up
acp-handler         Up
ollama              Up
postgres            Up
redis               Up
neo4j               Up
weaviate            Up
```

If any show "Exited", run `docker compose up -d` again.

### Step 4: Download an AI Model

MemoraForge uses local AI models (no OpenAI API key needed). Let's download one:

```bash
# Download the Llama 3.1 8B model (~4.7 GB)
docker compose exec ollama ollama pull llama3.1:8b
```

This takes 5-15 minutes depending on your internet speed.

### Step 5: Verify It Works

Open your web browser and visit these URLs. Each should show `"status": "healthy"`:

| Service | URL | What It Does |
|---------|-----|-------------|
| AI Server | [localhost:8000/health](http://localhost:8000/health) | Runs the AI models |
| MCP Server | [localhost:8100/health](http://localhost:8100/health) | Manages context/memory streams |
| Memory Hub | [localhost:8200/health](http://localhost:8200/health) | Long-term memory storage |
| ACP Handler | [localhost:8300/health](http://localhost:8300/health) | Agent communication protocol |

If all four show "healthy" — **congratulations, MemoraForge is running!**

---

## Using MemoraForge

### Option A: Use the Python SDK (Recommended for Beginners)

#### Install Python (if you don't have it)

1. Go to [python.org/downloads](https://www.python.org/downloads/)
2. Download Python 3.12+
3. **Important (Windows)**: Check "Add Python to PATH" during installation
4. Verify:

```bash
python3 --version
```

#### Install the MemoraForge SDK

```bash
# Install required packages
pip3 install httpx
```

#### Create Your First Agent

Create a new file called `my_first_agent.py` (use any text editor — Notepad, TextEdit, etc.):

```python
"""
My First MemoraForge Agent
--------------------------
This creates an AI agent that can remember things permanently.
"""

import asyncio
import httpx

# ----- Configuration (no need to change these) -----
ACP_URL = "http://localhost:8300"
MEMORY_URL = "http://localhost:8200"
API_URL = "http://localhost:8000"


async def main():
    async with httpx.AsyncClient(timeout=120.0) as client:

        # ===== STEP 1: Register your agent =====
        print("📝 Registering agent...")
        resp = await client.post(f"{ACP_URL}/rpc", json={
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {
                "agent_id": "my-first-agent",
                "agent_name": "My First Agent",
                "capabilities": ["memory_claw", "memory_store"],
            },
            "id": 1,
        })
        print(f"   ✅ Agent registered!\n")

        # ===== STEP 2: Store some memories =====
        memories_to_store = [
            "My name is Alex and I live in Portland, Oregon.",
            "I'm building a mobile app for tracking hiking trails.",
            "My favorite programming language is Python.",
            "The project deadline is March 30, 2026.",
            "My co-founder is Jamie, who handles the design work.",
        ]

        print("💾 Storing memories...")
        for memory in memories_to_store:
            await client.post(f"{MEMORY_URL}/ingest/store", json={
                "agent_id": "my-first-agent",
                "content": memory,
                "memory_type": "fact",
                "auto_summarize": False,
            })
            print(f"   Stored: {memory[:50]}...")
        print(f"   ✅ {len(memories_to_store)} memories stored!\n")

        # ===== STEP 3: Ask the agent to remember things =====
        print("🦀 Clawing memories (searching)...\n")

        questions = [
            "What am I building?",
            "Who is on my team?",
            "Where do I live?",
        ]

        for question in questions:
            resp = await client.post(f"{MEMORY_URL}/retrieve/claw", json={
                "query": question,
                "agent_id": "my-first-agent",
                "top_k": 3,
                "max_tokens": 5000,
            })
            data = resp.json()

            print(f"   Question: {question}")
            print(f"   Found {data['total_results']} memories in {data['retrieval_ms']:.0f}ms:")
            for result in data["results"][:2]:
                print(f"      → {result['content'][:80]}")
            print()

        # ===== STEP 4: Chat with the AI using retrieved memories =====
        print("🤖 Asking the AI a question with memory context...\n")

        # First, claw relevant memories
        resp = await client.post(f"{MEMORY_URL}/retrieve/claw", json={
            "query": "Tell me about my project",
            "agent_id": "my-first-agent",
            "top_k": 5,
            "max_tokens": 10000,
        })
        memories = resp.json()["results"]
        context = "\n".join(m["content"] for m in memories)

        # Then ask the AI with that context
        resp = await client.post(f"{API_URL}/v1/chat", json={
            "model": "llama3.1:8b",
            "messages": [
                {
                    "role": "system",
                    "content": f"You are a helpful assistant. Here is what you know about the user:\n\n{context}",
                },
                {
                    "role": "user",
                    "content": "Give me a quick status summary of my project.",
                },
            ],
            "max_tokens": 500,
        })
        answer = resp.json()["choices"][0]["message"]["content"]
        print(f"   AI Response:\n   {answer}\n")

        # ===== STEP 5: Check memory stats =====
        resp = await client.get(f"{MEMORY_URL}/stats")
        stats = resp.json()
        print(f"📊 Memory Hub Stats:")
        print(f"   Total memories: {stats['total_memories']}")
        print(f"   Total tokens: {stats['total_tokens']}")
        print(f"   Total chunks: {stats['total_chunks']}")

    print("\n✅ Done! Your agent is running with persistent memory.")


# Run it
asyncio.run(main())
```

#### Run Your Agent

```bash
python3 my_first_agent.py
```

**What you should see:**

```
📝 Registering agent...
   ✅ Agent registered!

💾 Storing memories...
   Stored: My name is Alex and I live in Portland, Oregon...
   Stored: I'm building a mobile app for tracking hiking ...
   Stored: My favorite programming language is Python...
   Stored: The project deadline is March 30, 2026...
   Stored: My co-founder is Jamie, who handles the design...
   ✅ 5 memories stored!

🦀 Clawing memories (searching)...

   Question: What am I building?
   Found 3 memories in 12ms:
      → I'm building a mobile app for tracking hiking trails.
      → My favorite programming language is Python.

   Question: Who is on my team?
   Found 2 memories in 8ms:
      → My co-founder is Jamie, who handles the design work.

   Question: Where do I live?
   Found 1 memories in 5ms:
      → My name is Alex and I live in Portland, Oregon.

🤖 Asking the AI a question with memory context...

   AI Response:
   Based on what I know, you're building a mobile hiking trail tracking app
   with your co-founder Jamie. Your deadline is March 30, 2026...

📊 Memory Hub Stats:
   Total memories: 5
   Total tokens: 127
   Total chunks: 5

✅ Done! Your agent is running with persistent memory.
```

---

### Option B: Use the Interactive Agent (Chat Mode)

Create a file called `chat_agent.py`:

```python
"""
Interactive Chat Agent — talk to an AI that remembers everything.
Type your messages, and the agent will remember across the conversation.
"""

import asyncio
import httpx

ACP_URL = "http://localhost:8300"
MEMORY_URL = "http://localhost:8200"
API_URL = "http://localhost:8000"
AGENT_ID = "chat-agent"


async def main():
    async with httpx.AsyncClient(timeout=120.0) as client:
        # Register
        await client.post(f"{ACP_URL}/rpc", json={
            "jsonrpc": "2.0",
            "method": "agent.register",
            "params": {
                "agent_id": AGENT_ID,
                "agent_name": "Chat Agent",
                "capabilities": ["memory_claw", "memory_store"],
            },
            "id": 1,
        })

        print("🦀 MemoraForge Chat Agent")
        print("   Everything you say is remembered permanently.")
        print("   Type 'quit' to exit, 'memories' to see what's stored.\n")

        conversation = []

        while True:
            user_input = input("You: ").strip()
            if not user_input:
                continue
            if user_input.lower() == "quit":
                break
            if user_input.lower() == "memories":
                resp = await client.get(f"{MEMORY_URL}/stats")
                print(f"\n📊 {resp.json()}\n")
                continue

            # 1. Store what the user said
            await client.post(f"{MEMORY_URL}/ingest/store", json={
                "agent_id": AGENT_ID,
                "content": f"User said: {user_input}",
                "memory_type": "conversation",
            })

            # 2. Claw relevant memories
            resp = await client.post(f"{MEMORY_URL}/retrieve/claw", json={
                "query": user_input,
                "agent_id": AGENT_ID,
                "top_k": 10,
                "max_tokens": 10000,
            })
            memories = resp.json().get("results", [])
            context = "\n".join(m["content"] for m in memories) if memories else "No memories yet."

            # 3. Build conversation with memory context
            messages = [
                {
                    "role": "system",
                    "content": (
                        "You are a helpful assistant with perfect memory. "
                        f"Here is what you remember:\n\n{context}"
                    ),
                },
            ]
            # Add recent conversation (last 10 exchanges)
            messages.extend(conversation[-20:])
            messages.append({"role": "user", "content": user_input})

            # 4. Get AI response
            try:
                resp = await client.post(f"{API_URL}/v1/chat", json={
                    "model": "llama3.1:8b",
                    "messages": messages,
                    "max_tokens": 1000,
                })
                answer = resp.json()["choices"][0]["message"]["content"]
            except Exception as e:
                answer = f"(AI unavailable: {e})"

            print(f"\nAgent: {answer}\n")

            # 5. Store the exchange and update conversation
            conversation.append({"role": "user", "content": user_input})
            conversation.append({"role": "assistant", "content": answer})

            await client.post(f"{MEMORY_URL}/ingest/store", json={
                "agent_id": AGENT_ID,
                "content": f"User asked: {user_input}\nAgent replied: {answer}",
                "memory_type": "conversation",
            })

    print("Goodbye! Your memories are saved for next time.")

asyncio.run(main())
```

Run it:

```bash
python3 chat_agent.py
```

Now you can chat naturally. **Everything is remembered.** Close it, come back tomorrow,
and the agent still knows everything from before.

---

## Common Tasks — Quick Reference

### Start the platform
```bash
cd ~/agent-builder-framework/memoraforge
docker compose up -d
```

### Stop the platform
```bash
docker compose down
```

### Stop AND delete all data (fresh start)
```bash
docker compose down -v
```

### Check if services are running
```bash
docker compose ps
```

### See logs when something goes wrong
```bash
# All services
docker compose logs

# Just the AI server
docker compose logs api-server

# Live/streaming logs
docker compose logs -f memory-hub
```

### See memory stats
Open in browser: [localhost:8200/stats](http://localhost:8200/stats)

### Download a different/bigger AI model
```bash
# Smaller/faster model (~2 GB)
docker compose exec ollama ollama pull llama3.2:3b

# Larger/smarter model (~26 GB, needs 32+ GB RAM)
docker compose exec ollama ollama pull llama3.1:70b
```

Then change `"model": "llama3.1:8b"` in your Python file to the new model name.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `docker: command not found` | Install Docker Desktop and restart your terminal |
| `python3: command not found` | Install Python from python.org, restart terminal |
| `Connection refused` on localhost | Run `docker compose up -d` and wait 30 seconds |
| AI responses are very slow | Normal for first request (~30s). After that, ~2-5s. |
| Out of memory errors | Close other apps. Or use smaller model: `llama3.2:3b` |
| `port already in use` | Another app is using that port. Run `docker compose down` then `up -d` |
| Services keep restarting | Check logs: `docker compose logs api-server` |

---

## What Each Piece Does (Plain English)

```
┌──────────────────────────────────────────────────────────────┐
│                     YOUR PYTHON SCRIPT                       │
│               (my_first_agent.py / chat_agent.py)            │
│                                                              │
│  This is what YOU write and control.                         │
│  It talks to the services below via simple web requests.     │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┼────────────────┐
              ▼            ▼                ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────────┐
│   ACP Handler    │ │  Memory Hub  │ │   AI Server      │
│   (Receptionist) │ │  (Library)   │ │   (Brain)        │
│                  │ │              │ │                  │
│ Registers agents │ │ Stores all   │ │ Runs the actual  │
│ Checks ID/auth   │ │ memories     │ │ AI model that    │
│ Routes messages  │ │ Searches     │ │ generates text   │
│ Keeps logs       │ │ them fast    │ │ responses        │
└──────────────────┘ └──────┬───────┘ └──────────────────┘
                            │
              ┌─────────────┼──────────────┐
              ▼             ▼              ▼
        ┌──────────┐ ┌──────────┐  ┌──────────────┐
        │ Weaviate │ │  Neo4j   │  │  PostgreSQL   │
        │          │ │          │  │               │
        │ "Filing  │ │ "Mind    │  │ "Record       │
        │ cabinet" │ │  map"    │  │  book"        │
        │ finds    │ │ connects │  │ stores logs,  │
        │ similar  │ │ related  │  │ metadata,     │
        │ memories │ │ concepts │  │ audit trail   │
        └──────────┘ └──────────┘  └───────────────┘
```

---

## Cost

**Running locally: $0** (just your electricity)

**Running in the cloud (production, for a business):**

| Tier | What You Get | Est. Monthly Cost |
|------|-------------|-------------------|
| Dev/Hobby | 1 GPU, small models, single user | ~$200-400 |
| Startup | 2 GPUs, 70B model, 10 agents | ~$2,000-4,000 |
| Production | Full cluster, auto-scaling, HA | ~$10,000+ |
