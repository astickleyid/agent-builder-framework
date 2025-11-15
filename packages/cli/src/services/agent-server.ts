import http from 'http';
import { AgentConfig } from './registry';
import { AgentRuntime } from './runtime';

export async function startAgentServer(config: AgentConfig, port: number): Promise<void> {
  const runtime = new AgentRuntime(config);
  
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    if (req.url === '/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'healthy', agent: config.name }));
      return;
    }

    if (req.url === '/config') {
      res.writeHead(200);
      res.end(JSON.stringify(config));
      return;
    }

    if (req.url === '/chat' && req.method === 'POST') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        try {
          const { message } = JSON.parse(body);
          const responseText = await runtime.processMessage(message);
          
          const response = {
            agent: config.name,
            response: responseText,
            timestamp: new Date().toISOString(),
          };
          
          res.writeHead(200);
          res.end(JSON.stringify(response));
        } catch (error: any) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid request', message: error.message }));
        }
      });
      return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not found' }));
  });

  server.listen(port, () => {
    console.log(`Agent "${config.name}" listening on port ${port}`);
  });

  process.on('SIGTERM', () => {
    server.close(() => {
      process.exit(0);
    });
  });
}

// Allow running as standalone script
if (require.main === module) {
  const configPath = process.argv[2];
  const port = parseInt(process.argv[3] || '3000', 10);

  if (!configPath) {
    console.error('Usage: node agent-server.js <config-path> [port]');
    process.exit(1);
  }

  const config = require(configPath);
  startAgentServer(config, port).catch((error) => {
    console.error('Failed to start agent server:', error);
    process.exit(1);
  });
}
