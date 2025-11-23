"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPToolWrapper = void 0;
const BaseTool_1 = require("../tools/BaseTool");
/**
 * Wrapper to make MCP tools work like native tools
 */
class MCPToolWrapper extends BaseTool_1.BaseTool {
    mcpClient;
    toolInfo;
    constructor(mcpClient, toolInfo) {
        super({
            name: toolInfo.name,
            description: toolInfo.description,
            parameters: toolInfo.inputSchema
        });
        this.mcpClient = mcpClient;
        this.toolInfo = toolInfo;
    }
    async execute(params) {
        try {
            const result = await this.mcpClient.executeTool(this.toolInfo.name, params);
            if (!result.success) {
                return {
                    success: false,
                    error: result.error
                };
            }
            // Format the content based on type
            let formattedContent = result.content;
            if (Array.isArray(result.content)) {
                formattedContent = result.content
                    .map((item) => {
                    if (item.type === 'text') {
                        return item.text;
                    }
                    else if (item.type === 'image') {
                        return `[Image: ${item.mimeType}]`;
                    }
                    else if (item.type === 'resource') {
                        return `[Resource: ${item.uri}]`;
                    }
                    return JSON.stringify(item);
                })
                    .join('\n');
            }
            return {
                success: true,
                result: formattedContent,
                isError: result.isError
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
exports.MCPToolWrapper = MCPToolWrapper;
//# sourceMappingURL=MCPTool.js.map