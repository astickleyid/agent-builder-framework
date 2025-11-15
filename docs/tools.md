# Tool System Documentation

## Overview

The stick.ai framework includes a powerful tool system that allows agents to interact with external systems, execute commands, manipulate data, and make HTTP requests. Tools are executed in a secure, sandboxed environment with built-in safety checks.

## Architecture

### Tool Components

1. **Tool Interface** - Defines the contract for all tools
2. **Tool Registry** - Manages tool registration and discovery
3. **Built-in Tools** - Pre-built tools for common operations
4. **Security Layer** - Sandboxing and permission checks
5. **Execution Engine** - Handles tool execution with timeout and resource limits

### Security Features

- **Permission System** - Tools can require explicit permission
- **Danger Levels** - Tools are classified by risk (safe, low, medium, high)
- **Command Filtering** - Dangerous commands are blocked
- **Path Restrictions** - Access to sensitive files is prevented
- **Host Filtering** - Requests to internal services are blocked
- **Resource Limits** - Timeouts and size limits prevent abuse
- **Sandboxed Execution** - Tools run in isolated contexts

## Built-in Tools

### System Tools

#### bash
Execute shell commands in a sandboxed environment.

**Category:** system  
**Permission Required:** Yes  
**Danger Level:** high

**Parameters:**
- `command` (string, required) - The bash command to execute
- `args` (array, optional) - Optional command arguments

**Example:**
```json
{
  "tool": "bash",
  "params": {
    "command": "ls",
    "args": ["-la", "/tmp"]
  }
}
```

**Security Features:**
- Blocks dangerous commands (rm -rf /, fork bombs, etc.)
- 30-second timeout by default
- 1MB output size limit
- Custom working directory support

#### file-ops
Perform file system operations with security constraints.

**Category:** system  
**Permission Required:** Yes  
**Danger Level:** medium

**Parameters:**
- `operation` (string, required) - Operation: read, write, list, delete, exists
- `path` (string, required) - File or directory path
- `content` (string, optional) - Content to write (for write operation)

**Operations:**

**Read:**
```json
{
  "tool": "file-ops",
  "params": {
    "operation": "read",
    "path": "/path/to/file.txt"
  }
}
```

**Write:**
```json
{
  "tool": "file-ops",
  "params": {
    "operation": "write",
    "path": "/path/to/file.txt",
    "content": "File content here"
  }
}
```

**List Directory:**
```json
{
  "tool": "file-ops",
  "params": {
    "operation": "list",
    "path": "/path/to/directory"
  }
}
```

**Delete:**
```json
{
  "tool": "file-ops",
  "params": {
    "operation": "delete",
    "path": "/path/to/file.txt"
  }
}
```

**Check Exists:**
```json
{
  "tool": "file-ops",
  "params": {
    "operation": "exists",
    "path": "/path/to/file.txt"
  }
}
```

**Security Features:**
- Blocks access to sensitive files (/etc/passwd, SSH keys, etc.)
- 10MB file size limit
- Path validation and sanitization

### Web Tools

#### http
Make HTTP/HTTPS requests.

**Category:** web  
**Permission Required:** Yes  
**Danger Level:** medium

**Parameters:**
- `url` (string, required) - The URL to request
- `method` (string, optional) - HTTP method (default: GET)
- `headers` (object, optional) - HTTP headers
- `body` (string, optional) - Request body

**Example GET:**
```json
{
  "tool": "http",
  "params": {
    "url": "https://api.example.com/data",
    "method": "GET",
    "headers": {
      "Authorization": "Bearer token"
    }
  }
}
```

**Example POST:**
```json
{
  "tool": "http",
  "params": {
    "url": "https://api.example.com/data",
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": "{\"key\": \"value\"}"
  }
}
```

**Security Features:**
- Blocks requests to AWS metadata service
- 30-second timeout
- 10MB response size limit
- Automatic JSON parsing

### Data Tools

#### json
Parse, validate, and manipulate JSON data.

**Category:** data  
**Permission Required:** No  
**Danger Level:** safe

**Parameters:**
- `operation` (string, required) - Operation: parse, stringify, query, validate
- `data` (string, required) - JSON string or object
- `path` (string, optional) - JSON path for query operation

**Parse:**
```json
{
  "tool": "json",
  "params": {
    "operation": "parse",
    "data": "{\"name\": \"John\", \"age\": 30}"
  }
}
```

**Stringify:**
```json
{
  "tool": "json",
  "params": {
    "operation": "stringify",
    "data": {"name": "John", "age": 30}
  }
}
```

**Query:**
```json
{
  "tool": "json",
  "params": {
    "operation": "query",
    "data": "{\"user\": {\"name\": \"John\"}}",
    "path": "user.name"
  }
}
```

**Validate:**
```json
{
  "tool": "json",
  "params": {
    "operation": "validate",
    "data": "{\"valid\": true}"
  }
}
```

## API Usage

### List Available Tools

Get a list of all tools available to an agent.

```bash
curl http://localhost:3000/tools
```

**Response:**
```json
{
  "tools": [
    {
      "name": "bash",
      "description": "Execute bash commands in a sandboxed environment",
      "category": "system",
      "parameters": [...],
      "requiresPermission": true,
      "dangerLevel": "high"
    },
    ...
  ]
}
```

### Execute a Tool

Execute a tool with given parameters.

```bash
curl -X POST http://localhost:3000/tools/execute \
  -H "Content-Type: application/json" \
  -d '{
    "tool": "bash",
    "params": {
      "command": "echo Hello"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "output": {
    "stdout": "Hello",
    "stderr": ""
  },
  "executionTime": 5,
  "metadata": {
    "command": "echo Hello",
    "exitCode": 0
  }
}
```

### Error Response

When a tool fails, you'll get an error response:

```json
{
  "success": false,
  "error": "Command blocked: potentially dangerous operation detected",
  "executionTime": 1
}
```

## Configuration

### Agent Configuration

Enable tools in your agent configuration:

```json
{
  "name": "my-agent",
  "tools": ["bash", "file-ops", "http", "json"],
  ...
}
```

### Execution Context

Provide additional context for tool execution:

```json
{
  "tool": "bash",
  "params": {
    "command": "ls"
  },
  "context": {
    "workingDirectory": "/tmp",
    "timeout": 10000,
    "maxOutputSize": 1048576
  }
}
```

**Context Options:**
- `workingDirectory` - Working directory for command execution
- `timeout` - Timeout in milliseconds
- `environment` - Environment variables
- `maxOutputSize` - Maximum output size in bytes

## Security Best Practices

### 1. Tool Selection
Only enable tools your agent actually needs:

```json
{
  "tools": ["json"]  // Only safe data manipulation
}
```

### 2. Input Validation
Always validate user inputs before passing to tools:

```typescript
// Bad - direct user input
executeTool('bash', { command: userInput });

// Good - validated input
const safeCommand = validateCommand(userInput);
executeTool('bash', { command: safeCommand });
```

### 3. Permission Checks
Tools with `requiresPermission: true` should only be used with explicit user consent.

### 4. Danger Levels
- **safe** - No restrictions, safe for all operations
- **low** - Minimal risk, restricted resources
- **medium** - Moderate risk, requires permission
- **high** - High risk, requires explicit permission and audit logging

### 5. Resource Limits
Always set appropriate timeouts and size limits:

```json
{
  "context": {
    "timeout": 5000,
    "maxOutputSize": 102400
  }
}
```

## Creating Custom Tools

### Step 1: Implement the Tool Interface

```typescript
import { Tool, ToolDefinition, ToolExecutionResult } from './types';

export class CustomTool implements Tool {
  definition: ToolDefinition = {
    name: 'my-custom-tool',
    description: 'Does something custom',
    category: 'custom',
    parameters: [
      {
        name: 'param1',
        type: 'string',
        description: 'First parameter',
        required: true,
      },
    ],
    requiresPermission: false,
    dangerLevel: 'safe',
  };

  async execute(
    params: Record<string, any>,
    context?: any
  ): Promise<ToolExecutionResult> {
    try {
      // Your tool logic here
      return {
        success: true,
        output: 'Tool result',
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
```

### Step 2: Register the Tool

```typescript
import { getToolRegistry } from './registry';
import { CustomTool } from './custom-tool';

const registry = getToolRegistry();
registry.register(new CustomTool());
```

### Step 3: Add to Agent Configuration

```json
{
  "tools": ["my-custom-tool"]
}
```

## Troubleshooting

### Tool Not Found

**Error:** `Tool "xyz" not found`

**Solution:** Make sure the tool is registered and the name matches exactly.

### Permission Denied

**Error:** `Tool "bash" is not allowed for this agent`

**Solution:** Add the tool to your agent's `tools` array in the configuration.

### Command Blocked

**Error:** `Command blocked: potentially dangerous operation detected`

**Solution:** The command contains dangerous patterns. Review the security restrictions and use safer alternatives.

### Timeout

**Error:** `Request timeout`

**Solution:** Increase the timeout in the execution context or optimize the operation.

### File Too Large

**Error:** `File too large to read`

**Solution:** The file exceeds the maximum size limit. Process the file in chunks or increase the limit.

## Examples

### Example 1: Data Processing Pipeline

```bash
# Read data from file
curl -X POST http://localhost:3000/tools/execute \
  -d '{"tool": "file-ops", "params": {"operation": "read", "path": "/data/input.json"}}'

# Parse JSON
curl -X POST http://localhost:3000/tools/execute \
  -d '{"tool": "json", "params": {"operation": "parse", "data": "..."}}'

# Write processed data
curl -X POST http://localhost:3000/tools/execute \
  -d '{"tool": "file-ops", "params": {"operation": "write", "path": "/data/output.json", "content": "..."}}'
```

### Example 2: API Integration

```bash
# Fetch data from API
curl -X POST http://localhost:3000/tools/execute \
  -d '{"tool": "http", "params": {"url": "https://api.example.com/data"}}'

# Process response
curl -X POST http://localhost:3000/tools/execute \
  -d '{"tool": "json", "params": {"operation": "query", "data": "...", "path": "results.items"}}'
```

### Example 3: System Administration

```bash
# Check disk usage
curl -X POST http://localhost:3000/tools/execute \
  -d '{"tool": "bash", "params": {"command": "df", "args": ["-h"]}}'

# List processes
curl -X POST http://localhost:3000/tools/execute \
  -d '{"tool": "bash", "params": {"command": "ps", "args": ["aux"]}}'
```

## Performance Considerations

### 1. Tool Execution Overhead
- Average overhead: 1-5ms per tool call
- Network tools: Variable based on response time
- File operations: Depends on file size

### 2. Resource Limits
- Default timeout: 30 seconds
- Max output size: 1-10MB depending on tool
- Concurrent executions: Unlimited (OS-limited)

### 3. Optimization Tips
- Use batch operations when possible
- Cache frequently accessed data
- Set appropriate timeouts
- Implement retry logic for network operations

## Future Enhancements

Planned improvements for the tool system:

1. **Python Tool** - Execute Python code in sandboxed environment
2. **Node Tool** - Execute Node.js code
3. **Database Tools** - SQL query execution
4. **Browser Tool** - Web scraping and automation
5. **Git Tool** - Git repository operations
6. **Docker Tool** - Container management
7. **CSV Tool** - CSV data manipulation
8. **Email Tool** - Send emails
9. **Slack/Discord Tools** - Chat integrations

## Related Documentation

- [Getting Started](./getting-started.md)
- [Configuration Guide](./configuration.md)
- [LLM Integration](./llm-integration.md)
- [Security Best Practices](./PRIVACY.md)

---

**Need Help?**
- 📧 Email: support@stick.ai
- 💬 Discord: [Join our community](https://discord.gg/stickai)
- 🐛 Issues: [GitHub Issues](https://github.com/stickai/framework/issues)
