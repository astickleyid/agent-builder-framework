import { AgentConfig } from './registry';
import inquirer from 'inquirer';

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

  constructor(config: AgentConfig) {
    this.context = {
      config,
      conversationHistory: [],
    };
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
      return `I have access to the following tools: ${this.context.config.tools.join(', ')}`;
    }
    
    // Default response
    return `I received your message: "${input}". ${this.context.config.instructions}\n\nNote: This is a demonstration runtime. For production use, integrate with actual LLM providers like OpenAI, Anthropic, or local models.`;
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
