import fs from 'fs-extra';
import path from 'path';
import { SimpleAgent, type SimpleAgentConfig, type LLMConfig } from './simple-agent';

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  provider: string;
  model: string;
  tools: string[];
  instructions: string;
  temperature: number;
  maxTokens: number;
  capabilities: string[];
  mcpServers?: Array<{ id: string; enabled: boolean }>;
}

export interface DeployedAgent {
  config: AgentConfig;
  instance?: SimpleAgent; // Agent instance
  port?: number;
  status: 'stopped' | 'starting' | 'running' | 'error';
  error?: string;
  startedAt?: Date;
}

class AgentManager {
  private agents: Map<string, DeployedAgent> = new Map();
  private configDir: string;
  private nextPort: number = 4000;

  constructor() {
    this.configDir = path.join(process.cwd(), '.stick-agents');
    this.ensureConfigDir();
    this.loadAgents();
  }

  private ensureConfigDir() {
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirpSync(this.configDir);
    }
  }

  private async loadAgents() {
    try {
      const files = await fs.readdir(this.configDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const config = await fs.readJson(path.join(this.configDir, file));
          this.agents.set(config.id, {
            config,
            status: 'stopped'
          });
        }
      }
    } catch (error) {
      console.error('Error loading agents:', error);
    }
  }

  async saveAgent(config: AgentConfig): Promise<void> {
    const configPath = path.join(this.configDir, `${config.id}.json`);
    await fs.writeJson(configPath, config, { spaces: 2 });
    
    const existing = this.agents.get(config.id);
    this.agents.set(config.id, {
      config,
      status: existing?.status || 'stopped',
      instance: existing?.instance,
      port: existing?.port
    });
  }

  async getAgent(id: string): Promise<DeployedAgent | undefined> {
    return this.agents.get(id);
  }

  async listAgents(): Promise<AgentConfig[]> {
    return Array.from(this.agents.values()).map(a => a.config);
  }

  async deleteAgent(id: string): Promise<void> {
    const agent = this.agents.get(id);
    if (agent?.instance) {
      // Stop agent if running
      await this.stopAgent(id);
    }

    const configPath = path.join(this.configDir, `${id}.json`);
    if (await fs.pathExists(configPath)) {
      await fs.remove(configPath);
    }

    this.agents.delete(id);
  }

  async deployAgent(id: string): Promise<{ url: string }> {
    const deployed = this.agents.get(id);
    if (!deployed) {
      throw new Error(`Agent ${id} not found`);
    }

    if (deployed.status === 'running') {
      return {
        url: 'In-memory (API route)'
      };
    }

    deployed.status = 'starting';

    try {
      const config = deployed.config;

      // Convert UI config to SimpleAgent config
      const agentConfig: SimpleAgentConfig = {
        name: config.name,
        description: config.description,
        provider: config.provider,
        model: config.model,
        instructions: config.instructions,
        temperature: config.temperature,
        maxTokens: config.maxTokens,
        tools: config.tools
      };

      // Create LLM config
      const llmConfig = this.createLLMConfig(config);
      
      // Create agent instance
      const agentInstance = new SimpleAgent(agentConfig, llmConfig);

      deployed.instance = agentInstance;
      deployed.status = 'running';
      deployed.startedAt = new Date();

      return {
        url: 'In-memory (API route)'
      };
    } catch (error: any) {
      deployed.status = 'error';
      deployed.error = error.message;
      throw error;
    }
  }

  async stopAgent(id: string): Promise<void> {
    const deployed = this.agents.get(id);
    if (!deployed) {
      throw new Error(`Agent ${id} not found`);
    }

    if (deployed.instance) {
      deployed.status = 'stopped';
      deployed.instance = undefined;
      deployed.port = undefined;
    }
  }

  private createLLMConfig(config: AgentConfig): LLMConfig | null {
    if (!config.provider || config.provider === 'none') {
      return null;
    }

    const llmConfig: LLMConfig = {
      provider: config.provider,
      model: config.model,
      temperature: config.temperature,
      maxTokens: config.maxTokens
    };

    if (config.provider === 'openai') {
      llmConfig.apiKey = process.env.OPENAI_API_KEY;
    } else if (config.provider === 'anthropic') {
      llmConfig.apiKey = process.env.ANTHROPIC_API_KEY;
    } else if (config.provider === 'ollama') {
      llmConfig.host = process.env.OLLAMA_HOST || 'http://localhost:11434';
    }

    return llmConfig;
  }

  async testAgent(id: string, input: string): Promise<string> {
    const deployed = this.agents.get(id);
    if (!deployed) {
      throw new Error(`Agent ${id} not found`);
    }

    if (deployed.status !== 'running' || !deployed.instance) {
      throw new Error(`Agent ${id} is not deployed. Deploy it first.`);
    }

    // Call the agent instance directly
    try {
      const result = await deployed.instance.run(input);
      return result;
    } catch (error: any) {
      throw new Error(`Agent execution failed: ${error.message}`);
    }
  }
}

// Singleton instance
let agentManagerInstance: AgentManager | null = null;

export function getAgentManager(): AgentManager {
  if (!agentManagerInstance) {
    agentManagerInstance = new AgentManager();
  }
  return agentManagerInstance;
}
