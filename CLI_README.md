# 🚀 stick.ai CLI - Complete Guide

## What Is This?

**stick.ai** is a CLI framework for building and running AI agents locally. Think of it as your terminal-based agent development environment.

## Quick Start (30 Seconds)

```bash
# Install globally
npm install -g @stick-ai/cli

# Launch AI assistant (auto-guides you)
stick

# Or create your first agent manually
stick init my-agent
stick run my-agent --interactive
```

## How It Works

Just type `stick` and the AI assistant launches automatically. It will:
- ✅ Detect your Ollama models
- ✅ Guide you step-by-step
- ✅ Execute commands for you
- ✅ Answer all your questions

## All Commands (Crystal Clear)

### 🟢 **Basic Commands** (Start Here)

#### 1. Create an Agent
```bash
stick init my-agent
```
Creates a new agent project with config files.

#### 2. Run Your Agent
```bash
# Interactive chat mode
stick run my-agent --interactive

# With specific provider
stick run my-agent --provider ollama --model llama3.2:1b

# Single query
stick run my-agent --input "Hello, how are you?"
```

**All run options:**
- `-i, --interactive` - Chat mode
- `-p, --provider <name>` - openai, anthropic, or ollama
- `-m, --model <name>` - Specific model
- `-t, --temperature <0-1>` - Response randomness
- `--max-tokens <number>` - Response length limit
- `--ollama-host <url>` - Custom Ollama URL
- `-v, --verbose` - Show detailed logs

#### 3. List Your Agents
```bash
stick list
```
Shows all agents you've created.

#### 4. Deploy as API
```bash
# Local HTTP server
stick deploy --port 3000

# Access it
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

### 🔵 **Monitoring**

#### View Logs
```bash
# All logs
stick logs

# Specific agent
stick logs --agent my-agent

# Follow live
stick logs --follow

# Last N lines
stick logs --lines 100
```

#### Performance Metrics
```bash
stick metrics
```

### 🟣 **Advanced Features**

#### MCP Servers (Custom Tools)
```bash
# Create custom tool
stick mcp create weather-tool

# List tools
stick mcp list

# Test a tool
stick mcp test weather-tool

# Connect tool to agent
stick mcp connect weather-tool my-agent
```

#### Multi-Agent Systems
```bash
# Create multi-agent system
stick multi-agent create research-team

# Add agents to system
stick multi-agent add-agent researcher
stick multi-agent add-agent writer

# Run the system
stick multi-agent run research-team

# Check status
stick multi-agent status research-team
```

#### Workflows
```bash
# Create automation workflow
stick workflow create data-pipeline

# Add steps
stick workflow add-step extract
stick workflow add-step transform
stick workflow add-step load

# Run workflow
stick workflow run data-pipeline

# Visualize
stick workflow visualize data-pipeline
```

### 🤖 **AI Assistant & Help**

#### AI Assistant (Recommended!)
```bash
# Launch (auto-detects models)
stick

# Or explicitly
stick ai
stick assistant
```

The AI will ask what you want to build and guide you through everything.

#### Interactive Guide
```bash
stick guide
```

Shows an interactive menu with:
- Complete command overview
- Quick start tutorial
- First agent walkthrough
- Advanced feature guides
- Deployment options
- All commands with examples

#### Examples
```bash
stick examples
```

Shows natural language examples of how to use the CLI.

#### Get Help
```bash
# General help
stick --help

# Command-specific help
stick run --help
stick mcp --help
stick deploy --help
```

## AI Providers

### Ollama (Local, Free)
```bash
# Install Ollama
# Visit: https://ollama.ai

# Pull a model
ollama pull llama3.2:1b      # Fast, 1GB
ollama pull mistral:7b       # Better, 4GB

# Use with stick
stick run my-agent --provider ollama --model llama3.2:1b
```

### OpenAI (Cloud)
```bash
# Set API key
export OPENAI_API_KEY="sk-..."

# Use with stick
stick run my-agent --provider openai --model gpt-4
```

### Anthropic (Cloud)
```bash
# Set API key
export ANTHROPIC_API_KEY="sk-ant-..."

# Use with stick
stick run my-agent --provider anthropic --model claude-3-sonnet-20240229
```

## Complete Example Workflow

```bash
# 1. Create agent
stick init customer-support

# 2. Run interactively with Ollama
stick run customer-support \
  --interactive \
  --provider ollama \
  --model llama3.2:1b

# 3. Chat with it
You: "How do I reset my password?"
Agent: "I can help you with that..."

# 4. Deploy as API
stick deploy --port 3000

# 5. Test the API
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello!"}'
```

## Tips & Best Practices

### 🌟 **For Beginners**
1. Just run `stick` - the AI will guide you
2. Use `stick guide` for step-by-step tutorials
3. Start with `stick init` + `stick run --interactive`
4. Use Ollama for free local testing

### ⚡ **For Advanced Users**
1. Create MCP servers for custom tools
2. Build multi-agent systems for complex tasks
3. Use workflows for automation pipelines
4. Deploy with `--cloud` for production

### 🔧 **Troubleshooting**

**Agent won't start?**
```bash
# Check Ollama is running
ollama list

# Try a different model
stick run my-agent --model llama3.2:1b
```

**404 Error?**
- Make sure Ollama is running: `ollama serve`
- Check you have a model: `ollama list`
- Pull a model if needed: `ollama pull llama3.2:1b`

**Command not found?**
```bash
# Reinstall CLI
npm install -g @stick-ai/cli

# Or run from repo
cd packages/cli
npm run build
node dist/cli.js
```

## What Makes This Special?

### ✅ **AI-First**
Just type `stick` and get AI guidance automatically.

### ✅ **Local-First**
Works 100% locally with Ollama. No cloud required.

### ✅ **Crystal Clear**
Every command has detailed help. Run `--help` on anything.

### ✅ **Production Ready**
Deploy as HTTP APIs, use in production systems.

### ✅ **Extensible**
Create custom tools (MCP), multi-agent systems, workflows.

## Common Use Cases

### 1. **Chatbot**
```bash
stick init chatbot
stick run chatbot --interactive
```

### 2. **Research Assistant**
```bash
stick multi-agent create research-team
stick multi-agent add-agent researcher
stick multi-agent add-agent summarizer
stick multi-agent run research-team
```

### 3. **Custom Tool Integration**
```bash
stick mcp create github-tool
# ... configure tool ...
stick mcp connect github-tool my-agent
```

### 4. **Automated Pipeline**
```bash
stick workflow create data-processor
stick workflow add-step fetch
stick workflow add-step analyze
stick workflow add-step report
stick workflow run data-processor
```

## Get Help Anytime

- 🤖 **AI Assistant:** `stick` or `stick ai`
- 📖 **Interactive Guide:** `stick guide`
- 📋 **All Commands:** `stick --help`
- 💬 **Examples:** `stick examples`
- 🔍 **Specific Command:** `stick <command> --help`

## Summary

**The Easiest Way:** Just type `stick` and let the AI guide you.

**Quick Reference:**
- `stick init <name>` - Create agent
- `stick run <name> -i` - Run interactively
- `stick deploy` - Deploy as API
- `stick guide` - Interactive tutorial
- `stick --help` - See everything

---

**Ready to build?** Run `stick` right now! 🚀
