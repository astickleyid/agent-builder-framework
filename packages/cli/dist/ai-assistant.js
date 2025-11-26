#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLIAssistant = void 0;
exports.startAssistant = startAssistant;
const chalk_1 = __importDefault(require("chalk"));
const runtime_1 = require("@stick-ai/runtime");
const inquirer_1 = __importDefault(require("inquirer"));
const ora_1 = __importDefault(require("ora"));
class CLIAssistant {
    agent = null;
    context;
    spinner = (0, ora_1.default)();
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
                console.log(chalk_1.default.yellow('\n⚠️  Ollama is not running. The assistant needs Ollama for local AI.'));
                console.log(chalk_1.default.cyan('\nOptions:'));
                console.log(chalk_1.default.white('  1. Install Ollama: https://ollama.ai'));
                console.log(chalk_1.default.white('  2. Start Ollama: ollama serve'));
                console.log(chalk_1.default.white('  3. Pull a model: ollama pull mistral'));
                console.log(chalk_1.default.white('\nOr use the traditional CLI (stick init, stick run, etc.)'));
                process.exit(1);
            }
            // Create AI agent - Stick Agent
            // Try to find an available model
            const availableModel = await this.getAvailableModel();
            if (!availableModel) {
                this.spinner.fail('No Ollama models found');
                console.log(chalk_1.default.yellow('\n⚠️  No models installed. Please pull a model:'));
                console.log(chalk_1.default.cyan('  ollama pull llama3.2:1b   (fast, 1GB)'));
                console.log(chalk_1.default.cyan('  ollama pull mistral:7b    (better, 4GB)'));
                process.exit(1);
            }
            this.agent = new runtime_1.IntelligentAgent({
                name: 'stick-agent',
                version: '1.0.0',
                description: 'Stick Agent - Your intelligent CLI assistant that helps build AI agents, MCP servers, and automation workflows',
                capabilities: ['chat'],
                tools: ['datetime', 'text'],
                instructions: this.getSystemPrompt(),
                environment: {}
            }, {
                provider: 'ollama',
                model: availableModel,
                host: 'http://localhost:11434',
                temperature: 0.7
            });
            this.spinner.succeed('AI Assistant Ready!');
        }
        catch (error) {
            this.spinner.fail('Failed to initialize assistant');
            console.error(chalk_1.default.red('Error:'), error.message);
            throw error;
        }
    }
    /**
     * Check if Ollama is available
     */
    async checkOllama() {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            return response.ok;
        }
        catch {
            return false;
        }
    }
    /**
     * Get first available Ollama model
     */
    async getAvailableModel() {
        try {
            const response = await fetch('http://localhost:11434/api/tags');
            const data = await response.json();
            if (data.models && data.models.length > 0) {
                return data.models[0].name;
            }
            return null;
        }
        catch {
            return null;
        }
    }
    /**
     * Get system prompt for the assistant
     */
    getSystemPrompt() {
        return `You are Stick Agent - the expert AI assistant for the Stick.AI Agent Framework CLI.

Your role is to help users build ANYTHING within a local environment:
- Custom AI agents (single or multi-agent systems)
- MCP servers (custom tools and integrations for agents)
- Workflow pipelines (automated processes)
- AI automations (complex agent behaviors and systems)
- Complete AI automation systems with no confusion

You are essentially the guide that tells users HOW to do everything and executes the proper commands to deliver results.

CRITICAL RULES:
1. Ask clarifying questions to understand EXACTLY what the user wants to build
2. Break down complex tasks into crystal-clear, step-by-step instructions
3. Suggest the EXACT CLI commands to run - NO AMBIGUITY
4. Execute commands when asked - you can run them directly
5. Guide users through the ENTIRE process from start to finish
6. Make it IMPOSSIBLE to be confused - explain everything
7. Adapt to their skill level (complete beginner to expert)
8. When building custom agents, ask about: purpose, tools needed, MCP servers, memory requirements
9. For MCP servers, guide them through tool creation, testing, and integration
10. For multi-agent systems, help design the architecture and coordination

Available CLI commands (ALL OF THEM):

BASIC COMMANDS:
- stick init <name> [options]                    - Create a new agent project
  Options: -t, --template <template>
  
- stick run <agent> [options]                    - Run a specific agent
  Options: -i, --interactive, --input <text>, -p, --provider <provider>,
           -m, --model <model>, -t, --temperature <temp>, --max-tokens <tokens>,
           --ollama-host <host>, -v, --verbose
           
- stick list                                     - List all configured agents

- stick deploy [options]                         - Deploy agent as HTTP API server
  Options: -p, --port <port>, -c, --cloud
  
- stick metrics                                  - View agent performance metrics

- stick logs [options]                           - View agent logs
  Options: -a, --agent <agent>, -t, --tail, -n, --lines <number>, -f, --follow

ADVANCED COMMANDS:
- stick mcp [action] [name]                      - MCP server management
  Actions: create, list, connect, disconnect, test
  
- stick multi-agent [action] [name]              - Multi-agent system builder
  Actions: create, add-agent, run, status
  
- stick workflow [action] [name]                 - Workflow pipeline builder
  Actions: create, add-step, run, visualize

ASSISTANT:
- stick assistant (or 'stick ai')                - Start AI assistant (this mode!)
- stick examples                                 - Show natural language examples
- stick                                          - Launch with AI auto-connected (default)
- stick logs [options]                 - View agent execution logs
- stick mcp create <name>              - Create custom MCP server (guided)
- stick mcp install <server>           - Install existing MCP server
- stick mcp list                       - List available/installed MCP servers
- stick mcp test <server>              - Test MCP server
- stick workflow create <name>         - Create workflow pipeline
- stick multi-agent create <name>      - Create multi-agent system
- stick multi-agent diagram <name>     - Visualize multi-agent architecture
- stick assistant                      - Launch this guided assistant
- stick examples                       - Show natural language examples

When suggesting commands, format them as:
\`\`\`bash
stick <command>
\`\`\`

Always explain:
- WHAT the command does
- WHY it's needed for their goal
- WHAT to expect as output
- NEXT steps in the process
- Any configuration or files that will be created

Be conversational, patient, and thorough. Your goal is to make building powerful AI systems accessible to EVERYONE.
If the user's goal is unclear, ask detailed questions before suggesting anything.`;
    }
    /**
     * Start the conversational assistant
     */
    async start() {
        console.log(chalk_1.default.cyan.bold('\n╔══════════════════════════════════════════════════════════════════╗'));
        console.log(chalk_1.default.cyan.bold('║                                                                  ║'));
        console.log(chalk_1.default.cyan.bold('║                  🤖 Stick Agent Assistant 🤖                     ║'));
        console.log(chalk_1.default.cyan.bold('║                                                                  ║'));
        console.log(chalk_1.default.cyan.bold('╚══════════════════════════════════════════════════════════════════╝\n'));
        console.log(chalk_1.default.white('I\'m Stick Agent - your AI guide! Tell me what you want to build and I\'ll walk you through every step.\n'));
        console.log(chalk_1.default.cyan.bold('What can I help you build?\n'));
        console.log(chalk_1.default.gray('Examples:'));
        console.log(chalk_1.default.gray('  • "I want to build a chatbot that can search the web"'));
        console.log(chalk_1.default.gray('  • "Create a multi-agent system for data analysis"'));
        console.log(chalk_1.default.gray('  • "Build a custom MCP server for GitHub integration"'));
        console.log(chalk_1.default.gray('  • "Set up an automation workflow for email processing"'));
        console.log(chalk_1.default.gray('  • "Build an AI agent that monitors system logs"'));
        console.log(chalk_1.default.gray('  • "Create a custom tool for my agents"\n'));
        console.log(chalk_1.default.yellow('💡 I can execute commands for you and guide you through the entire process!\n'));
        // Get user's goal
        const { goal } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'goal',
                message: chalk_1.default.cyan('What would you like to build?'),
                validate: (input) => input.trim().length > 0 || 'Please describe what you want to build'
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
    async conversationLoop() {
        while (true) {
            // Get AI response
            this.spinner.start('Thinking...');
            try {
                const response = await this.getAIResponse();
                this.spinner.stop();
                // Parse response for commands
                const { text, commands, questions } = this.parseResponse(response);
                // Display AI response
                console.log(chalk_1.default.cyan('\n🤖 Assistant:\n'));
                console.log(chalk_1.default.white(text));
                // Show commands if any
                if (commands.length > 0) {
                    console.log(chalk_1.default.yellow('\n📋 Commands to run:\n'));
                    commands.forEach((cmd, idx) => {
                        console.log(chalk_1.default.green(`${idx + 1}. ${cmd}`));
                    });
                }
                // Ask if user wants to execute
                if (commands.length > 0) {
                    const { action } = await inquirer_1.default.prompt([
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
                    }
                    else if (action === 'question') {
                        await this.askQuestion();
                        continue;
                    }
                    else if (action === 'modify') {
                        await this.modifyPlan();
                        continue;
                    }
                    else {
                        console.log(chalk_1.default.yellow('\n👋 Goodbye! Come back anytime you need help.\n'));
                        break;
                    }
                }
                // Check if there are questions
                if (questions.length > 0) {
                    const { answer } = await inquirer_1.default.prompt([
                        {
                            type: 'input',
                            name: 'answer',
                            message: chalk_1.default.cyan(questions[0])
                        }
                    ]);
                    this.context.conversation?.push({
                        role: 'user',
                        content: answer
                    });
                    continue;
                }
                // Ask if done or continue
                const { continueConvo } = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'continueConvo',
                        message: 'Need help with anything else?',
                        default: false
                    }
                ]);
                if (!continueConvo) {
                    console.log(chalk_1.default.green('\n✅ All done! Your project is ready.\n'));
                    break;
                }
                // Get next input
                const { nextInput } = await inquirer_1.default.prompt([
                    {
                        type: 'input',
                        name: 'nextInput',
                        message: chalk_1.default.cyan('What next?')
                    }
                ]);
                this.context.conversation?.push({
                    role: 'user',
                    content: nextInput
                });
            }
            catch (error) {
                this.spinner.fail('Error');
                console.error(chalk_1.default.red('Error:'), error.message);
                break;
            }
        }
    }
    /**
     * Get AI response
     */
    async getAIResponse() {
        if (!this.agent)
            throw new Error('Agent not initialized');
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
    parseResponse(response) {
        const commands = [];
        const questions = [];
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
    async executeCommands(commands) {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        for (let i = 0; i < commands.length; i++) {
            const cmd = commands[i];
            console.log(chalk_1.default.cyan(`\n📟 Executing: ${cmd}\n`));
            this.spinner.start('Running...');
            try {
                const { stdout, stderr } = await execAsync(cmd, {
                    cwd: process.cwd()
                });
                this.spinner.succeed('Command completed');
                if (stdout) {
                    console.log(chalk_1.default.white(stdout));
                }
                if (stderr) {
                    console.log(chalk_1.default.yellow(stderr));
                }
                // Add result to conversation
                this.context.conversation?.push({
                    role: 'system',
                    content: `Command executed: ${cmd}\nOutput: ${stdout || 'No output'}`
                });
            }
            catch (error) {
                this.spinner.fail('Command failed');
                console.error(chalk_1.default.red('Error:'), error.message);
                // Ask AI how to fix
                console.log(chalk_1.default.yellow('\n🤔 Let me help you fix this...\n'));
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
    async askQuestion() {
        const { question } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'question',
                message: chalk_1.default.cyan('What\'s your question?')
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
    async modifyPlan() {
        const { modification } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'modification',
                message: chalk_1.default.cyan('What would you like to change?')
            }
        ]);
        this.context.conversation?.push({
            role: 'user',
            content: `I want to modify the plan: ${modification}`
        });
    }
}
exports.CLIAssistant = CLIAssistant;
/**
 * Start the AI assistant
 */
async function startAssistant() {
    const assistant = new CLIAssistant();
    try {
        await assistant.initialize();
        await assistant.start();
    }
    catch (error) {
        console.error(chalk_1.default.red('Failed to start assistant:'), error.message);
        process.exit(1);
    }
}
//# sourceMappingURL=ai-assistant.js.map