/**
 * MemoraForge API client for the Visual Builder
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8300';
const MEMORY_BASE = import.meta.env.VITE_MEMORY_BASE ?? 'http://localhost:8200';
const MCP_BASE = import.meta.env.VITE_MCP_BASE ?? 'http://localhost:8100';
const LLM_BASE = import.meta.env.VITE_LLM_BASE ?? 'http://localhost:8000';

async function rpc<T>(method: string, params: Record<string, unknown> = {}): Promise<T> {
  const resp = await fetch(`${API_BASE}/rpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params,
      id: crypto.randomUUID().slice(0, 8),
    }),
  });
  const data = await resp.json();
  if (data.error) throw new Error(data.error.message);
  return data.result as T;
}

export const api = {
  // ── Agents ──
  registerAgent: (agentId: string, name: string, capabilities: string[] = []) =>
    rpc('agent.register', { agent_id: agentId, agent_name: name, capabilities }),

  listAgents: async () => {
    const resp = await fetch(`${API_BASE}/agents`);
    return resp.json();
  },

  // ── Memory ──
  clawMemory: (query: string, topK = 20) =>
    rpc('memory.claw', { query, top_k: topK }),

  storeMemory: (content: string, memoryType = 'fact') =>
    rpc('memory.store', { content, memory_type: memoryType }),

  getMemoryStats: async () => {
    const resp = await fetch(`${MEMORY_BASE}/stats`);
    return resp.json();
  },

  // ── Health ──
  checkHealth: async (): Promise<Record<string, unknown>[]> => {
    const services = [
      { name: 'API Server', url: `${LLM_BASE}/health` },
      { name: 'MCP Server', url: `${MCP_BASE}/health` },
      { name: 'Memory Hub', url: `${MEMORY_BASE}/health` },
      { name: 'ACP Handler', url: `${API_BASE}/health` },
    ];

    return Promise.all(
      services.map(async (svc) => {
        const start = performance.now();
        try {
          const resp = await fetch(svc.url, { signal: AbortSignal.timeout(5000) });
          const data = await resp.json();
          return {
            service: svc.name,
            status: data.status === 'healthy' ? 'healthy' : 'degraded',
            latencyMs: Math.round(performance.now() - start),
            details: data,
          };
        } catch {
          return {
            service: svc.name,
            status: 'down',
            latencyMs: Math.round(performance.now() - start),
            details: {},
          };
        }
      }),
    );
  },

  // ── Orchestration ──
  dispatch: (task: string, agentIds: string[] = [], strategy = 'parallel') =>
    rpc('orchestrator.dispatch', { task, agent_ids: agentIds, strategy }),
};
