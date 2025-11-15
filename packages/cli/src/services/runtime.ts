import { AgentConfig } from './registry';
import inquirer from 'inquirer';
import { createLLMProvider, LLMProvider } from './llm';
import { initializeBuiltinTools, getTool, listTools, ToolExecutionResult } from './tools';

export interface Message {
  role: 'user' | 'agent' | 'system';
  content: string;
  timestamp: Date;
}

export interface AgentContext {
  config: AgentConfig;
  conversationHistory: Message[];
}

export class AgentRuntime {
  private context: AgentContext;
  private llmProvider: LLMProvider | null = null;
  private toolsEnabled: boolean = false;

  constructor(config: AgentConfig) {
    this.context = {
      config,
      conversationHistory: [],
    };

    // Initialize tools system if agent has tools configured
    if (config.tools && config.tools.length > 0) {
      initializeBuiltinTools();
      this.toolsEnabled = true;
    }

    // Initialize LLM provider if configured
    if (config.llm && config.llm.provider !== 'none') {
      try {
        this.llmProvider = createLLMProvider({
          provider: config.llm.provider,
          model: config.llm.model,
          apiKey: config.llm.apiKey,
          baseURL: config.llm.baseURL,
          temperature: config.environment.temperature,
          maxTokens: config.environment.maxTokens,
          stream: config.llm.stream ?? false,
        });
      } catch (error) {
        console.warn('Failed to initialize LLM provider:', error);
      }
    }
  }

  async processMessage(userInput: string): Promise<string> {
    // Add user message to history
    this.context.conversationHistory.push({
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    });

    // Simulate agent processing (in a real implementation, this would call an LLM)
    const response = await this.generateResponse(userInput);

    // Add agent response to history
    this.context.conversationHistory.push({
      role: 'agent',
      content: response,
      timestamp: new Date(),
    });

    return response;
  }

  private async generateResponse(input: string): Promise<string> {
    // Use LLM provider if available
    if (this.llmProvider) {
      try {
        const response = await this.llmProvider.generateResponse(
          this.context.conversationHistory,
          this.context.config.instructions
        );
        return response.content;
      } catch (error: any) {
        console.error('LLM provider error:', error.message);
        return `Error: Failed to get response from LLM provider. ${error.message}`;
      }
    }

    // Fallback to rule-based responses if no LLM provider configured
    const lowerInput = input.toLowerCase();
    
    // Basic rule-based responses for demonstration
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return `Hello! I'm ${this.context.config.name}, an AI agent. How can I help you today?`;
    }
    
    if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
      return this.getHelpResponse();
    }
    
    if (lowerInput.includes('status') || lowerInput.includes('info')) {
      return this.getStatusResponse();
    }
    
    if (lowerInput.includes('capabilities')) {
      return `My capabilities include: ${this.context.config.capabilities.join(', ')}`;
    }
    
    if (lowerInput.includes('tools')) {
      const availableTools = this.getAvailableTools();
      if (availableTools.length > 0) {
        const toolList = availableTools
          .map((t) => `  - ${t.name}: ${t.description}`)
          .join('\n');
        return `I have access to the following tools:\n${toolList}`;
      }
      return `I have access to the following tools: ${this.context.config.tools.join(', ')}`;
    }
    
    // Check for tool execution requests (simple pattern matching)
    if (lowerInput.includes('use tool') || lowerInput.includes('execute')) {
      return `To execute a tool, please configure an LLM provider that supports tool calling, or use the tool execution API directly.`;
    }
    
    // Default response
    return `I received your message: "${input}". ${this.context.config.instructions}\n\nNote: This is a demonstration runtime. For production use, configure an LLM provider (OpenAI, Anthropic, or Ollama) in your agent configuration.`;
  }

  private getHelpResponse(): string {
    return `I'm ${this.context.config.name}. ${this.context.config.description}

Available commands:
- Ask me anything within my capabilities
- Type "status" to see my configuration
- Type "capabilities" to see what I can do
- Type "tools" to see available tools
- Type "exit" or "quit" to end the session

${this.context.config.instructions}`;
  }

  private getStatusResponse(): string {
    return `Agent Status:
Name: ${this.context.config.name}
Version: ${this.context.config.version}
Description: ${this.context.config.description}
Capabilities: ${this.context.config.capabilities.join(', ')}
Tools: ${this.context.config.tools.join(', ')}
Max Tokens: ${this.context.config.environment.maxTokens}
Temperature: ${this.context.config.environment.temperature}
Conversation History: ${this.context.conversationHistory.length} messages`;
  }

  getConversationHistory(): Message[] {
    return this.context.conversationHistory;
  }

  clearHistory(): void {
    this.context.conversationHistory = [];
  }

  /**
   * Execute a tool by name with given parameters
   */
  async executeTool(
    toolName: string,
    params: Record<string, any>,
    context?: any
  ): Promise<ToolExecutionResult> {
    if (!this.toolsEnabled) {
      return {
        success: false,
        error: 'Tools are not enabled for this agent',
      };
    }

    // Check if tool is in agent's allowed tools
    if (!this.context.config.tools.includes(toolName)) {
      return {
        success: false,
        error: `Tool "${toolName}" is not allowed for this agent`,
      };
    }

    const tool = getTool(toolName);
    if (!tool) {
      return {
        success: false,
        error: `Tool "${toolName}" not found`,
      };
    }

    try {
      return await tool.execute(params, context);
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Tool execution failed',
      };
    }
  }

  /**
   * List available tools for this agent
   */
  getAvailableTools() {
    if (!this.toolsEnabled) {
      return [];
    }

    const allTools = listTools();
    return allTools.filter((tool) =>
      this.context.config.tools.includes(tool.name)
    );
  }

  async processMessageStream(
    userInput: string,
    onChunk: (content: string) => void
  ): Promise<void> {
    // Add user message to history
    this.context.conversationHistory.push({
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    });

    // Use LLM provider streaming if available
    if (this.llmProvider) {
      try {
        let fullResponse = '';
        await this.llmProvider.streamResponse(
          this.context.conversationHistory,
          (chunk) => {
            if (!chunk.done && chunk.content) {
              fullResponse += chunk.content;
              onChunk(chunk.content);
            }
          },
          this.context.config.instructions
        );

        // Add complete response to history
        this.context.conversationHistory.push({
          role: 'agent',
          content: fullResponse,
          timestamp: new Date(),
        });
      } catch (error: any) {
        const errorMsg = `Error: Failed to get streaming response from LLM provider. ${error.message}`;
        onChunk(errorMsg);
        this.context.conversationHistory.push({
          role: 'agent',
          content: errorMsg,
          timestamp: new Date(),
        });
      }
    } else {
      // Fallback to non-streaming
      const response = await this.generateResponse(userInput);
      onChunk(response);
    }
  }
}

export class InteractiveSession {
  private runtime: AgentRuntime;
  private active: boolean = false;

  constructor(config: AgentConfig) {
    this.runtime = new AgentRuntime(config);
  }

  async start(): Promise<void> {
    this.active = true;
    
    console.log(`\n🤖 ${this.runtime['context'].config.name} is ready!\n`);
    console.log('Type your messages below. Type "exit" or "quit" to end the session.\n');

    while (this.active) {
      const { message } = await inquirer.prompt([
        {
          type: 'input',
          name: 'message',
          message: 'You:',
          prefix: '💬',
        },
      ]);

      if (message.toLowerCase() === 'exit' || message.toLowerCase() === 'quit') {
        this.stop();
        break;
      }

      if (!message.trim()) {
        continue;
      }

      try {
        const response = await this.runtime.processMessage(message);
        console.log(`\n🤖 Agent: ${response}\n`);
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
  }

  stop(): void {
    this.active = false;
    console.log('\n👋 Session ended. Goodbye!\n');
  }
}
