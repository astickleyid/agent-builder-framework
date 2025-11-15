import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export interface AgentConfig {
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  tools: string[];
  instructions: string;
  environment: {
    maxTokens: number;
    temperature: number;
  };
  llm?: {
    provider: 'openai' | 'anthropic' | 'ollama' | 'none';
    model?: string;
    apiKey?: string;
    baseURL?: string;
    stream?: boolean;
  };
  port?: number;
  status?: 'running' | 'stopped';
  pid?: number;
  deployedAt?: string;
}

export interface AgentRegistry {
  agents: Record<string, AgentConfig>;
}

export class AgentRegistryService {
  private registryPath: string;
  private configDir: string;

  constructor() {
    this.configDir = path.join(os.homedir(), '.config', 'stick-ai');
    this.registryPath = path.join(this.configDir, 'registry.json');
  }

  async ensureRegistry(): Promise<void> {
    await fs.ensureDir(this.configDir);
    if (!(await fs.pathExists(this.registryPath))) {
      await fs.writeJson(this.registryPath, { agents: {} }, { spaces: 2 });
    }
  }

  async getRegistry(): Promise<AgentRegistry> {
    await this.ensureRegistry();
    return await fs.readJson(this.registryPath);
  }

  async saveRegistry(registry: AgentRegistry): Promise<void> {
    await this.ensureRegistry();
    await fs.writeJson(this.registryPath, registry, { spaces: 2 });
  }

  async registerAgent(config: AgentConfig, projectPath: string): Promise<void> {
    const registry = await this.getRegistry();
    
    registry.agents[config.name] = {
      ...config,
      status: 'stopped',
    };

    await this.saveRegistry(registry);

    // Save agent metadata
    const agentDir = path.join(this.configDir, 'agents', config.name);
    await fs.ensureDir(agentDir);
    await fs.writeJson(
      path.join(agentDir, 'config.json'),
      { ...config, projectPath },
      { spaces: 2 }
    );
  }

  async getAgent(name: string): Promise<AgentConfig | null> {
    const registry = await this.getRegistry();
    return registry.agents[name] || null;
  }

  async getAllAgents(): Promise<AgentConfig[]> {
    const registry = await this.getRegistry();
    return Object.values(registry.agents);
  }

  async updateAgentStatus(
    name: string,
    status: 'running' | 'stopped',
    pid?: number
  ): Promise<void> {
    const registry = await this.getRegistry();
    
    if (registry.agents[name]) {
      registry.agents[name].status = status;
      registry.agents[name].pid = pid;
      
      if (status === 'running') {
        registry.agents[name].deployedAt = new Date().toISOString();
      }
      
      await this.saveRegistry(registry);
    }
  }

  async removeAgent(name: string): Promise<void> {
    const registry = await this.getRegistry();
    delete registry.agents[name];
    await this.saveRegistry(registry);

    // Remove agent metadata
    const agentDir = path.join(this.configDir, 'agents', name);
    if (await fs.pathExists(agentDir)) {
      await fs.remove(agentDir);
    }
  }
}
