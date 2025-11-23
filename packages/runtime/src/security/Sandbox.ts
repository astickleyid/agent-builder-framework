import { spawn } from 'child_process';

export interface SandboxConfig {
  timeout?: number;
  memoryLimit?: number;
  allowedCommands?: string[];
  allowedDomains?: string[];
  env?: Record<string, string>;
}

export interface SandboxResult {
  success: boolean;
  output?: string;
  error?: string;
  exitCode?: number;
  timedOut?: boolean;
}

/**
 * Sandbox - Execute code/commands in restricted environment
 */
export class Sandbox {
  private config: SandboxConfig;

  constructor(config: SandboxConfig = {}) {
    this.config = {
      timeout: 30000, // 30 seconds default
      memoryLimit: 512, // 512MB default
      allowedCommands: [],
      allowedDomains: [],
      ...config
    };
  }

  /**
   * Execute command in sandbox
   */
  async executeCommand(command: string, args: string[] = []): Promise<SandboxResult> {
    // Check if command is allowed
    if (this.config.allowedCommands && this.config.allowedCommands.length > 0) {
      if (!this.config.allowedCommands.includes(command)) {
        return {
          success: false,
          error: `Command not allowed: ${command}`
        };
      }
    }

    return new Promise((resolve) => {
      let output = '';
      let error = '';
      let timedOut = false;

      const child = spawn(command, args, {
        env: {
          ...process.env,
          ...this.config.env,
          // Limit resources
          NODE_OPTIONS: `--max-old-space-size=${this.config.memoryLimit}`
        },
        timeout: this.config.timeout
      });

      // Set timeout
      const timeoutId = setTimeout(() => {
        timedOut = true;
        child.kill('SIGTERM');
        setTimeout(() => child.kill('SIGKILL'), 5000); // Force kill after 5s
      }, this.config.timeout);

      child.stdout?.on('data', (data) => {
        output += data.toString();
      });

      child.stderr?.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        clearTimeout(timeoutId);
        
        if (timedOut) {
          resolve({
            success: false,
            error: 'Command timed out',
            timedOut: true
          });
        } else if (code === 0) {
          resolve({
            success: true,
            output: output.trim(),
            exitCode: code
          });
        } else {
          resolve({
            success: false,
            error: error.trim() || output.trim(),
            exitCode: code || undefined
          });
        }
      });

      child.on('error', (err) => {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          error: err.message
        });
      });
    });
  }

  /**
   * Validate URL is in allowed domains
   */
  validateURL(url: string): boolean {
    if (!this.config.allowedDomains || this.config.allowedDomains.length === 0) {
      return true; // No restrictions
    }

    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      return this.config.allowedDomains.some(domain => {
        // Allow exact match or subdomain
        return hostname === domain || hostname.endsWith(`.${domain}`);
      });
    } catch (error) {
      return false; // Invalid URL
    }
  }

  /**
   * Sanitize input to prevent injection
   */
  sanitizeInput(input: string): string {
    // Remove potentially dangerous characters
    return input
      .replace(/[;&|`$()]/g, '')
      .replace(/\.\.\//g, '')
      .trim();
  }

  /**
   * Check if path is safe (no directory traversal)
   */
  validatePath(filePath: string, baseDir: string): boolean {
    const path = require('path');
    const resolvedPath = path.resolve(baseDir, filePath);
    const resolvedBase = path.resolve(baseDir);
    
    // Ensure path stays within base directory
    return resolvedPath.startsWith(resolvedBase);
  }
}
