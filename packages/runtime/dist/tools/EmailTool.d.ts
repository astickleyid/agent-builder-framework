import { BaseTool } from './BaseTool';
export declare class EmailTool extends BaseTool {
    private transporter;
    constructor();
    private initializeTransporter;
    execute(params: {
        to: string | string[];
        subject: string;
        body: string;
        html?: boolean;
        cc?: string | string[];
        bcc?: string | string[];
        attachments?: string[];
        smtpConfig?: any;
    }): Promise<any>;
}
//# sourceMappingURL=EmailTool.d.ts.map