# stick.ai - Enterprise AI Agent Orchestration Framework

<div align="center">

**The most advanced local-first framework for building and deploying AI agents**

[![npm version](https://img.shields.io/npm/v/@stick-ai/cli.svg)](https://www.npmjs.com/package/@stick-ai/cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

[Website](https://stick.ai) • [Documentation](./docs) • [Demo](./DEMO.md) • [Discord](https://discord.gg/stickai)

</div>

---

## ✨ NEW: Intelligent Natural Language CLI!

The Stick CLI now features **Stick Agent** - your AI guide that helps you build anything through natural conversation! No memorization, no confusion - just describe what you want. [See the CLI guide →](./CLI_GUIDE.md)

## 🚀 Features

- **🤖 Natural Language Interface** - Just describe what you want: "create a chatbot", "deploy as API"
- **🧠 AI-Powered Guidance** - Stick Agent walks you through building anything step-by-step
- **🏠 Local-First Architecture** - Zero cloud dependencies, complete data sovereignty
- **⚡ Lightning Fast Setup** - Production-ready agents in under 60 seconds
- **🔧 Real Agent Execution** - Works with GPT-4, Claude, and Ollama out of the box
- **🛠️ Extensible Tooling** - 17 built-in production tools, easy custom MCP server creation
- **💬 Interactive Chat Mode** - Test your agents in real-time conversations
- **🎯 Multi-Provider Support** - OpenAI, Anthropic, Ollama - switch anytime
- **🌐 Real Deployment** - Actually deploys as HTTP API with REST endpoints
- **💎 Type-Safe** - Full TypeScript support with intelligent autocomplete

## 📦 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/stickai/framework.git
cd framework

# Build packages
cd packages/runtime && npm install && npm run build
cd ../cli && npm install && npm run build
cd ../..

# Or install from npm (when published)
npm install -g @stick-ai/cli
```

### Create Your First Agent

#### Method 1: Natural Language (Recommended)

```bash
# Just run stick and describe what you want!
stick

# Then type: "I want to build a chatbot"
# Stick Agent will guide you through the entire process
```

#### Method 2: Direct Commands

```bash
# Create an agent
stick create a chatbot

# Or use traditional syntax
stick init my-agent

# Run with Ollama (local AI - no API keys needed!)
stick run my-agent --provider ollama --model mistral:7b --interactive

# Deploy as HTTP API
stick deploy
```

#### Method 3: Manual Configuration

```bash
# Navigate to CLI directory
cd packages/cli/test-agent

# Create agent config
cat > my-agent.json << 'EOF'
{
  "name": "my-assistant",
  "version": "1.0.0",
  "description": "My first AI agent",
  "capabilities": ["chat"],
  "tools": ["datetime", "text", "http"],
  "instructions": "You are a helpful assistant.",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b"
  },
  "environment": {
    "temperature": 0.7
  }
}
EOF

# Run it!
stick run my-agent --interactive
```

**That's it!** Your agent is now running. Try asking it questions!

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

## 🎮 Usage Examples

### With OpenAI (GPT-4, GPT-3.5)
```bash
export OPENAI_API_KEY="sk-..."
node dist/cli.js run my-agent --provider openai --model gpt-4 --interactive
```

### With Anthropic (Claude)
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
node dist/cli.js run my-agent --provider anthropic --model claude-3-sonnet-20240229 --interactive
```

### With Ollama (Local, Free)
```bash
# Start Ollama: ollama serve
node dist/cli.js run my-agent --provider ollama --model llama2 --interactive
```

### Single Input Execution
```bash
node dist/cli.js run my-agent --input "What's the weather today?"
```

### Custom Configuration
```bash
node dist/cli.js run my-agent \
  --provider openai \
  --model gpt-4 \
  --temperature 0.9 \
  --max-tokens 2000 \
  --interactive
```

## 📚 Documentation

- [Live Demo Guide](./DEMO.md) - Complete walkthrough
- [Implementation Status](./IMPLEMENTATION_STATUS.md) - What's working
- [Getting Started](./docs/getting-started.md) - Detailed setup
- [Configuration Guide](./docs/configuration.md) - Config options
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

## 🛠️ Built-In Tools (14 Production Tools)

- **System**: `bash`, `python`, `file-ops`
- **Web**: `http`, `web-scraper`
- **Data**: `database`, `csv`, `json`, `xml`
- **Communication**: `email`, `slack`
- **Development**: `github`
- **Utilities**: `datetime`, `text`

[View all tools](./packages/runtime/README.md#built-in-tools)

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
