# stick.ai - Enterprise AI Agent Orchestration Framework

<div align="center">

**The most advanced local-first framework for building and deploying AI agents**

[![npm version](https://img.shields.io/npm/v/@stick-ai/cli.svg)](https://www.npmjs.com/package/@stick-ai/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Website](https://stick.ai) • [Documentation](./docs) • [Examples](./examples) • [Discord](https://discord.gg/stickai)

</div>

---

## 🚀 Features

- **🏠 Local-First Architecture** - Zero cloud dependencies, complete data sovereignty
- **⚡ Lightning Fast Setup** - Production-ready agents in under 60 seconds
- **🎯 Multi-Agent Orchestration** - Coordinate complex agent workflows
- **🔧 Extensible Tooling** - 40+ built-in tools, easy custom tool creation
- **📊 Real-Time Monitoring** - Built-in observability and debugging
- **🔒 Enterprise Security** - Sandboxed execution, rate limiting, audit logs
- **🌐 Cloud Ready** - Deploy anywhere: local, AWS, GCP, Azure, Kubernetes
- **💎 Type-Safe** - Full TypeScript support with intelligent autocomplete

## 📦 Quick Start

### Installation

```bash
npm install -g @stick-ai/cli
```

### Create Your First Agent

```bash
# Initialize a new agent
stick init my-agent

# Deploy locally
cd my-agent
stick deploy

# Run your agent
stick run my-agent --interactive
```

**That's it!** Your agent is now running at `localhost:3000`

## 🎯 Use Cases

- **Customer Support** - 24/7 AI-powered support automation
- **Code Review** - Automated code quality and security analysis
- **Data Analysis** - Intelligent data processing and insights
- **Content Creation** - Automated writing, editing, and publishing
- **DevOps Automation** - Infrastructure management and monitoring
- **Research Assistant** - Information gathering and synthesis

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Your Application                    │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│                     stick.ai CLI                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   Init   │  │  Deploy  │  │   Run    │             │
│  └──────────┘  └──────────┘  └──────────┘             │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────┐
│              Agent Orchestration Engine                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Agent 1  →  Agent 2  →  Agent 3  →  Result     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Tools  │  │  Memory  │  │ Security │              │
│  └─────────┘  └──────────┘  └──────────┘              │
└─────────────────────────────────────────────────────────┘
```

## 📚 Documentation

- [Getting Started](./docs/getting-started.md)
- [Configuration Guide](./docs/configuration.md)
- [Privacy Policy](./docs/PRIVACY.md)
- [Terms of Service](./docs/TERMS.md)

## 💻 Tech Stack

### Framework
- **Runtime**: Node.js 18+
- **Language**: TypeScript 5.3+
- **CLI**: Commander.js
- **Styling**: Chalk, Ora

### Website
- **Framework**: Next.js 15 (App Router)
- **UI**: React 18, Tailwind CSS
- **Animations**: Framer Motion
- **Components**: Radix UI

## 🎨 Agent Configuration

Define your agent's behavior with a simple JSON config:

```json
{
  "name": "customer-support",
  "version": "1.0.0",
  "description": "24/7 AI-powered customer support",
  "capabilities": ["chat", "email", "ticket-management"],
  "tools": ["database", "crm", "analytics"],
  "instructions": "You are a helpful customer support agent...",
  "environment": {
    "maxTokens": 4000,
    "temperature": 0.7
  }
}
```

## 🛠️ Built-In Tools

- **System**: `bash`, `python`, `node`, `file-ops`
- **Web**: `http`, `browser`, `scraper`, `api`
- **Data**: `database`, `csv`, `json`, `xml`
- **AI**: `openai`, `anthropic`, `huggingface`
- **Communication**: `email`, `slack`, `discord`
- **Development**: `git`, `github`, `docker`, `kubernetes`

## 🔐 Security

- **Sandboxed Execution** - Agents run in isolated environments
- **Rate Limiting** - Prevent abuse and resource exhaustion
- **Audit Logging** - Track all agent actions
- **Secret Management** - Secure storage for API keys and credentials

## 📈 Monitoring

Real-time metrics and observability:

```bash
# View agent metrics
stick metrics

# View logs
stick logs --agent=my-agent --tail
```

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md)

- 🐛 [Report bugs](https://github.com/stickai/framework/issues)
- 💡 [Request features](https://github.com/stickai/framework/discussions)
- 🔧 [Submit PRs](https://github.com/stickai/framework/pulls)

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) for details.

## 🌐 Links

- **Website**: https://stick.ai
- **Documentation**: https://stick.ai/docs
- **GitHub**: https://github.com/stickai/framework
- **Discord**: https://discord.gg/stickai
- **Twitter**: https://twitter.com/stickai

## 💬 Support

- 📧 **Email**: support@stick.ai
- 💬 **Discord**: [Join our community](https://discord.gg/stickai)
- 📖 **Docs**: [Full documentation](./docs)
- 🐛 **Issues**: [GitHub Issues](https://github.com/stickai/framework/issues)

---

<div align="center">

**Built with ❤️ by the stick.ai team**

[Website](https://stick.ai) • [Docs](./docs) • [Discord](https://discord.gg/stickai) • [Twitter](https://twitter.com/stickai)

</div>
