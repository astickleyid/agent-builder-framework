"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicTool = void 0;
const BaseTool_1 = require("./BaseTool");
const axios_1 = __importDefault(require("axios"));
class AnthropicTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'anthropic',
            description: 'Interact with Anthropic Claude API',
            parameters: {
                operation: 'string (chat|completion)',
                apiKey: 'string (Anthropic API key)',
                model: 'string (claude-3-opus, claude-3-sonnet, claude-2)',
                messages: 'array (for chat)',
                prompt: 'string (for completion)',
                temperature: 'number (0-1, optional)',
                maxTokens: 'number (optional)'
            }
        });
    }
    async execute(params) {
        const { operation, apiKey, model = 'claude-3-sonnet-20240229', messages, prompt, temperature = 0.7, maxTokens = 1000, system } = params;
        try {
            const headers = {
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            };
            switch (operation) {
                case 'chat':
                    if (!messages || messages.length === 0) {
                        throw new Error('messages required for chat operation');
                    }
                    const chatResponse = await axios_1.default.post('https://api.anthropic.com/v1/messages', {
                        model,
                        messages,
                        max_tokens: maxTokens,
                        temperature,
                        ...(system && { system })
                    }, { headers });
                    return {
                        success: true,
                        response: chatResponse.data.content[0].text,
                        usage: chatResponse.data.usage,
                        model: chatResponse.data.model,
                        stopReason: chatResponse.data.stop_reason
                    };
                case 'completion':
                    if (!prompt) {
                        throw new Error('prompt required for completion operation');
                    }
                    // Convert to messages format (Claude uses messages API)
                    const completionMessages = [
                        { role: 'user', content: prompt }
                    ];
                    const completionResponse = await axios_1.default.post('https://api.anthropic.com/v1/messages', {
                        model,
                        messages: completionMessages,
                        max_tokens: maxTokens,
                        temperature,
                        ...(system && { system })
                    }, { headers });
                    return {
                        success: true,
                        response: completionResponse.data.content[0].text,
                        usage: completionResponse.data.usage
                    };
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.response?.status,
                details: error.response?.data
            };
        }
    }
}
exports.AnthropicTool = AnthropicTool;
//# sourceMappingURL=AnthropicTool.js.map