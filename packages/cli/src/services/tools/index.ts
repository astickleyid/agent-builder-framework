/**
 * Tools System
 * Main entry point for tool system
 */

export * from './types';
export * from './registry';
export * from './builtin';

import { getToolRegistry } from './registry';
import { BashTool, FileOpsTool, HttpTool, JsonTool } from './builtin';

/**
 * Initialize and register all built-in tools
 */
export function initializeBuiltinTools(): void {
  const registry = getToolRegistry();

  // Register built-in tools
  registry.register(new BashTool());
  registry.register(new FileOpsTool());
  registry.register(new HttpTool());
  registry.register(new JsonTool());
}

/**
 * Get a tool by name
 */
export function getTool(name: string) {
  return getToolRegistry().get(name);
}

/**
 * List all available tools
 */
export function listTools() {
  return getToolRegistry().list();
}
