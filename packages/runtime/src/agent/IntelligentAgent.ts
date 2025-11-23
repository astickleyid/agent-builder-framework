import { Agent, AgentConfig, Message } from './Agent';
import { createTool } from '../tools';
import { MCPClient, MCPServerConfig, MCPToolWrapper } from '../mcp';

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'ollama';
  apiKey?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  host?: string; // for ollama
}

export class IntelligentAgent extends Agent {
  private llmConfig: LLMConfig;
  private systemPrompt: string;
  private mcpClient: MCPClient | null = null;

  constructor(config: AgentConfig, llmConfig: LLMConfig) {
    super(config);
    this.llmConfig = llmConfig;
    this.systemPrompt = this.buildSystemPrompt();
    
    // Initialize MCP client if servers are configured
    if (config.mcp && config.mcp.servers && config.mcp.servers.length > 0) {
      this.mcpClient = new MCPClient();
      this.initializeMCP(config.mcp.servers).catch(err => {
        console.error('[MCP] Initialization failed:', err.message);
      });
    }
  }

  private async initializeMCP(servers: MCPServerConfig[]): Promise<void> {
    if (!this.mcpClient) return;

    for (const server of servers) {
      try {
        await this.mcpClient.connect(server);
        
        // Register MCP tools as regular tools
        const mcpTools = this.mcpClient.getTools();
        for (const toolInfo of mcpTools) {
          const wrapper = new MCPToolWrapper(this.mcpClient, toolInfo);
          this.registerTool(toolInfo.name, wrapper);
          console.log(`[Agent] Registered MCP tool: ${toolInfo.name}`);
        }
      } catch (error: any) {
        console.error(`[MCP] Failed to connect to ${server.name}:`, error.message);
      }
    }
  }

  private buildSystemPrompt(): string {
    const toolsList = this.config.tools.join(', ');
    return `${this.config.instructions}

Available Tools: ${toolsList}

When you need to use a tool, respond with a JSON object in this format:
{
  "thought": "your reasoning",
  "tool": "tool_name",
  "parameters": { ...tool params }
}

If no tool is needed, respond normally with text.`;
  }

  public async run(input: string): Promise<string> {
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    this.conversationHistory.push(userMessage);

    try {
      // Get response from LLM
      const llmResponse = await this.callLLM(input);

      // Check if LLM wants to use a tool
      const toolCall = this.parseToolCall(llmResponse);

      let finalResponse: string;

      if (toolCall) {
        // Execute the tool
        const toolResult = await this.executeTool(
          toolCall.tool,
          toolCall.parameters
        );

        // Get final response with tool result
        finalResponse = await this.callLLM(
          `Tool "${toolCall.tool}" executed. Result: ${JSON.stringify(toolResult)}\n\nProvide a natural language response to the user.`
        );
      } else {
        finalResponse = llmResponse;
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: finalResponse,
        timestamp: new Date()
      };

      this.conversationHistory.push(assistantMessage);

      return finalResponse;
    } catch (error: any) {
      const errorMessage = `Error: ${error.message}`;
      this.conversationHistory.push({
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      });
      return errorMessage;
    }
  }

  private async callLLM(prompt: string): Promise<string> {
    const { provider, apiKey, model, temperature, maxTokens, host } = this.llmConfig;

    // Prepare messages
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...this.conversationHistory
        .slice(-10) // Last 10 messages for context
        .map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: prompt }
    ];

    try {
      let tool;
      let result;

      switch (provider) {
        case 'openai':
          if (!apiKey) throw new Error('OpenAI API key required');
          tool = createTool('openai');
          result = await tool.execute({
            operation: 'chat',
            apiKey,
            model: model || 'gpt-3.5-turbo',
            messages,
            temperature: temperature || 0.7,
            maxTokens: maxTokens || 1000
          });
          break;

        case 'anthropic':
          if (!apiKey) throw new Error('Anthropic API key required');
          tool = createTool('anthropic');
          result = await tool.execute({
            operation: 'chat',
            apiKey,
            model: model || 'claude-3-sonnet-20240229',
            messages: messages.filter(m => m.role !== 'system'),
            system: this.systemPrompt,
            temperature: temperature || 0.7,
            maxTokens: maxTokens || 1000
          });
          break;

        case 'ollama':
          tool = createTool('ollama');
          result = await tool.execute({
            operation: 'chat',
            model: model || 'llama2',
            messages,
            host: host || 'http://localhost:11434',
            temperature: temperature || 0.7
          });
          break;

        default:
          throw new Error(`Unknown LLM provider: ${provider}`);
      }

      if (!result.success) {
        throw new Error(result.error || 'LLM call failed');
      }

      return result.response;
    } catch (error: any) {
      console.error('[IntelligentAgent] LLM call failed:', error.message);
      throw error;
    }
  }

  private parseToolCall(response: string): { tool: string; parameters: any } | null {
    try {
      // Look for JSON in the response
      const jsonMatch = response.match(/\{[\s\S]*"tool"[\s\S]*\}/);
      if (!jsonMatch) return null;

      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.tool && parsed.parameters) {
        return {
          tool: parsed.tool,
          parameters: parsed.parameters
        };
      }

      return null;
    } catch {
      return null;
    }
  }

  private async executeTool(toolName: string, parameters: any): Promise<any> {
    try {
      const tool = this.toolRegistry.get(toolName);
      if (!tool) {
        // Try to create it
        const newTool = createTool(toolName);
        this.registerTool(toolName, newTool);
        return await newTool.execute(parameters);
      }

      return await tool.execute(parameters);
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  public getLLMConfig(): LLMConfig {
    return this.llmConfig;
  }

  public updateLLMConfig(config: Partial<LLMConfig>): void {
    this.llmConfig = { ...this.llmConfig, ...config };
  }
}
