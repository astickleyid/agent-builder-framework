/**
 * Tool Registry
 * Manages registration and discovery of tools
 */

import { Tool, ToolDefinition, ToolRegistry as IToolRegistry } from './types';

export class ToolRegistryImpl implements IToolRegistry {
  private tools: Map<string, Tool> = new Map();

  register(tool: Tool): void {
    if (this.tools.has(tool.definition.name)) {
      throw new Error(`Tool "${tool.definition.name}" is already registered`);
    }
    this.tools.set(tool.definition.name, tool);
  }

  unregister(name: string): void {
    this.tools.delete(name);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  list(): ToolDefinition[] {
    return Array.from(this.tools.values()).map((tool) => tool.definition);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  clear(): void {
    this.tools.clear();
  }
}

// Singleton instance
let registryInstance: ToolRegistryImpl | null = null;

export function getToolRegistry(): ToolRegistryImpl {
  if (!registryInstance) {
    registryInstance = new ToolRegistryImpl();
  }
  return registryInstance;
}
