"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCPClient = void 0;
const index_js_1 = require("@modelcontextprotocol/sdk/client/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/client/stdio.js");
class MCPClient {
    clients = new Map();
    processes = new Map();
    tools = new Map();
    connected = new Set();
    /**
     * Connect to an MCP server
     */
    async connect(config) {
        try {
            console.log(`[MCP] Connecting to ${config.name}...`);
            if (config.transport === 'http') {
                throw new Error('HTTP transport not yet implemented');
            }
            // Create MCP client
            const client = new index_js_1.Client({
                name: 'stick-ai-agent',
                version: '1.0.0'
            }, {
                capabilities: {}
            });
            // Create stdio transport
            const transport = new stdio_js_1.StdioClientTransport({
                command: config.command,
                args: config.args || [],
                env: config.env
            });
            await client.connect(transport);
            this.clients.set(config.name, client);
            this.connected.add(config.name);
            // Discover tools from this server
            await this.discoverTools(config.name);
            console.log(`[MCP] ✓ Connected to ${config.name}`);
        }
        catch (error) {
            console.error(`[MCP] Failed to connect to ${config.name}:`, error.message);
            throw error;
        }
    }
    /**
     * Discover tools from an MCP server
     */
    async discoverTools(serverName) {
        const client = this.clients.get(serverName);
        if (!client) {
            throw new Error(`No client found for server: ${serverName}`);
        }
        try {
            const response = await client.listTools();
            if (response.tools) {
                for (const tool of response.tools) {
                    const mcpTool = {
                        name: `${serverName}/${tool.name}`,
                        description: tool.description || '',
                        inputSchema: tool.inputSchema,
                        server: serverName
                    };
                    this.tools.set(mcpTool.name, mcpTool);
                    console.log(`[MCP] Discovered tool: ${mcpTool.name}`);
                }
            }
        }
        catch (error) {
            console.error(`[MCP] Failed to discover tools from ${serverName}:`, error.message);
        }
    }
    /**
     * Execute a tool from an MCP server
     */
    async executeTool(toolName, parameters) {
        const tool = this.tools.get(toolName);
        if (!tool) {
            throw new Error(`Tool not found: ${toolName}`);
        }
        const client = this.clients.get(tool.server);
        if (!client) {
            throw new Error(`Server not connected: ${tool.server}`);
        }
        try {
            console.log(`[MCP] Executing ${toolName} with params:`, parameters);
            // Extract the actual tool name (without server prefix)
            const actualToolName = toolName.split('/').pop() || toolName;
            const response = await client.callTool({
                name: actualToolName,
                arguments: parameters
            });
            return {
                success: true,
                content: response.content,
                isError: response.isError || false
            };
        }
        catch (error) {
            console.error(`[MCP] Tool execution failed:`, error.message);
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
     * Get all available tools from all connected servers
     */
    getTools() {
        return Array.from(this.tools.values());
    }
    /**
     * Get a specific tool
     */
    getTool(name) {
        return this.tools.get(name);
    }
    /**
     * Check if a server is connected
     */
    isConnected(serverName) {
        return this.connected.has(serverName);
    }
    /**
     * Disconnect from a server
     */
    async disconnect(serverName) {
        const client = this.clients.get(serverName);
        if (client) {
            await client.close();
            this.clients.delete(serverName);
        }
        const process = this.processes.get(serverName);
        if (process) {
            process.kill();
            this.processes.delete(serverName);
        }
        this.connected.delete(serverName);
        // Remove tools from this server
        for (const [name, tool] of this.tools.entries()) {
            if (tool.server === serverName) {
                this.tools.delete(name);
            }
        }
        console.log(`[MCP] Disconnected from ${serverName}`);
    }
    /**
     * Disconnect from all servers
     */
    async disconnectAll() {
        const serverNames = Array.from(this.connected);
        for (const name of serverNames) {
            await this.disconnect(name);
        }
    }
    /**
     * Get list of connected servers
     */
    getConnectedServers() {
        return Array.from(this.connected);
    }
}
exports.MCPClient = MCPClient;
//# sourceMappingURL=MCPClient.js.map