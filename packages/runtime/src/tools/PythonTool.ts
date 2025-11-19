import { BaseTool } from './BaseTool';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

export class PythonTool extends BaseTool {
  constructor() {
    super({
      name: 'python',
      description: 'Execute Python code safely',
      parameters: {
        code: 'string - Python code to execute',
        timeout: 'number (optional, default: 30000ms)',
        packages: 'string[] (optional) - Required pip packages'
      }
    });
  }

  async execute(params: {
    code: string;
    timeout?: number;
    packages?: string[];
  }): Promise<any> {
    const { code, timeout = 30000, packages = [] } = params;

    try {
      // Create temporary file for Python code
      const tmpDir = os.tmpdir();
      const tmpFile = path.join(tmpDir, `stick_ai_${Date.now()}.py`);
      
      await fs.writeFile(tmpFile, code);

      // Install packages if needed
      if (packages.length > 0) {
        const installCmd = `pip install ${packages.join(' ')}`;
        await execAsync(installCmd, { timeout: 60000 });
      }

      // Execute Python code
      const { stdout, stderr } = await execAsync(`python3 ${tmpFile}`, {
        timeout,
        maxBuffer: 5 * 1024 * 1024 // 5MB
      });

      // Clean up
      await fs.unlink(tmpFile).catch(() => {});

      return {
        success: true,
        stdout,
        stderr,
        code
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        code
      };
    }
  }
}
