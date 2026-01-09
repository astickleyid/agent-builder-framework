export interface MCPServerConfig {
  name: string;
  command: string;
  args?: string[];
  env?: Record<string, string>;
}

export interface AgentConfig {
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
  mcp?: {
    servers: MCPServerConfig[];
  };
}

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export class Agent {
  protected config: AgentConfig;
  protected conversationHistory: Message[] = [];
  protected toolRegistry: Map<string, any> = new Map();
  
  constructor(config: AgentConfig) {
    this.config = config;
    this.initialize();
  }

  private initialize() {
    console.log(`[Agent] Initializing ${this.config.name}...`);
    console.log(`[Agent] Tools: ${this.config.tools.join(', ')}`);
    console.log(`[Agent] Capabilities: ${this.config.capabilities.join(', ')}`);
  }

  public async run(input: string): Promise<string> {
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    this.conversationHistory.push(userMessage);

    const response = await this.processInput(input);

    const assistantMessage: Message = {
      role: 'assistant',
      content: response,
      timestamp: new Date()
    };

    this.conversationHistory.push(assistantMessage);

    return response;
  }

  private async processInput(input: string): Promise<string> {
    // Check if agent has LLM capabilities (extended by IntelligentAgent)
    // This base implementation provides a helpful response for non-intelligent agents

    const toolsAvailable = this.config.tools.length > 0
      ? `\n\nAvailable tools: ${this.config.tools.join(', ')}`
      : '';

    const capabilities = this.config.capabilities.length > 0
      ? `\n\nCapabilities: ${this.config.capabilities.join(', ')}`
      : '';

    return `Agent "${this.config.name}" received your request: "${input}"${toolsAvailable}${capabilities}\n\nNote: This is a base agent. For AI-powered responses, use IntelligentAgent with LLM configuration (OpenAI, Anthropic, or Ollama).`;
  }

  public registerTool(name: string, tool: any) {
    this.toolRegistry.set(name, tool);
    console.log(`[Agent] Registered tool: ${name}`);
  }

  public getHistory(): Message[] {
    return this.conversationHistory;
  }

  public getName(): string {
    return this.config.name;
  }

  public getConfig(): AgentConfig {
    return this.config;
  }
}
