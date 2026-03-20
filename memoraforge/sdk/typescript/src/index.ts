/**
 * MemoraForge TypeScript SDK
 *
 * Usage:
 *   import { MemoraForge } from '@memoraforge/sdk';
 *   const mf = new MemoraForge({ apiKey: 'mf_...' });
 *   const agent = await mf.createAgent('my-agent');
 *   const memories = await agent.claw('quantum computing');
 */

export interface MemoraForgeConfig {
  apiKey?: string;
  baseUrl?: string;
  memoryHubUrl?: string;
  mcpUrl?: string;
  apiServerUrl?: string;
}

export interface AgentConfig {
  name: string;
  model?: string;
  capabilities?: string[];
}

export interface ClawOptions {
  topK?: number;
  includeGraph?: boolean;
  maxTokens?: number;
  minRelevance?: number;
}

export interface StoreOptions {
  memoryType?: string;
  metadata?: Record<string, unknown>;
  relations?: Array<{ source: string; target: string; type: string }>;
  ttlHours?: number;
}

export interface Memory {
  memoryId: string;
  content: string;
  relevanceScore: number;
  source: string;
  tokenCount: number;
  metadata: Record<string, unknown>;
}

export interface JsonRpcResponse<T = unknown> {
  jsonrpc: '2.0';
  result?: T;
  error?: { code: number; message: string; data?: unknown };
  id: string | number | null;
}

export class MemoraForgeError extends Error {
  constructor(
    message: string,
    public code: number = -1,
  ) {
    super(message);
    this.name = 'MemoraForgeError';
  }
}

export class MemoraForge {
  private baseUrl: string;
  private memoryHubUrl: string;
  private mcpUrl: string;
  private apiServerUrl: string;
  private headers: Record<string, string>;

  constructor(config: MemoraForgeConfig = {}) {
    this.baseUrl = config.baseUrl ?? 'http://localhost:8300';
    this.memoryHubUrl = config.memoryHubUrl ?? 'http://localhost:8200';
    this.mcpUrl = config.mcpUrl ?? 'http://localhost:8100';
    this.apiServerUrl = config.apiServerUrl ?? 'http://localhost:8000';
    this.headers = {
      'Content-Type': 'application/json',
      ...(config.apiKey ? { 'X-API-Key': config.apiKey } : {}),
    };
  }

  async createAgent(config: AgentConfig): Promise<AgentClient> {
    const agentId = `agent_${crypto.randomUUID().slice(0, 8)}`;

    const result = await this.rpc<{
      agent_id: string;
      session_token: string;
      assigned_stream_id: string;
    }>('agent.register', {
      agent_id: agentId,
      agent_name: config.name,
      capabilities: config.capabilities ?? ['memory_claw', 'memory_store'],
      max_context_tokens: 128_000,
    });

    return new AgentClient(
      agentId,
      config.name,
      config.model ?? 'llama3.1:8b',
      result.session_token,
      result.assigned_stream_id,
      this,
    );
  }

  async listAgents(): Promise<Array<Record<string, unknown>>> {
    const resp = await fetch(`${this.baseUrl}/agents`, { headers: this.headers });
    const data = await resp.json();
    return data.agents ?? [];
  }

  async rpc<T>(method: string, params: Record<string, unknown>): Promise<T> {
    const resp = await fetch(`${this.baseUrl}/rpc`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: crypto.randomUUID().slice(0, 8),
      }),
    });

    const data: JsonRpcResponse<T> = await resp.json();

    if (data.error) {
      throw new MemoraForgeError(data.error.message, data.error.code);
    }

    return data.result as T;
  }
}

export class AgentClient {
  constructor(
    public readonly agentId: string,
    public readonly name: string,
    public readonly model: string,
    private sessionToken: string,
    public readonly streamId: string,
    private platform: MemoraForge,
  ) {}

  async claw(query: string, options: ClawOptions = {}): Promise<Memory[]> {
    const result = await this.platform.rpc<{ memories: Memory[] }>('memory.claw', {
      query,
      top_k: options.topK ?? 50,
      include_graph: options.includeGraph ?? true,
      max_tokens: options.maxTokens ?? 50_000,
      min_relevance: options.minRelevance ?? 0.3,
    });
    return result.memories;
  }

  async store(content: string, options: StoreOptions = {}): Promise<string> {
    const result = await this.platform.rpc<{ memory_id: string }>('memory.store', {
      content,
      memory_type: options.memoryType ?? 'fact',
      metadata: options.metadata ?? {},
      relations: options.relations ?? [],
      ttl_hours: options.ttlHours ?? null,
    });
    return result.memory_id;
  }

  async invoke(
    targetAgentId: string,
    action: string,
    payload: Record<string, unknown> = {},
  ): Promise<Record<string, unknown>> {
    return this.platform.rpc('agent.invoke', {
      target_agent_id: targetAgentId,
      action,
      payload,
    });
  }

  async subscribeContext(streamName: string): Promise<Record<string, unknown>> {
    return this.platform.rpc('context.subscribe', {
      stream_name: streamName,
    });
  }
}
