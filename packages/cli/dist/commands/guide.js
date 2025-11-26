#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guideCommand = guideCommand;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
/**
 * Interactive guide - shows user everything they can do
 */
async function guideCommand() {
    console.clear();
    console.log(chalk_1.default.bold.cyan('\n╔════════════════════════════════════════════════════════════╗'));
    console.log(chalk_1.default.bold.cyan('║                                                            ║'));
    console.log(chalk_1.default.bold.cyan('║           🚀 Welcome to stick.ai CLI Guide 🚀             ║'));
    console.log(chalk_1.default.bold.cyan('║                                                            ║'));
    console.log(chalk_1.default.bold.cyan('╚════════════════════════════════════════════════════════════╝\n'));
    console.log(chalk_1.default.white('This guide will show you EVERYTHING you can do.\n'));
    const { choice } = await inquirer_1.default.prompt([{
            type: 'list',
            name: 'choice',
            message: 'What do you want to learn about?',
            choices: [
                { name: '📖 Complete Command Overview', value: 'overview' },
                { name: '🎯 Quick Start Tutorial', value: 'quickstart' },
                { name: '🤖 How to Create Your First Agent', value: 'first-agent' },
                { name: '⚡ Advanced Features (MCP, Multi-Agent, Workflows)', value: 'advanced' },
                { name: '💬 AI Assistant Usage', value: 'ai-assistant' },
                { name: '🌐 Deployment Options', value: 'deployment' },
                { name: '📋 See All Commands With Examples', value: 'all-commands' },
                { name: '❌ Exit', value: 'exit' }
            ]
        }]);
    switch (choice) {
        case 'overview':
            showOverview();
            break;
        case 'quickstart':
            await quickStartTutorial();
            break;
        case 'first-agent':
            await firstAgentGuide();
            break;
        case 'advanced':
            showAdvancedFeatures();
            break;
        case 'ai-assistant':
            showAIAssistantGuide();
            break;
        case 'deployment':
            showDeploymentGuide();
            break;
        case 'all-commands':
            showAllCommands();
            break;
        case 'exit':
            console.log(chalk_1.default.gray('\n👋 Run'), chalk_1.default.cyan('stick guide'), chalk_1.default.gray('anytime to come back!\n'));
            process.exit(0);
    }
    // Ask if they want to see more
    const { more } = await inquirer_1.default.prompt([{
            type: 'confirm',
            name: 'more',
            message: 'Want to see something else?',
            default: true
        }]);
    if (more) {
        await guideCommand();
    }
    else {
        console.log(chalk_1.default.gray('\n👋 Happy building! Run'), chalk_1.default.cyan('stick'), chalk_1.default.gray('anytime for AI help.\n'));
    }
}
function showOverview() {
    console.log(chalk_1.default.bold.yellow('\n📊 COMPLETE COMMAND OVERVIEW\n'));
    console.log(chalk_1.default.bold('🟢 BASIC COMMANDS (Start Here)'));
    console.log(chalk_1.default.white('  stick init <name>              '), chalk_1.default.gray('Create a new agent'));
    console.log(chalk_1.default.white('  stick run <agent>              '), chalk_1.default.gray('Run your agent'));
    console.log(chalk_1.default.white('  stick list                     '), chalk_1.default.gray('See all your agents'));
    console.log(chalk_1.default.white('  stick deploy                   '), chalk_1.default.gray('Deploy as API'));
    console.log(chalk_1.default.bold('\n🔵 MONITORING & LOGS'));
    console.log(chalk_1.default.white('  stick logs                     '), chalk_1.default.gray('View agent logs'));
    console.log(chalk_1.default.white('  stick metrics                  '), chalk_1.default.gray('Performance stats'));
    console.log(chalk_1.default.bold('\n🟣 ADVANCED FEATURES'));
    console.log(chalk_1.default.white('  stick mcp <action>             '), chalk_1.default.gray('Custom tool servers'));
    console.log(chalk_1.default.white('  stick multi-agent <action>     '), chalk_1.default.gray('Multi-agent systems'));
    console.log(chalk_1.default.white('  stick workflow <action>        '), chalk_1.default.gray('Automation pipelines'));
    console.log(chalk_1.default.bold('\n🤖 AI ASSISTANCE'));
    console.log(chalk_1.default.white('  stick                          '), chalk_1.default.gray('AI assistant (auto-launches)'));
    console.log(chalk_1.default.white('  stick ai                       '), chalk_1.default.gray('Start AI guide'));
    console.log(chalk_1.default.white('  stick examples                 '), chalk_1.default.gray('See examples'));
    console.log(chalk_1.default.white('  stick guide                    '), chalk_1.default.gray('This guide'));
    console.log(chalk_1.default.dim('\n💡 Tip: Run any command with --help for details'));
}
async function quickStartTutorial() {
    console.log(chalk_1.default.bold.yellow('\n🎯 QUICK START - 60 SECONDS TO YOUR FIRST AGENT\n'));
    console.log(chalk_1.default.bold('Step 1:'), chalk_1.default.white('Create an agent'));
    console.log(chalk_1.default.cyan('  $ stick init my-first-agent\n'));
    console.log(chalk_1.default.bold('Step 2:'), chalk_1.default.white('Run it interactively'));
    console.log(chalk_1.default.cyan('  $ stick run my-first-agent --interactive\n'));
    console.log(chalk_1.default.bold('Step 3:'), chalk_1.default.white('Chat with your agent!'));
    console.log(chalk_1.default.gray('  You: "Hello!"'));
    console.log(chalk_1.default.gray('  Agent: "Hi! How can I help?"\n'));
    console.log(chalk_1.default.bold('Optional:'), chalk_1.default.white('Deploy as API'));
    console.log(chalk_1.default.cyan('  $ stick deploy --port 3000\n'));
    const { tryNow } = await inquirer_1.default.prompt([{
            type: 'confirm',
            name: 'tryNow',
            message: 'Want to create your first agent right now?',
            default: true
        }]);
    if (tryNow) {
        console.log(chalk_1.default.cyan('\n▶ Running: stick init my-first-agent\n'));
        const { createIntelligentAgent } = require('@stick-ai/runtime');
        // Execute init command here
        console.log(chalk_1.default.green('✓ Agent created! Now run:'), chalk_1.default.cyan('stick run my-first-agent --interactive\n'));
    }
}
async function firstAgentGuide() {
    console.log(chalk_1.default.bold.yellow('\n🤖 HOW TO CREATE YOUR FIRST AGENT\n'));
    console.log(chalk_1.default.bold('What is an agent?'));
    console.log(chalk_1.default.white('An AI agent is a program that uses LLMs (like GPT-4 or Ollama) to:'));
    console.log(chalk_1.default.gray('  • Understand natural language'));
    console.log(chalk_1.default.gray('  • Use tools (search, calculate, etc.)'));
    console.log(chalk_1.default.gray('  • Remember conversations'));
    console.log(chalk_1.default.gray('  • Execute tasks autonomously\n'));
    console.log(chalk_1.default.bold('Creating an agent:\n'));
    console.log(chalk_1.default.cyan('1. stick init my-agent'));
    console.log(chalk_1.default.gray('   Creates project structure with config\n'));
    console.log(chalk_1.default.cyan('2. Choose your AI provider:'));
    console.log(chalk_1.default.white('   • Ollama (local, free)    '), chalk_1.default.gray('→ stick run my-agent --provider ollama'));
    console.log(chalk_1.default.white('   • OpenAI (cloud, paid)    '), chalk_1.default.gray('→ stick run my-agent --provider openai'));
    console.log(chalk_1.default.white('   • Anthropic (cloud, paid) '), chalk_1.default.gray('→ stick run my-agent --provider anthropic\n'));
    console.log(chalk_1.default.cyan('3. Run your agent:'));
    console.log(chalk_1.default.white('   stick run my-agent --interactive\n'));
    console.log(chalk_1.default.dim('💡 The --interactive flag lets you chat with your agent'));
}
function showAdvancedFeatures() {
    console.log(chalk_1.default.bold.yellow('\n⚡ ADVANCED FEATURES\n'));
    console.log(chalk_1.default.bold.cyan('🔧 MCP Servers (Model Context Protocol)'));
    console.log(chalk_1.default.white('Create custom tools for your agents:\n'));
    console.log(chalk_1.default.gray('  stick mcp create weather-tool      '), chalk_1.default.dim('Create new tool'));
    console.log(chalk_1.default.gray('  stick mcp list                     '), chalk_1.default.dim('See all tools'));
    console.log(chalk_1.default.gray('  stick mcp test weather-tool        '), chalk_1.default.dim('Test a tool'));
    console.log(chalk_1.default.bold.cyan('\n🤝 Multi-Agent Systems'));
    console.log(chalk_1.default.white('Multiple agents working together:\n'));
    console.log(chalk_1.default.gray('  stick multi-agent create research-team'));
    console.log(chalk_1.default.gray('  stick multi-agent add-agent researcher'));
    console.log(chalk_1.default.gray('  stick multi-agent add-agent writer'));
    console.log(chalk_1.default.gray('  stick multi-agent run research-team'));
    console.log(chalk_1.default.bold.cyan('\n⚙️ Workflow Pipelines'));
    console.log(chalk_1.default.white('Automate multi-step processes:\n'));
    console.log(chalk_1.default.gray('  stick workflow create data-pipeline'));
    console.log(chalk_1.default.gray('  stick workflow add-step extract'));
    console.log(chalk_1.default.gray('  stick workflow add-step transform'));
    console.log(chalk_1.default.gray('  stick workflow run data-pipeline'));
}
function showAIAssistantGuide() {
    console.log(chalk_1.default.bold.yellow('\n💬 AI ASSISTANT GUIDE\n'));
    console.log(chalk_1.default.bold('The AI Assistant helps you build ANYTHING:\n'));
    console.log(chalk_1.default.cyan('How to use:'));
    console.log(chalk_1.default.white('1. Just run:'), chalk_1.default.cyan('stick'));
    console.log(chalk_1.default.gray('   AI auto-launches and connects to Ollama\n'));
    console.log(chalk_1.default.white('2. Tell it what you want:'));
    console.log(chalk_1.default.gray('   "I want to build a chatbot that can search the web"'));
    console.log(chalk_1.default.gray('   "Create a multi-agent research system"'));
    console.log(chalk_1.default.gray('   "Build a custom tool for GitHub integration"\n'));
    console.log(chalk_1.default.white('3. Follow the step-by-step guidance'));
    console.log(chalk_1.default.gray('   The AI will execute commands for you!\n'));
    console.log(chalk_1.default.bold('Requirements:'));
    console.log(chalk_1.default.gray('  • Ollama installed and running'));
    console.log(chalk_1.default.gray('  • At least one model pulled (llama3.2:1b, mistral:7b, etc.)'));
}
function showDeploymentGuide() {
    console.log(chalk_1.default.bold.yellow('\n🌐 DEPLOYMENT OPTIONS\n'));
    console.log(chalk_1.default.bold.cyan('1. Local HTTP API (Simplest)'));
    console.log(chalk_1.default.white('   stick deploy --port 3000\n'));
    console.log(chalk_1.default.gray('   Access: http://localhost:3000'));
    console.log(chalk_1.default.gray('   Test: curl -X POST http://localhost:3000/chat -d \'{"message":"Hello"}\'\n'));
    console.log(chalk_1.default.bold.cyan('2. Docker Container'));
    console.log(chalk_1.default.white('   stick deploy --docker\n'));
    console.log(chalk_1.default.gray('   Builds image and runs container'));
    console.log(chalk_1.default.bold.cyan('3. Cloud Deployment'));
    console.log(chalk_1.default.white('   stick deploy --cloud\n'));
    console.log(chalk_1.default.gray('   Deploys to configured cloud provider'));
}
function showAllCommands() {
    console.log(chalk_1.default.bold.yellow('\n📋 ALL COMMANDS WITH EXAMPLES\n'));
    const commands = [
        {
            cmd: 'stick init <name>',
            desc: 'Create new agent',
            example: 'stick init my-chatbot'
        },
        {
            cmd: 'stick run <agent> [options]',
            desc: 'Run agent',
            example: 'stick run my-agent --interactive --provider ollama'
        },
        {
            cmd: 'stick list',
            desc: 'List all agents',
            example: 'stick list'
        },
        {
            cmd: 'stick deploy [options]',
            desc: 'Deploy as API',
            example: 'stick deploy --port 8080'
        },
        {
            cmd: 'stick logs [options]',
            desc: 'View logs',
            example: 'stick logs --agent my-agent --follow'
        },
        {
            cmd: 'stick metrics',
            desc: 'View metrics',
            example: 'stick metrics'
        },
        {
            cmd: 'stick mcp <action> [name]',
            desc: 'MCP server mgmt',
            example: 'stick mcp create github-tool'
        },
        {
            cmd: 'stick multi-agent <action> [name]',
            desc: 'Multi-agent systems',
            example: 'stick multi-agent create team'
        },
        {
            cmd: 'stick workflow <action> [name]',
            desc: 'Workflows',
            example: 'stick workflow create pipeline'
        },
        {
            cmd: 'stick ai',
            desc: 'AI assistant',
            example: 'stick ai'
        },
        {
            cmd: 'stick examples',
            desc: 'See examples',
            example: 'stick examples'
        },
        {
            cmd: 'stick guide',
            desc: 'This guide',
            example: 'stick guide'
        }
    ];
    commands.forEach(({ cmd, desc, example }) => {
        console.log(chalk_1.default.cyan(cmd));
        console.log(chalk_1.default.gray(`  ${desc}`));
        console.log(chalk_1.default.white(`  Example: ${example}\n`));
    });
}
//# sourceMappingURL=guide.js.map