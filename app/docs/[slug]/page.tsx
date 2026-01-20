import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import TerminalIcon from '@/components/icons/TerminalIcon';

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
    description: 'Complete agent configuration reference',
    prev: { slug: 'first-agent', title: 'Your First Agent' },
    next: { slug: 'agents', title: 'Agents' },
    content: (
      <>
        <h2>Agent Configuration Reference</h2>
        <p>This comprehensive guide covers every configuration option available in stick.ai. The <code>agent.json</code> file is the heart of your agent, defining its behavior, capabilities, tools, and integrations.</p>

        <h3>Complete Configuration Structure</h3>
        <pre><code>{`{
  // Core Identity
  "name": "my-agent",                    // Required: Unique agent identifier
  "version": "1.0.0",                    // Required: Semantic version
  "description": "Agent description",    // Optional: Human-readable description

  // Capabilities & Tools
  "capabilities": ["chat", "task-execution", "data-analysis"],
  "tools": ["bash", "http", "database", "filesystem"],

  // Behavior Definition
  "instructions": "You are a helpful AI assistant specialized in data analysis...",

  // LLM Configuration
  "llm": {
    "provider": "ollama",                // "ollama" | "openai" | "anthropic"
    "model": "mistral:7b",               // Provider-specific model name
    "temperature": 0.7,                  // 0.0 - 2.0 (creativity level)
    "maxTokens": 4000,                   // Maximum response length
    "topP": 0.9,                         // Nucleus sampling (0.0 - 1.0)
    "frequencyPenalty": 0.0,             // Penalize repetition (-2.0 - 2.0)
    "presencePenalty": 0.0               // Encourage topic diversity (-2.0 - 2.0)
  },

  // Memory System
  "memory": {
    "enabled": true,                     // Enable conversation memory
    "maxHistory": 100,                   // Max messages to retain
    "contextWindow": 10,                 // Messages sent to LLM
    "persistent": true,                  // Save across sessions
    "storagePath": "./data/memory",      // Where to store memories
    "summarization": {
      "enabled": true,                   // Auto-summarize old conversations
      "threshold": 50                    // Summarize after N messages
    },
    "vector": {
      "enabled": false,                  // Vector database for semantic search
      "dimensions": 1536,                // Embedding dimensions
      "similarity": "cosine"             // "cosine" | "euclidean" | "dot"
    }
  },

  // Security & Sandboxing
  "security": {
    "sandboxed": true,                   // Run in isolated environment
    "allowedDomains": [                  // Whitelist for HTTP requests
      "api.example.com",
      "*.trusted-domain.com"
    ],
    "blockedCommands": ["rm -rf", "sudo", "dd"],
    "rateLimiting": {
      "enabled": true,
      "requestsPerMinute": 60,
      "requestsPerHour": 1000,
      "tokensPerMinute": 100000,
      "burstSize": 10                    // Allow short bursts
    },
    "authentication": {
      "required": false,                 // Require auth for API access
      "method": "api-key",               // "api-key" | "jwt" | "oauth"
      "keys": ["key1", "key2"]           // Valid API keys
    },
    "audit": {
      "enabled": true,                   // Log all operations
      "logPath": "./logs/audit.log",
      "includeMessages": false           // Log full message content
    }
  },

  // Model Context Protocol
  "mcp": {
    "enabled": true,
    "servers": [
      {
        "name": "filesystem",
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem"],
        "env": {                         // Environment variables for MCP server
          "ALLOWED_DIRS": "/path/to/allowed"
        }
      }
    ]
  },

  // Multi-Agent Orchestration
  "orchestration": {
    "enabled": false,
    "mode": "hierarchical",              // "hierarchical" | "peer" | "pipeline"
    "coordinator": "main-agent",
    "subAgents": [
      {
        "name": "specialist-agent-1",
        "role": "data-collector",
        "weight": 1.0                    // Priority/importance weight
      }
    ]
  },

  // Monitoring & Observability
  "monitoring": {
    "enabled": true,
    "metricsPort": 9090,                 // Prometheus metrics endpoint
    "healthCheckPath": "/health",
    "logLevel": "info",                  // "debug" | "info" | "warn" | "error"
    "tracing": {
      "enabled": false,
      "endpoint": "http://jaeger:14268/api/traces"
    }
  },

  // Performance Tuning
  "performance": {
    "caching": {
      "enabled": true,
      "ttl": 3600,                       // Cache TTL in seconds
      "maxSize": 1000                    // Max cached items
    },
    "streaming": true,                   // Stream LLM responses
    "parallel": {
      "enabled": true,
      "maxConcurrency": 5                // Max parallel tool calls
    }
  }
}`}</code></pre>

        <h3>Core Fields Reference</h3>
        <table>
          <thead>
            <tr><th>Field</th><th>Type</th><th>Default</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>name</code></td>
              <td>string</td>
              <td>required</td>
              <td>Unique identifier for your agent. Must be lowercase, alphanumeric with hyphens</td>
            </tr>
            <tr>
              <td><code>version</code></td>
              <td>string</td>
              <td>"1.0.0"</td>
              <td>Semantic version (major.minor.patch). Used for compatibility tracking</td>
            </tr>
            <tr>
              <td><code>description</code></td>
              <td>string</td>
              <td>""</td>
              <td>Human-readable description shown in UI and logs</td>
            </tr>
            <tr>
              <td><code>capabilities</code></td>
              <td>string[]</td>
              <td>[]</td>
              <td>List of agent capabilities: "chat", "task-execution", "data-analysis", "code-generation"</td>
            </tr>
            <tr>
              <td><code>tools</code></td>
              <td>string[]</td>
              <td>[]</td>
              <td>Built-in tools the agent can use. See Tools documentation for complete list</td>
            </tr>
            <tr>
              <td><code>instructions</code></td>
              <td>string</td>
              <td>""</td>
              <td>System prompt defining agent behavior, personality, and goals</td>
            </tr>
          </tbody>
        </table>

        <h3>LLM Configuration Deep Dive</h3>
        <table>
          <thead>
            <tr><th>Parameter</th><th>Range</th><th>Best For</th><th>Description</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>temperature</code></td>
              <td>0.0 - 2.0</td>
              <td>0.3: Factual, 0.7: Balanced, 1.2: Creative</td>
              <td>Controls randomness. Lower = more deterministic, Higher = more creative</td>
            </tr>
            <tr>
              <td><code>maxTokens</code></td>
              <td>1 - 128000</td>
              <td>2000-4000 for most uses</td>
              <td>Maximum response length. Balance cost vs completeness</td>
            </tr>
            <tr>
              <td><code>topP</code></td>
              <td>0.0 - 1.0</td>
              <td>0.9 recommended</td>
              <td>Nucleus sampling. Alternative to temperature</td>
            </tr>
            <tr>
              <td><code>frequencyPenalty</code></td>
              <td>-2.0 - 2.0</td>
              <td>0.0 to 0.5</td>
              <td>Reduces repetition. Positive values penalize repeated tokens</td>
            </tr>
            <tr>
              <td><code>presencePenalty</code></td>
              <td>-2.0 - 2.0</td>
              <td>0.0 to 0.6</td>
              <td>Encourages topic diversity. Positive values introduce new topics</td>
            </tr>
          </tbody>
        </table>

        <h3>Environment Variables</h3>
        <p>Store sensitive information in environment variables, never in <code>agent.json</code>:</p>
        <pre><code>{`# .env file (add to .gitignore!)
# LLM Provider API Keys
OPENAI_API_KEY=sk-proj-...
ANTHROPIC_API_KEY=sk-ant-api03-...
OLLAMA_HOST=http://localhost:11434

# Database Credentials
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
REDIS_URL=redis://localhost:6379

# External Service Keys
GITHUB_TOKEN=ghp_...
SLACK_BOT_TOKEN=xoxb-...
SENDGRID_API_KEY=SG...

# Application Settings
NODE_ENV=production
LOG_LEVEL=info
PORT=3000`}</code></pre>

        <h3>Best Practices</h3>
        <ul>
          <li><strong>Version Control:</strong> Keep <code>agent.json</code> in git, but use <code>.env</code> for secrets</li>
          <li><strong>Instructions:</strong> Be specific and detailed. Include examples of desired behavior</li>
          <li><strong>Tools:</strong> Only enable tools the agent actually needs to reduce attack surface</li>
          <li><strong>Memory:</strong> Balance <code>maxHistory</code> vs context window size for optimal performance</li>
          <li><strong>Security:</strong> Always enable sandboxing in production environments</li>
          <li><strong>Rate Limiting:</strong> Set conservative limits and increase based on monitoring</li>
          <li><strong>Temperature:</strong> Start at 0.7 and adjust based on output quality</li>
        </ul>

        <h3>Common Configuration Patterns</h3>

        <h4>Customer Support Bot</h4>
        <pre><code>{`{
  "name": "support-bot",
  "capabilities": ["chat", "ticket-management"],
  "tools": ["database", "email", "slack"],
  "instructions": "You are a customer support agent. Be empathetic, professional, and solution-oriented. Always search the knowledge base before escalating.",
  "llm": {
    "provider": "anthropic",
    "model": "claude-3-sonnet",
    "temperature": 0.4
  },
  "memory": {
    "enabled": true,
    "maxHistory": 50,
    "persistent": true
  }
}`}</code></pre>

        <h4>Code Review Bot</h4>
        <pre><code>{`{
  "name": "code-reviewer",
  "capabilities": ["code-analysis", "security-audit"],
  "tools": ["github", "bash", "filesystem"],
  "instructions": "Review code for security, performance, and best practices. Be constructive and specific.",
  "llm": {
    "provider": "openai",
    "model": "gpt-4-turbo",
    "temperature": 0.3
  }
}`}</code></pre>

        <h4>Research Assistant</h4>
        <pre><code>{`{
  "name": "researcher",
  "capabilities": ["research", "data-analysis"],
  "tools": ["web-search", "http", "json", "text"],
  "instructions": "Research topics thoroughly. Cite sources. Be objective and fact-based.",
  "llm": {
    "provider": "anthropic",
    "model": "claude-3-opus",
    "temperature": 0.6,
    "maxTokens": 8000
  },
  "orchestration": {
    "mode": "pipeline",
    "subAgents": ["search-agent", "analysis-agent", "writer-agent"]
  }
}`}</code></pre>

        <h3>Configuration Validation</h3>
        <p>Validate your configuration before deployment:</p>
        <pre><code>{`# Validate syntax and required fields
stick config validate agent.json

# Test configuration with dry-run
stick run my-agent --dry-run

# Output schema for reference
stick config schema > schema.json`}</code></pre>

        <h3>Troubleshooting</h3>
        <p><strong>Agent not starting:</strong></p>
        <ul>
          <li>Check JSON syntax: <code>jsonlint agent.json</code></li>
          <li>Verify all required fields are present</li>
          <li>Check environment variables are set</li>
          <li>Review logs: <code>stick logs my-agent</code></li>
        </ul>

        <p><strong>Poor response quality:</strong></p>
        <ul>
          <li>Adjust <code>temperature</code> (lower for factual, higher for creative)</li>
          <li>Improve <code>instructions</code> with more specific guidance and examples</li>
          <li>Increase <code>maxTokens</code> if responses are cut off</li>
          <li>Consider upgrading to a more capable model</li>
        </ul>

        <p><strong>Performance issues:</strong></p>
        <ul>
          <li>Enable caching for repeated queries</li>
          <li>Reduce <code>maxHistory</code> to lower memory usage</li>
          <li>Disable unused tools</li>
          <li>Use streaming for faster perceived response times</li>
        </ul>

        <h3>Next Steps</h3>
        <ul>
          <li><Link href="/docs/agents">Learn about agent architecture</Link> and lifecycle</li>
          <li><Link href="/docs/tools">Explore all 17 built-in tools</Link> and their configurations</li>
          <li><Link href="/docs/security">Configure security and sandboxing</Link> for production</li>
          <li><Link href="/docs/schema">View the complete JSON schema</Link> reference</li>
        </ul>
      </>
    )
  },
  'agents': {
    title: 'Agent Architecture',
    description: 'Deep dive into agent concepts and design patterns',
    prev: { slug: 'configuration', title: 'Configuration' },
    next: { slug: 'tools', title: 'Tools' },
    content: (
      <>
        <h2>Understanding AI Agents</h2>
        <p>Agents are the core building blocks of stick.ai. This comprehensive guide explains agent architecture, lifecycle, types, and best practices for building intelligent autonomous systems.</p>

        <h3>What is an Agent?</h3>
        <p>An agent in stick.ai is an autonomous AI system powered by Large Language Models (LLMs) that can:</p>
        <ul>
          <li><strong>Understand natural language:</strong> Process and interpret user requests in plain English</li>
          <li><strong>Reason about tasks:</strong> Break down complex problems into actionable steps</li>
          <li><strong>Use tools autonomously:</strong> Select and execute appropriate tools to accomplish goals</li>
          <li><strong>Maintain context:</strong> Remember conversation history and user preferences</li>
          <li><strong>Learn from feedback:</strong> Adapt behavior based on results and user input</li>
          <li><strong>Execute workflows:</strong> Handle multi-step processes from start to finish</li>
        </ul>

        <p>Unlike simple chatbots, agents are goal-oriented and can take action to accomplish tasks without step-by-step human guidance.</p>

        <h3>Agent Architecture</h3>
        <p>Every stick.ai agent consists of four core components:</p>

        <h4>1. Large Language Model (LLM)</h4>
        <p>The "brain" of the agent. Handles:</p>
        <ul>
          <li>Understanding user intent</li>
          <li>Planning action sequences</li>
          <li>Generating natural language responses</li>
          <li>Reasoning about which tools to use</li>
        </ul>
        <p><strong>Supported LLMs:</strong> Ollama (local), OpenAI GPT-4/3.5, Anthropic Claude</p>

        <h4>2. Tool System</h4>
        <p>The "hands" of the agent. Provides:</p>
        <ul>
          <li>17 built-in tools (bash, http, database, etc.)</li>
          <li>Custom tool support</li>
          <li>Tool selection and execution logic</li>
          <li>Result parsing and error handling</li>
        </ul>

        <h4>3. Memory System</h4>
        <p>The "memory" of the agent. Manages:</p>
        <ul>
          <li>Conversation history</li>
          <li>User preferences</li>
          <li>Long-term knowledge storage</li>
          <li>Context window management</li>
        </ul>

        <h4>4. Orchestration Layer</h4>
        <p>The "conductor" for multi-agent systems. Handles:</p>
        <ul>
          <li>Agent-to-agent communication</li>
          <li>Task delegation</li>
          <li>Result aggregation</li>
          <li>Workflow coordination</li>
        </ul>

        <h3>Agent Lifecycle</h3>
        <p>Understanding the agent lifecycle is crucial for debugging and optimization:</p>

        <h4>Phase 1: Initialization</h4>
        <pre><code>{`stick run my-agent

[1] Loading configuration from agent.json
[2] Validating configuration schema
[3] Initializing LLM connection (ollama/mistral:7b)
[4] Loading tools: bash, http, json, database
[5] Restoring memory from ./data/memory (if persistent)
[6] Starting health check endpoint
[7] Agent ready!`}</code></pre>

        <h4>Phase 2: Request Handling</h4>
        <pre><code>{`User Input: "Find all users who signed up today and email them a welcome message"

Step 1: Parse & Understand
  → LLM processes natural language input
  → Identifies intent: database query + email sending
  → Plans two-step workflow

Step 2: Reason & Plan
  → Agent determines required tools: database, email
  → Creates execution plan:
    1. Query database for today's signups
    2. For each user, send welcome email

Step 3: Execute Tools
  → Executes: database.query("SELECT * FROM users WHERE created_at >= CURRENT_DATE")
  → Returns: [{id: 1, email: "user@example.com", name: "John"}, ...]
  → For each user:
    → Executes: email.send({to: user.email, subject: "Welcome!", ...})

Step 4: Generate Response
  → LLM summarizes results
  → Agent responds: "I found 3 new users and sent welcome emails to:
     • john@example.com
     • jane@example.com
     • bob@example.com"

Step 5: Update Memory
  → Save conversation to history
  → Update context window
  → Persist to disk (if enabled)`}</code></pre>

        <h4>Phase 3: Shutdown</h4>
        <pre><code>{`Ctrl+C (SIGINT)

[1] Receiving shutdown signal
[2] Completing in-flight requests
[3] Saving memory state
[4] Closing LLM connection
[5] Cleaning up resources
[6] Agent stopped gracefully`}</code></pre>

        <h3>Agent Types</h3>

        <h4>1. Chat Agent</h4>
        <p><strong>Purpose:</strong> Conversational interface for users</p>
        <p><strong>Best for:</strong> Customer support, assistants, Q&A</p>
        <p><strong>Characteristics:</strong></p>
        <ul>
          <li>Interactive back-and-forth conversation</li>
          <li>Maintains conversation context</li>
          <li>Responds to follow-up questions</li>
          <li>Clarifies ambiguous requests</li>
        </ul>
        <pre><code>{`{
  "name": "support-chatbot",
  "capabilities": ["chat"],
  "tools": ["database", "email"],
  "instructions": "You are a friendly customer support agent...",
  "memory": {
    "enabled": true,
    "maxHistory": 50
  }
}`}</code></pre>

        <h4>2. Task Agent</h4>
        <p><strong>Purpose:</strong> Single-purpose task execution</p>
        <p><strong>Best for:</strong> Data processing, scheduled jobs, automation</p>
        <p><strong>Characteristics:</strong></p>
        <ul>
          <li>Optimized for specific task</li>
          <li>Minimal conversational overhead</li>
          <li>Focused tool set</li>
          <li>Fast execution</li>
        </ul>
        <pre><code>{`{
  "name": "daily-report-generator",
  "capabilities": ["task-execution"],
  "tools": ["database", "email", "text"],
  "instructions": "Generate and email daily sales reports...",
  "memory": {
    "enabled": false  // No conversation history needed
  }
}`}</code></pre>

        <h4>3. Workflow Agent</h4>
        <p><strong>Purpose:</strong> Multi-step process automation</p>
        <p><strong>Best for:</strong> Complex business processes, ETL pipelines</p>
        <p><strong>Characteristics:</strong></p>
        <ul>
          <li>Executes predefined workflows</li>
          <li>Handles errors and retries</li>
          <li>Checkpoints progress</li>
          <li>Can be resumed after failures</li>
        </ul>
        <pre><code>{`{
  "name": "data-pipeline",
  "capabilities": ["workflow"],
  "tools": ["http", "database", "csv", "email"],
  "workflow": {
    "steps": [
      {"name": "fetch-data", "tool": "http"},
      {"name": "transform", "tool": "csv"},
      {"name": "load", "tool": "database"},
      {"name": "notify", "tool": "email"}
    ],
    "onError": "retry",
    "maxRetries": 3
  }
}`}</code></pre>

        <h4>4. Coordinator Agent</h4>
        <p><strong>Purpose:</strong> Orchestrate multiple specialized agents</p>
        <p><strong>Best for:</strong> Complex multi-domain problems</p>
        <p><strong>Characteristics:</strong></p>
        <ul>
          <li>Delegates tasks to specialist agents</li>
          <li>Aggregates results</li>
          <li>Manages agent communication</li>
          <li>Handles conflicts and priorities</li>
        </ul>
        <pre><code>{`{
  "name": "research-coordinator",
  "capabilities": ["orchestration"],
  "orchestration": {
    "mode": "hierarchical",
    "subAgents": [
      {"name": "search-agent", "role": "information-gathering"},
      {"name": "analysis-agent", "role": "data-processing"},
      {"name": "writer-agent", "role": "report-generation"}
    ]
  }
}`}</code></pre>

        <h3>Agent Design Patterns</h3>

        <h4>Pattern 1: Single-Purpose Specialist</h4>
        <p><strong>When to use:</strong> Task is well-defined and limited in scope</p>
        <p><strong>Example:</strong> Invoice processor, email summarizer, code formatter</p>
        <pre><code>{`// Specialized email parser agent
{
  "name": "email-parser",
  "tools": ["text", "json"],
  "instructions": "Extract structured data from emails: sender, date, key points, action items",
  "llm": {
    "temperature": 0.1  // Low temperature for consistent extraction
  }
}`}</code></pre>

        <h4>Pattern 2: General-Purpose Assistant</h4>
        <p><strong>When to use:</strong> Users need help with varied tasks</p>
        <p><strong>Example:</strong> Personal assistant, office helper</p>
        <pre><code>{`{
  "name": "general-assistant",
  "tools": ["bash", "http", "database", "email", "slack", "calculator", "datetime"],
  "instructions": "You are a helpful assistant. Handle diverse requests intelligently...",
  "llm": {
    "temperature": 0.7  // Balanced creativity
  }
}`}</code></pre>

        <h4>Pattern 3: Research & Analysis</h4>
        <p><strong>When to use:</strong> Need to gather and synthesize information</p>
        <p><strong>Example:</strong> Market research, competitive analysis</p>
        <pre><code>{`{
  "name": "market-researcher",
  "tools": ["web-search", "web-scraper", "http", "json", "text"],
  "instructions": "Research thoroughly, cite sources, provide objective analysis...",
  "llm": {
    "model": "gpt-4",  // Use most capable model
    "maxTokens": 8000  // Allow long reports
  }
}`}</code></pre>

        <h4>Pattern 4: Pipeline Agent</h4>
        <p><strong>When to use:</strong> Sequential data processing required</p>
        <p><strong>Example:</strong> ETL, data transformation</p>
        <pre><code>{`{
  "name": "data-transformer",
  "orchestration": {
    "mode": "pipeline",
    "agents": [
      "extractor-agent",    // Fetches raw data
      "transformer-agent",  // Cleans and transforms
      "loader-agent"        // Loads into destination
    ]
  }
}`}</code></pre>

        <h3>Best Practices</h3>

        <h4>Naming Agents</h4>
        <ul>
          <li>Use descriptive, purpose-focused names: <code>customer-support-bot</code> not <code>bot-1</code></li>
          <li>Include domain/context: <code>sales-data-analyzer</code>, <code>hr-assistant</code></li>
          <li>Use kebab-case: <code>code-review-bot</code></li>
        </ul>

        <h4>Writing Instructions</h4>
        <pre><code>{`// ❌ Bad: Vague instructions
"instructions": "Be helpful"

// ✅ Good: Specific, actionable instructions
"instructions": "You are a customer support agent for AcmeCorp.

Your goals:
1. Understand the customer's issue completely before responding
2. Search the knowledge base (use database tool) before escalating
3. Be empathetic and professional
4. Provide step-by-step solutions
5. Follow up to ensure the issue is resolved

Tone: Friendly but professional
Response length: Concise (2-3 paragraphs max)

Example interaction:
User: 'I can't log in'
You: Check specific error, ask about browser, guide through password reset

Never:
- Guess solutions without checking the knowledge base
- Make promises about timelines without checking with engineering
- Share internal system details"`}</code></pre>

        <h4>Tool Selection</h4>
        <ul>
          <li>Only enable tools the agent actually needs</li>
          <li>Start minimal, add tools as requirements emerge</li>
          <li>Consider security implications of each tool</li>
          <li>Group related agents with similar tool sets</li>
        </ul>

        <h4>Memory Configuration</h4>
        <ul>
          <li>Chat agents: Enable memory with 50-100 messages</li>
          <li>Task agents: Disable memory for stateless execution</li>
          <li>Long-running agents: Enable persistent memory</li>
          <li>Balance context window vs history size</li>
        </ul>

        <h3>Debugging Agents</h3>

        <h4>Enable Debug Logging</h4>
        <pre><code>{`stick run my-agent --log-level debug

# Output shows:
# → User message received
# → LLM reasoning process
# → Tool selection logic
# → Tool execution results
# → Response generation`}</code></pre>

        <h4>Common Issues</h4>
        <p><strong>Agent not using tools:</strong></p>
        <ul>
          <li>Check tools are listed in configuration</li>
          <li>Verify tool descriptions are clear</li>
          <li>Improve instructions to mention when to use tools</li>
        </ul>

        <p><strong>Inconsistent responses:</strong></p>
        <ul>
          <li>Lower temperature for more consistent outputs</li>
          <li>Add more examples in instructions</li>
          <li>Use stricter output formatting requirements</li>
        </ul>

        <p><strong>Slow responses:</strong></p>
        <ul>
          <li>Reduce maxTokens</li>
          <li>Use faster model (gpt-3.5-turbo vs gpt-4)</li>
          <li>Enable streaming for better perceived performance</li>
          <li>Cache common queries</li>
        </ul>

        <h3>Performance Optimization</h3>
        <ul>
          <li><strong>Caching:</strong> Cache LLM responses for identical queries</li>
          <li><strong>Streaming:</strong> Stream responses for better UX</li>
          <li><strong>Parallel tool execution:</strong> Run independent tools concurrently</li>
          <li><strong>Memory management:</strong> Summarize old conversations to save tokens</li>
          <li><strong>Model selection:</strong> Use smaller models when possible (mistral vs gpt-4)</li>
        </ul>

        <h3>Next Steps</h3>
        <ul>
          <li><Link href="/docs/tools">Explore all 17 built-in tools</Link> to extend agent capabilities</li>
          <li><Link href="/docs/multi-agent">Learn about multi-agent systems</Link> for complex workflows</li>
          <li><Link href="/docs/memory">Deep dive into memory systems</Link> for context management</li>
          <li><Link href="/docs/deployment">Deploy agents to production</Link> with Docker and Kubernetes</li>
          <li><Link href="/examples">See real-world examples</Link> of different agent types</li>
        </ul>
      </>
    )
  },
  'tools': {
    title: 'Built-in Tools',
    description: 'Complete reference for all 17 built-in tools',
    prev: { slug: 'agents', title: 'Agents' },
    next: { slug: 'llm-providers', title: 'LLM Providers' },
    content: (
      <>
        <h2>Built-in Tools Reference</h2>
        <p>stick.ai includes 17 production-ready tools that extend your agent's capabilities. Each tool is thoroughly tested, secure, and optimized for performance. This guide provides complete documentation for every tool including usage, parameters, examples, and best practices.</p>

        <h3>Tool Categories</h3>
        <ul>
          <li><strong>System Tools (3):</strong> bash, filesystem, python</li>
          <li><strong>Web Tools (3):</strong> http, web-search, web-scraper</li>
          <li><strong>Data Tools (5):</strong> json, csv, xml, yaml, database</li>
          <li><strong>Utility Tools (3):</strong> datetime, text, calculator</li>
          <li><strong>Integration Tools (3):</strong> github, email, slack</li>
        </ul>

        <h3>Enabling Tools</h3>
        <p>Add tools to your agent's configuration:</p>
        <pre><code>{`{
  "tools": ["datetime", "http", "json", "database"],
  // Tools are automatically loaded and made available to the agent
}`}</code></pre>

        <hr />

        <h2>System Tools</h2>

        <h3>1. bash - Shell Command Execution</h3>
        <p><strong>Purpose:</strong> Execute shell commands on the host system</p>
        <p><strong>Use cases:</strong> File operations, process management, system administration, Git operations</p>
        <p><strong>Security:</strong> Runs in sandboxed environment when <code>security.sandboxed: true</code></p>

        <h4>Configuration</h4>
        <pre><code>{`{
  "tools": ["bash"],
  "security": {
    "sandboxed": true,
    "blockedCommands": ["rm -rf /", ":(){ :|:& };:", "dd if=/dev/zero"]
  }
}`}</code></pre>

        <h4>Usage Examples</h4>
        <pre><code>{`// Agent automatically uses bash tool when needed
User: "List all JSON files in the current directory"
Agent uses: bash("find . -name '*.json' -type f")

User: "What's my current working directory?"
Agent uses: bash("pwd")

User: "Create a backup of config.json"
Agent uses: bash("cp config.json config.json.backup")

User: "Show git commit history"
Agent uses: bash("git log --oneline -10")`}</code></pre>

        <h4>Capabilities</h4>
        <ul>
          <li>Execute any shell command</li>
          <li>Pipe commands together</li>
          <li>Access environment variables</li>
          <li>Work with files and directories</li>
          <li>Run system utilities</li>
        </ul>

        <h4>Security Best Practices</h4>
        <ul>
          <li>Always enable sandboxing in production</li>
          <li>Block dangerous commands (rm -rf, dd, fork bombs)</li>
          <li>Limit file system access to specific directories</li>
          <li>Use non-root user for agent process</li>
          <li>Enable audit logging for all commands</li>
        </ul>

        <h3>2. filesystem - File Operations</h3>
        <p><strong>Purpose:</strong> Read, write, and manipulate files</p>
        <p><strong>Use cases:</strong> Configuration management, log processing, data storage, file generation</p>

        <h4>Capabilities</h4>
        <ul>
          <li><strong>Read files:</strong> Text, JSON, binary</li>
          <li><strong>Write files:</strong> Create or overwrite files</li>
          <li><strong>List directory:</strong> Browse file system</li>
          <li><strong>File info:</strong> Size, permissions, timestamps</li>
          <li><strong>Search:</strong> Find files by name or content</li>
        </ul>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Read the contents of README.md"
Agent uses: filesystem.read("README.md")

User: "Save this data to output.json"
Agent uses: filesystem.write("output.json", data)

User: "List all files in the src directory"
Agent uses: filesystem.list("./src")

User: "Search for 'API_KEY' in all .env files"
Agent uses: filesystem.search("*.env", "API_KEY")`}</code></pre>

        <h4>Configuration</h4>
        <pre><code>{`{
  "tools": ["filesystem"],
  "security": {
    "filesystem": {
      "allowedPaths": ["/app/data", "/app/uploads"],
      "blockedPaths": ["/etc", "/root", "~/.ssh"],
      "maxFileSize": "10MB"
    }
  }
}`}</code></pre>

        <h3>3. python - Python Code Execution</h3>
        <p><strong>Purpose:</strong> Execute Python code for data processing and analysis</p>
        <p><strong>Use cases:</strong> Data science, machine learning, scientific computing, complex algorithms</p>

        <h4>Features</h4>
        <ul>
          <li>Execute Python 3.x code</li>
          <li>Access to numpy, pandas, matplotlib</li>
          <li>Sandboxed execution environment</li>
          <li>Capture output and return values</li>
        </ul>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Calculate the average of these numbers: 10, 20, 30, 40"
Agent uses: python("import statistics; print(statistics.mean([10,20,30,40]))")

User: "Create a bar chart of sales data"
Agent uses: python("""
import matplotlib.pyplot as plt
data = [100, 150, 200, 175]
plt.bar(range(len(data)), data)
plt.savefig('sales.png')
""")

User: "Analyze this CSV data"
Agent uses: python("""
import pandas as pd
df = pd.read_csv('data.csv')
print(df.describe())
""")`}</code></pre>

        <hr />

        <h2>Web Tools</h2>

        <h3>4. http - HTTP Requests</h3>
        <p><strong>Purpose:</strong> Make HTTP/HTTPS requests to APIs and websites</p>
        <p><strong>Use cases:</strong> API integration, webhooks, data fetching, external services</p>

        <h4>Supported Methods</h4>
        <ul>
          <li>GET - Fetch data</li>
          <li>POST - Submit data</li>
          <li>PUT - Update resources</li>
          <li>PATCH - Partial updates</li>
          <li>DELETE - Remove resources</li>
        </ul>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Get the weather for New York"
Agent uses: http.get("https://api.weather.com/v3/wx/conditions/current?location=NYC")

User: "Post this data to our API"
Agent uses: http.post("https://api.example.com/data", {
  headers: { "Content-Type": "application/json" },
  body: { name: "John", age: 30 }
})

User: "Check if the website is up"
Agent uses: http.get("https://example.com", { timeout: 5000 })`}</code></pre>

        <h4>Configuration</h4>
        <pre><code>{`{
  "tools": ["http"],
  "security": {
    "http": {
      "allowedDomains": ["*.example.com", "api.trusted-site.com"],
      "blockedDomains": ["malicious-site.com"],
      "timeout": 30000,
      "maxRedirects": 5,
      "validateSSL": true
    }
  }
}`}</code></pre>

        <h3>5. web-search - Web Search</h3>
        <p><strong>Purpose:</strong> Search the internet using multiple search engines</p>
        <p><strong>Use cases:</strong> Research, fact-checking, information gathering</p>
        <p><strong>Supported engines:</strong> Google, Brave Search, DuckDuckGo</p>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "What are the latest AI developments?"
Agent uses: web-search("latest AI developments 2024")

User: "Find documentation for React hooks"
Agent uses: web-search("React hooks documentation site:react.dev")

User: "Research competitors in the AI agent space"
Agent uses: web-search("AI agent frameworks comparison")`}</code></pre>

        <h3>6. web-scraper - Web Scraping</h3>
        <p><strong>Purpose:</strong> Extract structured data from websites</p>
        <p><strong>Use cases:</strong> Data mining, price monitoring, content aggregation</p>

        <h4>Features</h4>
        <ul>
          <li>Parse HTML with CSS selectors</li>
          <li>Extract text, links, images</li>
          <li>Handle JavaScript-rendered pages</li>
          <li>Respect robots.txt</li>
        </ul>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Scrape all article titles from example.com"
Agent uses: web-scraper("https://example.com", {
  selector: "article h2",
  extract: "text"
})

User: "Get product prices from this page"
Agent uses: web-scraper("https://shop.example.com", {
  selector: ".product-price",
  extract: "text",
  parseNumber: true
})`}</code></pre>

        <hr />

        <h2>Data Tools</h2>

        <h3>7. json - JSON Operations</h3>
        <p><strong>Purpose:</strong> Parse, validate, and manipulate JSON data</p>

        <h4>Operations</h4>
        <ul>
          <li>Parse JSON strings</li>
          <li>Stringify objects</li>
          <li>Query with JSONPath</li>
          <li>Validate against schema</li>
          <li>Transform and filter data</li>
        </ul>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Parse this JSON string: {...}"
Agent uses: json.parse(jsonString)

User: "Get all user names from this JSON"
Agent uses: json.query(data, "$.users[*].name")

User: "Validate this config against schema"
Agent uses: json.validate(config, schema)`}</code></pre>

        <h3>8. csv - CSV Processing</h3>
        <p><strong>Purpose:</strong> Read, write, and analyze CSV files</p>

        <h4>Features</h4>
        <ul>
          <li>Parse CSV files</li>
          <li>Generate CSV from data</li>
          <li>Filter and transform rows</li>
          <li>Handle custom delimiters</li>
          <li>Support for headers</li>
        </ul>

        <h3>9. xml - XML Processing</h3>
        <p><strong>Purpose:</strong> Parse and manipulate XML documents</p>
        <p><strong>Use cases:</strong> SOAP APIs, RSS feeds, configuration files</p>

        <h3>10. yaml - YAML Operations</h3>
        <p><strong>Purpose:</strong> Parse and generate YAML files</p>
        <p><strong>Use cases:</strong> Kubernetes configs, Docker Compose, CI/CD pipelines</p>

        <h3>11. database - Database Queries</h3>
        <p><strong>Purpose:</strong> Query and manipulate databases</p>
        <p><strong>Supported:</strong> PostgreSQL, MySQL, SQLite, MongoDB</p>

        <h4>Configuration</h4>
        <pre><code>{`{
  "tools": ["database"],
  "database": {
    "type": "postgres",
    "connection": {
      "host": "localhost",
      "port": 5432,
      "database": "mydb",
      "user": "agent_user",
      // Use environment variable for password
      "password": "$DATABASE_PASSWORD"
    },
    "readOnly": true,  // Prevent writes
    "allowedTables": ["users", "products", "orders"]
  }
}`}</code></pre>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "How many users do we have?"
Agent uses: database.query("SELECT COUNT(*) FROM users")

User: "Show me recent orders"
Agent uses: database.query("SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '7 days' LIMIT 10")

User: "Find users by email"
Agent uses: database.query("SELECT * FROM users WHERE email = $1", ["user@example.com"])`}</code></pre>

        <hr />

        <h2>Utility Tools</h2>

        <h3>12. datetime - Date and Time</h3>
        <p><strong>Purpose:</strong> Work with dates, times, and timezones</p>

        <h4>Operations</h4>
        <ul>
          <li>Get current time</li>
          <li>Parse date strings</li>
          <li>Format dates</li>
          <li>Calculate durations</li>
          <li>Convert timezones</li>
          <li>Date arithmetic</li>
        </ul>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "What time is it?"
Agent uses: datetime.now()

User: "What day is Christmas this year?"
Agent uses: datetime.parse("2024-12-25").day_of_week()

User: "How many days until New Year?"
Agent uses: datetime.diff("2025-01-01", datetime.now(), "days")`}</code></pre>

        <h3>13. text - Text Processing</h3>
        <p><strong>Purpose:</strong> Manipulate and analyze text</p>

        <h4>Operations</h4>
        <ul>
          <li>Search and replace</li>
          <li>Regular expressions</li>
          <li>Case conversion</li>
          <li>Word count</li>
          <li>Trimming and padding</li>
          <li>Split and join</li>
          <li>Template rendering</li>
        </ul>

        <h3>14. calculator - Mathematical Operations</h3>
        <p><strong>Purpose:</strong> Perform mathematical calculations</p>

        <h4>Capabilities</h4>
        <ul>
          <li>Basic arithmetic (+, -, *, /)</li>
          <li>Advanced math (pow, sqrt, log)</li>
          <li>Trigonometry (sin, cos, tan)</li>
          <li>Statistics (mean, median, stdev)</li>
          <li>Unit conversions</li>
        </ul>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Calculate 15% of 250"
Agent uses: calculator.eval("250 * 0.15")

User: "What's the square root of 144?"
Agent uses: calculator.sqrt(144)

User: "Convert 100 miles to kilometers"
Agent uses: calculator.convert(100, "miles", "kilometers")`}</code></pre>

        <hr />

        <h2>Integration Tools</h2>

        <h3>15. github - GitHub Integration</h3>
        <p><strong>Purpose:</strong> Interact with GitHub repositories and APIs</p>

        <h4>Capabilities</h4>
        <ul>
          <li>Create/update issues</li>
          <li>Comment on pull requests</li>
          <li>Create branches</li>
          <li>Read file contents</li>
          <li>Search code</li>
          <li>Manage webhooks</li>
        </ul>

        <h4>Configuration</h4>
        <pre><code>{`{
  "tools": ["github"],
  "github": {
    "token": "$GITHUB_TOKEN",  // Environment variable
    "repos": ["myorg/myrepo"],
    "permissions": ["read", "write", "issues"]
  }
}`}</code></pre>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Create an issue for the bug we just found"
Agent uses: github.createIssue("myorg/myrepo", {
  title: "Bug: Login fails with special characters",
  body: "Description...",
  labels: ["bug", "high-priority"]
})

User: "Comment on PR #42"
Agent uses: github.commentOnPR("myorg/myrepo", 42, "LGTM! ✅")

User: "Search for TODOs in the codebase"
Agent uses: github.searchCode("myorg/myrepo", "TODO")`}</code></pre>

        <h3>16. email - Email Sending</h3>
        <p><strong>Purpose:</strong> Send emails via SMTP or email services</p>

        <h4>Configuration</h4>
        <pre><code>{`{
  "tools": ["email"],
  "email": {
    "provider": "sendgrid",  // or "smtp", "ses", "mailgun"
    "apiKey": "$SENDGRID_API_KEY",
    "from": "agent@example.com",
    "replyTo": "support@example.com"
  }
}`}</code></pre>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Email the report to john@example.com"
Agent uses: email.send({
  to: "john@example.com",
  subject: "Daily Report",
  body: reportContent,
  attachments: ["report.pdf"]
})

User: "Send welcome email to new user"
Agent uses: email.sendTemplate("welcome", {
  to: user.email,
  variables: { name: user.name }
})`}</code></pre>

        <h3>17. slack - Slack Integration</h3>
        <p><strong>Purpose:</strong> Send messages and interact with Slack</p>

        <h4>Capabilities</h4>
        <ul>
          <li>Send messages to channels</li>
          <li>Send direct messages</li>
          <li>Post rich messages with blocks</li>
          <li>Upload files</li>
          <li>React to messages</li>
          <li>List channels and users</li>
        </ul>

        <h4>Configuration</h4>
        <pre><code>{`{
  "tools": ["slack"],
  "slack": {
    "token": "$SLACK_BOT_TOKEN",
    "channels": ["#general", "#alerts"],
    "allowDMs": false
  }
}`}</code></pre>

        <h4>Usage Examples</h4>
        <pre><code>{`User: "Post this alert to #alerts channel"
Agent uses: slack.postMessage("#alerts", "⚠️ High CPU usage detected")

User: "Upload this report to Slack"
Agent uses: slack.uploadFile("#reports", "weekly-report.pdf")

User: "Send DM to @john"
Agent uses: slack.sendDM("john", "Your report is ready")`}</code></pre>

        <hr />

        <h2>Creating Custom Tools</h2>
        <p>Need a tool that doesn't exist? Create your own:</p>
        <pre><code>{`// tools/my-custom-tool.ts
export class MyCustomTool {
  name = "my-custom-tool";
  description = "Does something specific";

  async execute(params: any) {
    // Tool implementation
    return result;
  }
}

// Register in agent.json
{
  "customTools": ["./tools/my-custom-tool.ts"]
}`}</code></pre>

        <h3>Tool Best Practices</h3>
        <ul>
          <li><strong>Only enable needed tools:</strong> Reduces attack surface and improves performance</li>
          <li><strong>Use rate limiting:</strong> Prevent abuse of expensive tools (web-search, API calls)</li>
          <li><strong>Configure security:</strong> Whitelist domains, block dangerous commands</li>
          <li><strong>Monitor usage:</strong> Track which tools are used most to optimize configuration</li>
          <li><strong>Set timeouts:</strong> Prevent tools from hanging indefinitely</li>
          <li><strong>Cache results:</strong> Cache expensive operations (web-search, database queries)</li>
        </ul>

        <h3>Next Steps</h3>
        <ul>
          <li><Link href="/docs/llm-providers">Configure LLM providers</Link> to power your tools</li>
          <li><Link href="/docs/security">Set up security</Link> and sandboxing for tools</li>
          <li><Link href="/docs/multi-agent">Learn about multi-agent coordination</Link> with specialized tools</li>
          <li><Link href="/examples">See examples</Link> using different tool combinations</li>
        </ul>
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
    title: 'Multi-Agent Orchestration',
    description: 'Build sophisticated multi-agent systems',
    prev: { slug: 'memory', title: 'Memory System' },
    next: { slug: 'mcp', title: 'MCP Integration' },
    content: (
      <>
        <h2>Multi-Agent Orchestration</h2>
        <p>Complex problems often require multiple specialized agents working together. This comprehensive guide covers multi-agent system design, orchestration patterns, communication protocols, and best practices for building sophisticated agent networks.</p>

        <h3>Why Multi-Agent Systems?</h3>
        <p>Single agents hit limitations when dealing with:</p>
        <ul>
          <li><strong>Domain complexity:</strong> Tasks spanning multiple specialties (legal + financial + technical)</li>
          <li><strong>Scale:</strong> Processing large volumes of data in parallel</li>
          <li><strong>Reliability:</strong> Fault tolerance through redundancy</li>
          <li><strong>Modularity:</strong> Independent development and testing of subsystems</li>
          <li><strong>Performance:</strong> Parallel execution of independent tasks</li>
        </ul>

        <p><strong>Real-world example:</strong> A research system with specialized agents for search, analysis, and report writing outperforms a single general-purpose agent.</p>

        <h3>Orchestration Patterns</h3>

        <h4>1. Hierarchical Pattern</h4>
        <p><strong>Structure:</strong> Coordinator → Specialist Agents</p>
        <p><strong>Best for:</strong> Complex workflows with clear task delegation</p>
        <p><strong>Use cases:</strong> Research systems, customer service, data pipelines</p>

        <pre><code>{`┌─────────────────┐
│   Coordinator   │  ← Makes decisions, delegates tasks
└────────┬────────┘
         │
    ┌────┴────┬─────────┬──────────┐
    │         │         │          │
┌───▼───┐ ┌──▼───┐ ┌──▼────┐ ┌───▼────┐
│Search │ │Analyze│ │ Write │ │ Review │  ← Specialists
└───────┘ └───────┘ └───────┘ └────────┘

// coordinator-agent.json
{
  "name": "research-coordinator",
  "capabilities": ["orchestration"],
  "tools": ["task-queue"],
  "instructions": "You coordinate research tasks. Delegate searching to search-agent, analysis to analysis-agent, and writing to writer-agent. Aggregate their results.",

  "orchestration": {
    "mode": "hierarchical",
    "subAgents": [
      {
        "name": "search-agent",
        "role": "information-gathering",
        "tools": ["web-search", "web-scraper"],
        "priority": 1  // Execute first
      },
      {
        "name": "analysis-agent",
        "role": "data-processing",
        "tools": ["text", "json"],
        "priority": 2,  // After search
        "dependsOn": ["search-agent"]
      },
      {
        "name": "writer-agent",
        "role": "report-generation",
        "tools": ["text", "filesystem"],
        "priority": 3,  // After analysis
        "dependsOn": ["analysis-agent"]
      }
    ]
  }
}

// search-agent.json
{
  "name": "search-agent",
  "capabilities": ["research"],
  "tools": ["web-search", "web-scraper", "http"],
  "instructions": "You are a research specialist. Find relevant, credible sources. Return structured data with URLs and summaries."
}

// analysis-agent.json
{
  "name": "analysis-agent",
  "capabilities": ["data-analysis"],
  "tools": ["text", "json", "calculator"],
  "instructions": "You analyze research data. Extract key insights, identify patterns, summarize findings objectively."
}

// writer-agent.json
{
  "name": "writer-agent",
  "capabilities": ["content-generation"],
  "tools": ["text", "filesystem"],
  "instructions": "You write professional reports. Create well-structured documents with clear sections, citations, and executive summaries."
}`}</code></pre>

        <h4>2. Peer-to-Peer Pattern</h4>
        <p><strong>Structure:</strong> Agents communicate directly with each other</p>
        <p><strong>Best for:</strong> Collaborative problem-solving, negotiation</p>
        <p><strong>Use cases:</strong> Multi-perspective analysis, consensus building</p>

        <pre><code>{`     ┌────────┐
     │Agent A │◄──┐
     └───┬────┘   │
         │        │
    ┌────▼────┐   │
    │ Agent B │───┤  ← All agents can communicate
    └────┬────┘   │
         │        │
    ┌────▼────┐   │
    │ Agent C │───┘
    └─────────┘

// Configuration for peer-to-peer
{
  "orchestration": {
    "mode": "peer-to-peer",
    "agents": [
      {"name": "legal-expert", "domain": "law"},
      {"name": "financial-expert", "domain": "finance"},
      {"name": "technical-expert", "domain": "engineering"}
    ],
    "communication": {
      "protocol": "message-passing",
      "timeout": 30000
    }
  }
}

// Each agent can send messages to others
// Example workflow:
// 1. Legal-expert analyzes contract
// 2. Sends findings to financial-expert
// 3. Financial-expert reviews cost implications
// 4. Sends to technical-expert for feasibility
// 5. Technical-expert provides implementation assessment
// 6. All three agents discuss and reach consensus`}</code></pre>

        <h4>3. Pipeline Pattern</h4>
        <p><strong>Structure:</strong> Sequential processing chain</p>
        <p><strong>Best for:</strong> Data transformation, ETL workflows</p>
        <p><strong>Use cases:</strong> Data pipelines, content processing</p>

        <pre><code>{`Input → Agent 1 → Agent 2 → Agent 3 → Output
        Extract   Transform  Load

{
  "orchestration": {
    "mode": "pipeline",
    "agents": [
      {
        "name": "extractor",
        "input": "raw-data",
        "output": "extracted-data"
      },
      {
        "name": "transformer",
        "input": "extracted-data",
        "output": "transformed-data"
      },
      {
        "name": "loader",
        "input": "transformed-data",
        "output": "final-result"
      }
    ],
    "errorHandling": {
      "onError": "retry",
      "maxRetries": 3,
      "fallback": "manual-review"
    }
  }
}`}</code></pre>

        <h4>4. Broadcast Pattern</h4>
        <p><strong>Structure:</strong> One agent sends to many</p>
        <p><strong>Best for:</strong> Parallel processing, consensus</p>
        <p><strong>Use cases:</strong> Sentiment analysis, multi-model ensembles</p>

        <pre><code>{`        ┌────────┐
        │ Source │
        └───┬────┘
            │
    ┌───────┼───────┬───────┐
    │       │       │       │
┌───▼──┐ ┌──▼──┐ ┌──▼──┐ ┌──▼──┐
│Agent1│ │Agent2│ │Agent3│ │Agent4│  ← All process same input
└──────┘ └──────┘ └──────┘ └──────┘

{
  "orchestration": {
    "mode": "broadcast",
    "source": "dispatcher-agent",
    "receivers": [
      {"name": "sentiment-analyzer-1", "model": "gpt-4"},
      {"name": "sentiment-analyzer-2", "model": "claude-3"},
      {"name": "sentiment-analyzer-3", "model": "mistral"}
    ],
    "aggregation": {
      "method": "voting",  // or "averaging", "consensus"
      "quorum": 2          // Minimum agreeing agents
    }
  }
}`}</code></pre>

        <h3>Communication Protocols</h3>

        <h4>Message Passing</h4>
        <pre><code>{`// Agent A sends message to Agent B
const message = {
  from: "agent-a",
  to: "agent-b",
  type: "request",
  payload: {
    task: "analyze",
    data: {...}
  },
  timestamp: Date.now(),
  messageId: "msg-123"
};

// Agent B receives and responds
const response = {
  from: "agent-b",
  to: "agent-a",
  type: "response",
  inReplyTo: "msg-123",
  payload: {
    result: {...},
    confidence: 0.95
  }
};`}</code></pre>

        <h4>Shared Memory</h4>
        <pre><code>{`{
  "orchestration": {
    "communication": {
      "method": "shared-memory",
      "store": "redis://localhost:6379",
      "channels": {
        "tasks": "task-queue",
        "results": "result-store",
        "logs": "agent-logs"
      }
    }
  }
}

// Agents read/write to shared data structures
// Agent A: Set task
await redis.lpush('task-queue', JSON.stringify(task));

// Agent B: Get task
const task = await redis.brpop('task-queue', 0);

// Agent B: Store result
await redis.hset('result-store', taskId, result);`}</code></pre>

        <h4>Event Bus</h4>
        <pre><code>{`{
  "orchestration": {
    "communication": {
      "method": "event-bus",
      "broker": "kafka://localhost:9092",
      "topics": [
        "agent.events",
        "agent.tasks",
        "agent.results"
      ]
    }
  }
}

// Agents publish and subscribe to events
// Agent A publishes
await eventBus.publish('agent.tasks', {
  type: 'research-request',
  query: 'AI agent frameworks'
});

// Agent B subscribes
eventBus.subscribe('agent.tasks', async (event) => {
  if (event.type === 'research-request') {
    const result = await research(event.query);
    await eventBus.publish('agent.results', result);
  }
});`}</code></pre>

        <h3>Advanced Orchestration</h3>

        <h4>Conditional Routing</h4>
        <pre><code>{`{
  "orchestration": {
    "mode": "conditional",
    "router": "triage-agent",
    "routes": [
      {
        "condition": "sentiment < 0.3",
        "agent": "escalation-agent",
        "priority": "high"
      },
      {
        "condition": "complexity > 0.7",
        "agent": "expert-agent",
        "timeout": 60000
      },
      {
        "condition": "default",
        "agent": "standard-agent"
      }
    ]
  }
}

// Triage agent evaluates and routes
User query → Triage Agent → Evaluate conditions → Route to appropriate agent`}</code></pre>

        <h4>Load Balancing</h4>
        <pre><code>{`{
  "orchestration": {
    "mode": "load-balanced",
    "strategy": "round-robin",  // or "least-loaded", "random"
    "agentPool": [
      {"name": "worker-1", "capacity": 10},
      {"name": "worker-2", "capacity": 10},
      {"name": "worker-3", "capacity": 10}
    ],
    "healthCheck": {
      "enabled": true,
      "interval": 10000
    }
  }
}`}</code></pre>

        <h4>Fault Tolerance</h4>
        <pre><code>{`{
  "orchestration": {
    "reliability": {
      "retries": {
        "enabled": true,
        "maxAttempts": 3,
        "backoff": "exponential",  // 1s, 2s, 4s
        "retryableErrors": ["timeout", "rate-limit"]
      },
      "fallback": {
        "enabled": true,
        "strategy": "alternative-agent",  // Use backup agent
        "alternativeAgent": "fallback-agent"
      },
      "circuit-breaker": {
        "enabled": true,
        "threshold": 5,  // Failures before opening
        "timeout": 60000  // Time before retry
      }
    }
  }
}`}</code></pre>

        <h3>Real-World Example: E-Commerce Order Processing</h3>
        <pre><code>{`// System: Multi-agent order processing pipeline

// 1. order-validator-agent
{
  "name": "order-validator",
  "tools": ["database", "http"],
  "instructions": "Validate order: check inventory, verify payment, validate address"
}

// 2. inventory-agent
{
  "name": "inventory-manager",
  "tools": ["database"],
  "instructions": "Reserve inventory, update stock levels, handle backorders"
}

// 3. payment-agent
{
  "name": "payment-processor",
  "tools": ["http"],  // Stripe/PayPal integration
  "instructions": "Process payment, handle refunds, manage payment methods"
}

// 4. shipping-agent
{
  "name": "shipping-coordinator",
  "tools": ["http", "database"],
  "instructions": "Calculate shipping, create labels, track shipments"
}

// 5. notification-agent
{
  "name": "notification-service",
  "tools": ["email", "slack"],
  "instructions": "Send order confirmations, shipping updates, delivery notifications"
}

// Coordinator orchestrates the flow
{
  "name": "order-processing-coordinator",
  "orchestration": {
    "mode": "pipeline",
    "agents": [
      "order-validator",
      "payment-processor",
      "inventory-manager",
      "shipping-coordinator",
      "notification-service"
    ],
    "errorHandling": {
      "onValidationFail": "reject-order",
      "onPaymentFail": "notify-customer",
      "onInventoryFail": "backorder",
      "maxRetries": 2
    }
  }
}

// Workflow:
// Order Received
//   → Validator checks all fields
//   → Payment processes charge
//   → Inventory reserves items
//   → Shipping creates label
//   → Notification sends confirmation
// Order Complete`}</code></pre>

        <h3>Monitoring & Debugging</h3>

        <h4>Agent Dashboard</h4>
        <pre><code>{`stick orchestration status

┌─────────────────────────────────────────────┐
│ Multi-Agent System Status                   │
├─────────────────────────────────────────────┤
│ Coordinator: order-processing-coordinator   │
│ Mode: Pipeline                              │
│ Active Agents: 5                            │
│ Queue Depth: 23                             │
│ Processing Rate: 45 orders/min              │
└─────────────────────────────────────────────┘

Agents:
  ✓ order-validator      [healthy] 12 tasks/min
  ✓ payment-processor    [healthy] 12 tasks/min
  ⚠ inventory-manager    [degraded] 8 tasks/min (high latency)
  ✓ shipping-coordinator [healthy] 11 tasks/min
  ✓ notification-service [healthy] 12 tasks/min

Recent Errors:
  [14:23:45] inventory-manager: Timeout connecting to database
  [14:22:10] payment-processor: Rate limit exceeded (Stripe API)`}</code></pre>

        <h4>Tracing Agent Communication</h4>
        <pre><code>{`// Enable distributed tracing
{
  "monitoring": {
    "tracing": {
      "enabled": true,
      "provider": "jaeger",
      "endpoint": "http://jaeger:14268/api/traces"
    }
  }
}

// View trace in Jaeger UI
Order-12345 (2.3s total)
  ├─ order-validator (0.2s)
  ├─ payment-processor (1.1s)
  │   └─ Stripe API call (1.0s)
  ├─ inventory-manager (0.5s)
  │   └─ Database query (0.4s)
  ├─ shipping-coordinator (0.3s)
  └─ notification-service (0.2s)
      └─ Email sent (0.15s)`}</code></pre>

        <h3>Best Practices</h3>

        <h4>Design Principles</h4>
        <ul>
          <li><strong>Single Responsibility:</strong> Each agent should have one clear purpose</li>
          <li><strong>Loose Coupling:</strong> Agents communicate through well-defined interfaces</li>
          <li><strong>Idempotency:</strong> Operations can be safely retried</li>
          <li><strong>Fault Isolation:</strong> One agent's failure doesn't crash the system</li>
          <li><strong>Observability:</strong> All agent interactions are logged and traceable</li>
        </ul>

        <h4>Performance Optimization</h4>
        <ul>
          <li><strong>Parallel execution:</strong> Run independent agents concurrently</li>
          <li><strong>Caching:</strong> Cache agent responses for identical queries</li>
          <li><strong>Load balancing:</strong> Distribute work across agent pools</li>
          <li><strong>Priority queues:</strong> Process urgent tasks first</li>
          <li><strong>Batch processing:</strong> Group similar tasks for efficiency</li>
        </ul>

        <h4>Security Considerations</h4>
        <ul>
          <li><strong>Agent authentication:</strong> Verify agent identity in communications</li>
          <li><strong>Message encryption:</strong> Encrypt sensitive inter-agent messages</li>
          <li><strong>Access control:</strong> Limit which agents can invoke others</li>
          <li><strong>Audit logging:</strong> Log all agent interactions for security review</li>
          <li><strong>Sandboxing:</strong> Isolate agents to prevent lateral movement</li>
        </ul>

        <h3>Testing Multi-Agent Systems</h3>

        <h4>Unit Testing Individual Agents</h4>
        <pre><code>{`// test/search-agent.test.ts
import { SearchAgent } from './agents/search-agent';

describe('SearchAgent', () => {
  it('should find relevant sources', async () => {
    const agent = new SearchAgent(config);
    const results = await agent.search('AI agents');

    expect(results).toHaveLength(10);
    expect(results[0]).toHaveProperty('url');
    expect(results[0]).toHaveProperty('title');
  });
});`}</code></pre>

        <h4>Integration Testing Agent Communication</h4>
        <pre><code>{`// test/orchestration.test.ts
describe('Research Pipeline', () => {
  it('should coordinate all agents', async () => {
    const coordinator = new Coordinator(config);
    const result = await coordinator.process('Research AI agents');

    // Verify each agent was called
    expect(searchAgent.search).toHaveBeenCalled();
    expect(analysisAgent.analyze).toHaveBeenCalled();
    expect(writerAgent.write).toHaveBeenCalled();

    // Verify final output
    expect(result.report).toContain('AI agents');
    expect(result.citations).toHaveLength(greaterThan(5));
  });
});`}</code></pre>

        <h4>Load Testing</h4>
        <pre><code>{`stick orchestration load-test \\
  --agents 5 \\
  --requests 1000 \\
  --duration 60s \\
  --report load-test-results.json

Results:
  Total Requests: 1000
  Successful: 987 (98.7%)
  Failed: 13 (1.3%)
  Avg Response Time: 1.2s
  P95 Response Time: 2.5s
  Throughput: 16.5 req/s`}</code></pre>

        <h3>Next Steps</h3>
        <ul>
          <li><Link href="/docs/mcp">Integrate MCP servers</Link> to extend agent capabilities</li>
          <li><Link href="/docs/deployment">Deploy multi-agent systems</Link> with Docker Compose and Kubernetes</li>
          <li><Link href="/docs/security">Secure agent communication</Link> with authentication and encryption</li>
          <li><Link href="/examples">Explore multi-agent examples</Link> including research systems and pipelines</li>
        </ul>
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

// Generate static paths for all documentation pages
export async function generateStaticParams() {
  return Object.keys(documentationContent).map((slug) => ({
    slug,
  }));
}

export default function DocPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  
  const doc = documentationContent[slug];
  
  if (!doc) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative">
                <TerminalIcon className="w-6 h-6 text-accent-blue" />
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
              <TerminalIcon className="w-6 h-6 text-accent-blue" />
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


