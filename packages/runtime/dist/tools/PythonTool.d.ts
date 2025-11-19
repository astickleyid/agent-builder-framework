import { BaseTool } from './BaseTool';
export declare class PythonTool extends BaseTool {
    constructor();
    execute(params: {
        code: string;
        timeout?: number;
        packages?: string[];
    }): Promise<any>;
}
//# sourceMappingURL=PythonTool.d.ts.map