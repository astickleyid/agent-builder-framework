export { Agent, AgentConfig, Message } from './agent/Agent';
export { IntelligentAgent, LLMConfig } from './agent/IntelligentAgent';
export * from './tools';
export declare const VERSION = "1.1.0";
export declare function createAgent(config: any): Promise<import("./agent/Agent").Agent>;
export declare function createIntelligentAgent(config: any, llmConfig: any): Promise<import("./agent/IntelligentAgent").IntelligentAgent>;
//# sourceMappingURL=index.d.ts.map