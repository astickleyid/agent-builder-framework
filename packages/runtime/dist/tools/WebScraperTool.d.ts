import { BaseTool } from './BaseTool';
export declare class WebScraperTool extends BaseTool {
    constructor();
    execute(params: {
        url: string;
        selector?: string;
        timeout?: number;
        headers?: Record<string, string>;
    }): Promise<any>;
}
//# sourceMappingURL=WebScraperTool.d.ts.map