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
export declare class Agent {
    protected config: AgentConfig;
    protected conversationHistory: Message[];
    protected toolRegistry: Map<string, any>;
    constructor(config: AgentConfig);
    private initialize;
    run(input: string): Promise<string>;
    private processInput;
    registerTool(name: string, tool: any): void;
    getHistory(): Message[];
    getName(): string;
    getConfig(): AgentConfig;
}
//# sourceMappingURL=Agent.d.ts.map