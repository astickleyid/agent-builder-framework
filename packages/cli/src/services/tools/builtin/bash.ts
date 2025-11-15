/**
 * Bash Tool
 * Executes shell commands with security constraints
 */

import { Tool, ToolDefinition, ToolExecutionContext, ToolExecutionResult } from '../types';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class BashTool implements Tool {
  definition: ToolDefinition = {
    name: 'bash',
    description: 'Execute bash commands in a sandboxed environment',
    category: 'system',
    parameters: [
      {
        name: 'command',
        type: 'string',
        description: 'The bash command to execute',
        required: true,
      },
      {
        name: 'args',
        type: 'array',
        description: 'Optional command arguments',
        required: false,
        default: [],
      },
    ],
    requiresPermission: true,
    dangerLevel: 'high',
  };

  private readonly DANGEROUS_COMMANDS = [
    'rm -rf /',
    'mkfs',
    'dd if=/dev/zero',
    ':(){:|:&};:',  // Fork bomb
    'chmod -R 777 /',
    'chown -R',
  ];

  private readonly DEFAULT_TIMEOUT = 30000; // 30 seconds
  private readonly MAX_OUTPUT_SIZE = 1024 * 1024; // 1MB

  async execute(
    params: Record<string, any>,
    context?: ToolExecutionContext
  ): Promise<ToolExecutionResult> {
    const startTime = Date.now();

    try {
      // Validate parameters
      if (!params.command || typeof params.command !== 'string') {
        return {
          success: false,
          error: 'Invalid command parameter',
        };
      }

      const command = params.command.trim();
      const args = params.args || [];

      // Security checks
      if (this.isDangerousCommand(command)) {
        return {
          success: false,
          error: 'Command blocked: potentially dangerous operation detected',
        };
      }

      // Build full command
      const fullCommand = args.length > 0 ? `${command} ${args.join(' ')}` : command;

      // Execute with timeout and working directory
      const options = {
        timeout: context?.timeout || this.DEFAULT_TIMEOUT,
        cwd: context?.workingDirectory || process.cwd(),
        env: { ...process.env, ...context?.environment },
        maxBuffer: context?.maxOutputSize || this.MAX_OUTPUT_SIZE,
      };

      const { stdout, stderr } = await execAsync(fullCommand, options);

      const executionTime = Date.now() - startTime;

      return {
        success: true,
        output: {
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        },
        executionTime,
        metadata: {
          command: fullCommand,
          exitCode: 0,
        },
      };
    } catch (error: any) {
      const executionTime = Date.now() - startTime;

      return {
        success: false,
        error: error.message || 'Command execution failed',
        executionTime,
        metadata: {
          command: params.command,
          exitCode: error.code || 1,
        },
      };
    }
  }

  private isDangerousCommand(command: string): boolean {
    const lowerCommand = command.toLowerCase();
    return this.DANGEROUS_COMMANDS.some((dangerous) =>
      lowerCommand.includes(dangerous.toLowerCase())
    );
  }
}
