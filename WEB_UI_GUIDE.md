# Web UI Agent Builder Guide

## 🎨 Visual Agent Builder Playground

The stick.ai framework now includes a **fully functional visual agent builder** that makes creating and deploying AI agents incredibly easy - no code required!

![Agent Builder Interface](https://github.com/user-attachments/assets/5cafe420-0406-42b5-8a38-ce78889ef727)

## 🚀 Getting Started

### 1. Start the Web Interface

```bash
# From the repository root
npm run dev

# The interface will be available at:
# http://localhost:3002/playground
```

### 2. Access the Playground

Navigate to `http://localhost:3002/playground` in your web browser.

## 📋 Three Main Tabs

### 🛠️ Builder Tab

**Configure your agent visually**

![Builder Tab](https://github.com/user-attachments/assets/5cafe420-0406-42b5-8a38-ce78889ef727)

#### Basic Configuration
- **Agent Name**: Give your agent a unique identifier
- **Description**: Describe what your agent does
- **LLM Provider**: Choose from:
  - Ollama (Local) - Free, runs on your machine
  - OpenAI - GPT-4, GPT-3.5
  - Anthropic - Claude models
- **Model**: Select the specific model to use
- **System Instructions**: Define your agent's behavior and personality

#### Native Tools
Click to enable/disable built-in tools:
- `datetime` - Date and time operations
- `text` - Text manipulation
- `json` - JSON parsing and generation
- `csv` - CSV file operations
- `xml` - XML processing
- `yaml` - YAML operations
- `http` - HTTP requests
- `bash` - Shell commands
- `filesystem` - File operations
- `calculator` - Math calculations
- `web-search` - Web searching
- `github` - GitHub integration
- `database` - Database operations

#### MCP Servers
Add Model Context Protocol servers for advanced integrations:
- Filesystem - Read/write files
- Brave Search - Web search capabilities
- GitHub - Repository operations
- SQLite - Local database
- PostgreSQL - Database operations

#### Advanced Settings
- **Temperature**: Control response creativity (0.0 - 2.0)
- **Max Tokens**: Set maximum response length

#### Action Buttons
- **💾 Save Agent**: Persist your configuration
- **🚀 Deploy**: Start the agent (enables testing)
- **📋 Export JSON**: Download configuration file
- **🔄 Reset**: Reset to default configuration

### 👁️ Preview Tab

**View your agent configuration in a structured format**
- See all settings at a glance
- Review tool selections
- Verify MCP server connections

### 🧪 Test Tab

**Interact with your deployed agent in real-time**

![Test Tab](https://github.com/user-attachments/assets/05678cd5-9bdb-4569-8dc9-57b9271ff6d3)

#### Deployment Status
- **Green "Deployed"**: Agent is running and ready
- **Yellow "Starting"**: Agent is being deployed
- **Red "Not Deployed"**: Need to deploy first

#### Chat Interface
- Type messages in the text box
- Press Enter or click Send
- View conversation history
- Agent responses show timing information

#### Quick Tests
Pre-written prompts to test your agent:
- "What can you help me with?"
- "Tell me about your capabilities"
- "What tools do you have access to?"
- "Solve: 25 * 47 + 120"
- "What is the current date and time?"

![Test Conversation](https://github.com/user-attachments/assets/e6c723d8-ed5d-44e8-85dd-b15144b8c651)

#### Test Statistics
Real-time metrics:
- Total Messages sent
- Average Response Time
- Tools Available

#### Active Configuration
Current agent settings display:
- Provider and Model
- Temperature
- Max Tokens

#### Live Testing Indicator
- ✓ Green: Connected to real LLM
- ⚠️ Orange: Simulated mode (when LLM not available)

## 🔄 Complete Workflow

### Step 1: Configure Your Agent

1. Open the Playground at `http://localhost:3002/playground`
2. Click on the **Builder** tab
3. Fill in the basic configuration:
   - Name: `my-assistant`
   - Description: `A helpful AI assistant`
   - Provider: `ollama` (or your preferred provider)
   - Model: `mistral:7b`
   - Instructions: Customize the agent's behavior
4. Select tools by clicking the buttons (they turn blue when enabled)
5. Add MCP servers if needed

### Step 2: Save Your Agent

1. Click **💾 Save Agent**
2. Wait for the success message
3. The agent configuration is now persisted

### Step 3: Deploy Your Agent

1. Click **🚀 Deploy**
2. Wait for deployment confirmation
3. The agent is now running in-memory

### Step 4: Test Your Agent

1. Switch to the **🧪 Test** tab
2. Verify the "Deployed" status is green
3. Either:
   - Click a Quick Test button, or
   - Type your own message
4. Watch the agent respond in real-time
5. View statistics and response times

### Step 5: Export Configuration (Optional)

1. Go back to the **Builder** tab
2. Click **📋 Export JSON**
3. Save the JSON file for:
   - Version control
   - Sharing with team
   - CLI deployment
   - Backup

## 💡 Tips and Best Practices

### Provider Selection

**Ollama (Recommended for Development)**
- ✅ Free and runs locally
- ✅ No API keys required
- ✅ Complete privacy
- ⚠️ Requires Ollama to be running: `ollama serve`
- ⚠️ Need to pull models first: `ollama pull mistral:7b`

**OpenAI**
- ✅ Most capable models (GPT-4)
- ✅ Fast responses
- ⚠️ Requires API key: `export OPENAI_API_KEY=sk-...`
- ⚠️ Costs per request

**Anthropic**
- ✅ Claude models with large context
- ✅ Strong reasoning capabilities
- ⚠️ Requires API key: `export ANTHROPIC_API_KEY=sk-ant-...`
- ⚠️ Costs per request

### Tool Selection

**Start Simple**
- Begin with `datetime` and `text` tools
- Test basic functionality
- Add more tools as needed

**For Web Agents**
- Enable `http` for API calls
- Add `web-search` for information retrieval
- Include `json` for data processing

**For Development Agents**
- Enable `bash` for command execution
- Add `filesystem` for file operations
- Include `github` for repository access

### Temperature Settings

- **0.0 - 0.3**: Focused, deterministic (good for code, data)
- **0.4 - 0.7**: Balanced (general purpose)
- **0.8 - 1.5**: Creative (writing, brainstorming)
- **1.6 - 2.0**: Very creative (experimental)

### Testing Strategy

1. **Start with Quick Tests**: Use the predefined prompts
2. **Test Tool Usage**: Ask questions that require tools
3. **Test Edge Cases**: Try unexpected inputs
4. **Monitor Performance**: Check response times
5. **Iterate**: Adjust configuration based on results

## 🔧 Troubleshooting

### Agent Not Responding

**Check Deployment Status**
- Ensure the agent shows "Deployed" (green indicator)
- If not deployed, click the 🚀 Deploy button

**Verify Provider Setup**
- **Ollama**: Run `ollama list` to see available models
- **OpenAI**: Check `echo $OPENAI_API_KEY`
- **Anthropic**: Check `echo $ANTHROPIC_API_KEY`

### Slow Responses

**For Ollama**
- Check system resources
- Try a smaller model (e.g., `mistral:7b` instead of `llama2:13b`)
- Reduce max tokens

**For Cloud Providers**
- Check internet connection
- Verify API rate limits
- Consider upgrading plan

### Errors in Chat

**"Agent not deployed"**
- Click the Deploy button in Builder tab
- Wait for success message
- Return to Test tab

**"Failed to save agent"**
- Check browser console for errors
- Verify write permissions
- Try again

**Simulated responses instead of real LLM**
- Ollama: Ensure `ollama serve` is running
- OpenAI/Anthropic: Verify API keys are set
- Check deployment status indicator

## 🎓 Example Use Cases

### Customer Support Agent

```
Name: support-bot
Provider: openai
Model: gpt-4
Tools: http, database, email
Instructions: You are a helpful customer support agent. 
Always be polite and professional. Use the database to 
look up customer information when needed.
```

### Code Review Assistant

```
Name: code-reviewer
Provider: anthropic
Model: claude-3-sonnet
Tools: github, filesystem, bash
Instructions: You are an expert code reviewer. Analyze 
code for bugs, security issues, and best practices. 
Provide constructive feedback.
```

### Research Assistant

```
Name: research-helper
Provider: ollama
Model: mistral:7b
Tools: web-search, http, text, json
Instructions: You are a research assistant. Help gather 
and synthesize information from multiple sources. Always 
cite your sources.
```

## 🌟 Advanced Features

### Multiple Agents

You can create and save multiple agents:
1. Configure and save first agent
2. Click Reset to clear form
3. Configure second agent with different name
4. Save second agent
5. Both are stored independently

### JSON Export/Import

**Export**:
- Click "Export JSON" to download configuration
- Use this file with the CLI: `stick run my-agent --config agent.json`
- Share with team members
- Keep in version control

**Import** (CLI):
- Place exported JSON in your project
- Run: `stick run my-agent`
- All settings are preserved

### API Integration

The web UI uses REST API endpoints that you can also call directly:

```bash
# List all agents
curl http://localhost:3002/api/agents

# Get agent status
curl http://localhost:3002/api/agents/{id}/status

# Test agent
curl -X POST http://localhost:3002/api/agents/{id}/test \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello!"}'
```

## 📚 Next Steps

1. **Try the Examples**: Start with the Quick Start example
2. **Read the Docs**: Check `/docs` for detailed guides
3. **Join Community**: Share your agents on Discord
4. **Contribute**: Help improve the framework on GitHub

## 🤝 Support

- **Documentation**: [Full Docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/astickleyid/agent-builder-framework/issues)
- **Discord**: Join our community
- **Email**: support@stick.ai

---

**Made with ❤️ by the stick.ai team**

Making AI agent development so easy, it feels illegal! 🚀
