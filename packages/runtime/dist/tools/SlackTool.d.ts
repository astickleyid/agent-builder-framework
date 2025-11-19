import { BaseTool } from './BaseTool';
export declare class SlackTool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'send-message' | 'list-channels' | 'get-user';
        token: string;
        channel?: string;
        text?: string;
        attachments?: any[];
    }): Promise<any>;
}
//# sourceMappingURL=SlackTool.d.ts.map