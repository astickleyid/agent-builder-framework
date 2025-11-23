# stick.ai - Quick Start Guide

**Get your first AI agent running in 5 minutes!**

---

## 🚀 Option 1: Instant Test (No Setup)

```bash
# Run the test suite
./test-framework.sh

# Try the demo agent
cd packages/cli/test-agent
node ../dist/cli.js run basic-agent --interactive
```

That's it! You now have a working agent.

---

## 💬 Basic Commands in Interactive Mode

```
You> Hello!
Agent> [basic-agent] Processing: Hello!

You> history
# Shows conversation history

You> clear
# Clears the screen

You> exit
# Exits interactive mode
```

---

## 🎯 Option 2: Create Your Own Agent (2 minutes)

```bash
cd packages/cli

# Create agent config
cat > my-agent.json << 'EOF'
{
  "name": "my-assistant",
  "version": "1.0.0",
  "description": "My first AI agent",
  "capabilities": ["chat"],
  "tools": ["datetime", "text"],
  "instructions": "You are a helpful assistant.",
  "aiProvider": "none",
  "environment": {
    "temperature": 0.7
  }
}
EOF

# Run it!
node dist/cli.js run my-agent --interactive
```

---

## 🤖 Option 3: With Real AI (OpenAI)

```bash
# Set your API key
export OPENAI_API_KEY="sk-your-key-here"

# Create smart agent
cat > smart-agent.json << 'EOF'
{
  "name": "gpt-assistant",
  "version": "1.0.0",
  "description": "GPT-powered assistant",
  "capabilities": ["chat", "reasoning"],
  "tools": ["bash", "http", "datetime", "text"],
  "instructions": "You are a helpful AI assistant.",
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

# Run with AI
node dist/cli.js run smart-agent --interactive
```

Now your agent can actually think and use tools!

---

## 🆓 Option 4: Free Local AI (Ollama)

```bash
# Install Ollama first: https://ollama.ai
# Then start it: ollama serve

# Pull a model
ollama pull llama2

# Run agent with Ollama
node dist/cli.js run smart-agent \
  --provider ollama \
  --model llama2 \
  --interactive
```

100% free, 100% local, 100% private!

---

## 📋 All Available Tools

Add these to your agent's `tools` array:

**System:** `bash`, `python`, `file-ops`  
**Web:** `http`, `web-scraper`  
**Data:** `json`, `csv`, `xml`, `database`  
**Communication:** `email`, `slack`  
**Development:** `github`  
**Utilities:** `datetime`, `text`  
**AI:** `openai`, `anthropic`, `ollama`

Example:
```json
{
  "tools": ["bash", "http", "datetime", "text"]
}
```

---

## 🎨 Customize Your Agent

```bash
node dist/cli.js run my-agent \
  --provider openai \
  --model gpt-4 \
  --temperature 0.9 \
  --max-tokens 2000 \
  --interactive
```

### Options:
- `--provider` → openai, anthropic, ollama, none
- `--model` → gpt-4, gpt-3.5-turbo, claude-3, llama2
- `--temperature` → 0-1 (higher = more creative)
- `--max-tokens` → Max response length
- `--interactive` → Chat mode
- `--input "text"` → Single command

---

## 🐛 Troubleshooting

### "Agent not found"
```bash
# Make sure config file exists
ls *.json

# Or specify full path
node dist/cli.js run ./path/to/agent.json --interactive
```

### "API key error"
```bash
# For OpenAI
export OPENAI_API_KEY="sk-..."

# For Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# Or use .env file
echo 'OPENAI_API_KEY=sk-...' > .env
```

### "Ollama connection failed"
```bash
# Start Ollama
ollama serve

# Test it works
curl http://localhost:11434/api/tags

# Then run agent
node dist/cli.js run agent --provider ollama --model llama2 --interactive
```

---

## 📚 Learn More

- **Complete Guide:** [DEMO.md](./DEMO.md)
- **What's Working:** [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md)
- **Project Overview:** [README.md](./README.md)
- **Session Details:** [SESSION_SUMMARY.md](./SESSION_SUMMARY.md)

---

## 💡 Example Conversations

### Basic Agent
```
You> What time is it?
Agent> [my-assistant] Processing: What time is it?
```

### Intelligent Agent (with LLM)
```
You> What time is it in Tokyo?
Agent> Let me check that for you using the datetime tool...
Agent> The current time in Tokyo is 9:30 AM JST.

You> Can you make an HTTP request to check the weather?
Agent> I'll use the HTTP tool to check the weather API...
[Agent makes request]
Agent> The weather is sunny, 72°F.
```

---

## ✅ Verification

Run this to verify everything works:
```bash
./test-framework.sh
```

Should see:
```
✓ Test 1 Passed: Basic agent execution
✓ Test 2 Passed: Tool loading
✓ Test 3 Passed: Agent response
✓ Test 4 Passed: Provider selection
🎉 All tests passed!
```

---

## 🚀 You're Ready!

Pick an option above and start building!

**Need help?** Check the full documentation in [DEMO.md](./DEMO.md)

**Want to contribute?** See [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) for what's next.

---

**Happy building!** 🎉
