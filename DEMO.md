# stick.ai Framework - Live Demo

## 🎉 What's New: Core Execution Engine is LIVE!

The stick.ai framework now has **real agent execution** with LLM integration and tool orchestration!

---

## Quick Start Demo

### 1. Install Dependencies
```bash
cd packages/cli
npm install
npm run build
```

### 2. Create Your First Agent
```bash
# From packages/cli directory
node dist/cli.js init my-first-agent
cd my-first-agent
```

### 3. Run in Basic Mode (No LLM Required)
```bash
# Create a simple config
cat > agent.json << 'EOF'
{
  "name": "demo-agent",
  "version": "1.0.0",
  "description": "My first agent",
  "capabilities": ["chat"],
  "tools": ["datetime", "text"],
  "instructions": "You are a helpful assistant",
  "aiProvider": "none",
  "environment": {
    "temperature": 0.7
  }
}
EOF

# Run it!
node ../dist/cli.js run demo-agent --input "Hello!"
```

**Output:**
```
✓ Agent "demo-agent" loaded (basic mode)
📦 Loading 2 tools...
  ✓ datetime
  ✓ text

User> Hello!
Agent> [demo-agent] Processing: Hello!
```

### 4. Try Interactive Mode
```bash
node ../dist/cli.js run demo-agent --interactive
```

**Interactive Commands:**
- Type any message to chat
- `history` - View conversation history
- `clear` - Clear screen
- `exit` or `quit` - Exit

---

## Advanced: With AI Providers

### Option 1: OpenAI (GPT-4, GPT-3.5)
```bash
# Set your API key
export OPENAI_API_KEY="sk-..."

# Create intelligent agent config
cat > smart-agent.json << 'EOF'
{
  "name": "gpt-assistant",
  "version": "1.0.0",
  "description": "GPT-powered assistant",
  "capabilities": ["chat", "reasoning", "tool-use"],
  "tools": ["bash", "http", "datetime"],
  "instructions": "You are a helpful AI assistant. Use tools when needed.",
  "aiProvider": "openai",
  "llm": {
    "provider": "openai",
    "model": "gpt-3.5-turbo"
  },
  "environment": {
    "maxTokens": 2000,
    "temperature": 0.7
  }
}
EOF

# Run with OpenAI
node ../dist/cli.js run gpt-assistant --interactive
```

### Option 2: Anthropic (Claude)
```bash
export ANTHROPIC_API_KEY="sk-ant-..."

node ../dist/cli.js run gpt-assistant \
  --provider anthropic \
  --model claude-3-sonnet-20240229 \
  --interactive
```

### Option 3: Ollama (Local, Free)
```bash
# Start Ollama
ollama serve

# In another terminal
node ../dist/cli.js run gpt-assistant \
  --provider ollama \
  --model llama2 \
  --interactive
```

---

## Example Conversations

### With Basic Agent
```
You> What time is it?
Agent> [demo-agent] Processing: What time is it?
```

### With Intelligent Agent (GPT/Claude/Ollama)
```
You> What time is it?
Agent> Let me check the current time for you.

[Agent uses datetime tool]

Agent> The current time is 4:56 PM EST on November 23, 2024.
```

---

## CLI Options Reference

```bash
stick run <agent> [options]

Options:
  -i, --interactive           Interactive chat mode
  --input <text>             Single message to process
  -p, --provider <provider>  AI provider (openai, anthropic, ollama)
  -m, --model <model>        Model to use (e.g., gpt-4, claude-3)
  -t, --temperature <temp>   Temperature 0-1 (default: 0.7)
  --max-tokens <tokens>      Max tokens to generate
  --ollama-host <host>       Ollama server URL
  -v, --verbose              Verbose output for debugging
```

### Examples
```bash
# Quick test
stick run my-agent --input "Hello!"

# Interactive session
stick run my-agent --interactive

# With specific provider
stick run my-agent --provider openai --model gpt-4 --interactive

# Adjust creativity
stick run my-agent --temperature 0.9 --interactive

# Use local Ollama
stick run my-agent --provider ollama --model mistral --interactive
```

---

## Tools Available

Your agents can use these 17 built-in tools:

**System:**
- `bash` - Execute shell commands
- `python` - Run Python code
- `file-ops` - Read/write files

**Web:**
- `http` - HTTP/REST API calls
- `web-scraper` - Scrape websites

**Data:**
- `json` - JSON operations
- `csv` - CSV file handling
- `xml` - XML parsing
- `database` - Database queries

**Communication:**
- `email` - Send emails
- `slack` - Slack integration

**Development:**
- `github` - GitHub API

**Utilities:**
- `datetime` - Date/time operations
- `text` - Text manipulation

**AI:**
- `openai` - GPT models
- `anthropic` - Claude models
- `ollama` - Local LLMs

---

## Configuration Examples

### Chatbot Agent
```json
{
  "name": "chatbot",
  "description": "Friendly conversational agent",
  "capabilities": ["chat"],
  "tools": ["datetime", "text"],
  "instructions": "You are a friendly chatbot. Be helpful and concise.",
  "aiProvider": "openai",
  "environment": {
    "temperature": 0.8
  }
}
```

### Code Assistant
```json
{
  "name": "code-helper",
  "description": "Programming assistant",
  "capabilities": ["code-generation", "debugging"],
  "tools": ["bash", "file-ops", "github", "python"],
  "instructions": "You are an expert programmer. Help with coding tasks.",
  "aiProvider": "anthropic",
  "environment": {
    "temperature": 0.3
  }
}
```

### Research Agent
```json
{
  "name": "researcher",
  "description": "Web research assistant",
  "capabilities": ["research", "analysis"],
  "tools": ["http", "web-scraper", "text"],
  "instructions": "You research topics online and provide summaries.",
  "aiProvider": "ollama",
  "environment": {
    "temperature": 0.5
  }
}
```

---

## Testing Your Setup

Run the test suite:
```bash
cd packages/cli/test-agent

# Test basic agent
node ../dist/cli.js run basic-agent --input "Test 1"

# Test interactive mode
node ../dist/cli.js run basic-agent --interactive

# Test with real LLM (if available)
export OPENAI_API_KEY="sk-..."
node ../dist/cli.js run test-assistant --provider openai --interactive
```

---

## What's Working Now ✅

- ✅ Real agent execution with LLM integration
- ✅ Interactive REPL with chat interface
- ✅ Tool registration and execution
- ✅ Multiple AI provider support
- ✅ Conversation history
- ✅ Command-line options
- ✅ Error handling
- ✅ Configuration loading
- ✅ Graceful fallbacks

## Coming Soon 🚀

- 🔜 MCP (Model Context Protocol) integration
- 🔜 Vector memory with embeddings
- 🔜 Multi-agent orchestration
- 🔜 Deployment system
- 🔜 Real-time metrics
- 🔜 Persistent memory
- 🔜 Web UI dashboard

---

## Troubleshooting

### Agent not found
```bash
# Make sure you're in the right directory
cd my-agent
node ../dist/cli.js run my-agent --input "test"

# Or provide full path
node dist/cli.js run /path/to/my-agent --input "test"
```

### API key errors
```bash
# Set environment variable
export OPENAI_API_KEY="sk-..."

# Or use .env file
echo 'OPENAI_API_KEY=sk-...' > .env
```

### Ollama connection failed
```bash
# Make sure Ollama is running
ollama serve

# Check it's accessible
curl http://localhost:11434/api/tags

# Specify custom host if needed
node dist/cli.js run agent --ollama-host http://localhost:11434
```

---

## Get Help

- 📚 **Docs:** See `/docs` directory
- 💬 **Issues:** Open GitHub issue
- 🔧 **Examples:** Check `/packages/cli/test-agent`
- 📖 **Status:** See `IMPLEMENTATION_STATUS.md`

---

**The stick.ai framework is now functional! Start building!** 🚀
