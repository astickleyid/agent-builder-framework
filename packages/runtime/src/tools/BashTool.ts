import { BaseTool } from './BaseTool';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class BashTool extends BaseTool {
  constructor() {
    super({
      name: 'bash',
      description: 'Execute bash commands in a sandboxed environment',
      parameters: {
        command: 'string',
        timeout: 'number (optional, default: 30000ms)'
      }
    });
  }

  async execute(params: { command: string; timeout?: number }): Promise<any> {
    const { command, timeout = 30000 } = params;

    try {
      const { stdout, stderr } = await execAsync(command, {
        timeout,
        maxBuffer: 1024 * 1024 // 1MB
      });

      return {
        success: true,
        stdout,
        stderr,
        command
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        command
      };
    }
  }
}
