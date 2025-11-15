# LLM Provider Integration Guide

This guide explains how to integrate Large Language Model (LLM) providers with your stick.ai agents to enable intelligent, AI-powered conversations.

## Overview

stick.ai supports three types of LLM providers:
- **OpenAI**: Cloud-based models like GPT-4, GPT-3.5-turbo, etc.
- **Anthropic**: Cloud-based Claude models
- **Ollama**: Local models for privacy and cost savings

## Configuration

### Basic Setup

Add the `llm` configuration block to your agent's `config/agent.json`:

```json
{
  "name": "my-agent",
  "version": "1.0.0",
  "description": "My AI agent",
  "capabilities": ["chat", "task-execution"],
  "tools": ["bash", "file-ops", "http"],
  "instructions": "You are a helpful AI assistant.",
  "environment": {
    "maxTokens": 4000,
    "temperature": 0.7
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "your-api-key",
    "stream": true
  }
}
```

## Provider-Specific Configuration

### OpenAI

#### Models
- `gpt-4o` - Latest GPT-4 Omni model (recommended)
- `gpt-4o-mini` - Faster, more cost-effective version
- `gpt-4-turbo` - Previous generation GPT-4
- `gpt-3.5-turbo` - Legacy model, very cost-effective

#### Configuration
```json
{
  "llm": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "sk-...",
    "stream": true
  }
}
```

#### Environment Variables
```bash
export OPENAI_API_KEY="sk-..."
```

#### Getting an API Key
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Add billing information to your account
4. Copy the key and add it to your configuration

### Anthropic

#### Models
- `claude-3-5-sonnet-20241022` - Latest Claude model (recommended)
- `claude-3-opus-20240229` - Most capable model
- `claude-3-sonnet-20240229` - Balanced performance
- `claude-3-haiku-20240307` - Fastest, most cost-effective

#### Configuration
```json
{
  "llm": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "apiKey": "sk-ant-...",
    "stream": true
  }
}
```

#### Environment Variables
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

#### Getting an API Key
1. Visit https://console.anthropic.com/settings/keys
2. Create a new API key
3. Add billing information to your account
4. Copy the key and add it to your configuration

### Ollama (Local Models)

Ollama allows you to run models locally on your machine, providing:
- Complete privacy (no data sent to cloud)
- No API costs
- Offline capability
- Full control over models

#### Installation
```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download
```

#### Available Models
- `llama3.2` - Meta's latest Llama model (recommended)
- `llama3.1` - Previous Llama version
- `mistral` - Efficient open model
- `codellama` - Specialized for code
- `phi3` - Microsoft's efficient model

#### Pull a Model
```bash
ollama pull llama3.2
```

#### Configuration
```json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3.2",
    "baseURL": "http://localhost:11434",
    "stream": true
  }
}
```

#### Environment Variables
```bash
export OLLAMA_HOST="http://localhost:11434"
```

## Streaming Responses

All providers support streaming for real-time response generation:

```json
{
  "llm": {
    "stream": true
  }
}
```

When streaming is enabled:
- Responses appear word-by-word in real-time
- Better user experience for long responses
- Lower perceived latency

When streaming is disabled:
- Complete response is generated before display
- Useful for batch processing
- Simpler error handling

## Security Best Practices

### API Key Management

**Never commit API keys to version control!**

Use environment variables:
```bash
# In your shell or .env file
export OPENAI_API_KEY="your-key-here"
export ANTHROPIC_API_KEY="your-key-here"
```

Then reference in config:
```json
{
  "llm": {
    "provider": "openai",
    // apiKey is optional if environment variable is set
    "model": "gpt-4o-mini"
  }
}
```

### .gitignore
Ensure your `.gitignore` includes:
```
.env
.env.local
config/agent.json  # If it contains sensitive keys
```

## Cost Optimization

### Model Selection
- **Development**: Use `gpt-4o-mini`, `claude-3-haiku`, or Ollama models
- **Production**: Balance cost vs quality for your use case
- **High quality**: Use `gpt-4o` or `claude-3-5-sonnet`

### Token Management
Control costs by setting appropriate limits:
```json
{
  "environment": {
    "maxTokens": 4000,  // Limit response length
    "temperature": 0.7   // Lower = more deterministic
  }
}
```

### Local First
For development and testing, use Ollama:
- Zero API costs
- Instant responses (no network latency)
- Complete privacy

## Troubleshooting

### "LLM provider error" messages

**Invalid API Key**
```
Error: Failed to get response from LLM provider. Invalid API key
```
Solution: Check your API key is correct and has billing enabled

**Rate Limit Exceeded**
```
Error: Rate limit exceeded
```
Solution: 
- Reduce request frequency
- Upgrade your API plan
- Switch to a different provider

**Model Not Found**
```
Error: Model not found
```
Solution: Verify the model name is correct for your provider

### Ollama Connection Issues

**Connection Refused**
```
Error: connect ECONNREFUSED 127.0.0.1:11434
```
Solution: 
1. Check Ollama is running: `ollama serve`
2. Verify the port: `ollama list`
3. Check baseURL in config

**Model Not Available**
```
Error: model 'llama3.2' not found
```
Solution: Pull the model first: `ollama pull llama3.2`

## Examples

### Simple Chat Agent with OpenAI
```json
{
  "name": "chat-bot",
  "version": "1.0.0",
  "description": "A simple chat bot",
  "capabilities": ["chat"],
  "tools": [],
  "instructions": "You are a friendly and helpful assistant.",
  "environment": {
    "maxTokens": 2000,
    "temperature": 0.8
  },
  "llm": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "stream": true
  }
}
```

### Code Assistant with Claude
```json
{
  "name": "code-helper",
  "version": "1.0.0",
  "description": "Helps with coding tasks",
  "capabilities": ["code-generation", "code-review"],
  "tools": ["bash", "file-ops"],
  "instructions": "You are an expert programmer who helps with code.",
  "environment": {
    "maxTokens": 4000,
    "temperature": 0.3
  },
  "llm": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "stream": true
  }
}
```

### Private Agent with Ollama
```json
{
  "name": "private-assistant",
  "version": "1.0.0",
  "description": "Privacy-focused assistant",
  "capabilities": ["chat", "task-execution"],
  "tools": ["bash", "file-ops"],
  "instructions": "You help with tasks while keeping data local.",
  "environment": {
    "maxTokens": 4000,
    "temperature": 0.7
  },
  "llm": {
    "provider": "ollama",
    "model": "llama3.2",
    "baseURL": "http://localhost:11434",
    "stream": true
  }
}
```

## Next Steps

- [Configuration Guide](./configuration.md) - Full configuration reference
- [Getting Started](./getting-started.md) - Basic usage guide
- [API Documentation](../packages/cli/README.md) - CLI command reference

## Support

Need help? 
- 📧 Email: support@stick.ai
- 💬 Discord: https://discord.gg/stickai
- 📖 Docs: https://stick.ai/docs
