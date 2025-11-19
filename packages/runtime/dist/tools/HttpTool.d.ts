import { BaseTool } from './BaseTool';
export declare class HttpTool extends BaseTool {
    constructor();
    execute(params: {
        url: string;
        method?: string;
        headers?: Record<string, string>;
        data?: any;
    }): Promise<any>;
}
//# sourceMappingURL=HttpTool.d.ts.map