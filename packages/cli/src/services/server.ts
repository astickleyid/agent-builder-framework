import { spawn, ChildProcess } from 'child_process';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { AgentConfig } from './registry';

export interface ServerProcess {
  pid: number;
  port: number;
  startedAt: Date;
  process: ChildProcess;
}

export class ServerManager {
  private processes: Map<string, ServerProcess> = new Map();
  private pidDir: string;

  constructor() {
    this.pidDir = path.join(os.homedir(), '.config', 'stick-ai', 'pids');
  }

  async ensurePidDir(): Promise<void> {
    await fs.ensureDir(this.pidDir);
  }

  async startServer(agentName: string, config: AgentConfig, port: number): Promise<ServerProcess> {
    await this.ensurePidDir();

    // Create a simple HTTP server script
    const serverScript = this.generateServerScript(config, port);
    const scriptPath = path.join(this.pidDir, `${agentName}-server.js`);
    await fs.writeFile(scriptPath, serverScript);

    // Start the server process
    const serverProcess = spawn('node', [scriptPath], {
      detached: true,
      stdio: 'ignore',
    });

    serverProcess.unref();

    const processInfo: ServerProcess = {
      pid: serverProcess.pid!,
      port,
      startedAt: new Date(),
      process: serverProcess,
    };

    this.processes.set(agentName, processInfo);

    // Save PID to file
    const pidFile = path.join(this.pidDir, `${agentName}.pid`);
    await fs.writeFile(pidFile, serverProcess.pid!.toString());

    return processInfo;
  }

  private generateServerScript(config: AgentConfig, port: number): string {
    return `
const http = require('http');

const agentConfig = ${JSON.stringify(config, null, 2)};

const server = http.createServer((req, res) => {
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
    res.end(JSON.stringify({ status: 'healthy', agent: agentConfig.name }));
    return;
  }

  if (req.url === '/config') {
    res.writeHead(200);
    res.end(JSON.stringify(agentConfig));
    return;
  }

  if (req.url === '/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { message } = JSON.parse(body);
        const response = {
          agent: agentConfig.name,
          response: \`I received your message: "\${message}". \${agentConfig.instructions}\`,
          timestamp: new Date().toISOString()
        };
        res.writeHead(200);
        res.end(JSON.stringify(response));
      } catch (error) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid request' }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(${port}, () => {
  console.log(\`Agent "\${agentConfig.name}" listening on port ${port}\`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    process.exit(0);
  });
});
`;
  }

  async stopServer(agentName: string): Promise<void> {
    const pidFile = path.join(this.pidDir, `${agentName}.pid`);
    
    if (await fs.pathExists(pidFile)) {
      const pidStr = await fs.readFile(pidFile, 'utf-8');
      const pid = parseInt(pidStr, 10);
      
      try {
        process.kill(pid, 'SIGTERM');
        await fs.remove(pidFile);
      } catch (error) {
        // Process might already be dead
      }
    }

    const scriptPath = path.join(this.pidDir, `${agentName}-server.js`);
    if (await fs.pathExists(scriptPath)) {
      await fs.remove(scriptPath);
    }

    this.processes.delete(agentName);
  }

  async isServerRunning(agentName: string): Promise<boolean> {
    const pidFile = path.join(this.pidDir, `${agentName}.pid`);
    
    if (!(await fs.pathExists(pidFile))) {
      return false;
    }

    const pidStr = await fs.readFile(pidFile, 'utf-8');
    const pid = parseInt(pidStr, 10);
    
    try {
      // Check if process is running
      process.kill(pid, 0);
      return true;
    } catch {
      // Process is not running, clean up PID file
      await fs.remove(pidFile);
      return false;
    }
  }

  getProcess(agentName: string): ServerProcess | undefined {
    return this.processes.get(agentName);
  }
}
