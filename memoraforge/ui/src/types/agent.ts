/**
 * MemoraForge Visual Builder — Type definitions
 */

export interface AgentNode {
  id: string;
  type: 'agent' | 'memory' | 'tool' | 'llm' | 'input' | 'output' | 'orchestrator';
  name: string;
  config: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface AgentEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type: 'data' | 'control' | 'memory';
}

export interface AgentFlow {
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  edges: AgentEdge[];
  createdAt: string;
  updatedAt: string;
}

export interface MemoryStats {
  totalMemories: number;
  totalTokens: number;
  totalChunks: number;
  typeBreakdown: Record<string, number>;
}

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  latencyMs: number;
  details: Record<string, unknown>;
}

export interface AgentStatus {
  agentId: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  connected: boolean;
  memoryCount: number;
  lastActivity: string;
}

export type NodeCategory = {
  label: string;
  color: string;
  nodes: {
    type: AgentNode['type'];
    label: string;
    description: string;
    defaultConfig: Record<string, unknown>;
  }[];
};

export const NODE_CATEGORIES: NodeCategory[] = [
  {
    label: 'Core',
    color: '#e94560',
    nodes: [
      {
        type: 'agent',
        label: 'Agent',
        description: 'An autonomous AI agent with memory and tools',
        defaultConfig: { model: 'llama3.1:8b', maxContextTokens: 128000 },
      },
      {
        type: 'orchestrator',
        label: 'Orchestrator',
        description: 'Coordinates multiple agents for complex tasks',
        defaultConfig: { strategy: 'parallel', timeoutMs: 60000 },
      },
    ],
  },
  {
    label: 'Memory',
    color: '#0f3460',
    nodes: [
      {
        type: 'memory',
        label: 'Memory Hub',
        description: 'Connect to the Memory Hub for persistent storage',
        defaultConfig: { topK: 50, includeGraph: true },
      },
    ],
  },
  {
    label: 'Tools',
    color: '#533483',
    nodes: [
      {
        type: 'tool',
        label: 'Tool',
        description: 'External tool (web search, code exec, API call)',
        defaultConfig: { toolType: 'web_search' },
      },
      {
        type: 'llm',
        label: 'LLM',
        description: 'Direct LLM inference endpoint',
        defaultConfig: { model: 'llama3.1:8b', temperature: 0.7 },
      },
    ],
  },
  {
    label: 'I/O',
    color: '#16213e',
    nodes: [
      {
        type: 'input',
        label: 'Input',
        description: 'User input / webhook / trigger',
        defaultConfig: { inputType: 'user_message' },
      },
      {
        type: 'output',
        label: 'Output',
        description: 'Response output / webhook / action',
        defaultConfig: { outputType: 'response' },
      },
    ],
  },
];
