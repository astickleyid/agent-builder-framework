export interface MCPServerConfig {
    name: string;
    command: string;
    args?: string[];
    env?: Record<string, string>;
    transport?: 'stdio' | 'http';
    url?: string;
}
export interface MCPTool {
    name: string;
    description: string;
    inputSchema: any;
    server: string;
}
export declare class MCPClient {
    private clients;
    private processes;
    private tools;
    private connected;
    /**
     * Connect to an MCP server
     */
    connect(config: MCPServerConfig): Promise<void>;
    /**
     * Discover tools from an MCP server
     */
    private discoverTools;
    /**
     * Execute a tool from an MCP server
     */
    executeTool(toolName: string, parameters: any): Promise<any>;
    /**
     * Get all available tools from all connected servers
     */
    getTools(): MCPTool[];
    /**
     * Get a specific tool
     */
    getTool(name: string): MCPTool | undefined;
    /**
     * Check if a server is connected
     */
    isConnected(serverName: string): boolean;
    /**
     * Disconnect from a server
     */
    disconnect(serverName: string): Promise<void>;
    /**
     * Disconnect from all servers
     */
    disconnectAll(): Promise<void>;
    /**
     * Get list of connected servers
     */
    getConnectedServers(): string[];
}
//# sourceMappingURL=MCPClient.d.ts.map