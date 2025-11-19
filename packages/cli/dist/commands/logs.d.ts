interface LogsOptions {
    agent?: string;
    tail?: boolean;
    lines?: number;
    follow?: boolean;
}
export declare function logsCommand(options?: LogsOptions): Promise<void>;
export {};
//# sourceMappingURL=logs.d.ts.map