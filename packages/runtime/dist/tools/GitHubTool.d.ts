import { BaseTool } from './BaseTool';
export declare class GitHubTool extends BaseTool {
    constructor();
    execute(params: {
        operation: string;
        owner?: string;
        repo?: string;
        token?: string;
        data?: any;
    }): Promise<any>;
}
//# sourceMappingURL=GitHubTool.d.ts.map