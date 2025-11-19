import { BaseTool } from './BaseTool';
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileOpsTool extends BaseTool {
  constructor() {
    super({
      name: 'file-ops',
      description: 'File operations (read, write, delete, list)',
      parameters: {
        operation: 'string (read|write|delete|list)',
        path: 'string',
        content: 'string (for write)',
      }
    });
  }

  async execute(params: {
    operation: 'read' | 'write' | 'delete' | 'list';
    path: string;
    content?: string;
  }): Promise<any> {
    const { operation, path: filePath, content } = params;

    try {
      switch (operation) {
        case 'read':
          const data = await fs.readFile(filePath, 'utf-8');
          return { success: true, content: data };

        case 'write':
          if (!content) {
            throw new Error('Content is required for write operation');
          }
          await fs.writeFile(filePath, content, 'utf-8');
          return { success: true, message: 'File written successfully' };

        case 'delete':
          await fs.unlink(filePath);
          return { success: true, message: 'File deleted successfully' };

        case 'list':
          const files = await fs.readdir(filePath);
          return { success: true, files };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
