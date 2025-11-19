export interface ToolConfig {
    name: string;
    description: string;
    parameters?: Record<string, any>;
}
export declare abstract class BaseTool {
    protected config: ToolConfig;
    constructor(config: ToolConfig);
    abstract execute(params: any): Promise<any>;
    getName(): string;
    getDescription(): string;
    getConfig(): ToolConfig;
}
//# sourceMappingURL=BaseTool.d.ts.map