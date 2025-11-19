import { BaseTool } from './BaseTool';
export declare class TextTool extends BaseTool {
    constructor();
    execute(params: {
        operation: string;
        text: string;
        search?: string;
        replacement?: string;
        delimiter?: string;
        caseType?: string;
    }): Promise<any>;
    private convertCase;
}
//# sourceMappingURL=TextTool.d.ts.map