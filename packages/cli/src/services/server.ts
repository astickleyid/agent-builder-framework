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

    // Save agent config for the server to use
    const configPath = path.join(this.pidDir, `${agentName}-config.json`);
    await fs.writeJson(configPath, config);

    // Get the path to the compiled agent-server.js
    const serverScriptPath = path.join(__dirname, 'agent-server.js');

    // Start the server process
    const serverProcess = spawn('node', [serverScriptPath, configPath, port.toString()], {
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

    // Clean up config file
    const configPath = path.join(this.pidDir, `${agentName}-config.json`);
    if (await fs.pathExists(configPath)) {
      await fs.remove(configPath);
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
