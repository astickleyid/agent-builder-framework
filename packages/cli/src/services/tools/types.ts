/**
 * Tool System Types
 * Defines interfaces for the tool execution system
 */

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  description: string;
  required: boolean;
  default?: any;
}

export interface ToolDefinition {
  name: string;
  description: string;
  category: 'system' | 'web' | 'data' | 'ai' | 'communication' | 'development';
  parameters: ToolParameter[];
  requiresPermission?: boolean;
  dangerLevel?: 'safe' | 'low' | 'medium' | 'high';
}

export interface ToolExecutionContext {
  workingDirectory?: string;
  timeout?: number;
  environment?: Record<string, string>;
  maxOutputSize?: number;
}

export interface ToolExecutionResult {
  success: boolean;
  output?: any;
  error?: string;
  executionTime?: number;
  metadata?: Record<string, any>;
}

export interface Tool {
  definition: ToolDefinition;
  execute(params: Record<string, any>, context?: ToolExecutionContext): Promise<ToolExecutionResult>;
}

export interface ToolRegistry {
  register(tool: Tool): void;
  unregister(name: string): void;
  get(name: string): Tool | undefined;
  list(): ToolDefinition[];
  has(name: string): boolean;
}
