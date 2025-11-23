# Test Agent Examples

This directory contains test agents to demonstrate the stick.ai framework capabilities.

## Available Test Agents

### 1. basic-agent.json
A simple agent without LLM that demonstrates the core framework.
```bash
node ../dist/cli.js run basic-agent --input "Test message"
```

### 2. agent.json (test-assistant)
An intelligent agent with Ollama LLM integration.
```bash
# Requires Ollama running locally
node ../dist/cli.js run test-assistant --interactive
```

## Testing Commands

### Single Input
```bash
node ../dist/cli.js run basic-agent --input "Hello, world!"
```

### Interactive Mode
```bash
node ../dist/cli.js run basic-agent --interactive
```

### With Different Provider
```bash
# OpenAI
export OPENAI_API_KEY="your-key"
node ../dist/cli.js run test-assistant --provider openai --model gpt-4

# Anthropic  
export ANTHROPIC_API_KEY="your-key"
node ../dist/cli.js run test-assistant --provider anthropic --model claude-3-sonnet-20240229

# Ollama (local)
node ../dist/cli.js run test-assistant --provider ollama --model llama2
```

## What's Working

✅ Agent initialization and configuration loading
✅ Tool registration and loading  
✅ Interactive REPL mode with history
✅ Single input execution
✅ Basic agent mode (without LLM)
✅ Intelligent agent mode (with LLM)
✅ Multiple AI provider support (OpenAI, Anthropic, Ollama)
✅ Error handling and graceful degradation
✅ Command-line options for customization

## Next Steps

- Add memory persistence
- Implement MCP client
- Add multi-agent orchestration
- Enhance tool calling logic
- Add more comprehensive tests
