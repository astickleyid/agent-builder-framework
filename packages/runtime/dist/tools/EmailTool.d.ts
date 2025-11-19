import { BaseTool } from './BaseTool';
export declare class EmailTool extends BaseTool {
    constructor();
    execute(params: {
        to: string | string[];
        subject: string;
        body: string;
        html?: boolean;
        cc?: string | string[];
        bcc?: string | string[];
        attachments?: string[];
    }): Promise<any>;
}
//# sourceMappingURL=EmailTool.d.ts.map