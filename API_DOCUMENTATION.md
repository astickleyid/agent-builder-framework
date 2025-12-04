# stick.ai Web API Documentation

## Overview

The stick.ai framework provides a RESTful API for managing and interacting with AI agents through the web interface. All endpoints are available when running the development server.

## Base URL

```
http://localhost:3002/api
```

## Authentication

Currently, no authentication is required for local development. For production deployments, implement appropriate authentication mechanisms.

## Endpoints

### Agents Management

#### List All Agents

```http
GET /api/agents
```

**Description**: Retrieve all configured agents.

**Response**:
```json
{
  "agents": [
    {
      "id": "abc123",
      "name": "my-agent",
      "description": "A custom AI agent",
      "provider": "ollama",
      "model": "mistral:7b",
      "tools": ["datetime", "text"],
      "instructions": "You are a helpful AI assistant.",
      "temperature": 0.7,
      "maxTokens": 2000,
      "capabilities": ["chat", "reasoning"]
    }
  ]
}
```

**Status Codes**:
- `200 OK`: Success
- `500 Internal Server Error`: Server error

---

#### Create/Save Agent

```http
POST /api/agents
```

**Description**: Create or update an agent configuration.

**Request Body**:
```json
{
  "id": "abc123",  // Optional: omit to generate new ID
  "name": "my-agent",
  "description": "A custom AI agent",
  "provider": "ollama",
  "model": "mistral:7b",
  "tools": ["datetime", "text"],
  "instructions": "You are a helpful AI assistant.",
  "temperature": 0.7,
  "maxTokens": 2000,
  "capabilities": ["chat", "reasoning"],
  "mcpServers": []
}
```

**Response**:
```json
{
  "success": true,
  "agent": {
    "id": "abc123",
    "name": "my-agent",
    // ... full agent config
  }
}
```

**Status Codes**:
- `200 OK`: Agent created/updated
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error

---

#### Get Agent Details

```http
GET /api/agents/{id}
```

**Description**: Retrieve details of a specific agent.

**Parameters**:
- `id` (path): Agent identifier

**Response**:
```json
{
  "agent": {
    "config": { /* agent configuration */ },
    "instance": null,  // or agent instance if deployed
    "status": "stopped",  // or "starting", "running", "error"
    "startedAt": null  // or ISO timestamp
  }
}
```

**Status Codes**:
- `200 OK`: Success
- `404 Not Found`: Agent not found
- `500 Internal Server Error`: Server error

---

#### Delete Agent

```http
DELETE /api/agents/{id}
```

**Description**: Delete an agent and stop it if running.

**Parameters**:
- `id` (path): Agent identifier

**Response**:
```json
{
  "success": true
}
```

**Status Codes**:
- `200 OK`: Agent deleted
- `500 Internal Server Error`: Server error

---

### Agent Deployment

#### Deploy Agent

```http
POST /api/agents/{id}/deploy
```

**Description**: Deploy an agent, making it available for testing and interaction.

**Parameters**:
- `id` (path): Agent identifier

**Response**:
```json
{
  "success": true,
  "url": "In-memory (API route)",
  "message": "Agent deployed successfully"
}
```

**Status Codes**:
- `200 OK`: Agent deployed
- `500 Internal Server Error`: Deployment failed

---

#### Stop Agent

```http
DELETE /api/agents/{id}/deploy
```

**Description**: Stop a running agent.

**Parameters**:
- `id` (path): Agent identifier

**Response**:
```json
{
  "success": true
}
```

**Status Codes**:
- `200 OK`: Agent stopped
- `500 Internal Server Error`: Error stopping agent

---

#### Get Deployment Status

```http
GET /api/agents/{id}/status
```

**Description**: Check the deployment status of an agent.

**Parameters**:
- `id` (path): Agent identifier

**Response**:
```json
{
  "status": "running",  // or "stopped", "starting", "error"
  "url": "In-memory (API route)",  // or null if not running
  "startedAt": "2024-12-03T22:30:00.000Z",  // or null
  "error": null  // or error message if status is "error"
}
```

**Status Codes**:
- `200 OK`: Success
- `404 Not Found`: Agent not found
- `500 Internal Server Error`: Server error

---

### Agent Interaction

#### Test Agent

```http
POST /api/agents/{id}/test
```

**Description**: Send a message to a deployed agent and receive a response.

**Parameters**:
- `id` (path): Agent identifier

**Request Body**:
```json
{
  "input": "What can you help me with?"
}
```

**Response**:
```json
{
  "success": true,
  "result": "I can help you with various tasks including..."
}
```

**Status Codes**:
- `200 OK`: Success
- `400 Bad Request`: Missing input
- `500 Internal Server Error`: Agent execution failed

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message describing what went wrong"
}
```

## Examples

### Create and Deploy an Agent

```bash
# 1. Create agent
curl -X POST http://localhost:3002/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-agent",
    "description": "Test agent",
    "provider": "ollama",
    "model": "mistral:7b",
    "tools": ["datetime"],
    "instructions": "You are a helpful assistant."
  }'

# Response: {"success": true, "agent": {"id": "abc123", ...}}

# 2. Deploy the agent
curl -X POST http://localhost:3002/api/agents/abc123/deploy

# 3. Test the agent
curl -X POST http://localhost:3002/api/agents/abc123/test \
  -H "Content-Type: application/json" \
  -d '{"input": "Hello!"}'
```

### Check Agent Status

```bash
curl http://localhost:3002/api/agents/abc123/status
```

### List All Agents

```bash
curl http://localhost:3002/api/agents
```

### Delete Agent

```bash
curl -X DELETE http://localhost:3002/api/agents/abc123
```

## Rate Limiting

Currently no rate limiting is enforced in development mode. Implement appropriate rate limiting for production deployments.

## CORS

CORS is enabled by default for all origins in development. Configure appropriately for production.

## WebSocket Support

WebSocket support for streaming responses is planned for future releases.

## SDK

TypeScript/JavaScript SDK coming soon for easier integration.

## Security Considerations

### For Production Deployment

1. **Add Authentication**: Implement JWT or API key authentication
2. **Rate Limiting**: Add per-user/IP rate limits
3. **Input Validation**: Sanitize all inputs
4. **HTTPS Only**: Use TLS encryption
5. **CORS**: Restrict to specific origins
6. **API Keys**: Secure storage of LLM provider keys
7. **Logging**: Monitor API usage and errors
8. **Timeouts**: Set appropriate timeouts for agent execution

### Environment Variables

```bash
# Required for cloud LLM providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional
OLLAMA_HOST=http://localhost:11434
```

## Versioning

Current API version: `v1` (implicit)

Future versions will be explicitly versioned:
- `/api/v1/agents`
- `/api/v2/agents`

## Support

- **Issues**: [GitHub Issues](https://github.com/astickleyid/agent-builder-framework/issues)
- **Documentation**: [Full Docs](./docs)
- **Discord**: Community support

---

**Last Updated**: December 2024  
**Version**: 1.0.0
