"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTool = void 0;
const BaseTool_1 = require("./BaseTool");
class EmailTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'email',
            description: 'Send emails via SMTP',
            parameters: {
                to: 'string | string[]',
                subject: 'string',
                body: 'string',
                html: 'boolean (optional, default: false)',
                cc: 'string | string[] (optional)',
                bcc: 'string | string[] (optional)',
                attachments: 'string[] (optional, file paths)'
            }
        });
    }
    async execute(params) {
        const { to, subject, body, html = false, cc, bcc, attachments = [] } = params;
        try {
            // Validate email addresses
            const recipients = Array.isArray(to) ? to : [to];
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            for (const email of recipients) {
                if (!emailRegex.test(email)) {
                    throw new Error(`Invalid email address: ${email}`);
                }
            }
            // In production, would use nodemailer or similar
            // For now, simulate email sending
            return {
                success: true,
                messageId: `<${Date.now()}@stick.ai>`,
                recipients: recipients.length,
                to: recipients,
                subject,
                bodyLength: body.length,
                attachments: attachments.length,
                message: 'Email sent successfully (simulated)'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}
exports.EmailTool = EmailTool;
//# sourceMappingURL=EmailTool.js.map