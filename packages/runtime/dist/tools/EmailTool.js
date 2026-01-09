"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTool = void 0;
const BaseTool_1 = require("./BaseTool");
const nodemailer = __importStar(require("nodemailer"));
class EmailTool extends BaseTool_1.BaseTool {
    transporter = null;
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
                attachments: 'string[] (optional, file paths)',
                smtpConfig: 'object (optional, SMTP configuration)'
            }
        });
    }
    async initializeTransporter(smtpConfig) {
        if (this.transporter) {
            return this.transporter;
        }
        // Use provided SMTP config or environment variables
        const config = smtpConfig || {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        };
        // Validate SMTP configuration
        if (!config.auth?.user || !config.auth?.pass) {
            throw new Error('SMTP credentials not configured. Set SMTP_USER and SMTP_PASS environment variables or provide smtpConfig.');
        }
        this.transporter = nodemailer.createTransport(config);
        // Verify connection
        await this.transporter.verify();
        return this.transporter;
    }
    async execute(params) {
        const { to, subject, body, html = false, cc, bcc, attachments = [], smtpConfig } = params;
        try {
            // Validate email addresses
            const recipients = Array.isArray(to) ? to : [to];
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            for (const email of recipients) {
                if (!emailRegex.test(email)) {
                    throw new Error(`Invalid email address: ${email}`);
                }
            }
            // Initialize transporter
            const transporter = await this.initializeTransporter(smtpConfig);
            // Prepare attachments
            const mailAttachments = attachments.map(filePath => ({
                filename: filePath.split('/').pop(),
                path: filePath
            }));
            // Send email
            const mailOptions = {
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to: Array.isArray(to) ? to.join(', ') : to,
                subject,
                ...(html ? { html: body } : { text: body }),
                ...(cc && { cc: Array.isArray(cc) ? cc.join(', ') : cc }),
                ...(bcc && { bcc: Array.isArray(bcc) ? bcc.join(', ') : bcc }),
                ...(mailAttachments.length > 0 && { attachments: mailAttachments })
            };
            const info = await transporter.sendMail(mailOptions);
            return {
                success: true,
                messageId: info.messageId,
                recipients: recipients.length,
                to: recipients,
                subject,
                bodyLength: body.length,
                attachments: attachments.length,
                message: 'Email sent successfully',
                response: info.response
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                details: error.code || 'UNKNOWN_ERROR'
            };
        }
    }
}
exports.EmailTool = EmailTool;
//# sourceMappingURL=EmailTool.js.map