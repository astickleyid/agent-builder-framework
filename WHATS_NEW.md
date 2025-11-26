# 🎉 What's New in Stick CLI v1.1.0

## Major Updates

### 🤖 Meet Stick Agent - Your AI Guide

The CLI now features **Stick Agent**, an intelligent AI assistant that guides you through building anything with natural conversation.

```bash
# Just run stick
stick

# Then describe what you want:
> "I want to build a chatbot that can search GitHub"

# Stick Agent will:
# ✅ Ask clarifying questions
# ✅ Break it into clear steps
# ✅ Suggest exact commands
# ✅ Execute them for you
# ✅ Guide you through testing and deployment
```

**No confusion. No memorization. Just describe what you want.**

### 💬 Natural Language Interface

The entire CLI now understands natural language:

```bash
# All of these work:
stick create a chatbot for customer support
stick build an agent with web search
stick run mybot using ollama with mistral
stick deploy my-agent as an API on port 4000
stick help me build an MCP server
stick show me my agents
```

60+ natural language phrases supported across all commands.

### 🚀 Real Deployment

`stick deploy` now **actually deploys** your agent as a working HTTP API:

```bash
stick deploy

# Creates real server with endpoints:
# POST   /api/chat      - Send messages to agent
# GET    /api/health    - Health check
# GET    /api/metrics   - Performance metrics
# GET    /api/config    - Agent configuration

# Test it:
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

Plus Docker support for cloud deployment:
- Auto-generates Dockerfile
- Provides AWS, GCP, K8s deployment commands
- Health checks included

### 📋 Complete Guidance System

Never be confused again:

1. **Starting out?** → `stick` launches guided assistant
2. **Know what you want?** → Use natural language
3. **Advanced user?** → Traditional commands still work
4. **Need examples?** → `stick examples` shows 60+ phrases
5. **Want to learn?** → CLI explains every step

### 🎯 New Commands

```bash
# AI Assistant (guided building)
stick assistant
stick ai

# Natural language examples
stick examples

# MCP Server management
stick mcp create <name>      # Build custom tools
stick mcp install <server>   # Install existing tools
stick mcp list              # Show available tools
stick mcp test <server>     # Test tools

# Multi-agent systems
stick multi-agent create <name>
stick multi-agent diagram <name>
stick multi-agent run <name>

# Workflow pipelines
stick workflow create <name>
stick workflow run <name>
```

## Breaking Changes

### Default Behavior

**Before:** `stick` with no args showed basic menu  
**After:** `stick` launches Stick Agent assistant

**Migration:** If you want the old menu, it's now available via `stick --help` or specific commands.

### Deploy Command

**Before:** Simulated deployment (didn't actually do anything)  
**After:** Starts real HTTP server with API endpoints

**Migration:** Your agents will now actually be deployed. Use `stick deploy --cloud` for Docker/cloud guidance.

### Agent Name

**Before:** Internal agent called "Intelligent Agent"  
**After:** Now called "Stick Agent"

**Migration:** No action needed - this is just a naming change.

## New Features in Detail

### 1. Stick Agent Assistant

**What it does:**
- Understands what you want to build
- Breaks complex tasks into steps
- Suggests exact commands to run
- Explains what each command does
- Can execute commands for you
- Guides through entire process

**When to use:**
- First time using framework
- Building something complex
- Need step-by-step guidance
- Want to learn best practices

**Example:**
```bash
stick
> "I want to build a multi-agent system that processes data"

# Stick Agent will:
# 1. Ask about data source
# 2. Ask about processing steps
# 3. Suggest agent architecture
# 4. Create agents one by one
# 5. Set up communication
# 6. Test the system
# 7. Help with deployment
```

### 2. Natural Language Processing

**Supports 60+ phrases across categories:**

**Creating agents:**
- "create a chatbot"
- "build an agent for customer support"
- "make a new bot called mybot"
- "initialize assistant with web search"

**Running agents:**
- "run my agent"
- "execute mybot in interactive mode"
- "start my-assistant using mistral"
- "use agent with ollama"

**Deploying:**
- "deploy my agent"
- "publish bot as API"
- "start server on port 4000"
- "deploy to cloud"

**MCP Servers:**
- "create MCP server for GitHub"
- "build a custom tool"
- "make database integration"
- "install github MCP server"

**And more...** Run `stick examples` to see all phrases.

### 3. Real HTTP API Deployment

**Local Deployment:**
```bash
stick deploy

# ✓ Server starting on http://localhost:3000
# 
# 📡 Agent API Endpoints:
#    POST   /api/chat
#    GET    /api/health
#    GET    /api/metrics
#    GET    /api/config
```

**Endpoints:**

- **POST /api/chat** - Send messages
  ```bash
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message": "Hello!"}'
  ```

- **GET /api/health** - Health check
  ```json
  {
    "status": "healthy",
    "agent": "my-agent",
    "version": "1.0.0",
    "uptime": 123456
  }
  ```

- **GET /api/metrics** - Performance data
  ```json
  {
    "requests": 42,
    "uptime": 123456,
    "memory": {...}
  }
  ```

**Cloud Deployment:**
```bash
stick deploy --cloud

# Generates:
# - Dockerfile
# - .dockerignore
# - Health check configuration
# - Deployment commands for:
#   • AWS ECS
#   • Google Cloud Run
#   • Kubernetes
```

### 4. Enhanced MCP Support

Build custom tools and integrations:

```bash
# Guided MCP server creation
stick mcp create github-tools

# Stick Agent will ask:
# - What tools do you need?
# - What APIs to integrate?
# - Authentication method?
# - Testing requirements?

# Then creates:
# - Server structure
# - Tool definitions
# - Tests
# - Documentation
# - Integration guide
```

### 5. Multi-Agent Systems

Build systems where agents collaborate:

```bash
stick multi-agent create data-pipeline

# Creates:
# - Multiple specialized agents
# - Communication channels
# - Orchestrator
# - Monitoring
# - Deployment config

stick multi-agent diagram data-pipeline
# Shows visual architecture

stick multi-agent run data-pipeline
# Runs the entire system
```

### 6. Better Error Messages

**Before:**
```
Error: Agent not found
```

**After:**
```
✗ Could not find agent config for "my-agent"

Searched locations:
  - /path/to/my-agent.json
  - /path/to/my-agent/agent.json
  - /path/to/agent.json
  - /path/to/my-agent/config.json
  - /path/to/config.json

Tip: Run "stick init" to create an agent
```

## Documentation

### New Guides

1. **CLI_GUIDE.md** - Complete CLI documentation
   - All commands explained
   - Natural language examples
   - Ollama integration
   - Best practices
   - Troubleshooting

2. **CLI_UPDATE_SUMMARY.md** - Technical change summary
   - File changes
   - Code changes
   - Migration guide

3. **WHATS_NEW.md** - This file
   - User-facing changes
   - New features
   - Examples

### Updated Guides

- **README.md** - Updated with new features
- All example commands now use natural language

## Best Practices

### 1. Start with Stick Agent

If you're new or building something complex:
```bash
stick
# Let the AI guide you
```

### 2. Use Natural Language

Don't memorize commands:
```bash
stick create a chatbot
stick run mybot with ollama
```

### 3. Test Locally with Ollama

No API keys needed:
```bash
# Install Ollama: https://ollama.ai
ollama serve
ollama pull mistral

# Run agent
stick run my-agent --provider ollama --model mistral:7b -i
```

### 4. Deploy and Test

```bash
stick deploy
# Test the API
curl http://localhost:3000/api/health
```

### 5. Build Incrementally

Start simple, add features:
```bash
# Step 1: Basic agent
stick init simple-bot

# Step 2: Test it
stick run simple-bot -i

# Step 3: Add tools (edit agent.json)
# Step 4: Deploy
stick deploy
```

## Examples

### Example 1: First Agent

```bash
# Use the assistant
stick

> "I want to create my first agent"
# Follow the guided process

# Or use natural language
stick create a simple chatbot

# Run it
stick run simple-chatbot --provider ollama --model mistral:7b -i
```

### Example 2: Web Scraping Agent

```bash
stick

> "Build an agent that can scrape websites"
# Stick Agent will:
# - Create agent with http tool
# - Configure web scraping
# - Set up data extraction
# - Test it with you
# - Help deploy
```

### Example 3: Multi-Agent System

```bash
stick

> "Create a multi-agent system for data analysis"
# Stick Agent will:
# - Design architecture
# - Create data collector agent
# - Create analyzer agent
# - Create reporter agent
# - Set up communication
# - Test the pipeline
```

### Example 4: Custom MCP Server

```bash
stick mcp create stripe-integration

# Guided through:
# - Stripe API integration
# - Authentication setup
# - Tool definitions
# - Testing
# - Agent integration
```

### Example 5: Deploy to Cloud

```bash
stick deploy --cloud

# Generates Dockerfile, then:
docker build -t my-agent .
docker run -p 3000:3000 my-agent

# Deploy to cloud
gcloud run deploy my-agent --image=my-agent
# or
kubectl apply -f deployment.yaml
```

## Troubleshooting

### CLI not working?

```bash
cd ~/development/stickai-agent-framework/packages/cli
npm run build
npm link
```

### Stick Agent not starting?

```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull a model
ollama pull mistral
```

### Deploy fails?

```bash
# Check you have an agent
stick list

# Make sure config exists
ls agent.json
```

### Natural language not working?

```bash
# See all examples
stick examples

# Use traditional commands
stick init my-agent
stick run my-agent -i
```

## What's Next?

### Coming Soon

1. **Visual Agent Builder** - Web UI for agent creation
2. **Enhanced Workflows** - Visual workflow designer
3. **Agent Marketplace** - Share and discover agents
4. **Team Collaboration** - Multi-user agent development
5. **Advanced Analytics** - Deeper performance insights

### Try It Now

```bash
# Update your CLI
cd ~/development/stickai-agent-framework/packages/cli
git pull
npm run build
npm link

# Start building
stick

# Or explore
stick examples
stick help
```

## Feedback

We'd love to hear from you:
- Discord: https://discord.gg/stickai
- GitHub Issues: https://github.com/stickai/framework/issues
- Documentation: https://stick.ai/docs

## Summary

**Stick CLI v1.1.0** transforms agent building from technical commands to natural conversation:

✅ **Stick Agent** - AI guide for building anything  
✅ **Natural Language** - 60+ supported phrases  
✅ **Real Deployment** - Actual HTTP API servers  
✅ **Zero Confusion** - Step-by-step guidance  
✅ **MCP Support** - Build custom tools easily  
✅ **Multi-Agent** - Coordinate multiple agents  
✅ **Local-First** - Works with Ollama (no API keys)  
✅ **Well Documented** - Comprehensive guides  

**Build powerful AI systems by just describing what you want. It's that simple.**

---

Ready to build? Run `stick` and start creating!
