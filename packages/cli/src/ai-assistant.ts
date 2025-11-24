#!/usr/bin/env node

import chalk from 'chalk';
import { StickAIAgent } from '@stickai/core';
import { OllamaProvider } from '@stickai/core';
import inquirer from 'inquirer';
import ora from 'ora';

/**
 * AI-Powered CLI Assistant
 * Guides users through building anything with natural language
 */

interface AssistantContext {
  userGoal: string;
  projectType?: 'agent' | 'multi-agent' | 'mcp-server' | 'workflow' | 'automation';
  agentName?: string;
  mcpServers?: string[];
  tools?: string[];
  memory?: boolean;
  deployment?: 'local' | 'docker' | 'production';
  currentStep?: number;
  steps?: string[];
  conversation?: Array<{ role: string; content: string }>;
}

export class CLIAssistant {
  private agent: StickAIAgent | null = null;
  private context: AssistantContext;
  private spinner = ora();

  constructor() {
    this.context = {
      userGoal: '',
      conversation: []
    };
  }

  /**
   * Initialize the AI assistant
   */
  async initialize() {
    this.spinner.start('Initializing AI Assistant...');

    try {
      // Check if Ollama is available
      const hasOllama = await this.checkOllama();
      
      if (!hasOllama) {
        this.spinner.fail('Ollama not found');
        console.log(chalk.yellow('\n⚠️  Ollama is not running. The assistant needs Ollama for local AI.'));
        console.log(chalk.cyan('\nOptions:'));
        console.log(chalk.white('  1. Install Ollama: https://ollama.ai'));
        console.log(chalk.white('  2. Start Ollama: ollama serve'));
        console.log(chalk.white('  3. Pull a model: ollama pull mistral'));
        console.log(chalk.white('\nOr use the traditional CLI (stick init, stick run, etc.)'));
        process.exit(1);
      }

      // Create AI agent
      this.agent = new StickAIAgent({
        name: 'CLI-Assistant',
        description: 'Intelligent assistant that helps build AI agents, MCP servers, and automation workflows',
        provider: new OllamaProvider({
          model: 'mistral:latest',
          baseURL: 'http://localhost:11434'
        }),
        systemPrompt: this.getSystemPrompt()
      });

      this.spinner.succeed('AI Assistant Ready!');
    } catch (error: any) {
      this.spinner.fail('Failed to initialize assistant');
      console.error(chalk.red('Error:'), error.message);
      throw error;
    }
  }

  /**
   * Check if Ollama is available
   */
  private async checkOllama(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get system prompt for the assistant
   */
  private getSystemPrompt(): string {
    return `You are an expert AI assistant for the Stick.AI Agent Framework CLI.

Your role is to help users build:
- Custom AI agents (single or multi-agent systems)
- MCP servers (custom tools and integrations)
- Workflow pipelines (automated processes)
- AI automations (complex agent behaviors)

You MUST:
1. Ask clarifying questions to understand what the user wants to build
2. Break down complex tasks into clear, actionable steps
3. Suggest the EXACT CLI commands to run
4. Explain what each command does
5. Guide users through the entire process without confusion
6. Adapt to their skill level (beginner to advanced)

Available CLI commands:
- stick init <name> [options]          - Create a new agent
- stick run <agent> [options]          - Run an agent
- stick deploy [options]               - Deploy agent as API
- stick list                           - List all agents
- stick metrics                        - View performance metrics
- stick logs [options]                 - View agent logs
- stick mcp create <name>              - Create custom MCP server
- stick mcp install <server>           - Install MCP server
- stick workflow create <name>         - Create workflow pipeline
- stick multi-agent create <name>      - Create multi-agent system

When suggesting commands, format them as:
\`\`\`bash
stick <command>
\`\`\`

Always explain:
- WHAT the command does
- WHY it's needed
- WHAT to expect as output
- NEXT steps

Be conversational, helpful, and break complex tasks into simple steps.
If the user's goal is unclear, ask questions before suggesting commands.`;
  }

  /**
   * Start the conversational assistant
   */
  async start() {
    console.log(chalk.cyan.bold('\n╔══════════════════════════════════════════════════════════════════╗'));
    console.log(chalk.cyan.bold('║                                                                  ║'));
    console.log(chalk.cyan.bold('║              🤖 Stick.AI Conversational Assistant 🤖             ║'));
    console.log(chalk.cyan.bold('║                                                                  ║'));
    console.log(chalk.cyan.bold('╚══════════════════════════════════════════════════════════════════╝\n'));

    console.log(chalk.white('I\'m your AI assistant! Tell me what you want to build and I\'ll guide you through it.\n'));
    console.log(chalk.gray('Examples:'));
    console.log(chalk.gray('  • "I want to build a chatbot that can search the web"'));
    console.log(chalk.gray('  • "Create a multi-agent system for data analysis"'));
    console.log(chalk.gray('  • "Build an MCP server for GitHub integration"'));
    console.log(chalk.gray('  • "Set up an automation workflow for email processing"\n'));

    // Get user's goal
    const { goal } = await inquirer.prompt([
      {
        type: 'input',
        name: 'goal',
        message: chalk.cyan('What would you like to build?'),
        validate: (input: string) => input.trim().length > 0 || 'Please describe what you want to build'
      }
    ]);

    this.context.userGoal = goal;
    this.context.conversation?.push({
      role: 'user',
      content: goal
    });

    // Start conversation loop
    await this.conversationLoop();
  }

  /**
   * Main conversation loop
   */
  private async conversationLoop() {
    while (true) {
      // Get AI response
      this.spinner.start('Thinking...');
      
      try {
        const response = await this.getAIResponse();
        this.spinner.stop();

        // Parse response for commands
        const { text, commands, questions } = this.parseResponse(response);

        // Display AI response
        console.log(chalk.cyan('\n🤖 Assistant:\n'));
        console.log(chalk.white(text));

        // Show commands if any
        if (commands.length > 0) {
          console.log(chalk.yellow('\n📋 Commands to run:\n'));
          commands.forEach((cmd, idx) => {
            console.log(chalk.green(`${idx + 1}. ${cmd}`));
          });
        }

        // Ask if user wants to execute
        if (commands.length > 0) {
          const { action } = await inquirer.prompt([
            {
              type: 'list',
              name: 'action',
              message: 'What would you like to do?',
              choices: [
                { name: '✅ Execute these commands', value: 'execute' },
                { name: '💬 Ask a question', value: 'question' },
                { name: '✏️  Modify the plan', value: 'modify' },
                { name: '❌ Exit', value: 'exit' }
              ]
            }
          ]);

          if (action === 'execute') {
            await this.executeCommands(commands);
          } else if (action === 'question') {
            await this.askQuestion();
            continue;
          } else if (action === 'modify') {
            await this.modifyPlan();
            continue;
          } else {
            console.log(chalk.yellow('\n👋 Goodbye! Come back anytime you need help.\n'));
            break;
          }
        }

        // Check if there are questions
        if (questions.length > 0) {
          const { answer } = await inquirer.prompt([
            {
              type: 'input',
              name: 'answer',
              message: chalk.cyan(questions[0])
            }
          ]);

          this.context.conversation?.push({
            role: 'user',
            content: answer
          });
          continue;
        }

        // Ask if done or continue
        const { continueConvo } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'continueConvo',
            message: 'Need help with anything else?',
            default: false
          }
        ]);

        if (!continueConvo) {
          console.log(chalk.green('\n✅ All done! Your project is ready.\n'));
          break;
        }

        // Get next input
        const { nextInput } = await inquirer.prompt([
          {
            type: 'input',
            name: 'nextInput',
            message: chalk.cyan('What next?')
          }
        ]);

        this.context.conversation?.push({
          role: 'user',
          content: nextInput
        });

      } catch (error: any) {
        this.spinner.fail('Error');
        console.error(chalk.red('Error:'), error.message);
        break;
      }
    }
  }

  /**
   * Get AI response
   */
  private async getAIResponse(): Promise<string> {
    if (!this.agent) throw new Error('Agent not initialized');

    const conversationHistory = this.context.conversation
      ?.map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');

    const contextInfo = `
Current Context:
- User Goal: ${this.context.userGoal}
- Project Type: ${this.context.projectType || 'not determined yet'}
- Agent Name: ${this.context.agentName || 'not set'}
- MCP Servers: ${this.context.mcpServers?.join(', ') || 'none'}
- Current Step: ${this.context.currentStep || 1}

Conversation:
${conversationHistory}
`;

    const response = await this.agent.run(contextInfo);
    
    // Add to conversation
    this.context.conversation?.push({
      role: 'assistant',
      content: response
    });

    return response;
  }

  /**
   * Parse AI response for commands and questions
   */
  private parseResponse(response: string): { text: string; commands: string[]; questions: string[] } {
    const commands: string[] = [];
    const questions: string[] = [];
    let text = response;

    // Extract commands from code blocks
    const codeBlockRegex = /```bash\n(.*?)\n```/gs;
    let match;
    while ((match = codeBlockRegex.exec(response)) !== null) {
      commands.push(match[1].trim());
    }

    // Extract questions (lines ending with ?)
    const questionRegex = /^.+\?$/gm;
    while ((match = questionRegex.exec(response)) !== null) {
      questions.push(match[0].trim());
    }

    // Clean text (remove code blocks)
    text = text.replace(codeBlockRegex, '').trim();

    return { text, commands, questions };
  }

  /**
   * Execute commands
   */
  private async executeCommands(commands: string[]) {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    for (let i = 0; i < commands.length; i++) {
      const cmd = commands[i];
      
      console.log(chalk.cyan(`\n📟 Executing: ${cmd}\n`));
      this.spinner.start('Running...');

      try {
        const { stdout, stderr } = await execAsync(cmd, {
          cwd: process.cwd()
        });

        this.spinner.succeed('Command completed');

        if (stdout) {
          console.log(chalk.white(stdout));
        }
        if (stderr) {
          console.log(chalk.yellow(stderr));
        }

        // Add result to conversation
        this.context.conversation?.push({
          role: 'system',
          content: `Command executed: ${cmd}\nOutput: ${stdout || 'No output'}`
        });

      } catch (error: any) {
        this.spinner.fail('Command failed');
        console.error(chalk.red('Error:'), error.message);

        // Ask AI how to fix
        console.log(chalk.yellow('\n🤔 Let me help you fix this...\n'));
        this.context.conversation?.push({
          role: 'system',
          content: `Command failed: ${cmd}\nError: ${error.message}`
        });
      }
    }
  }

  /**
   * Ask a question
   */
  private async askQuestion() {
    const { question } = await inquirer.prompt([
      {
        type: 'input',
        name: 'question',
        message: chalk.cyan('What\'s your question?')
      }
    ]);

    this.context.conversation?.push({
      role: 'user',
      content: question
    });
  }

  /**
   * Modify the plan
   */
  private async modifyPlan() {
    const { modification } = await inquirer.prompt([
      {
        type: 'input',
        name: 'modification',
        message: chalk.cyan('What would you like to change?')
      }
    ]);

    this.context.conversation?.push({
      role: 'user',
      content: `I want to modify the plan: ${modification}`
    });
  }
}

/**
 * Start the AI assistant
 */
export async function startAssistant() {
  const assistant = new CLIAssistant();
  
  try {
    await assistant.initialize();
    await assistant.start();
  } catch (error: any) {
    console.error(chalk.red('Failed to start assistant:'), error.message);
    process.exit(1);
  }
}
