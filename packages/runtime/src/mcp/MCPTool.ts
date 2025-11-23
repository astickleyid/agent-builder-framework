import { BaseTool } from '../tools/BaseTool';
import { MCPClient, MCPTool as MCPToolInfo } from './MCPClient';

/**
 * Wrapper to make MCP tools work like native tools
 */
export class MCPToolWrapper extends BaseTool {
  private mcpClient: MCPClient;
  private toolInfo: MCPToolInfo;

  constructor(mcpClient: MCPClient, toolInfo: MCPToolInfo) {
    super({
      name: toolInfo.name,
      description: toolInfo.description,
      parameters: toolInfo.inputSchema
    });
    this.mcpClient = mcpClient;
    this.toolInfo = toolInfo;
  }

  async execute(params: any): Promise<any> {
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
          .map((item: any) => {
            if (item.type === 'text') {
              return item.text;
            } else if (item.type === 'image') {
              return `[Image: ${item.mimeType}]`;
            } else if (item.type === 'resource') {
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
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}
