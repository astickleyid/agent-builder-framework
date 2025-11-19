"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlackTool = void 0;
const BaseTool_1 = require("./BaseTool");
const axios_1 = __importDefault(require("axios"));
class SlackTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'slack',
            description: 'Send messages and interact with Slack',
            parameters: {
                operation: 'string (send-message|list-channels|get-user)',
                token: 'string (Slack bot token)',
                channel: 'string (for send-message)',
                text: 'string (message text)',
                attachments: 'array (optional)'
            }
        });
    }
    async execute(params) {
        const { operation, token, channel, text, attachments } = params;
        try {
            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
            switch (operation) {
                case 'send-message':
                    if (!channel || !text) {
                        throw new Error('channel and text required for send-message');
                    }
                    const response = await axios_1.default.post('https://slack.com/api/chat.postMessage', {
                        channel,
                        text,
                        attachments
                    }, { headers });
                    if (!response.data.ok) {
                        throw new Error(response.data.error || 'Slack API error');
                    }
                    return {
                        success: true,
                        channel,
                        timestamp: response.data.ts,
                        message: 'Message sent successfully'
                    };
                case 'list-channels':
                    const channelsResponse = await axios_1.default.get('https://slack.com/api/conversations.list', { headers });
                    return {
                        success: true,
                        channels: channelsResponse.data.channels?.map((ch) => ({
                            id: ch.id,
                            name: ch.name,
                            members: ch.num_members
                        })) || []
                    };
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}
exports.SlackTool = SlackTool;
//# sourceMappingURL=SlackTool.js.map