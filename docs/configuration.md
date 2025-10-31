# Agent Configuration Guide

Complete reference for configuring your stick.ai agents.

## Configuration File Structure

The `config/agent.json` file is the heart of your agent. Here's a complete example:

```json
{
  "name": "my-agent",
  "version": "1.0.0",
  "description": "Agent description",
  "capabilities": ["chat", "task-execution", "data-analysis"],
  "tools": ["bash", "file-ops", "http", "database"],
  "instructions": "Detailed instructions for agent behavior...",
  "environment": {
    "maxTokens": 4000,
    "temperature": 0.7,
    "topP": 0.9,
    "frequencyPenalty": 0.0,
    "presencePenalty": 0.0
  },
  "memory": {
    "enabled": true,
    "maxHistory": 100,
    "persistencePath": "./data/memory"
  },
  "security": {
    "sandboxed": true,
    "allowedDomains": ["api.example.com"],
    "rateLimiting": {
      "requestsPerMinute": 60
    }
  },
  "monitoring": {
    "enabled": true,
    "logLevel": "info",
    "metricsPort": 9090
  }
}
```

## Configuration Fields

### Core Fields

#### `name` (required)
- Type: `string`
- Unique identifier for your agent
- Must be lowercase, alphanumeric with hyphens

#### `version` (required)
- Type: `string`
- Semantic version (e.g., "1.0.0")

#### `description` (required)
- Type: `string`
- Brief description of agent's purpose

#### `capabilities` (required)
- Type: `string[]`
- List of agent capabilities
- Built-in: `chat`, `task-execution`, `data-analysis`, `email`, `scheduling`

#### `tools` (required)
- Type: `string[]`
- Available tools for the agent
- Built-in tools: `bash`, `file-ops`, `http`, `database`, `python`

#### `instructions` (required)
- Type: `string`
- Detailed behavioral instructions for the agent
- Define personality, constraints, and operating procedures

### Environment Settings

#### `maxTokens`
- Type: `number`
- Default: `4000`
- Maximum tokens per response

#### `temperature`
- Type: `number`
- Range: `0.0 - 2.0`
- Default: `0.7`
- Controls randomness (lower = more deterministic)

#### `topP`
- Type: `number`
- Range: `0.0 - 1.0`
- Default: `0.9`
- Nucleus sampling parameter

#### `frequencyPenalty`
- Type: `number`
- Range: `-2.0 - 2.0`
- Default: `0.0`
- Penalizes frequent tokens

#### `presencePenalty`
- Type: `number`
- Range: `-2.0 - 2.0`
- Default: `0.0`
- Penalizes already used tokens

### Memory Configuration

```json
"memory": {
  "enabled": true,
  "maxHistory": 100,
  "persistencePath": "./data/memory",
  "contextWindow": 10
}
```

- `enabled`: Enable/disable memory
- `maxHistory`: Max conversation history items
- `persistencePath`: Where to store memory data
- `contextWindow`: Number of previous messages to include

### Security Settings

```json
"security": {
  "sandboxed": true,
  "allowedDomains": ["api.example.com", "*.trusted.com"],
  "rateLimiting": {
    "requestsPerMinute": 60,
    "requestsPerHour": 1000
  },
  "authentication": {
    "required": true,
    "method": "api-key"
  }
}
```

### Monitoring & Logging

```json
"monitoring": {
  "enabled": true,
  "logLevel": "info",
  "metricsPort": 9090,
  "exportMetrics": true,
  "alerting": {
    "enabled": true,
    "webhookUrl": "https://alerts.example.com"
  }
}
```

## Environment Variables

Use `.env` file for sensitive configuration:

```bash
# Agent Configuration
AGENT_NAME=my-agent
AGENT_PORT=3000

# AI Provider
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Security
API_KEY_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret

# Monitoring
SENTRY_DSN=https://...
```

## Advanced Configuration

### Custom Tools

Reference custom tools in your config:

```json
"tools": [
  "bash",
  "file-ops",
  "./tools/custom-scraper.js",
  "./tools/data-processor.ts"
]
```

### Workflow Integration

```json
"workflows": {
  "onStart": "./workflows/initialization.yaml",
  "onError": "./workflows/error-handler.yaml",
  "scheduled": [
    {
      "name": "daily-report",
      "cron": "0 9 * * *",
      "workflow": "./workflows/daily-report.yaml"
    }
  ]
}
```

### Multi-Agent Configuration

```json
"orchestration": {
  "mode": "hierarchical",
  "coordinator": "main-agent",
  "subAgents": [
    {
      "name": "research-agent",
      "config": "./config/research-agent.json"
    },
    {
      "name": "writing-agent",
      "config": "./config/writing-agent.json"
    }
  ]
}
```

## Configuration Validation

Validate your configuration:

```bash
stick config validate
```

Generate configuration from template:

```bash
stick config init --template=chatbot
```

## Best Practices

1. **Version Control**: Always commit `agent.json`
2. **Secrets**: Never commit API keys - use `.env`
3. **Documentation**: Document custom configurations
4. **Testing**: Test config changes in development first
5. **Monitoring**: Enable monitoring in production
6. **Security**: Enable sandboxing for production agents
7. **Rate Limiting**: Set appropriate limits to prevent abuse

## Examples

### Customer Support Agent

```json
{
  "name": "support-bot",
  "capabilities": ["chat", "ticket-management", "email"],
  "tools": ["database", "crm", "email"],
  "instructions": "Provide helpful, professional customer support...",
  "environment": {
    "temperature": 0.5
  },
  "security": {
    "rateLimiting": {
      "requestsPerMinute": 100
    }
  }
}
```

### Data Analysis Agent

```json
{
  "name": "data-analyst",
  "capabilities": ["data-analysis", "visualization"],
  "tools": ["python", "database", "file-ops"],
  "instructions": "Analyze data and provide insights...",
  "environment": {
    "temperature": 0.3,
    "maxTokens": 8000
  }
}
```

### Code Review Agent

```json
{
  "name": "code-reviewer",
  "capabilities": ["code-analysis", "documentation"],
  "tools": ["bash", "file-ops", "github"],
  "instructions": "Review code for quality, security, and best practices...",
  "environment": {
    "temperature": 0.2
  }
}
```

## Next Steps

- [Custom Tools Guide](./custom-tools.md)
- [Workflow Configuration](./workflows.md)
- [Security Best Practices](./security.md)
