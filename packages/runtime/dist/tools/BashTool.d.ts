import { BaseTool } from './BaseTool';
export declare class BashTool extends BaseTool {
    constructor();
    execute(params: {
        command: string;
        timeout?: number;
    }): Promise<any>;
}
//# sourceMappingURL=BashTool.d.ts.map