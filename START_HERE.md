# 🚀 START HERE - Stick Agent Framework

## Your Framework is Ready!

Location: `~/development/stickai-agent-framework`

## Quick Start (3 Steps)

### 1. Start Ollama (if not already running)
```bash
# In a separate terminal
ollama serve
```

### 2. Pull a Model (if you haven't already)
```bash
ollama pull mistral
```

### 3. Launch Stick Agent
```bash
cd ~/development/stickai-agent-framework
stick
```

That's it! The AI assistant will guide you through everything else.

## What Just Happened?

✅ **Stick Agent** - Renamed from "Intelligent Agent" for better branding
✅ **AI Auto-Connect** - Stick Agent automatically connects when you run `stick`
✅ **Workflow Builder** - Full workflow pipeline creation (NEW!)
✅ **All Commands Working** - init, run, deploy, mcp, multi-agent, workflow
✅ **Natural Language** - Describe what you want in plain English
✅ **Built & Linked** - Everything is compiled and ready to use

## What Can You Build?

### Option 1: Let AI Guide You (Recommended)
```bash
stick
# Then describe what you want:
# - "Create a chatbot that can search GitHub"
# - "Build a multi-agent system for data analysis"
# - "Make a workflow for email processing"
```

### Option 2: Use Direct Commands
```bash
# Create an agent
stick init my-agent

# Run with Ollama
stick run my-agent --provider ollama --model mistral --interactive

# Create a workflow
stick workflow create my-pipeline

# Create MCP server
stick mcp create my-tools

# Create multi-agent system
stick multi-agent create my-system

# Deploy as API
stick deploy --port 3000
```

### Option 3: Natural Language (No AI needed)
```bash
# The CLI understands natural language commands:
stick "create a chatbot"
stick "deploy my agent on port 3000"
stick "build a custom MCP server"
```

## 📚 Documentation

- **`UPDATED_CLI_FEATURES.md`** ⭐ - Complete feature guide with all commands
- **`NOVEMBER_24_UPDATE.md`** - What was changed today
- **`README.md`** - Main project README
- **`OLLAMA_GUIDE.md`** - Ollama setup and configuration
- **`CLI_GUIDE.md`** - Detailed CLI documentation

## 🎯 Try These Examples

### Example 1: Simple Chatbot
```bash
stick
> "I want to create a simple chatbot"
# Stick Agent will guide you through the entire process
```

### Example 2: GitHub Analysis Agent
```bash
stick
> "Build an agent that analyzes GitHub repositories and provides insights"
# Stick Agent will:
# 1. Create the agent
# 2. Set up GitHub MCP server
# 3. Configure tools
# 4. Test it for you
```

### Example 3: Data Processing Workflow
```bash
stick workflow create data-processor
# Interactive wizard walks you through:
# - Number of steps
# - Step types (agent, api, transform, etc.)
# - Configuration for each step
```

### Example 4: Multi-Agent System
```bash
stick multi-agent create team-system
# Creates a coordinated system with multiple agents
# working together
```

## 🔍 Test That Everything Works

```bash
# 1. Check the CLI is installed
stick --version

# 2. See available commands
stick --help

# 3. View natural language examples
stick examples

# 4. Try a simple command
stick list

# 5. Launch the AI assistant
stick
```

## 🤖 About Stick Agent

**Stick Agent** is your intelligent CLI assistant powered by local AI (Ollama). It can:

- ✨ Understand natural language requests
- 🎯 Guide you step-by-step through complex builds
- 🔧 Execute commands for you automatically
- 💡 Answer questions and explain concepts
- 🚀 Help you build anything from simple agents to complex multi-agent systems

### Stick Agent vs Regular CLI

**Without Stick Agent:**
```bash
stick init mybot --template chat
stick mcp install @modelcontextprotocol/server-filesystem
stick run mybot --provider ollama --model mistral --interactive
# ... multiple commands, need to know exact syntax
```

**With Stick Agent:**
```bash
stick
> "Create a chatbot that can read files"
# AI figures out everything and does it for you
```

## 🎨 What's Next?

### The Web Interface Needs:

1. **Interactive Agent Builder Playground**
   - Visual configuration
   - Drag-and-drop tools
   - Live testing
   - Code export

2. **Documentation Portal**
   - Full API docs
   - Tutorials
   - Examples
   - Search

3. **Setup Wizard**
   - Guided installation
   - Dependency check
   - Quick start

4. **Live Dashboard**
   - Running agents
   - Metrics
   - Logs
   - Controls

### Currently Working:
- ✅ CLI (all commands)
- ✅ Runtime engine
- ✅ Stick Agent AI
- ✅ MCP integration
- ✅ Multi-agent orchestration
- ✅ Workflow pipelines
- ✅ Deployment system

### Coming Soon:
- 🚧 Web playground
- 🚧 Documentation site
- 🚧 Template marketplace
- 🚧 Cloud deployment
- 🚧 npm publishing

## 💬 Using Natural Language

You can interact with Stick in three ways:

### 1. AI Assistant Mode (Most Powerful)
```bash
stick
# Conversational interface, guides you through everything
```

### 2. Natural Language Commands (No AI needed)
```bash
stick "create a chatbot"
# CLI parses intent and executes appropriate command
```

### 3. Traditional CLI Commands (Precise Control)
```bash
stick init mybot --template chat
# Standard command-line syntax
```

## 🛠️ Advanced Usage

### Custom Agents with Code
```typescript
import { IntelligentAgent, createStickAgent } from '@stick-ai/runtime';

const agent = await createStickAgent(
  {
    name: 'my-custom-agent',
    version: '1.0.0',
    description: 'Does amazing things',
    capabilities: ['chat', 'tools'],
    tools: ['search', 'calculator']
  },
  {
    provider: 'ollama',
    model: 'mistral',
    temperature: 0.7
  }
);

const response = await agent.run('Hello!');
console.log(response);
```

### Deploy as HTTP API
```typescript
import { HTTPServer } from '@stick-ai/runtime';

const server = new HTTPServer({ port: 3000 });
server.registerAgent(agent);
server.start();

// Now your agent is available at:
// POST http://localhost:3000/api/agents/my-custom-agent/run
```

### Add MCP Tools
```bash
# Install existing MCP server
stick mcp install @modelcontextprotocol/server-filesystem

# Create custom MCP server
stick mcp create my-custom-tools
# Guided wizard helps you build custom tools
```

### Build Multi-Agent Systems
```bash
stick multi-agent create research-team

# Creates multiple specialized agents:
# - Researcher agent
# - Analyzer agent  
# - Reporter agent
# All coordinated by AgentOrchestrator
```

## 🔥 Pro Tips

1. **Be Specific with Stick Agent**
   - Good: "Create a chatbot that can search GitHub and send Slack messages"
   - Bad: "Make something"

2. **Let It Execute Commands**
   - When Stick Agent offers to run commands, let it!
   - It can do everything you can do manually, but faster

3. **Ask Questions**
   - Don't understand something? Ask!
   - Stick Agent can explain any concept

4. **Start Simple, Then Enhance**
   - Build a basic version first
   - Then add features iteratively

5. **Use Ollama Models Wisely**
   - `mistral` - Best all-around (recommended)
   - `codellama` - Best for code-heavy tasks
   - `mixtral` - Most capable but slower
   - `phi` - Fastest but less capable

## 🐛 Troubleshooting

### "Ollama not found"
```bash
# Install Ollama
curl https://ollama.ai/install.sh | sh

# Start Ollama
ollama serve

# Pull a model
ollama pull mistral
```

### "Command not found: stick"
```bash
# Re-link the CLI
cd ~/development/stickai-agent-framework/packages/cli
npm link
```

### "Agent won't run"
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Run with verbose output
stick run my-agent --verbose
```

### "Build failed"
```bash
# Clean and rebuild
cd ~/development/stickai-agent-framework

# Runtime
cd packages/runtime
rm -rf dist node_modules
npm install
npm run build

# CLI
cd ../cli
rm -rf dist node_modules
npm install
npm run build
npm link
```

## 📦 Project Structure

```
stickai-agent-framework/
├── packages/
│   ├── runtime/           # Core engine (Stick Agent lives here)
│   └── cli/               # Command-line interface
├── app/                   # Web interface (Next.js)
├── components/            # React components
├── docs/                  # Documentation
├── workflows/             # Created workflows go here
└── agents/                # Created agents go here
```

## 🎓 Learning Path

### Day 1: Basics
1. Run `stick` and build your first agent
2. Try different providers (ollama, openai)
3. Create a simple workflow

### Day 2: MCP Integration
1. Create a custom MCP server
2. Add tools to your agents
3. Build an agent that uses MCP tools

### Day 3: Multi-Agent Systems
1. Create a multi-agent system
2. Coordinate multiple agents
3. Build a complex workflow

### Day 4: Deployment
1. Deploy an agent as API
2. Test with curl/Postman
3. Build a client application

### Day 5: Advanced
1. Custom tool development
2. Memory systems
3. Security and authentication
4. Production deployment

## 🌟 Your First Session Should Be:

```bash
cd ~/development/stickai-agent-framework

# Make sure Ollama is running
ollama serve &

# Launch Stick Agent
stick

# At the prompt, type:
> "Help me understand what you can do"

# Then build something:
> "Create a simple chatbot that I can talk to"

# Stick Agent will:
# ✅ Create the agent
# ✅ Configure it
# ✅ Show you how to run it
# ✅ Guide you through testing it
```

## 📞 Get Help

- Run `stick examples` for natural language examples
- Run `stick --help` for command reference
- Check `UPDATED_CLI_FEATURES.md` for complete documentation
- Ask Stick Agent directly: `stick` then "How do I...?"

---

## 🎉 You're All Set!

Your Stick Agent Framework is fully functional and ready to build amazing AI systems.

**Just run:**
```bash
stick
```

**And start building!** 🚀

---

*Framework Location: `~/development/stickai-agent-framework`*
*Documentation: See `UPDATED_CLI_FEATURES.md`*
*Last Updated: November 24, 2024*
