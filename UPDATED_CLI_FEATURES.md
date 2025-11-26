# 🚀 Updated CLI Features - Stick Agent Framework

## What's New

### 1. **Stick Agent** - Your Intelligent CLI Assistant

The CLI now features **Stick Agent** (formerly "Intelligent Agent"), an AI-powered assistant that automatically connects when you run `stick` with no arguments.

```bash
# Just type stick - AI connects automatically!
stick
```

**Features:**
- ✨ **Auto-connects to AI** - No manual setup needed (requires Ollama)
- 🎯 **Natural Language Interface** - Describe what you want in plain English
- 🤖 **Guided Workflows** - Walks you through every step
- 📦 **Build Anything** - Agents, MCP servers, workflows, multi-agent systems
- 🔧 **Command Execution** - Can run commands for you automatically
- 💡 **Context-Aware** - Remembers your conversation and project state

### 2. **Complete Workflow Pipeline Builder**

Build complex automation workflows with an intuitive CLI:

```bash
# Create a new workflow
stick workflow create my-pipeline

# List workflows
stick workflow list

# Run a workflow
stick workflow run my-pipeline

# Delete a workflow
stick workflow delete my-pipeline
```

**Workflow Features:**
- Multiple step types: Agent tasks, API calls, data transforms, conditions, custom scripts
- JSON configuration
- Executable pipelines
- Auto-generated documentation

### 3. **Enhanced MCP Server Management**

Build custom MCP servers with guided creation:

```bash
# Create a new MCP server
stick mcp create my-server

# Install an existing server
stick mcp install @modelcontextprotocol/server-filesystem

# List available servers
stick mcp list

# Test a server
stick mcp test my-server

# Publish to npm
stick mcp publish my-server
```

### 4. **Multi-Agent System Builder**

Create sophisticated multi-agent systems:

```bash
# Create a multi-agent system
stick multi-agent create my-system

# Visualize architecture
stick multi-agent diagram my-system

# Run the system
stick multi-agent run my-system

# List all systems
stick multi-agent list
```

## CLI Commands Reference

### Core Commands

#### `stick` (no arguments)
Launches Stick Agent with AI automatically connected

#### `stick init [name]`
Initialize a new agent project
- Interactive prompts for configuration
- Multiple templates available
- Automatic project scaffolding

#### `stick run <agent> [options]`
Run a specific agent
```bash
# Run with Ollama
stick run my-agent --provider ollama --model mistral

# Interactive chat mode
stick run my-agent --interactive

# Single input
stick run my-agent --input "Hello, agent!"

# With custom settings
stick run my-agent --temperature 0.8 --max-tokens 1000
```

#### `stick deploy [options]`
Deploy agent as HTTP API
```bash
# Deploy locally
stick deploy --port 3000

# Deploy to cloud
stick deploy --cloud
```

#### `stick list`
List all configured agents

#### `stick metrics`
View agent performance metrics

#### `stick logs [options]`
View agent logs
```bash
# View logs for specific agent
stick logs --agent my-agent

# Tail logs
stick logs --tail --lines 100

# Follow logs in real-time
stick logs --follow
```

### AI Assistant

#### `stick ai` or `stick assistant`
Explicitly start the AI assistant (also auto-starts with `stick`)

**Example conversation:**
```
You: I want to build a chatbot that can search GitHub
Assistant: Great! Let me help you build that...
[guides you through the entire process]
```

### Advanced Commands

#### `stick mcp [action] [name]`
MCP server management
- `create` - Create new MCP server with guided setup
- `install` - Install existing MCP server
- `list` - List available/installed servers
- `test` - Test MCP server functionality
- `publish` - Publish to npm registry

#### `stick multi-agent [action] [name]`
Multi-agent system builder
- `create` - Create new multi-agent system
- `list` - List all systems
- `run` - Run a multi-agent system
- `diagram` - Visualize system architecture

#### `stick workflow [action] [name]`
Workflow pipeline builder
- `create` - Create new workflow pipeline
- `list` - List all workflows
- `run` - Execute a workflow
- `delete` - Remove a workflow

#### `stick examples`
Show natural language command examples

## Using with Ollama (Local AI)

### Setup Ollama

1. **Install Ollama:**
   ```bash
   # macOS/Linux
   curl https://ollama.ai/install.sh | sh
   
   # Or download from https://ollama.ai
   ```

2. **Start Ollama:**
   ```bash
   ollama serve
   ```

3. **Pull a model:**
   ```bash
   # Recommended for Stick Agent
   ollama pull mistral
   
   # Alternative models
   ollama pull llama2
   ollama pull codellama
   ollama pull mixtral
   ```

4. **Use with Stick:**
   ```bash
   # Stick Agent auto-connects to Ollama
   stick
   
   # Run agents with Ollama
   stick run my-agent --provider ollama --model mistral
   
   # Specify custom Ollama host
   stick run my-agent --provider ollama --model mistral --ollama-host http://localhost:11434
   ```

### Supported Models

- **mistral** (recommended) - Fast, capable, 7B parameters
- **llama2** - Meta's LLaMA 2, good general purpose
- **codellama** - Specialized for code tasks
- **mixtral** - Very capable, larger model
- **phi** - Small and fast
- **neural-chat** - Conversational model

## Natural Language Interface

You can use natural language instead of specific commands:

```bash
# Instead of: stick init chatbot --template chat
stick "create a chatbot"

# Instead of: stick deploy --port 3000
stick "deploy my agent on port 3000"

# Instead of: stick mcp create github-tools
stick "build a custom MCP server for GitHub"

# Instead of: stick multi-agent create data-pipeline
stick "set up a multi-agent system for data processing"
```

The CLI will:
1. Parse your intent
2. Show what it understood
3. Ask clarifying questions if needed
4. Execute the appropriate commands
5. Guide you through the process

## Building Custom Systems

### Example: Building a GitHub Analysis Agent

```bash
# Start Stick Agent
stick

# At the prompt, describe what you want:
You: I want to build an agent that analyzes GitHub repositories

# Stick Agent will guide you through:
# 1. Creating the agent
# 2. Setting up GitHub MCP server
# 3. Configuring API keys
# 4. Testing the agent
# 5. Deploying as API

# It can execute commands for you:
Assistant: I'll create the agent and set up GitHub integration.
Would you like me to execute these commands?
✅ Execute these commands

# Watch as it builds everything automatically!
```

### Example: Multi-Agent Data Pipeline

```bash
stick

You: Create a multi-agent system where one agent scrapes data, 
     another processes it, and a third generates reports

# Stick Agent will:
# 1. Design the architecture
# 2. Create each agent with specific roles
# 3. Set up coordination between agents
# 4. Configure data flow
# 5. Test the complete system
# 6. Deploy if requested
```

## Website Features Planned

The framework includes a web interface (work in progress) that will provide:

### Interactive Agent Builder Playground
- Visual agent configuration
- Drag-and-drop tool selection
- Real-time testing interface
- Code generation and export

### Complete Documentation Portal
- Comprehensive API docs
- Tutorial system
- Example gallery
- Video guides

### Setup Wizard
- Guided framework installation
- Dependency checking
- Configuration validation
- Quick start templates

## Advanced Features

### Custom Tool Development

Create custom tools for your agents:

```typescript
import { createTool } from '@stick-ai/runtime';

const myTool = createTool({
  name: 'my-custom-tool',
  description: 'Does something amazing',
  inputSchema: {
    type: 'object',
    properties: {
      input: { type: 'string' }
    }
  },
  execute: async (args) => {
    // Your logic here
    return { result: 'Done!' };
  }
});
```

### Memory Systems

Add persistent memory to agents:

```typescript
import { VectorMemory } from '@stick-ai/runtime';

const agent = new IntelligentAgent(config, llmConfig);
const memory = new VectorMemory({
  provider: 'chroma',
  collection: 'my-agent-memory'
});

agent.setMemory(memory);
```

### Security & Authentication

Built-in security features:

```typescript
import { SecurityManager, RateLimiter } from '@stick-ai/runtime';

const security = new SecurityManager({
  authentication: true,
  encryption: true,
  rateLimit: new RateLimiter({ max: 100, window: 60000 })
});
```

## Architecture

```
stick-agent-framework/
├── packages/
│   ├── runtime/          # Core agent runtime
│   │   ├── agent/        # Agent classes (Stick Agent)
│   │   ├── mcp/          # MCP integration
│   │   ├── memory/       # Memory systems
│   │   ├── orchestration/# Multi-agent coordination
│   │   ├── security/     # Security features
│   │   ├── deployment/   # Deployment utilities
│   │   └── tools/        # Built-in tools
│   └── cli/              # Command-line interface
│       ├── commands/     # CLI commands
│       ├── ai-assistant.ts  # Stick Agent implementation
│       ├── nlp.ts        # Natural language processing
│       └── interactive.ts   # Interactive mode
├── app/                  # Web interface (Next.js)
├── components/           # UI components
└── docs/                 # Documentation

```

## Next Steps

1. **Test the updated CLI:**
   ```bash
   cd ~/development/stickai-agent-framework
   stick
   ```

2. **Build your first agent with Stick Agent:**
   ```bash
   stick
   # Then describe what you want to build
   ```

3. **Create a workflow:**
   ```bash
   stick workflow create my-first-workflow
   ```

4. **Build a custom MCP server:**
   ```bash
   stick mcp create my-tools
   ```

5. **Deploy as API:**
   ```bash
   stick deploy
   ```

## Troubleshooting

### Ollama not connecting

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Pull a model if none available
ollama pull mistral
```

### CLI command not found

```bash
# Re-link the CLI
cd ~/development/stickai-agent-framework/packages/cli
npm link
```

### Agent won't run

```bash
# Check agent configuration
cat <agent-name>/agent.yaml

# Verify provider settings
stick run <agent> --verbose
```

## Contributing

The framework is open source and welcomes contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## Support

- 📖 [Documentation](./docs)
- 💬 [Discord Community](https://discord.gg/stickai)
- 🐛 [Issue Tracker](https://github.com/stickai/framework/issues)
- 📧 Email: support@stick.ai

## License

MIT - See [LICENSE](./LICENSE) file for details
