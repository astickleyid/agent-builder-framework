# @stick-ai/cli

Enterprise-grade CLI for building and managing AI agents with full backend functionality.

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

# Run your agent interactively
stick run my-agent --interactive

# Or check agent status
stick run my-agent

# List all agents
stick list

# Stop a running agent
stick stop my-agent
```

## Commands

### `stick init [name]`

Initialize a new agent project with boilerplate configuration.

**Options:**
- `-t, --template <template>` - Template to use (default: 'default')

**Example:**
```bash
stick init my-agent
cd my-agent
```

### `stick deploy`

Deploy your agent locally or to the cloud. Creates a persistent HTTP server for your agent.

**Options:**
- `-p, --port <port>` - Port to deploy on (default: 3000)
- `-c, --cloud` - Deploy to cloud infrastructure (coming soon)

**Example:**
```bash
stick deploy -p 3001
```

**Endpoints:**
- `GET /health` - Health check endpoint
- `GET /config` - Get agent configuration
- `POST /chat` - Send messages to the agent

### `stick list`

List all configured agents on your system with their status.

**Example output:**
```
Configured Agents:

● my-agent (running)
  My custom AI agent
  Version: 1.0.0
  URL: http://localhost:3000
  PID: 12345
  Deployed: 11/15/2025, 7:00:00 PM

○ other-agent (stopped)
  Another agent
  Version: 1.0.0

Total: 2 agent(s), 1 running
```

### `stick run <agent>`

Run a specific agent in interactive or status check mode.

**Options:**
- `-i, --interactive` - Run in interactive mode for conversations

**Example:**
```bash
# Interactive mode
stick run my-agent --interactive

# Check status
stick run my-agent
```

### `stick stop <agent>`

Stop a running agent server.

**Example:**
```bash
stick stop my-agent
```

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

### Configuration Fields

- **name** (required): Agent identifier (lowercase, alphanumeric with hyphens)
- **version** (required): Semantic version (e.g., "1.0.0")
- **description** (recommended): Human-readable description
- **capabilities** (array): List of agent capabilities
- **tools** (array): Available tools for the agent
- **instructions** (string): System instructions for agent behavior
- **environment** (object):
  - **maxTokens** (number): Maximum tokens for responses (1-100000)
  - **temperature** (number): Response randomness (0-2)

## Features

### ✨ Persistent Agent Registry
- Agents are registered and tracked in `~/.config/stick-ai/`
- Status tracking (running/stopped)
- Process management with PID tracking

### 🚀 HTTP Server
- Each agent runs as an independent HTTP server
- RESTful API endpoints for health, config, and chat
- Process isolation and management

### 💬 Interactive Mode
- Real-time conversation with your agents
- Conversation history tracking
- Context-aware responses

### 🔒 Validation
- Configuration validation with helpful error messages
- Runtime checks for agent health
- Port conflict detection

### 📊 Monitoring
- Real-time agent status
- Deployment timestamps
- Process monitoring

## Architecture

```
~/.config/stick-ai/
├── registry.json          # Central agent registry
├── agents/                # Agent metadata
│   └── my-agent/
│       └── config.json
└── pids/                  # Runtime process management
    ├── my-agent.pid
    └── my-agent-server.js
```

## Development

### Building from Source

```bash
cd packages/cli
npm install
npm run build
```

### Running Locally

```bash
npm run dev  # Watch mode
```

## API Documentation

### Chat Endpoint

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello agent!"}'
```

**Response:**
```json
{
  "agent": "my-agent",
  "response": "Hello! I'm my-agent...",
  "timestamp": "2025-11-15T19:00:00.000Z"
}
```

### Health Check

```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "healthy",
  "agent": "my-agent"
}
```

## Documentation

Full documentation: https://stick.ai/docs

## Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and API reference
- **Examples**: Sample agents and use cases

## License

MIT
