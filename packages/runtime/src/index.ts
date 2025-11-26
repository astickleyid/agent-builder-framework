export { Agent, AgentConfig, Message } from './agent/Agent';
export { IntelligentAgent, LLMConfig } from './agent/IntelligentAgent';
export { AgentOrchestrator, WorkflowResult } from './orchestration/AgentOrchestrator';
export * from './tools';
export * from './mcp';
export * from './memory';
export * from './deployment';
export * from './security';

// Alias: Stick Agent = Intelligent Agent
export { IntelligentAgent as StickAgent } from './agent/IntelligentAgent';

// Version info
export const VERSION = '1.1.0';

// Easy agent creation
export async function createAgent(config: any) {
  const { Agent } = await import('./agent/Agent');
  return new Agent(config);
}

// Create intelligent agent with LLM (Stick Agent)
export async function createIntelligentAgent(config: any, llmConfig: any) {
  const { IntelligentAgent } = await import('./agent/IntelligentAgent');
  return new IntelligentAgent(config, llmConfig);
}

// Alias for creating Stick Agent
export async function createStickAgent(config: any, llmConfig: any) {
  return createIntelligentAgent(config, llmConfig);
}
