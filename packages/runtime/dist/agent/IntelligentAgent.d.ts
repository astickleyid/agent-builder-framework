import { Agent, AgentConfig } from './Agent';
export interface LLMConfig {
    provider: 'openai' | 'anthropic' | 'ollama';
    apiKey?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    host?: string;
}
export declare class IntelligentAgent extends Agent {
    private llmConfig;
    private systemPrompt;
    private mcpClient;
    constructor(config: AgentConfig, llmConfig: LLMConfig);
    private initializeMCP;
    private buildSystemPrompt;
    run(input: string): Promise<string>;
    private callLLM;
    private parseToolCall;
    private executeTool;
    getLLMConfig(): LLMConfig;
    updateLLMConfig(config: Partial<LLMConfig>): void;
}
//# sourceMappingURL=IntelligentAgent.d.ts.map