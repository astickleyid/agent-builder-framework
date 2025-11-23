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

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

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
    // Basic response generation
    return `[${this.config.name}] Processing: ${input}`;
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
