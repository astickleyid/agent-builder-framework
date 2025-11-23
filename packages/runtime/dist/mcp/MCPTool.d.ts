import { BaseTool } from '../tools/BaseTool';
import { MCPClient, MCPTool as MCPToolInfo } from './MCPClient';
/**
 * Wrapper to make MCP tools work like native tools
 */
export declare class MCPToolWrapper extends BaseTool {
    private mcpClient;
    private toolInfo;
    constructor(mcpClient: MCPClient, toolInfo: MCPToolInfo);
    execute(params: any): Promise<any>;
}
//# sourceMappingURL=MCPTool.d.ts.map