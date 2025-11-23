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
export declare class Sandbox {
    private config;
    constructor(config?: SandboxConfig);
    /**
     * Execute command in sandbox
     */
    executeCommand(command: string, args?: string[]): Promise<SandboxResult>;
    /**
     * Validate URL is in allowed domains
     */
    validateURL(url: string): boolean;
    /**
     * Sanitize input to prevent injection
     */
    sanitizeInput(input: string): string;
    /**
     * Check if path is safe (no directory traversal)
     */
    validatePath(filePath: string, baseDir: string): boolean;
}
//# sourceMappingURL=Sandbox.d.ts.map