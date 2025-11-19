import { BaseTool } from './BaseTool';
export declare class JsonTool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'parse' | 'stringify' | 'validate' | 'query';
        data: any;
        query?: string;
    }): Promise<any>;
    private queryJson;
}
//# sourceMappingURL=JsonTool.d.ts.map