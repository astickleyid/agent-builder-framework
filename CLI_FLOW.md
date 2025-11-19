# stick.ai CLI - Complete Logic Flow

## 🎯 Overview

The CLI now has FULL functionality with real agent creation, tool configuration, and MCP integration.

---

## 📋 Complete User Journey

### 1. **Interactive Mode** (Just run `stick`)

```bash
stick
```

Shows beautiful TUI with:
- ASCII art logo with gradients
- Version info (runtime + CLI)
- Organized menu with sections
- Descriptions for each option

### 2. **Create New Agent**

**Flow:**
1. Select "🚀 Create New Agent"
2. Enter agent name (e.g., `my-chatbot`)
3. Choose template:
   - 🤖 Chatbot - http, json, text, datetime
   - 💼 Assistant - bash, file-ops, http, json, text
   - 🔍 Researcher - http, web-scraper, json, text, file-ops
   - 💻 Developer - bash, python, file-ops, github, json
   - 📊 Analyst - csv, json, database, http, text
   - ⚙️ Custom - choose your own

4. Select AI Provider:
   - 🟢 OpenAI (GPT-4, GPT-3.5)
   - 🔵 Anthropic (Claude 3)
   - 🟡 Ollama (Local, privacy-first)
   - ⚪ None (tools only)

5. Include default tools? (Y/N)

**Creates:**
```
my-chatbot/
├── config/
│   └── agent.json          # Agent configuration
├── tools/                  # Custom tools (empty initially)
├── workflows/              # Workflow definitions (empty)
├── index.js                # Main agent file (runnable!)
├── package.json            # Dependencies
├── README.md               # Documentation
├── .gitignore             
└── .env.example           # Environment template
```

**agent.json contains:**
```json
{
  "name": "my-chatbot",
  "version": "1.0.0",
  "template": "chatbot",
  "tools": ["http", "json", "text", "datetime"],
  "instructions": "You are my-chatbot, a helpful AI chatbot...",
  "ai": {
    "provider": "openai",
    "model": "gpt-3.5-turbo",
    "temperature": 0.7,
    "maxTokens": 4000
  },
  "mcp": {
    "servers": []
  }
}
```

**index.js is executable:**
```javascript
const { IntelligentAgent } = require('@stick-ai/runtime');

const agent = new IntelligentAgent(
  config,
  {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-3.5-turbo'
  }
);

// Ready to run!
```

### 3. **Configure Tools**

After creation (or from main menu):
- "🔧 Configure Tools"
- **Add tools**: Select from 17 available
- **Remove tools**: Uncheck to remove
- **View all tools**: See categories & descriptions

Updates `config/agent.json` with selected tools.

### 4. **Add MCP Servers**

Connect external tools via Model Context Protocol:

**Flow:**
1. Select "🔌 Add MCP Server"
2. Enter server name
3. Choose type:
   - HTTP/REST API
   - WebSocket
   - Local Process (stdio)
4. Enter endpoint/URL or command
5. Optional: Add API key

**Example MCP in config:**
```json
{
  "mcp": {
    "servers": [
      {
        "name": "filesystem",
        "type": "stdio",
        "endpoint": "npx -y @modelcontextprotocol/server-filesystem /path"
      },
      {
        "name": "github-mcp",
        "type": "http",
        "endpoint": "http://localhost:3001",
        "apiKey": "ghp_..."
      }
    ]
  }
}
```

### 5. **Run the Agent**

```bash
cd my-chatbot
npm install
npm start
```

Or use CLI:
```bash
stick run my-chatbot
```

---

## ⌨️ CLI Commands

### Command-line Mode

```bash
# Create agent (skip interactive)
stick init my-agent --template chatbot

# List all agents
stick list

# Run agent
stick run my-agent

# Deploy agent
stick deploy --port 3000

# View metrics
stick metrics

# View logs
stick logs --agent my-agent --follow
```

### Interactive Mode

```bash
# Launch TUI
stick
```

Full menu with:
- **Agent Management**
  - Create, List, Run agents
- **Deployment & Monitoring**
  - Deploy, Metrics, Logs
- **Configuration**
  - Configure Tools
  - Add MCP Servers
- **Help & Resources**
  - All 17 tools documentation
  - CLI commands reference
  - Links to docs, Discord, npm, GitHub

---

## 🛠️ Tool Configuration Logic

### Available Tools (17)

**System (2)**
- bash - shell commands
- python - Python code execution

**Web (2)**
- http - REST API calls
- web-scraper - scrape websites

**Data (4)**
- json - JSON operations
- csv - CSV handling
- xml - XML parsing  
- database - SQL/NoSQL queries

**Files (1)**
- file-ops - read/write files

**Communication (2)**
- email - SMTP emails
- slack - Slack integration

**Development (1)**
- github - GitHub API

**Utilities (2)**
- datetime - date/time ops
- text - text manipulation

**AI (3)**
- openai - GPT-4, GPT-3.5
- anthropic - Claude 3
- ollama - Local LLMs

### Tool Management

1. **View Current Tools**
   ```bash
   cat config/agent.json | grep tools
   ```

2. **Add Tools Programmatically**
   ```javascript
   const config = require('./config/agent.json');
   config.tools.push('github', 'database');
   fs.writeFileSync('config/agent.json', JSON.stringify(config, null, 2));
   ```

3. **Via CLI** (Interactive)
   ```bash
   stick
   # Select "Configure Tools"
   # Check/uncheck tools
   ```

---

## 🔌 MCP Integration

### What is MCP?

Model Context Protocol lets agents connect to external tools and data sources.

### Common MCP Servers

1. **Filesystem**
   ```bash
   npx -y @modelcontextprotocol/server-filesystem /path/to/files
   ```

2. **GitHub**
   ```bash
   npx -y @modelcontextprotocol/server-github
   ```

3. **Puppeteer (Browser)**
   ```bash
   npx -y @modelcontextprotocol/server-puppeteer
   ```

4. **Google Drive**
   ```bash
   npx -y @modelcontextprotocol/server-gdrive
   ```

### Adding to Agent

Via CLI:
```bash
stick
# Select "Add MCP Server"
# Fill in details
```

Result in `agent.json`:
```json
{
  "mcp": {
    "servers": [
      {
        "name": "github",
        "type": "stdio",
        "endpoint": "npx -y @modelcontextprotocol/server-github"
      }
    ]
  }
}
```

---

## 🚀 Complete Example Workflow

### Create a Research Agent with GitHub Access

```bash
# 1. Launch CLI
stick

# 2. Create New Agent
#    Name: research-bot
#    Template: Researcher
#    AI: OpenAI
#    Include tools: Yes

# 3. Configure Tools
#    Add: github, database, csv

# 4. Add MCP Server
#    Name: github-mcp
#    Type: stdio
#    Command: npx -y @modelcontextprotocol/server-github

# 5. Exit CLI

# 6. Install & Run
cd research-bot
npm install
export OPENAI_API_KEY=sk-...
npm start
```

### Result

You now have a fully functional agent that can:
- ✅ Think using GPT-4
- ✅ Scrape web pages
- ✅ Access GitHub via MCP
- ✅ Query databases
- ✅ Parse CSV files
- ✅ Make HTTP requests
- ✅ Process JSON/text
- ✅ Handle files

---

## 📦 Generated Project Structure

```
research-bot/
├── config/
│   └── agent.json              # Full configuration
├── tools/                      # Custom tool implementations
├── workflows/                  # Workflow definitions
├── index.js                    # Runnable agent (uses @stick-ai/runtime)
├── package.json                # Dependencies (@stick-ai/runtime)
├── README.md                   # Usage instructions
├── .gitignore
└── .env.example               # API keys template
```

---

## 🎓 Key Features

### ✅ Real Functionality
- Creates actual runnable projects
- Generates proper code files
- Configures tools correctly
- Sets up MCP servers
- Installs dependencies

### ✅ Flexible Configuration
- 6 templates (chatbot, assistant, researcher, developer, analyst, custom)
- 3 AI providers (OpenAI, Anthropic, Ollama)
- 17 built-in tools
- Unlimited MCP servers
- Custom tools support

### ✅ Developer Experience
- Beautiful TUI with colors/gradients
- Logical flow with prompts
- Clear next steps
- Generated documentation
- CLI commands for automation

### ✅ Production Ready
- TypeScript runtime
- Error handling
- Environment variables
- Git-ready (.gitignore)
- npm scripts

---

## 🔄 Complete Logic Flow

```
┌─────────────┐
│  Run `stick` │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Welcome Screen │ (Logo, versions, info)
└──────┬──────────┘
       │
       ▼
┌─────────────────────┐
│   Main Menu         │
│ ├─ Agent Management │
│ ├─ Deploy & Monitor │
│ ├─ Configuration    │ ◄─── NEW!
│ └─ Help & Resources │
└──────┬──────────────┘
       │
       ├─► Create Agent ──► Template ──► AI Provider ──► Generate Files
       │                                                    │
       ├─► Configure Tools ──► Add/Remove ──► Update agent.json
       │
       ├─► Add MCP ──► Server Details ──► Add to config
       │
       ├─► List/Run/Deploy ──► Execute actions
       │
       └─► Help ──► Show docs & commands
```

---

## 🎯 Success!

The CLI now has **complete logic flow**:

1. ✅ Creates real agent projects
2. ✅ Generates runnable code
3. ✅ Configures tools dynamically
4. ✅ Integrates MCP servers
5. ✅ Beautiful TUI with spacing
6. ✅ Command-line mode for automation
7. ✅ Full documentation
8. ✅ Production-ready output

**Every button, every option, every feature is now functional!** 🚀
