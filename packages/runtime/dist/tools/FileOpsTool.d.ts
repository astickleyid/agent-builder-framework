import { BaseTool } from './BaseTool';
export declare class FileOpsTool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'read' | 'write' | 'delete' | 'list';
        path: string;
        content?: string;
    }): Promise<any>;
}
//# sourceMappingURL=FileOpsTool.d.ts.map