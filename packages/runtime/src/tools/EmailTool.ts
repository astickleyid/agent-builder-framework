import { BaseTool } from './BaseTool';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

export class EmailTool extends BaseTool {
  private transporter: nodemailer.Transporter | null = null;

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

  private async initializeTransporter(smtpConfig?: any): Promise<nodemailer.Transporter> {
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

  async execute(params: {
    to: string | string[];
    subject: string;
    body: string;
    html?: boolean;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: string[];
    smtpConfig?: any;
  }): Promise<any> {
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
      const mailOptions: nodemailer.SendMailOptions = {
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        details: error.code || 'UNKNOWN_ERROR'
      };
    }
  }
}
