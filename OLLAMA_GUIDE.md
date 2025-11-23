# 🦙 Running stick.ai with Ollama (Local AI)

Run AI agents completely locally with Ollama - no API keys needed!

## 🚀 Quick Start

### Your Available Models
```
✅ mistral:7b (4.4 GB) - Best for general use
✅ llama3.2:1b (1.3 GB) - Fast and lightweight
✅ tinyllama:1.1b (637 MB) - Ultra-fast
✅ gpt-oss:120b-cloud - Cloud model
```

### Run with Ollama (3 Ways)

#### Method 1: Using Pre-configured Agent
```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent

# Interactive mode
node ../dist/cli.js run ollama-agent --interactive

# Single command
node ../dist/cli.js run ollama-agent --input "What is 2+2?"
```

#### Method 2: Override Model at Runtime
```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent

# Use mistral
node ../dist/cli.js run test-assistant --provider ollama --model mistral:7b --interactive

# Use llama3.2 (faster)
node ../dist/cli.js run test-assistant --provider ollama --model llama3.2:1b --interactive

# Use tinyllama (fastest)
node ../dist/cli.js run test-assistant --provider ollama --model tinyllama:1.1b --interactive
```

#### Method 3: Using Helper Script
```bash
cd ~/development/stickai-agent-framework

# Run with Ollama
./stick.sh run test-agent/ollama-agent --interactive

# Or specify model
./stick.sh run test-agent/test-assistant \
  --provider ollama \
  --model mistral:7b \
  --interactive
```

## 🎯 Example Conversation

```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent
node ../dist/cli.js run ollama-agent --interactive
```

Expected output:
```
✓ Intelligent agent "ollama-assistant" loaded

📦 Loading 6 tools...
  ✓ bash
  ✓ http
  ✓ datetime
  ✓ text
  ✓ file-ops
  ✓ json

🤖 Interactive Mode

Agent: ollama-assistant
Description: Local AI assistant powered by Ollama

Type your message and press Enter. Type "exit" or "quit" to stop.

You> Hello! What can you help me with?
[Agent thinking...]
Agent> I'm a local AI assistant running via Ollama. I can help you with...
```

## 💡 Tips

### Adjust Creativity
```bash
# More creative (0.9)
node ../dist/cli.js run ollama-agent --temperature 0.9 --interactive

# More focused (0.3)
node ../dist/cli.js run ollama-agent --temperature 0.3 --interactive
```

### Choose Faster Model
```bash
# For quick responses, use smaller model
node ../dist/cli.js run ollama-agent --model tinyllama:1.1b --interactive
```

### Longer Responses
```bash
# Generate more tokens
node ../dist/cli.js run ollama-agent --max-tokens 4000 --interactive
```

## 🔧 Troubleshooting

### "Connection refused"
```bash
# Make sure Ollama is running
ollama serve

# Test connection
curl http://localhost:11434/api/tags
```

### "Model not found"
```bash
# List available models
ollama list

# Pull a model if needed
ollama pull mistral
ollama pull llama3.2:1b
```

### Custom Ollama Host
```bash
# If Ollama is on different port/host
node ../dist/cli.js run ollama-agent \
  --ollama-host http://localhost:11434 \
  --interactive
```

## 📊 Model Comparison

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| mistral:7b | 4.4 GB | Medium | Best | General use |
| llama3.2:1b | 1.3 GB | Fast | Good | Quick tasks |
| tinyllama:1.1b | 637 MB | Fastest | OK | Simple queries |
| gpt-oss:120b | Cloud | N/A | Highest | Complex tasks |

## 🎨 Custom Agent Config

Create your own Ollama agent:

```json
{
  "name": "my-ollama-agent",
  "version": "1.0.0",
  "description": "My custom Ollama agent",
  "capabilities": ["chat", "reasoning"],
  "tools": ["bash", "datetime", "text"],
  "instructions": "You are a helpful assistant.",
  "aiProvider": "ollama",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b",
    "host": "http://localhost:11434"
  },
  "environment": {
    "maxTokens": 2000,
    "temperature": 0.7
  }
}
```

Save as `my-agent.json` and run:
```bash
node ../dist/cli.js run my-agent --interactive
```

## ✅ Test It Now!

```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent
node ../dist/cli.js run ollama-agent --input "Tell me a joke about AI"
```

## 🎉 Benefits of Ollama

✅ **100% Free** - No API costs
✅ **100% Local** - Complete privacy
✅ **100% Offline** - Works without internet
✅ **No API Keys** - Just works
✅ **Fast** - Runs on your hardware
✅ **Multiple Models** - Choose what fits your needs

---

**Enjoy your local AI agent!** 🦙
