# @stick-ai/cli

Enterprise-grade CLI for building and managing AI agents.

## Installation

```bash
npm install -g @stick-ai/cli
```

## Quick Start

```bash
# Create a new agent
stick init my-agent

# Deploy locally
cd my-agent
stick deploy

# Run your agent
stick run my-agent --interactive
```

## Commands

### `stick init [name]`

Initialize a new agent project with boilerplate configuration.

**Options:**
- `-t, --template <template>` - Template to use (default: 'default')

### `stick deploy`

Deploy your agent locally or to the cloud.

**Options:**
- `-p, --port <port>` - Port to deploy on (default: 3000)
- `-c, --cloud` - Deploy to cloud infrastructure

### `stick list`

List all configured agents on your system.

### `stick run <agent>`

Run a specific agent.

**Options:**
- `-i, --interactive` - Run in interactive mode

## Configuration

Agents are configured via `config/agent.json`:

```json
{
  "name": "my-agent",
  "version": "1.0.0",
  "description": "My custom AI agent",
  "capabilities": ["chat", "task-execution"],
  "tools": ["bash", "file-ops", "http"],
  "instructions": "You are a helpful AI agent...",
  "environment": {
    "maxTokens": 4000,
    "temperature": 0.7
  }
}
```

## Documentation

Full documentation: https://stick.ai/docs

## License

MIT
