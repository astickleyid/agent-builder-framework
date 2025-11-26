export { Agent, AgentConfig, Message } from './agent/Agent';
export { IntelligentAgent, LLMConfig } from './agent/IntelligentAgent';
export { AgentOrchestrator, WorkflowResult } from './orchestration/AgentOrchestrator';
export * from './tools';
export * from './mcp';
export * from './memory';
export * from './deployment';
export * from './security';
export { IntelligentAgent as StickAgent } from './agent/IntelligentAgent';
export declare const VERSION = "1.1.0";
export declare function createAgent(config: any): Promise<import("./agent/Agent").Agent>;
export declare function createIntelligentAgent(config: any, llmConfig: any): Promise<import("./agent/IntelligentAgent").IntelligentAgent>;
export declare function createStickAgent(config: any, llmConfig: any): Promise<import("./agent/IntelligentAgent").IntelligentAgent>;
//# sourceMappingURL=index.d.ts.map