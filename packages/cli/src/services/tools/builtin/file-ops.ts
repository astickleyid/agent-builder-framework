/**
 * File Operations Tool
 * Handles file system operations with security constraints
 */

import { Tool, ToolDefinition, ToolExecutionContext, ToolExecutionResult } from '../types';
import fs from 'fs-extra';
import path from 'path';

export class FileOpsTool implements Tool {
  definition: ToolDefinition = {
    name: 'file-ops',
    description: 'Perform file system operations (read, write, list)',
    category: 'system',
    parameters: [
      {
        name: 'operation',
        type: 'string',
        description: 'Operation to perform: read, write, list, delete, exists',
        required: true,
      },
      {
        name: 'path',
        type: 'string',
        description: 'File or directory path',
        required: true,
      },
      {
        name: 'content',
        type: 'string',
        description: 'Content to write (for write operation)',
        required: false,
      },
    ],
    requiresPermission: true,
    dangerLevel: 'medium',
  };

  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private readonly FORBIDDEN_PATHS = [
    '/etc/passwd',
    '/etc/shadow',
    '/etc/sudoers',
    '~/.ssh/id_rsa',
    '~/.ssh/id_ed25519',
  ];

  async execute(
    params: Record<string, any>,
    context?: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    try {
      const operation = params.operation?.toLowerCase();
      const filePath = params.path;

      if (!operation || !filePath) {
        return {
          success: false,
          error: 'Missing required parameters: operation and path',
        };
      }

      // Security check
      if (this.isForbiddenPath(filePath)) {
        return {
          success: false,
          error: 'Access denied: forbidden path',
        };
      }

      // Resolve path relative to working directory
      const resolvedPath = context?.workingDirectory
        ? path.resolve(context.workingDirectory, filePath)
        : path.resolve(filePath);

      let result: any;

      switch (operation) {
        case 'read':
          result = await this.readFile(resolvedPath);
          break;
        case 'write':
          result = await this.writeFile(resolvedPath, params.content || '');
          break;
        case 'list':
          result = await this.listDirectory(resolvedPath);
          break;
        case 'delete':
          result = await this.deleteFile(resolvedPath);
          break;
        case 'exists':
          result = await this.checkExists(resolvedPath);
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
          path: resolvedPath,
        },
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: error.message || 'File operation failed',
        executionTime,
      };
    }
  }

  private async readFile(filePath: string): Promise<any> {
    const stats = await fs.stat(filePath);

    if (stats.size > this.MAX_FILE_SIZE) {
      throw new Error('File too large to read');
    }

    const content = await fs.readFile(filePath, 'utf-8');
    return {
      content,
      size: stats.size,
      modified: stats.mtime,
    };
  }

  private async writeFile(filePath: string, content: string): Promise<any> {
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeFile(filePath, content, 'utf-8');

    return {
      message: 'File written successfully',
      path: filePath,
      size: Buffer.byteLength(content, 'utf-8'),
    };
  }

  private async listDirectory(dirPath: string): Promise<any> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    const files = await Promise.all(
      entries.map(async (entry) => {
        const fullPath = path.join(dirPath, entry.name);
        const stats = await fs.stat(fullPath);

        return {
          name: entry.name,
          type: entry.isDirectory() ? 'directory' : 'file',
          size: stats.size,
          modified: stats.mtime,
        };
      })
    );

    return {
      path: dirPath,
      entries: files,
      count: files.length,
    };
  }

  private async deleteFile(filePath: string): Promise<any> {
    await fs.remove(filePath);

    return {
      message: 'File deleted successfully',
      path: filePath,
    };
  }

  private async checkExists(filePath: string): Promise<any> {
    const exists = await fs.pathExists(filePath);

    return {
      exists,
      path: filePath,
    };
  }

  private isForbiddenPath(filePath: string): boolean {
    return this.FORBIDDEN_PATHS.some((forbidden) =>
      filePath.includes(forbidden)
    );
  }
}
