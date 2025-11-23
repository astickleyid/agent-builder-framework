# 🔌 MCP (Model Context Protocol) Integration

**Status:** ✅ **FULLY IMPLEMENTED & WORKING!**

The stick.ai framework now has complete MCP client integration, allowing you to use external MCP servers and their tools!

---

## 🎉 What's New

- ✅ Full MCP client implementation
- ✅ stdio transport support
- ✅ Dynamic tool discovery
- ✅ Seamless integration with agents
- ✅ MCP tools work like native tools
- ✅ Multiple MCP servers supported

---

## 🚀 Quick Start

### 1. Install an MCP Server

Popular MCP servers you can use:

```bash
# Filesystem server (read/write files)
npx @modelcontextprotocol/server-filesystem

# Brave Search (web search)
npx @modelcontextprotocol/server-brave-search

# Google Maps
npx @modelcontextprotocol/server-google-maps

# GitHub
npx @modelcontextprotocol/server-github

# SQLite
npx @modelcontextprotocol/server-sqlite
```

### 2. Configure Your Agent

Add MCP servers to your agent config:

```json
{
  "name": "my-agent",
  "version": "1.0.0",
  "description": "Agent with MCP tools",
  "tools": ["datetime", "text"],
  "instructions": "You are a helpful assistant.",
  "aiProvider": "ollama",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b"
  },
  "mcp": {
    "servers": [
      {
        "name": "filesystem",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
      },
      {
        "name": "brave-search",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-brave-search"],
        "env": {
          "BRAVE_API_KEY": "your-api-key-here"
        }
      }
    ]
  }
}
```

### 3. Run Your Agent

```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent
node ../dist/cli.js run mcp-agent --interactive
```

The MCP tools will automatically be discovered and registered!

---

## 📋 Available MCP Servers

### Official Servers

| Server | Purpose | Installation |
|--------|---------|--------------|
| **filesystem** | Read/write files | `npx @modelcontextprotocol/server-filesystem` |
| **brave-search** | Web search | `npx @modelcontextprotocol/server-brave-search` |
| **google-maps** | Maps & places | `npx @modelcontextprotocol/server-google-maps` |
| **github** | GitHub API | `npx @modelcontextprotocol/server-github` |
| **sqlite** | SQL queries | `npx @modelcontextprotocol/server-sqlite` |
| **postgres** | PostgreSQL | `npx @modelcontextprotocol/server-postgres` |
| **puppeteer** | Browser automation | `npx @modelcontextprotocol/server-puppeteer` |

### Community Servers

Check the MCP ecosystem for more: https://github.com/modelcontextprotocol/servers

---

## 🎯 Example Configurations

### Filesystem Access

```json
{
  "mcp": {
    "servers": [
      {
        "name": "filesystem",
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-filesystem",
          "/Users/you/Documents"
        ]
      }
    ]
  }
}
```

**Available tools:**
- `filesystem/read_file` - Read file contents
- `filesystem/write_file` - Write to a file
- `filesystem/list_directory` - List directory contents
- `filesystem/create_directory` - Create a new directory
- `filesystem/move_file` - Move/rename files

### Web Search with Brave

```json
{
  "mcp": {
    "servers": [
      {
        "name": "brave-search",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-brave-search"],
        "env": {
          "BRAVE_API_KEY": "your-brave-api-key"
        }
      }
    ]
  }
}
```

**Available tools:**
- `brave-search/search` - Web search

### GitHub Integration

```json
{
  "mcp": {
    "servers": [
      {
        "name": "github",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_TOKEN": "your-github-token"
        }
      }
    ]
  }
}
```

**Available tools:**
- `github/create_issue`
- `github/get_repository`
- `github/list_commits`
- And more...

### SQLite Database

```json
{
  "mcp": {
    "servers": [
      {
        "name": "sqlite",
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-sqlite",
          "/path/to/database.db"
        ]
      }
    ]
  }
}
```

### Multiple Servers

```json
{
  "mcp": {
    "servers": [
      {
        "name": "filesystem",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
      },
      {
        "name": "brave-search",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-brave-search"],
        "env": {
          "BRAVE_API_KEY": "your-key"
        }
      },
      {
        "name": "github",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"],
        "env": {
          "GITHUB_TOKEN": "your-token"
        }
      }
    ]
  }
}
```

---

## 💻 How It Works

### 1. **Connection**
When your agent starts, the MCP client:
- Spawns each configured MCP server as a subprocess
- Establishes stdio communication
- Validates the connection

### 2. **Tool Discovery**
- Queries each server for available tools
- Registers them with the agent
- Makes them available to the LLM

### 3. **Tool Execution**
- LLM decides to use an MCP tool
- Agent calls the MCP client
- MCP client communicates with the server
- Returns result to the agent
- Agent provides response to user

### 4. **Tool Naming**
MCP tools are prefixed with the server name:
- `filesystem/read_file`
- `brave-search/search`
- `github/create_issue`

---

## 🧪 Testing

### Test the MCP Integration

```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent

# Run the pre-configured MCP agent
node ../dist/cli.js run mcp-agent --interactive
```

### Example Conversation

```
You> List files in /tmp
Agent> Let me check the /tmp directory for you...
[Agent uses filesystem/list_directory tool]
Agent> Here are the files in /tmp: file1.txt, file2.json...

You> Read file1.txt
Agent> I'll read that file for you...
[Agent uses filesystem/read_file tool]
Agent> The contents are: ...
```

---

## 🔧 Troubleshooting

### MCP Server Not Found

```bash
# Make sure npx can find the package
npx @modelcontextprotocol/server-filesystem --help

# Or install globally
npm install -g @modelcontextprotocol/server-filesystem
```

### Connection Failed

Check the logs for error messages:
```
[MCP] Connecting to filesystem...
[MCP] Failed to connect to filesystem: ...
```

Common issues:
- Server command not found
- Invalid arguments
- Missing environment variables

### Tools Not Appearing

Make sure:
1. MCP server connected successfully
2. Agent config includes the server
3. Server provides tools (check server docs)

### Permission Errors

For filesystem server:
```json
{
  "name": "filesystem",
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-filesystem",
    "/allowed/path"  // ← Only allow specific paths
  ]
}
```

---

## 📚 Advanced Usage

### Custom MCP Server

You can create your own MCP server! See:
https://modelcontextprotocol.io/docs/

### Environment Variables

Pass secrets and config via environment variables:

```json
{
  "name": "my-server",
  "command": "node",
  "args": ["path/to/server.js"],
  "env": {
    "API_KEY": "secret-key",
    "DATABASE_URL": "postgresql://...",
    "LOG_LEVEL": "debug"
  }
}
```

### HTTP Transport (Coming Soon)

Currently only stdio transport is supported. HTTP transport coming soon:

```json
{
  "name": "remote-server",
  "transport": "http",
  "url": "http://localhost:3000/mcp"
}
```

---

## 🎓 Best Practices

### 1. **Security**
- Only give filesystem access to specific directories
- Use read-only mode when possible
- Validate API keys in environment variables
- Never commit API keys to git

### 2. **Performance**
- Start with fewer servers
- Add servers as needed
- Monitor tool execution times

### 3. **Error Handling**
- MCP connection failures don't crash the agent
- Tools gracefully handle errors
- Check logs for debugging

### 4. **Tool Selection**
- Choose relevant tools for your use case
- Too many tools can confuse the LLM
- Start simple, add complexity

---

## 📊 Architecture

```
┌─────────────────────────────────────────┐
│           Your Agent                    │
│  ┌────────────────────────────────┐    │
│  │   IntelligentAgent              │    │
│  │   - Native Tools (17)           │    │
│  │   - MCP Tools (dynamic)         │    │
│  └────────────────────────────────┘    │
│             ↓                           │
│  ┌────────────────────────────────┐    │
│  │       MCPClient                 │    │
│  │   - Manage connections          │    │
│  │   - Discover tools              │    │
│  │   - Execute tools               │    │
│  └────────────────────────────────┘    │
└──────────────┬──────────────────────────┘
               ↓
    ┌─────────────────────┐
    │   MCP Server        │
    │   (stdio/http)      │
    │   - filesystem      │
    │   - brave-search    │
    │   - github          │
    │   - etc.            │
    └─────────────────────┘
```

---

## ✅ What's Implemented

- ✅ MCP client with stdio transport
- ✅ Dynamic tool discovery
- ✅ Tool execution
- ✅ Multiple server support
- ✅ Error handling
- ✅ Environment variables
- ✅ Integration with IntelligentAgent
- ✅ Automatic tool registration

## 🔜 Coming Soon

- [ ] HTTP transport
- [ ] WebSocket transport
- [ ] Tool caching
- [ ] Connection pooling
- [ ] Health checks
- [ ] Metrics collection

---

## 🎉 Success!

MCP integration is **fully working**! You can now:

1. ✅ Connect to any MCP server
2. ✅ Use external tools
3. ✅ Combine MCP tools with native tools
4. ✅ Build powerful agents with extended capabilities

**Try it now:**
```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent
node ../dist/cli.js run mcp-agent --interactive
```

Check the agent logs to see MCP tools being discovered and used!

---

**MCP integration complete! 🚀**
