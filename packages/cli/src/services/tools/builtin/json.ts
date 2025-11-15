/**
 * JSON Tool
 * Parse and manipulate JSON data
 */

import { Tool, ToolDefinition, ToolExecutionContext, ToolExecutionResult } from '../types';

export class JsonTool implements Tool {
  definition: ToolDefinition = {
    name: 'json',
    description: 'Parse, validate, and manipulate JSON data',
    category: 'data',
    parameters: [
      {
        name: 'operation',
        type: 'string',
        description: 'Operation: parse, stringify, query, validate',
        required: true,
      },
      {
        name: 'data',
        type: 'string',
        description: 'JSON string or object',
        required: true,
      },
      {
        name: 'path',
        type: 'string',
        description: 'JSON path for query operation (e.g., "user.name")',
        required: false,
      },
    ],
    requiresPermission: false,
    dangerLevel: 'safe',
  };

  async execute(
    params: Record<string, any>,
    context?: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    try {
      const operation = params.operation?.toLowerCase();
      const data = params.data;

      if (!operation || data === undefined) {
        return {
          success: false,
          error: 'Missing required parameters: operation and data',
        };
      }

      let result: any;

      switch (operation) {
        case 'parse':
          result = this.parse(data);
          break;
        case 'stringify':
          result = this.stringify(data);
          break;
        case 'query':
          result = this.query(data, params.path);
          break;
        case 'validate':
          result = this.validate(data);
          break;
        default:
          return {
            success: false,
            error: `Unknown operation: ${operation}`,
          };
      }

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        output: result,
        executionTime,
        metadata: {
          operation,
        },
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: error.message || 'JSON operation failed',
        executionTime,
      };
    }
  }

  private parse(data: string): any {
    try {
      const parsed = JSON.parse(data);
      return {
        result: parsed,
        type: typeof parsed,
        valid: true,
      };
    } catch (error: any) {
      return {
        result: null,
        valid: false,
        error: error.message,
      };
    }
  }

  private stringify(data: any): any {
    try {
      const stringified = JSON.stringify(data, null, 2);
      return {
        result: stringified,
        size: Buffer.byteLength(stringified, 'utf-8'),
      };
    } catch (error: any) {
      throw new Error(`Failed to stringify: ${error.message}`);
    }
  }

  private query(data: any, path?: string): any {
    if (!path) {
      throw new Error('Path is required for query operation');
    }

    try {
      // Parse if string
      const obj = typeof data === 'string' ? JSON.parse(data) : data;

      // Simple path traversal (e.g., "user.name.first")
      const parts = path.split('.');
      let current = obj;

      for (const part of parts) {
        if (current === null || current === undefined) {
          return {
            result: null,
            found: false,
          };
        }
        current = current[part];
      }

      return {
        result: current,
        found: current !== undefined,
        path,
      };
    } catch (error: any) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }

  private validate(data: string): any {
    try {
      JSON.parse(data);
      return {
        valid: true,
        message: 'Valid JSON',
      };
    } catch (error: any) {
      return {
        valid: false,
        message: 'Invalid JSON',
        error: error.message,
      };
    }
  }
}
