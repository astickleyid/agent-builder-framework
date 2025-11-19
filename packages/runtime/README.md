# @stick-ai/runtime

Agent runtime engine for the stick.ai framework - build and execute AI agents with built-in tools.

## Installation

```bash
npm install @stick-ai/runtime
```

## Quick Start

```typescript
import { Agent, createTool } from '@stick-ai/runtime';

// Create an agent
const agent = new Agent({
  name: 'my-agent',
  version: '1.0.0',
  description: 'My AI agent',
  capabilities: ['chat', 'task-execution'],
  tools: ['bash', 'http', 'file-ops', 'json'],
  instructions: 'You are a helpful AI agent.',
  environment: {
    maxTokens: 4000,
    temperature: 0.7
  }
});

// Register tools
const bashTool = createTool('bash');
agent.registerTool('bash', bashTool);

// Run the agent
const response = await agent.run('Hello, what can you do?');
console.log(response);
```

## Features

- 🤖 **Agent Class** - Complete agent lifecycle management
- 🛠️ **Built-in Tools** - 14 production-ready tools
- 💾 **Memory** - Conversation history tracking
- 🔧 **Extensible** - Easy custom tool creation
- 📦 **TypeScript** - Full type safety
- ⚡ **Fast** - Lightweight and performant

## Built-in Tools

### BashTool (`bash`)
Execute shell commands safely:
```typescript
const bashTool = createTool('bash');
const result = await bashTool.execute({
  command: 'ls -la',
  timeout: 30000
});
```

### HttpTool (`http`)
Make HTTP requests:
```typescript
const httpTool = createTool('http');
const result = await httpTool.execute({
  url: 'https://api.example.com/data',
  method: 'GET',
  headers: { 'Authorization': 'Bearer token' }
});
```

### FileOpsTool (`file-ops`)
File system operations:
```typescript
const fileTool = createTool('file-ops');

// Read file
const content = await fileTool.execute({
  operation: 'read',
  path: './data.txt'
});

// Write file
await fileTool.execute({
  operation: 'write',
  path: './output.txt',
  content: 'Hello World'
});
```

### JsonTool (`json`)
JSON manipulation:
```typescript
const jsonTool = createTool('json');

// Parse JSON
const parsed = await jsonTool.execute({
  operation: 'parse',
  data: '{"name": "John"}'
});

// Query JSON
const result = await jsonTool.execute({
  operation: 'query',
  data: { user: { name: 'John' } },
  query: 'user.name'
});
```

### PythonTool (`python`)
Execute Python code:
```typescript
const pythonTool = createTool('python');
const result = await pythonTool.execute({
  code: 'print("Hello from Python!")',
  timeout: 30000
});
```

### DatabaseTool (`database`)
Database operations:
```typescript
const dbTool = createTool('database');

// Connect
const conn = await dbTool.execute({
  operation: 'connect',
  type: 'postgres',
  connectionString: 'postgresql://...'
});

// Query
const result = await dbTool.execute({
  operation: 'query',
  connectionId: conn.connectionId,
  query: 'SELECT * FROM users'
});
```

### EmailTool (`email`)
Send emails:
```typescript
const emailTool = createTool('email');
await emailTool.execute({
  to: 'user@example.com',
  subject: 'Hello',
  body: 'Message content'
});
```

### WebScraperTool (`web-scraper`)
Scrape web pages:
```typescript
const scraperTool = createTool('web-scraper');
const result = await scraperTool.execute({
  url: 'https://example.com',
  selector: 'h1'
});
```

### CsvTool (`csv`)
CSV operations:
```typescript
const csvTool = createTool('csv');

// Parse CSV file
const data = await csvTool.execute({
  operation: 'parse',
  path: './data.csv'
});

// Convert to CSV
const csv = await csvTool.execute({
  operation: 'stringify',
  data: [{ name: 'John', age: 30 }]
});
```

### GitHubTool (`github`)
GitHub API integration:
```typescript
const githubTool = createTool('github');

// Get repository info
const repo = await githubTool.execute({
  operation: 'get-repo',
  owner: 'microsoft',
  repo: 'vscode'
});

// List issues
const issues = await githubTool.execute({
  operation: 'list-issues',
  owner: 'microsoft',
  repo: 'vscode'
});
```

### SlackTool (`slack`)
Slack integration:
```typescript
const slackTool = createTool('slack');
await slackTool.execute({
  operation: 'send-message',
  token: 'xoxb-...',
  channel: '#general',
  text: 'Hello from stick.ai!'
});
```

### XmlTool (`xml`)
XML operations:
```typescript
const xmlTool = createTool('xml');
const parsed = await xmlTool.execute({
  operation: 'parse',
  data: '<root><name>John</name></root>'
});
```

### DateTimeTool (`datetime`)
Date/time operations:
```typescript
const dtTool = createTool('datetime');

// Get current time
const now = await dtTool.execute({ operation: 'now' });

// Add time
const future = await dtTool.execute({
  operation: 'add',
  date: '2024-01-01',
  amount: 7,
  unit: 'days'
});

// Calculate difference
const diff = await dtTool.execute({
  operation: 'diff',
  date: '2024-01-01',
  date2: '2024-12-31'
});
```

### TextTool (`text`)
Text manipulation:
```typescript
const textTool = createTool('text');

// Count words
const count = await textTool.execute({
  operation: 'count',
  text: 'Hello world'
});

// Convert case
const converted = await textTool.execute({
  operation: 'case',
  text: 'hello world',
  caseType: 'title'
});

// Search and replace
const replaced = await textTool.execute({
  operation: 'replace',
  text: 'Hello world',
  search: 'world',
  replacement: 'stick.ai'
});
```

## Agent Configuration

```typescript
interface AgentConfig {
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  tools: string[];
  instructions: string;
  environment: {
    maxTokens?: number;
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  };
  memory?: {
    enabled: boolean;
    maxHistory?: number;
    persistencePath?: string;
    contextWindow?: number;
  };
  security?: {
    sandboxed?: boolean;
    allowedDomains?: string[];
    rateLimiting?: {
      requestsPerMinute?: number;
      requestsPerHour?: number;
    };
  };
}
```

## Creating Custom Tools

```typescript
import { BaseTool } from '@stick-ai/runtime';

class MyCustomTool extends BaseTool {
  constructor() {
    super({
      name: 'my-tool',
      description: 'My custom tool',
      parameters: { input: 'string' }
    });
  }

  async execute(params: { input: string }): Promise<any> {
    // Your tool logic here
    return {
      success: true,
      result: `Processed: ${params.input}`
    };
  }
}

// Register with agent
const myTool = new MyCustomTool();
agent.registerTool('my-tool', myTool);
```

## Advanced Usage

### Conversation History
```typescript
// Get conversation history
const history = agent.getHistory();
console.log(history);
// [{ role: 'user', content: '...', timestamp: Date },
//  { role: 'assistant', content: '...', timestamp: Date }]
```

### Multiple Agents
```typescript
const researcher = new Agent({ name: 'researcher', ... });
const writer = new Agent({ name: 'writer', ... });

// Orchestrate multiple agents
const research = await researcher.run('Research AI trends');
const article = await writer.run(`Write article about: ${research}`);
```

## API Reference

### Agent Class

#### `new Agent(config: AgentConfig)`
Create a new agent instance.

#### `agent.run(input: string): Promise<string>`
Run the agent with user input.

#### `agent.registerTool(name: string, tool: BaseTool): void`
Register a tool with the agent.

#### `agent.getHistory(): Message[]`
Get conversation history.

#### `agent.getConfig(): AgentConfig`
Get agent configuration.

### Tools

#### `createTool(name: string): BaseTool`
Create a built-in tool by name.

Available tools: `'bash'`, `'http'`, `'file-ops'`, `'json'`, `'python'`, `'database'`, `'email'`, `'web-scraper'`, `'csv'`, `'github'`, `'slack'`, `'xml'`, `'datetime'`, `'text'`

## TypeScript Support

Full TypeScript definitions included:
```typescript
import type { Agent, AgentConfig, Message, BaseTool } from '@stick-ai/runtime';
```

## Requirements

- Node.js >= 18.0.0
- TypeScript >= 5.0 (for development)

## License

MIT

## Links

- [Documentation](https://stick.ai/docs)
- [GitHub](https://github.com/stickai/framework)
- [CLI Package](https://npmjs.com/package/@stick-ai/cli)
- [Website](https://stick.ai)

## Support

- 📧 Email: support@stick.ai
- 💬 Discord: [discord.gg/stickai](https://discord.gg/stickai)
- 🐛 Issues: [github.com/stickai/framework/issues](https://github.com/stickai/framework/issues)

---

Built with ❤️ by the stick.ai team
