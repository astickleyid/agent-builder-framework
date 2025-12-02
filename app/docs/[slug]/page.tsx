'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Terminal, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';

// Documentation content for each page
const documentationContent: Record<string, {
  title: string;
  description: string;
  content: React.ReactNode;
  prev?: { slug: string; title: string };
  next?: { slug: string; title: string };
}> = {
  'getting-started': {
    title: 'Getting Started',
    description: 'Get up and running with stick.ai in 5 minutes',
    prev: undefined,
    next: { slug: 'installation', title: 'Installation' },
    content: (
      <>
        <h2>Getting Started Guide</h2>
        <p>Welcome to stick.ai! This guide will help you get up and running in just 5 minutes.</p>
        
        <h3>Prerequisites</h3>
        <ul>
          <li>Node.js 18.0.0 or higher</li>
          <li>npm or yarn package manager</li>
          <li>Basic understanding of AI agents</li>
        </ul>

        <h3>Step 1: Install the CLI</h3>
        <pre><code>{`npm install -g @stick-ai/cli`}</code></pre>

        <h3>Step 2: Create Your First Agent</h3>
        <pre><code>{`stick init my-first-agent`}</code></pre>

        <h3>Step 3: Configure Your Agent</h3>
        <p>Edit the generated <code>agent.json</code> file:</p>
        <pre><code>{`{
  "name": "my-first-agent",
  "version": "1.0.0",
  "description": "My first AI agent",
  "capabilities": ["chat"],
  "tools": ["datetime", "text"],
  "instructions": "You are a helpful assistant."
}`}</code></pre>

        <h3>Step 4: Run Your Agent</h3>
        <pre><code>{`stick run my-first-agent --interactive`}</code></pre>

        <p>That's it! Your agent is now running and ready to chat.</p>

        <h3>Next Steps</h3>
        <ul>
          <li><strong>Installation:</strong> See detailed installation options</li>
          <li><strong>Your First Agent:</strong> Build a more complete agent</li>
          <li><strong>Configuration:</strong> Learn all configuration options</li>
          <li><strong>Tools:</strong> Explore the 17 built-in tools</li>
        </ul>
      </>
    )
  },
  'quick-start': {
    title: 'Quick Start',
    description: 'Get up and running with stick.ai in 5 minutes',
    prev: undefined,
    next: { slug: 'installation', title: 'Installation' },
    content: (
      <>
        <h2>Quick Start Guide</h2>
        <p>Welcome to stick.ai! This guide will help you get up and running in just 5 minutes.</p>
        
        <h3>Prerequisites</h3>
        <ul>
          <li>Node.js 18.0.0 or higher</li>
          <li>npm or yarn package manager</li>
          <li>Basic understanding of AI agents</li>
        </ul>

        <h3>Step 1: Install the CLI</h3>
        <pre><code>{`npm install -g @stick-ai/cli`}</code></pre>

        <h3>Step 2: Create Your First Agent</h3>
        <pre><code>{`stick init my-first-agent`}</code></pre>

        <h3>Step 3: Configure Your Agent</h3>
        <p>Edit the generated <code>agent.json</code> file:</p>
        <pre><code>{`{
  "name": "my-first-agent",
  "version": "1.0.0",
  "description": "My first AI agent",
  "capabilities": ["chat"],
  "tools": ["datetime", "text"],
  "instructions": "You are a helpful assistant."
}`}</code></pre>

        <h3>Step 4: Run Your Agent</h3>
        <pre><code>{`stick run my-first-agent --interactive`}</code></pre>

        <p>That's it! Your agent is now running and ready to chat.</p>
      </>
    )
  },
  'installation': {
    title: 'Installation',
    description: 'Install the stick.ai framework and CLI',
    prev: { slug: 'quick-start', title: 'Quick Start' },
    next: { slug: 'first-agent', title: 'Your First Agent' },
    content: (
      <>
        <h2>Installation Guide</h2>
        <p>Learn how to install stick.ai on your system.</p>

        <h3>System Requirements</h3>
        <ul>
          <li><strong>Node.js:</strong> Version 18.0.0 or higher</li>
          <li><strong>npm:</strong> Version 8.0.0 or higher (comes with Node.js)</li>
          <li><strong>Operating System:</strong> Windows, macOS, or Linux</li>
        </ul>

        <h3>Install via npm</h3>
        <pre><code>{`npm install -g @stick-ai/cli`}</code></pre>

        <h3>Install via yarn</h3>
        <pre><code>{`yarn global add @stick-ai/cli`}</code></pre>

        <h3>Verify Installation</h3>
        <pre><code>{`stick --version`}</code></pre>

        <h3>Install from Source</h3>
        <pre><code>{`git clone https://github.com/astickleyid/agent-builder-framework.git
cd agent-builder-framework
npm install
npm run build`}</code></pre>

        <h3>Local AI with Ollama</h3>
        <p>For local-first AI without API keys, install Ollama:</p>
        <pre><code>{`# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama and pull a model
ollama serve
ollama pull mistral:7b`}</code></pre>
      </>
    )
  },
  'first-agent': {
    title: 'Your First Agent',
    description: 'Build your first AI agent step by step',
    prev: { slug: 'installation', title: 'Installation' },
    next: { slug: 'configuration', title: 'Configuration' },
    content: (
      <>
        <h2>Building Your First Agent</h2>
        <p>This guide walks you through creating your first AI agent from scratch.</p>

        <h3>Initialize a New Agent</h3>
        <pre><code>{`stick init customer-support`}</code></pre>
        <p>This creates a new directory with the following structure:</p>
        <pre><code>{`customer-support/
├── agent.json      # Agent configuration
├── tools/          # Custom tools directory
├── workflows/      # Multi-step workflows
└── README.md`}</code></pre>

        <h3>Configure Your Agent</h3>
        <p>Edit <code>agent.json</code> to define your agent's behavior:</p>
        <pre><code>{`{
  "name": "customer-support",
  "version": "1.0.0",
  "description": "24/7 AI-powered customer support",
  "capabilities": ["chat", "email"],
  "tools": ["database", "datetime", "text"],
  "instructions": "You are a helpful customer support agent. Always be polite and professional.",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b"
  }
}`}</code></pre>

        <h3>Test Your Agent</h3>
        <pre><code>{`stick run customer-support --interactive`}</code></pre>

        <h3>Deploy Your Agent</h3>
        <pre><code>{`stick deploy customer-support --port 3000`}</code></pre>
      </>
    )
  },
  'configuration': {
    title: 'Configuration',
    description: 'Configure agents and settings',
    prev: { slug: 'first-agent', title: 'Your First Agent' },
    next: { slug: 'agents', title: 'Agents' },
    content: (
      <>
        <h2>Agent Configuration</h2>
        <p>Complete reference for configuring your stick.ai agents.</p>

        <h3>Configuration File Structure</h3>
        <pre><code>{`{
  "name": "my-agent",
  "version": "1.0.0",
  "description": "Agent description",
  "capabilities": ["chat", "task-execution"],
  "tools": ["bash", "http", "database"],
  "instructions": "Detailed instructions...",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b",
    "temperature": 0.7,
    "maxTokens": 4000
  },
  "memory": {
    "enabled": true,
    "maxHistory": 100
  },
  "security": {
    "sandboxed": true,
    "rateLimiting": {
      "requestsPerMinute": 60
    }
  }
}`}</code></pre>

        <h3>Core Fields</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td>name</td><td>string</td><td>Unique identifier for your agent</td></tr>
            <tr><td>version</td><td>string</td><td>Semantic version (e.g., "1.0.0")</td></tr>
            <tr><td>description</td><td>string</td><td>Brief description of agent's purpose</td></tr>
            <tr><td>capabilities</td><td>string[]</td><td>List of agent capabilities</td></tr>
            <tr><td>tools</td><td>string[]</td><td>Available tools for the agent</td></tr>
            <tr><td>instructions</td><td>string</td><td>Behavioral instructions</td></tr>
          </tbody>
        </table>

        <h3>Environment Variables</h3>
        <pre><code>{`# .env file
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OLLAMA_HOST=http://localhost:11434`}</code></pre>
      </>
    )
  },
  'agents': {
    title: 'Agents',
    description: 'Understanding AI agents',
    prev: { slug: 'configuration', title: 'Configuration' },
    next: { slug: 'tools', title: 'Tools' },
    content: (
      <>
        <h2>Understanding AI Agents</h2>
        <p>Learn about the core concepts of AI agents in stick.ai.</p>

        <h3>What is an Agent?</h3>
        <p>An agent in stick.ai is an autonomous AI system that can:</p>
        <ul>
          <li>Process natural language input</li>
          <li>Use tools to accomplish tasks</li>
          <li>Maintain conversation context</li>
          <li>Execute multi-step workflows</li>
        </ul>

        <h3>Agent Lifecycle</h3>
        <ol>
          <li><strong>Initialization:</strong> Agent loads configuration and tools</li>
          <li><strong>Input Processing:</strong> Receives and parses user input</li>
          <li><strong>Reasoning:</strong> LLM determines appropriate actions</li>
          <li><strong>Tool Execution:</strong> Executes necessary tools</li>
          <li><strong>Response:</strong> Generates and returns response</li>
        </ol>

        <h3>Agent Types</h3>
        <ul>
          <li><strong>Chat Agent:</strong> Conversational interface</li>
          <li><strong>Task Agent:</strong> Single-purpose task execution</li>
          <li><strong>Workflow Agent:</strong> Multi-step process automation</li>
          <li><strong>Coordinator Agent:</strong> Orchestrates other agents</li>
        </ul>
      </>
    )
  },
  'tools': {
    title: 'Tools',
    description: '17 built-in tools explained',
    prev: { slug: 'agents', title: 'Agents' },
    next: { slug: 'llm-providers', title: 'LLM Providers' },
    content: (
      <>
        <h2>Built-in Tools</h2>
        <p>stick.ai comes with 17 production-ready tools.</p>

        <h3>System Tools</h3>
        <ul>
          <li><strong>bash:</strong> Execute shell commands</li>
          <li><strong>filesystem:</strong> Read/write files</li>
          <li><strong>python:</strong> Execute Python code</li>
        </ul>

        <h3>Web Tools</h3>
        <ul>
          <li><strong>http:</strong> Make HTTP requests</li>
          <li><strong>web-search:</strong> Search the web</li>
          <li><strong>web-scraper:</strong> Extract web content</li>
        </ul>

        <h3>Data Tools</h3>
        <ul>
          <li><strong>json:</strong> Parse and manipulate JSON</li>
          <li><strong>csv:</strong> Process CSV files</li>
          <li><strong>xml:</strong> Parse XML documents</li>
          <li><strong>yaml:</strong> Handle YAML files</li>
          <li><strong>database:</strong> Query databases</li>
        </ul>

        <h3>Utility Tools</h3>
        <ul>
          <li><strong>datetime:</strong> Date/time operations</li>
          <li><strong>text:</strong> Text manipulation</li>
          <li><strong>calculator:</strong> Mathematical operations</li>
        </ul>

        <h3>Integration Tools</h3>
        <ul>
          <li><strong>github:</strong> GitHub API integration</li>
          <li><strong>email:</strong> Send emails</li>
          <li><strong>slack:</strong> Slack messaging</li>
        </ul>

        <h3>Using Tools</h3>
        <pre><code>{`{
  "tools": ["datetime", "http", "json", "database"]
}`}</code></pre>
      </>
    )
  },
  'llm-providers': {
    title: 'LLM Providers',
    description: 'OpenAI, Anthropic, Ollama',
    prev: { slug: 'tools', title: 'Tools' },
    next: { slug: 'memory', title: 'Memory System' },
    content: (
      <>
        <h2>LLM Providers</h2>
        <p>stick.ai supports multiple LLM providers out of the box.</p>

        <h3>Ollama (Local)</h3>
        <p>Free, local AI with no API keys required.</p>
        <pre><code>{`{
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b"
  }
}`}</code></pre>
        <p>Available models: mistral:7b, llama2:13b, codellama:7b, phi, neural-chat</p>

        <h3>OpenAI</h3>
        <p>Industry-leading models from OpenAI.</p>
        <pre><code>{`{
  "llm": {
    "provider": "openai",
    "model": "gpt-4"
  }
}

# Environment variable
OPENAI_API_KEY=sk-...`}</code></pre>
        <p>Available models: gpt-4, gpt-4-turbo, gpt-3.5-turbo</p>

        <h3>Anthropic</h3>
        <p>Claude models from Anthropic.</p>
        <pre><code>{`{
  "llm": {
    "provider": "anthropic",
    "model": "claude-3-sonnet"
  }
}

# Environment variable
ANTHROPIC_API_KEY=sk-ant-...`}</code></pre>
        <p>Available models: claude-3-opus, claude-3-sonnet, claude-3-haiku</p>

        <h3>Switching Providers</h3>
        <p>You can switch providers at runtime:</p>
        <pre><code>{`stick run my-agent --provider openai --model gpt-4`}</code></pre>
      </>
    )
  },
  'memory': {
    title: 'Memory System',
    description: 'Persistent and vector memory',
    prev: { slug: 'llm-providers', title: 'LLM Providers' },
    next: { slug: 'multi-agent', title: 'Multi-Agent Systems' },
    content: (
      <>
        <h2>Memory System</h2>
        <p>stick.ai provides robust memory capabilities for agents.</p>

        <h3>Conversation Memory</h3>
        <p>Automatically maintains conversation history:</p>
        <pre><code>{`{
  "memory": {
    "enabled": true,
    "maxHistory": 100,
    "contextWindow": 10
  }
}`}</code></pre>

        <h3>Persistent Memory</h3>
        <p>Store memories across sessions:</p>
        <pre><code>{`{
  "memory": {
    "persistent": true,
    "storagePath": "./data/memory"
  }
}`}</code></pre>

        <h3>Vector Memory</h3>
        <p>Semantic search through past conversations:</p>
        <pre><code>{`{
  "memory": {
    "vector": {
      "enabled": true,
      "dimensions": 1536,
      "similarity": "cosine"
    }
  }
}`}</code></pre>

        <h3>Memory Operations</h3>
        <ul>
          <li><strong>store:</strong> Save information to memory</li>
          <li><strong>recall:</strong> Retrieve relevant memories</li>
          <li><strong>forget:</strong> Clear specific memories</li>
          <li><strong>summarize:</strong> Compress conversation history</li>
        </ul>
      </>
    )
  },
  'multi-agent': {
    title: 'Multi-Agent Systems',
    description: 'Orchestrate multiple agents',
    prev: { slug: 'memory', title: 'Memory System' },
    next: { slug: 'mcp', title: 'MCP Integration' },
    content: (
      <>
        <h2>Multi-Agent Systems</h2>
        <p>Coordinate multiple agents working together.</p>

        <h3>Agent Orchestration</h3>
        <pre><code>{`{
  "orchestration": {
    "mode": "hierarchical",
    "coordinator": "main-agent",
    "subAgents": [
      { "name": "research-agent" },
      { "name": "writing-agent" },
      { "name": "review-agent" }
    ]
  }
}`}</code></pre>

        <h3>Communication Patterns</h3>
        <ul>
          <li><strong>Hierarchical:</strong> Coordinator delegates to specialists</li>
          <li><strong>Peer-to-peer:</strong> Agents communicate directly</li>
          <li><strong>Pipeline:</strong> Sequential agent processing</li>
          <li><strong>Broadcast:</strong> One-to-many communication</li>
        </ul>

        <h3>Example: Research Pipeline</h3>
        <pre><code>{`// coordinator-agent.json
{
  "name": "research-coordinator",
  "subAgents": [
    { "name": "searcher", "role": "find information" },
    { "name": "analyzer", "role": "analyze data" },
    { "name": "writer", "role": "create report" }
  ]
}`}</code></pre>
      </>
    )
  },
  'mcp': {
    title: 'MCP Integration',
    description: 'Model Context Protocol servers',
    prev: { slug: 'multi-agent', title: 'Multi-Agent Systems' },
    next: { slug: 'security', title: 'Security' },
    content: (
      <>
        <h2>MCP Integration</h2>
        <p>Extend your agents with Model Context Protocol servers.</p>

        <h3>What is MCP?</h3>
        <p>Model Context Protocol (MCP) is an open standard for connecting AI models to external tools and data sources.</p>

        <h3>Configuring MCP Servers</h3>
        <pre><code>{`{
  "mcp": {
    "servers": [
      {
        "name": "filesystem",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem"]
      },
      {
        "name": "github",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-github"]
      }
    ]
  }
}`}</code></pre>

        <h3>Available MCP Servers</h3>
        <ul>
          <li><strong>filesystem:</strong> Read/write local files</li>
          <li><strong>brave-search:</strong> Web search via Brave</li>
          <li><strong>github:</strong> GitHub API integration</li>
          <li><strong>sqlite:</strong> SQLite database access</li>
          <li><strong>postgres:</strong> PostgreSQL database</li>
        </ul>

        <h3>Creating Custom MCP Servers</h3>
        <p>Build your own MCP servers to extend agent capabilities:</p>
        <pre><code>{`// custom-server.ts
import { Server } from "@modelcontextprotocol/sdk/server";

const server = new Server({
  name: "custom-server",
  version: "1.0.0"
});

server.setRequestHandler(/* ... */);`}</code></pre>
      </>
    )
  },
  'security': {
    title: 'Security',
    description: 'Sandboxing and rate limiting',
    prev: { slug: 'mcp', title: 'MCP Integration' },
    next: { slug: 'deployment', title: 'Deployment' },
    content: (
      <>
        <h2>Security</h2>
        <p>Enterprise-grade security features for your agents.</p>

        <h3>Sandboxing</h3>
        <p>Run agents in isolated environments:</p>
        <pre><code>{`{
  "security": {
    "sandboxed": true,
    "allowedDomains": ["api.example.com"],
    "blockedCommands": ["rm", "sudo"]
  }
}`}</code></pre>

        <h3>Rate Limiting</h3>
        <p>Prevent abuse and resource exhaustion:</p>
        <pre><code>{`{
  "security": {
    "rateLimiting": {
      "requestsPerMinute": 60,
      "requestsPerHour": 1000,
      "tokensPerMinute": 100000
    }
  }
}`}</code></pre>

        <h3>Authentication</h3>
        <pre><code>{`{
  "security": {
    "authentication": {
      "required": true,
      "method": "api-key"
    }
  }
}`}</code></pre>

        <h3>Audit Logging</h3>
        <pre><code>{`{
  "security": {
    "audit": {
      "enabled": true,
      "logPath": "./logs/audit.log"
    }
  }
}`}</code></pre>

        <h3>Best Practices</h3>
        <ul>
          <li>Always enable sandboxing in production</li>
          <li>Use environment variables for secrets</li>
          <li>Set appropriate rate limits</li>
          <li>Enable audit logging</li>
          <li>Regularly review agent permissions</li>
        </ul>
      </>
    )
  },
  'deployment': {
    title: 'Deployment',
    description: 'Deploy to production',
    prev: { slug: 'security', title: 'Security' },
    next: { slug: 'api-reference', title: 'REST API' },
    content: (
      <>
        <h2>Deployment</h2>
        <p>Deploy your agents to production environments.</p>

        <h3>Local Deployment</h3>
        <pre><code>{`stick deploy my-agent --port 3000`}</code></pre>

        <h3>Docker Deployment</h3>
        <pre><code>{`# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install -g @stick-ai/cli
EXPOSE 3000
CMD ["stick", "deploy", "my-agent", "--port", "3000"]`}</code></pre>

        <h3>Docker Compose</h3>
        <pre><code>{`version: '3.8'
services:
  agent:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
    volumes:
      - ./data:/app/data`}</code></pre>

        <h3>Kubernetes</h3>
        <pre><code>{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-agent
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: agent
          image: my-agent:latest
          ports:
            - containerPort: 3000`}</code></pre>

        <h3>Health Checks</h3>
        <pre><code>{`GET /health
{
  "status": "healthy",
  "uptime": 3600,
  "version": "1.0.0"
}`}</code></pre>
      </>
    )
  },
  'api-reference': {
    title: 'REST API',
    description: 'Complete API documentation',
    prev: { slug: 'deployment', title: 'Deployment' },
    next: { slug: 'cli', title: 'CLI Commands' },
    content: (
      <>
        <h2>REST API Reference</h2>
        <p>Complete documentation for the stick.ai REST API.</p>

        <h3>Base URL</h3>
        <pre><code>{`http://localhost:3000/api`}</code></pre>

        <h3>Chat Endpoint</h3>
        <pre><code>{`POST /api/chat
Content-Type: application/json

{
  "message": "Hello, how can you help?",
  "agentName": "my-agent"
}

Response:
{
  "success": true,
  "response": "I can help you with...",
  "timestamp": 1234567890
}`}</code></pre>

        <h3>Agent Management</h3>
        <pre><code>{`GET /api/agents
Response: { "agents": [...] }

GET /api/agents/:name
Response: { "agent": {...} }

POST /api/agents
Body: { "config": {...} }
Response: { "created": true }`}</code></pre>

        <h3>Memory Operations</h3>
        <pre><code>{`GET /api/memory
Response: { "conversations": [...] }

POST /api/memory
Body: { "conversationId": "...", "messages": [...] }
Response: { "saved": true }`}</code></pre>

        <h3>Error Responses</h3>
        <pre><code>{`{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}`}</code></pre>
      </>
    )
  },
  'cli': {
    title: 'CLI Commands',
    description: 'Command line interface',
    prev: { slug: 'api-reference', title: 'REST API' },
    next: { slug: 'sdk', title: 'SDK Reference' },
    content: (
      <>
        <h2>CLI Commands</h2>
        <p>Complete reference for the stick.ai CLI.</p>

        <h3>Getting Help</h3>
        <pre><code>{`stick --help
stick <command> --help`}</code></pre>

        <h3>Core Commands</h3>
        <table>
          <thead>
            <tr><th>Command</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr><td><code>stick</code></td><td>Launch interactive mode</td></tr>
            <tr><td><code>stick init [name]</code></td><td>Create a new agent</td></tr>
            <tr><td><code>stick run [name]</code></td><td>Run an agent</td></tr>
            <tr><td><code>stick deploy [name]</code></td><td>Deploy as API</td></tr>
            <tr><td><code>stick list</code></td><td>List all agents</td></tr>
          </tbody>
        </table>

        <h3>Run Options</h3>
        <pre><code>{`stick run my-agent \\
  --provider ollama \\
  --model mistral:7b \\
  --temperature 0.7 \\
  --interactive`}</code></pre>

        <h3>Natural Language Mode</h3>
        <pre><code>{`# Just describe what you want
stick create a chatbot
stick deploy my agent as an API
stick help me build a research assistant`}</code></pre>
      </>
    )
  },
  'sdk': {
    title: 'SDK Reference',
    description: 'TypeScript/JavaScript SDK',
    prev: { slug: 'cli', title: 'CLI Commands' },
    next: { slug: 'schema', title: 'Configuration Schema' },
    content: (
      <>
        <h2>SDK Reference</h2>
        <p>Use stick.ai programmatically in your applications.</p>

        <h3>Installation</h3>
        <pre><code>{`npm install @stick-ai/runtime`}</code></pre>

        <h3>Basic Usage</h3>
        <pre><code>{`import { IntelligentAgent } from '@stick-ai/runtime';

const agent = new IntelligentAgent({
  name: 'my-agent',
  tools: ['datetime', 'text'],
  instructions: 'You are helpful.'
}, {
  provider: 'ollama',
  model: 'mistral:7b'
});

// Chat with the agent
const response = await agent.chat('Hello!');
console.log(response);`}</code></pre>

        <h3>With Tools</h3>
        <pre><code>{`const agent = new IntelligentAgent({
  tools: ['http', 'json', 'database']
});

// Agent can now make HTTP requests,
// parse JSON, and query databases`}</code></pre>

        <h3>Event Handlers</h3>
        <pre><code>{`agent.on('message', (msg) => {
  console.log('Received:', msg);
});

agent.on('toolCall', (tool, args) => {
  console.log('Tool called:', tool);
});

agent.on('error', (err) => {
  console.error('Error:', err);
});`}</code></pre>
      </>
    )
  },
  'schema': {
    title: 'Configuration Schema',
    description: 'JSON configuration reference',
    prev: { slug: 'sdk', title: 'SDK Reference' },
    next: { slug: 'guide-chatbot', title: 'Building a Chatbot' },
    content: (
      <>
        <h2>Configuration Schema</h2>
        <p>Complete JSON schema reference for agent configuration.</p>

        <h3>Full Schema</h3>
        <pre><code>{`{
  "name": "string (required)",
  "version": "string (semver)",
  "description": "string",
  "capabilities": ["chat", "task-execution", ...],
  "tools": ["tool-name", ...],
  "instructions": "string",
  "llm": {
    "provider": "ollama | openai | anthropic",
    "model": "string",
    "temperature": "number (0-2)",
    "maxTokens": "number",
    "topP": "number (0-1)"
  },
  "memory": {
    "enabled": "boolean",
    "maxHistory": "number",
    "persistent": "boolean",
    "storagePath": "string"
  },
  "security": {
    "sandboxed": "boolean",
    "rateLimiting": {
      "requestsPerMinute": "number",
      "requestsPerHour": "number"
    }
  },
  "mcp": {
    "servers": [{
      "name": "string",
      "command": "string",
      "args": ["string"]
    }]
  }
}`}</code></pre>

        <h3>Validation</h3>
        <pre><code>{`stick config validate`}</code></pre>
      </>
    )
  },
  'guide-chatbot': {
    title: 'Building a Chatbot',
    description: 'Create a conversational agent',
    prev: { slug: 'schema', title: 'Configuration Schema' },
    next: { slug: 'guide-research', title: 'Research Pipeline' },
    content: (
      <>
        <h2>Building a Chatbot</h2>
        <p>Step-by-step guide to create a conversational AI chatbot.</p>

        <h3>Step 1: Initialize</h3>
        <pre><code>{`stick init chatbot --template chatbot`}</code></pre>

        <h3>Step 2: Configure</h3>
        <pre><code>{`{
  "name": "chatbot",
  "description": "Friendly conversational AI",
  "capabilities": ["chat"],
  "tools": ["datetime", "text"],
  "instructions": "You are a friendly, helpful chatbot. Be conversational and engaging.",
  "llm": {
    "provider": "ollama",
    "model": "mistral:7b",
    "temperature": 0.8
  },
  "memory": {
    "enabled": true,
    "maxHistory": 50
  }
}`}</code></pre>

        <h3>Step 3: Test</h3>
        <pre><code>{`stick run chatbot --interactive`}</code></pre>

        <h3>Step 4: Deploy</h3>
        <pre><code>{`stick deploy chatbot --port 3000`}</code></pre>

        <h3>Integration Example</h3>
        <pre><code>{`// React component
const [response, setResponse] = useState('');

const sendMessage = async (msg) => {
  const res = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ message: msg })
  });
  const data = await res.json();
  setResponse(data.response);
};`}</code></pre>
      </>
    )
  },
  'guide-research': {
    title: 'Research Pipeline',
    description: 'Multi-agent research system',
    prev: { slug: 'guide-chatbot', title: 'Building a Chatbot' },
    next: { slug: 'guide-code-review', title: 'Code Review Bot' },
    content: (
      <>
        <h2>Research Pipeline</h2>
        <p>Build a multi-agent system for automated research.</p>

        <h3>Architecture</h3>
        <pre><code>{`Coordinator
    ├── Search Agent (finds information)
    ├── Analysis Agent (processes data)
    └── Writer Agent (creates report)`}</code></pre>

        <h3>Search Agent</h3>
        <pre><code>{`{
  "name": "search-agent",
  "tools": ["http", "web-search", "json"],
  "instructions": "Search and gather information..."
}`}</code></pre>

        <h3>Analysis Agent</h3>
        <pre><code>{`{
  "name": "analysis-agent",
  "tools": ["text", "json"],
  "instructions": "Analyze and summarize data..."
}`}</code></pre>

        <h3>Writer Agent</h3>
        <pre><code>{`{
  "name": "writer-agent",
  "tools": ["text", "filesystem"],
  "instructions": "Create well-structured reports..."
}`}</code></pre>

        <h3>Coordinator</h3>
        <pre><code>{`{
  "name": "research-coordinator",
  "orchestration": {
    "mode": "pipeline",
    "agents": ["search-agent", "analysis-agent", "writer-agent"]
  }
}`}</code></pre>
      </>
    )
  },
  'guide-code-review': {
    title: 'Code Review Bot',
    description: 'Automated code reviewer',
    prev: { slug: 'guide-research', title: 'Research Pipeline' },
    next: { slug: 'guide-docker', title: 'Docker Deployment' },
    content: (
      <>
        <h2>Code Review Bot</h2>
        <p>Build an automated code review agent.</p>

        <h3>Configuration</h3>
        <pre><code>{`{
  "name": "code-reviewer",
  "description": "Automated code review bot",
  "tools": ["github", "filesystem", "bash"],
  "instructions": "Review code for quality, security, and best practices. Provide constructive feedback.",
  "llm": {
    "provider": "openai",
    "model": "gpt-4",
    "temperature": 0.3
  }
}`}</code></pre>

        <h3>GitHub Integration</h3>
        <pre><code>{`// Set up GitHub webhook
stick deploy code-reviewer --webhook github

// Environment variables
GITHUB_TOKEN=ghp_...
GITHUB_WEBHOOK_SECRET=...`}</code></pre>

        <h3>Review Criteria</h3>
        <ul>
          <li>Code style and formatting</li>
          <li>Security vulnerabilities</li>
          <li>Performance issues</li>
          <li>Best practices</li>
          <li>Documentation</li>
        </ul>

        <h3>Example Review</h3>
        <pre><code>{`// Agent output
{
  "file": "src/api/users.js",
  "issues": [
    {
      "line": 42,
      "severity": "warning",
      "message": "SQL injection vulnerability"
    }
  ],
  "suggestions": [
    "Use parameterized queries"
  ]
}`}</code></pre>
      </>
    )
  },
  'guide-docker': {
    title: 'Docker Deployment',
    description: 'Deploy with Docker',
    prev: { slug: 'guide-code-review', title: 'Code Review Bot' },
    next: undefined,
    content: (
      <>
        <h2>Docker Deployment</h2>
        <p>Deploy your agents using Docker containers.</p>

        <h3>Dockerfile</h3>
        <pre><code>{`FROM node:18-alpine

WORKDIR /app

# Install CLI
RUN npm install -g @stick-ai/cli

# Copy agent configuration
COPY agent.json .
COPY tools/ ./tools/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \\
  CMD curl -f http://localhost:3000/health || exit 1

# Start agent
CMD ["stick", "deploy", "--port", "3000"]`}</code></pre>

        <h3>Docker Compose</h3>
        <pre><code>{`version: '3.8'

services:
  agent:
    build: .
    ports:
      - "3000:3000"
    environment:
      - OPENAI_API_KEY=\${OPENAI_API_KEY}
      - NODE_ENV=production
    volumes:
      - agent-data:/app/data
    restart: unless-stopped

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama

volumes:
  agent-data:
  ollama-data:`}</code></pre>

        <h3>Build and Run</h3>
        <pre><code>{`# Build image
docker build -t my-agent .

# Run container
docker run -d -p 3000:3000 my-agent

# With Docker Compose
docker-compose up -d`}</code></pre>

        <h3>Production Tips</h3>
        <ul>
          <li>Use multi-stage builds for smaller images</li>
          <li>Set resource limits</li>
          <li>Use secrets management</li>
          <li>Enable health checks</li>
          <li>Set up logging</li>
        </ul>
      </>
    )
  }
};

export default function DocPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const doc = documentationContent[slug];
  
  if (!doc) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <Terminal className="w-6 h-6 text-accent-blue" />
                <div className="absolute inset-0 blur-md bg-accent-blue/30" />
              </div>
              <span className="text-xl font-bold">stick.ai</span>
            </Link>
          </div>
        </nav>
        
        <div className="pt-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-zinc-400 mb-8">The documentation page "{slug}" doesn't exist.</p>
          <Link href="/docs" className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium">
            Back to Documentation
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Terminal className="w-6 h-6 text-accent-blue" />
              <div className="absolute inset-0 blur-md bg-accent-blue/30" />
            </div>
            <span className="text-xl font-bold">stick.ai</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-white font-semibold">
              Docs
            </Link>
            <Link href="/examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Examples
            </Link>
            <Link href="/playground" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Playground
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
            <Link href="/docs" className="hover:text-white transition-colors flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Documentation
            </Link>
            <span>/</span>
            <span className="text-white">{doc.title}</span>
          </div>

          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{doc.title}</h1>
            <p className="text-xl text-zinc-400">{doc.description}</p>
          </div>

          {/* Content */}
          <article className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-a:text-accent-blue prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white
            prose-code:text-accent-cyan prose-code:bg-surface prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            prose-pre:bg-black/40 prose-pre:border prose-pre:border-border prose-pre:rounded-xl
            prose-ul:text-zinc-300 prose-ol:text-zinc-300
            prose-li:marker:text-accent-blue
            prose-table:border-collapse
            prose-th:border prose-th:border-border prose-th:bg-surface prose-th:px-4 prose-th:py-2 prose-th:text-left
            prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2
          ">
            {doc.content}
          </article>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-border flex justify-between">
            {doc.prev ? (
              <Link 
                href={`/docs/${doc.prev.slug}`}
                className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <div>
                  <div className="text-xs text-zinc-500">Previous</div>
                  <div className="font-medium">{doc.prev.title}</div>
                </div>
              </Link>
            ) : <div />}
            
            {doc.next ? (
              <Link 
                href={`/docs/${doc.next.slug}`}
                className="group flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-right"
              >
                <div>
                  <div className="text-xs text-zinc-500">Next</div>
                  <div className="font-medium">{doc.next.title}</div>
                </div>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}


