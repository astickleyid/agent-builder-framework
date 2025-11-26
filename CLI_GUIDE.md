# 🤖 Stick CLI - Complete Guide

The Stick CLI is an intelligent, natural language interface for building and managing AI agents, MCP servers, multi-agent systems, and automation workflows.

## 🚀 Quick Start

### Installation

```bash
# From the repository
cd ~/development/stickai-agent-framework/packages/cli
npm install
npm run build
npm link

# Or install from npm (when published)
npm install -g @stick-ai/cli
```

### First Steps

```bash
# Launch the interactive assistant (recommended for beginners)
stick

# Or use specific commands
stick init my-agent
stick run my-agent --interactive
```

## 💬 Natural Language Interface

The Stick CLI understands natural language! Just type what you want to do:

```bash
# All of these work:
stick create a chatbot
stick build an agent for customer support
stick make a new bot called mybot
stick help me build an agent
```

### Examples

```bash
# Create agents
stick create a web scraping agent
stick make a chatbot with memory
stick build an agent that uses ollama

# Run agents
stick run my-agent
stick execute mybot with interactive mode
stick start my-assistant using mistral model

# Deploy
stick deploy my-agent as API
stick publish the bot to cloud
stick start agent as server on port 4000

# MCP Servers
stick create MCP server for github
stick build a custom tool for database access
stick install github MCP server

# Multi-agent systems
stick create multi-agent system for data processing
stick build agents that work together
stick make an agent team

# Workflows
stick create automation workflow
stick build data processing pipeline
```

## 🎯 Core Commands

### `stick` (No Arguments)

Launches **Stick Agent** - your AI-powered assistant that guides you through building anything.

```bash
stick
```

**What it does:**
- Asks what you want to build
- Breaks down complex tasks into steps
- Suggests exact commands to run
- Can execute commands for you
- Provides guidance without confusion

**Requirements:**
- Ollama running locally (`ollama serve`)
- A model installed (e.g., `ollama pull mistral`)

**Use this when:**
- You're new to the framework
- Building something complex
- Need step-by-step guidance
- Want to learn best practices

### `stick init <name>`

Create a new AI agent.

```bash
# Basic agent
stick init my-agent

# With template
stick init my-chatbot --template chatbot

# Interactive mode (asks questions)
stick init
```

**Options:**
- `-t, --template <template>` - Template to use (default, chatbot, api, automation)

**What it creates:**
- Agent configuration file
- Directory structure
- Example code
- README with instructions

### `stick run <agent>`

Run an agent with various options.

```bash
# Interactive chat mode
stick run my-agent --interactive

# Single input
stick run my-agent --input "What is 2+2?"

# With Ollama (local AI)
stick run my-agent --provider ollama --model mistral:7b --interactive

# With OpenAI
stick run my-agent --provider openai --model gpt-4 --interactive

# Verbose output
stick run my-agent --interactive --verbose
```

**Options:**
- `-i, --interactive` - Chat mode
- `--input <text>` - Single input to process
- `-p, --provider <provider>` - AI provider (openai, anthropic, ollama)
- `-m, --model <model>` - Model to use
- `-t, --temperature <temp>` - Temperature (0-1)
- `--max-tokens <tokens>` - Max tokens to generate
- `--ollama-host <host>` - Ollama host URL
- `-v, --verbose` - Verbose output

**Ollama Models:**
```bash
# Fast and lightweight
stick run my-agent --provider ollama --model llama3.2:1b -i

# Best for general use
stick run my-agent --provider ollama --model mistral:7b -i

# Ultra-fast
stick run my-agent --provider ollama --model tinyllama:1.1b -i
```

### `stick deploy`

Deploy your agent as an HTTP API server.

```bash
# Local deployment (default)
stick deploy

# Specify port
stick deploy --port 4000

# Cloud deployment guide
stick deploy --cloud
```

**What it does:**

**Local Deployment:**
- Starts HTTP server on specified port
- Creates REST API endpoints:
  - `POST /api/chat` - Send messages to agent
  - `GET /api/health` - Health check
  - `GET /api/metrics` - Performance metrics
  - `GET /api/config` - Agent configuration

**Cloud Deployment:**
- Creates Dockerfile
- Provides deployment commands for:
  - AWS ECS
  - Google Cloud Run
  - Kubernetes
  - Docker

**Example API Usage:**
```bash
# Send message to deployed agent
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello agent!"}'

# Check health
curl http://localhost:3000/api/health

# View metrics
curl http://localhost:3000/api/metrics
```

### `stick list`

List all configured agents.

```bash
stick list
```

Shows:
- Agent names
- Versions
- Status
- Capabilities
- Tools

### `stick metrics`

View agent performance metrics.

```bash
stick metrics
```

Shows:
- Request counts
- Response times
- Success/failure rates
- Memory usage
- Uptime

### `stick logs`

View agent execution logs.

```bash
# View logs
stick logs

# Specific agent
stick logs --agent my-agent

# Last N lines
stick logs --lines 100

# Follow (real-time)
stick logs --follow
```

## 🔌 MCP Server Commands

MCP (Model Context Protocol) allows you to create custom tools and integrations for your agents.

### `stick mcp create <name>`

Create a custom MCP server (guided process).

```bash
stick mcp create github-tools
```

**What it does:**
- Asks about the tool's purpose
- Generates server structure
- Creates example tools
- Sets up testing
- Provides integration instructions

### `stick mcp install <server>`

Install an existing MCP server.

```bash
stick mcp install github
stick mcp install @modelcontextprotocol/server-github
```

### `stick mcp list`

List available and installed MCP servers.

```bash
stick mcp list
```

### `stick mcp test <server>`

Test an MCP server.

```bash
stick mcp test github-tools
```

## 🤝 Multi-Agent Commands

Build systems where multiple agents work together.

### `stick multi-agent create <name>`

Create a multi-agent system (guided).

```bash
stick multi-agent create data-pipeline
```

**What it does:**
- Asks about system architecture
- Creates multiple agents
- Sets up communication
- Defines coordination logic
- Creates orchestrator

### `stick multi-agent list`

List multi-agent systems.

```bash
stick multi-agent list
```

### `stick multi-agent run <name>`

Run a multi-agent system.

```bash
stick multi-agent run data-pipeline
```

### `stick multi-agent diagram <name>`

Visualize multi-agent architecture.

```bash
stick multi-agent diagram data-pipeline
```

## ⚙️ Workflow Commands

Build automated workflow pipelines.

### `stick workflow create <name>`

Create an automation workflow.

```bash
stick workflow create email-processor
```

**What it does:**
- Asks about workflow steps
- Creates pipeline configuration
- Sets up triggers
- Defines data flow
- Creates monitoring

### `stick workflow list`

List workflows.

```bash
stick workflow list
```

### `stick workflow run <name>`

Run a workflow.

```bash
stick workflow run email-processor
```

## 🎓 Help & Learning

### `stick examples`

Show comprehensive natural language examples.

```bash
stick examples
```

### `stick assistant` / `stick ai`

Launch the guided assistant.

```bash
stick assistant
# or
stick ai
```

### `stick help [command]`

Get help on specific commands.

```bash
stick help
stick help run
stick help deploy
```

## 🦙 Using with Ollama (Local AI)

### Setup

```bash
# Install Ollama
# Visit: https://ollama.ai

# Start Ollama
ollama serve

# Pull a model
ollama pull mistral     # Recommended
ollama pull llama3.2    # Faster
ollama pull tinyllama   # Fastest
```

### Run Agent with Ollama

```bash
# Method 1: CLI arguments
stick run my-agent \
  --provider ollama \
  --model mistral:7b \
  --interactive

# Method 2: Configure in agent.json
{
  "name": "my-agent",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b"
  }
}

stick run my-agent --interactive
```

### Best Models for Different Use Cases

```bash
# Fast responses (1.3GB)
stick run my-agent --provider ollama --model llama3.2:1b -i

# Best quality (4.4GB)
stick run my-agent --provider ollama --model mistral:7b -i

# Ultra-fast testing (637MB)
stick run my-agent --provider ollama --model tinyllama:1.1b -i

# Coding tasks (4.7GB)
stick run my-agent --provider ollama --model codellama:7b -i
```

## 🏗️ Building Custom Agents

### Simple Agent

```bash
stick init simple-bot
cd simple-bot
```

Edit `agent.json`:
```json
{
  "name": "simple-bot",
  "version": "1.0.0",
  "description": "A simple chatbot",
  "capabilities": ["chat"],
  "tools": ["datetime", "text"],
  "instructions": "You are a helpful assistant.",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b"
  }
}
```

Run it:
```bash
stick run simple-bot --interactive
```

### Agent with Web Search

```bash
stick init web-searcher
```

Configure with tools:
```json
{
  "name": "web-searcher",
  "tools": ["http", "text", "datetime"],
  "instructions": "You help users search and analyze web content.",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b"
  }
}
```

### Agent with Memory

```json
{
  "name": "memory-bot",
  "capabilities": ["chat", "memory"],
  "tools": ["text", "memory"],
  "memory": {
    "enabled": true,
    "type": "local"
  }
}
```

## 🔧 Advanced Usage

### Custom Configuration

Create `.stickrc` in your home directory:

```json
{
  "defaultProvider": "ollama",
  "defaultModel": "mistral:7b",
  "defaultPort": 3000,
  "logLevel": "info",
  "telemetry": false
}
```

### Environment Variables

```bash
# Ollama configuration
export OLLAMA_HOST=http://localhost:11434
export OLLAMA_MODEL=mistral:7b

# OpenAI configuration
export OPENAI_API_KEY=your-key
export OPENAI_MODEL=gpt-4

# Anthropic configuration
export ANTHROPIC_API_KEY=your-key
export ANTHROPIC_MODEL=claude-3-opus
```

### Programmatic Usage

```javascript
const { Agent } = require('@stick-ai/runtime');

const agent = new Agent({
  name: 'my-agent',
  capabilities: ['chat'],
  tools: ['datetime', 'text']
});

const response = await agent.run('Hello!');
console.log(response);
```

## 🎯 Best Practices

### 1. Start with the Assistant

If you're new or building something complex:
```bash
stick
# Then: "I want to build a chatbot that can search GitHub"
```

### 2. Use Natural Language

Don't memorize commands:
```bash
stick create a chatbot
stick run mybot with ollama
stick deploy my-agent as API
```

### 3. Test Locally First

Always test with Ollama before deploying:
```bash
stick run my-agent --provider ollama --model mistral:7b -i
```

### 4. Build Incrementally

Start simple, add features gradually:
```bash
# Step 1: Basic agent
stick init my-agent

# Step 2: Test it
stick run my-agent -i

# Step 3: Add tools
# Edit agent.json, add tools: ["http", "text"]

# Step 4: Deploy
stick deploy
```

### 5. Use MCP for Custom Tools

Need specific functionality? Create an MCP server:
```bash
stick mcp create my-custom-tool
```

## 🐛 Troubleshooting

### "Agent not found"

```bash
# List agents to see what's configured
stick list

# Make sure you're in the right directory
cd path/to/your/agent
stick run agent-name
```

### "Ollama not running"

```bash
# Start Ollama
ollama serve

# Check if it's running
curl http://localhost:11434/api/tags
```

### "Model not found"

```bash
# List available models
ollama list

# Pull the model
ollama pull mistral
```

### Deploy fails

```bash
# Check configuration exists
ls agent.json config/agent.json

# Make sure runtime is installed
npm install @stick-ai/runtime

# Try with verbose output
stick deploy --verbose
```

## 📚 Resources

- **Documentation**: [./docs](./docs)
- **Examples**: [./examples](./examples)  
- **Contributing**: [CONTRIBUTING.md](./CONTRIBUTING.md)
- **Website**: https://stick.ai
- **Discord**: https://discord.gg/stickai

## 🚀 What's Next?

1. **Try the assistant**: `stick`
2. **Create your first agent**: `stick init my-bot`
3. **Run it locally**: `stick run my-bot --provider ollama --model mistral:7b -i`
4. **Deploy it**: `stick deploy`
5. **Build something awesome!**

The Stick CLI is designed to make building AI agents as simple as having a conversation. Don't hesitate to use natural language and let the assistant guide you!
