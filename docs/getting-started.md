# Getting Started with stick.ai

Welcome to stick.ai - the most advanced local-first AI agent orchestration framework.

## Installation

Install the stick.ai CLI globally via npm:

```bash
npm install -g @stick-ai/cli
```

Or using yarn:

```bash
yarn global add @stick-ai/cli
```

## Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn package manager
- Basic understanding of AI agents and workflows

## Your First Agent

### 1. Create a New Agent

```bash
stick init customer-support
```

This creates a new agent project with the following structure:

```
customer-support/
├── config/
│   └── agent.json       # Agent configuration
├── tools/               # Custom tools directory
├── workflows/           # Multi-step workflows
├── .env.example        # Environment variables template
├── .gitignore
└── README.md
```

### 2. Configure Your Agent

Edit `config/agent.json`:

```json
{
  "name": "customer-support",
  "version": "1.0.0",
  "description": "24/7 AI-powered customer support",
  "capabilities": ["chat", "email", "ticket-management"],
  "tools": ["database", "crm", "analytics"],
  "instructions": "You are a helpful customer support agent. Always be polite, professional, and solution-oriented.",
  "environment": {
    "maxTokens": 4000,
    "temperature": 0.7
  }
}
```

### 3. Deploy Your Agent

```bash
cd customer-support
stick deploy
```

This will:
- Build your agent
- Run health checks
- Start the agent on localhost:3000

### 4. Run Your Agent

```bash
stick run customer-support --interactive
```

## Next Steps

- [Agent Configuration Guide](./configuration.md)
- [Creating Custom Tools](./custom-tools.md)
- [Multi-Agent Orchestration](./orchestration.md)
- [Deployment Options](./deployment.md)
- [API Reference](./api-reference.md)

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `stick init [name]` | Create a new agent |
| `stick deploy` | Deploy agent locally |
| `stick deploy --cloud` | Deploy to cloud |
| `stick list` | List all agents |
| `stick run <agent>` | Run an agent |
| `stick run <agent> -i` | Run in interactive mode |

## Need Help?

- 📚 [Full Documentation](https://stick.ai/docs)
- 💬 [Community Discord](https://discord.gg/stickai)
- 🐛 [Report Issues](https://github.com/stickai/framework/issues)
- 📧 [Email Support](mailto:support@stick.ai)

## What's Next?

Now that you have your first agent running, explore:

1. **Adding Custom Tools** - Extend your agent's capabilities
2. **Creating Workflows** - Build multi-step automated processes
3. **Agent Orchestration** - Coordinate multiple agents
4. **Cloud Deployment** - Scale to production
5. **Monitoring & Analytics** - Track performance and usage
