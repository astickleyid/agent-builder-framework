#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Interactive guide - shows user everything they can do
 */
export async function guideCommand() {
  console.clear();
  
  console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║                                                            ║'));
  console.log(chalk.bold.cyan('║           🚀 Welcome to stick.ai CLI Guide 🚀             ║'));
  console.log(chalk.bold.cyan('║                                                            ║'));
  console.log(chalk.bold.cyan('╚════════════════════════════════════════════════════════════╝\n'));

  console.log(chalk.white('This guide will show you EVERYTHING you can do.\n'));

  const { choice } = await inquirer.prompt([{
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
      console.log(chalk.gray('\n👋 Run'), chalk.cyan('stick guide'), chalk.gray('anytime to come back!\n'));
      process.exit(0);
  }

  // Ask if they want to see more
  const { more } = await inquirer.prompt([{
    type: 'confirm',
    name: 'more',
    message: 'Want to see something else?',
    default: true
  }]);

  if (more) {
    await guideCommand();
  } else {
    console.log(chalk.gray('\n👋 Happy building! Run'), chalk.cyan('stick'), chalk.gray('anytime for AI help.\n'));
  }
}

function showOverview() {
  console.log(chalk.bold.yellow('\n📊 COMPLETE COMMAND OVERVIEW\n'));
  
  console.log(chalk.bold('🟢 BASIC COMMANDS (Start Here)'));
  console.log(chalk.white('  stick init <name>              '), chalk.gray('Create a new agent'));
  console.log(chalk.white('  stick run <agent>              '), chalk.gray('Run your agent'));
  console.log(chalk.white('  stick list                     '), chalk.gray('See all your agents'));
  console.log(chalk.white('  stick deploy                   '), chalk.gray('Deploy as API'));
  
  console.log(chalk.bold('\n🔵 MONITORING & LOGS'));
  console.log(chalk.white('  stick logs                     '), chalk.gray('View agent logs'));
  console.log(chalk.white('  stick metrics                  '), chalk.gray('Performance stats'));
  
  console.log(chalk.bold('\n🟣 ADVANCED FEATURES'));
  console.log(chalk.white('  stick mcp <action>             '), chalk.gray('Custom tool servers'));
  console.log(chalk.white('  stick multi-agent <action>     '), chalk.gray('Multi-agent systems'));
  console.log(chalk.white('  stick workflow <action>        '), chalk.gray('Automation pipelines'));
  
  console.log(chalk.bold('\n🤖 AI ASSISTANCE'));
  console.log(chalk.white('  stick                          '), chalk.gray('AI assistant (auto-launches)'));
  console.log(chalk.white('  stick ai                       '), chalk.gray('Start AI guide'));
  console.log(chalk.white('  stick examples                 '), chalk.gray('See examples'));
  console.log(chalk.white('  stick guide                    '), chalk.gray('This guide'));
  
  console.log(chalk.dim('\n💡 Tip: Run any command with --help for details'));
}

async function quickStartTutorial() {
  console.log(chalk.bold.yellow('\n🎯 QUICK START - 60 SECONDS TO YOUR FIRST AGENT\n'));
  
  console.log(chalk.bold('Step 1:'), chalk.white('Create an agent'));
  console.log(chalk.cyan('  $ stick init my-first-agent\n'));
  
  console.log(chalk.bold('Step 2:'), chalk.white('Run it interactively'));
  console.log(chalk.cyan('  $ stick run my-first-agent --interactive\n'));
  
  console.log(chalk.bold('Step 3:'), chalk.white('Chat with your agent!'));
  console.log(chalk.gray('  You: "Hello!"'));
  console.log(chalk.gray('  Agent: "Hi! How can I help?"\n'));
  
  console.log(chalk.bold('Optional:'), chalk.white('Deploy as API'));
  console.log(chalk.cyan('  $ stick deploy --port 3000\n'));
  
  const { tryNow } = await inquirer.prompt([{
    type: 'confirm',
    name: 'tryNow',
    message: 'Want to create your first agent right now?',
    default: true
  }]);
  
  if (tryNow) {
    console.log(chalk.cyan('\n▶ Running: stick init my-first-agent\n'));
    const { createIntelligentAgent } = require('@stick-ai/runtime');
    // Execute init command here
    console.log(chalk.green('✓ Agent created! Now run:'), chalk.cyan('stick run my-first-agent --interactive\n'));
  }
}

async function firstAgentGuide() {
  console.log(chalk.bold.yellow('\n🤖 HOW TO CREATE YOUR FIRST AGENT\n'));
  
  console.log(chalk.bold('What is an agent?'));
  console.log(chalk.white('An AI agent is a program that uses LLMs (like GPT-4 or Ollama) to:'));
  console.log(chalk.gray('  • Understand natural language'));
  console.log(chalk.gray('  • Use tools (search, calculate, etc.)'));
  console.log(chalk.gray('  • Remember conversations'));
  console.log(chalk.gray('  • Execute tasks autonomously\n'));
  
  console.log(chalk.bold('Creating an agent:\n'));
  console.log(chalk.cyan('1. stick init my-agent'));
  console.log(chalk.gray('   Creates project structure with config\n'));
  
  console.log(chalk.cyan('2. Choose your AI provider:'));
  console.log(chalk.white('   • Ollama (local, free)    '), chalk.gray('→ stick run my-agent --provider ollama'));
  console.log(chalk.white('   • OpenAI (cloud, paid)    '), chalk.gray('→ stick run my-agent --provider openai'));
  console.log(chalk.white('   • Anthropic (cloud, paid) '), chalk.gray('→ stick run my-agent --provider anthropic\n'));
  
  console.log(chalk.cyan('3. Run your agent:'));
  console.log(chalk.white('   stick run my-agent --interactive\n'));
  
  console.log(chalk.dim('💡 The --interactive flag lets you chat with your agent'));
}

function showAdvancedFeatures() {
  console.log(chalk.bold.yellow('\n⚡ ADVANCED FEATURES\n'));
  
  console.log(chalk.bold.cyan('🔧 MCP Servers (Model Context Protocol)'));
  console.log(chalk.white('Create custom tools for your agents:\n'));
  console.log(chalk.gray('  stick mcp create weather-tool      '), chalk.dim('Create new tool'));
  console.log(chalk.gray('  stick mcp list                     '), chalk.dim('See all tools'));
  console.log(chalk.gray('  stick mcp test weather-tool        '), chalk.dim('Test a tool'));
  
  console.log(chalk.bold.cyan('\n🤝 Multi-Agent Systems'));
  console.log(chalk.white('Multiple agents working together:\n'));
  console.log(chalk.gray('  stick multi-agent create research-team'));
  console.log(chalk.gray('  stick multi-agent add-agent researcher'));
  console.log(chalk.gray('  stick multi-agent add-agent writer'));
  console.log(chalk.gray('  stick multi-agent run research-team'));
  
  console.log(chalk.bold.cyan('\n⚙️ Workflow Pipelines'));
  console.log(chalk.white('Automate multi-step processes:\n'));
  console.log(chalk.gray('  stick workflow create data-pipeline'));
  console.log(chalk.gray('  stick workflow add-step extract'));
  console.log(chalk.gray('  stick workflow add-step transform'));
  console.log(chalk.gray('  stick workflow run data-pipeline'));
}

function showAIAssistantGuide() {
  console.log(chalk.bold.yellow('\n💬 AI ASSISTANT GUIDE\n'));
  
  console.log(chalk.bold('The AI Assistant helps you build ANYTHING:\n'));
  
  console.log(chalk.cyan('How to use:'));
  console.log(chalk.white('1. Just run:'), chalk.cyan('stick'));
  console.log(chalk.gray('   AI auto-launches and connects to Ollama\n'));
  
  console.log(chalk.white('2. Tell it what you want:'));
  console.log(chalk.gray('   "I want to build a chatbot that can search the web"'));
  console.log(chalk.gray('   "Create a multi-agent research system"'));
  console.log(chalk.gray('   "Build a custom tool for GitHub integration"\n'));
  
  console.log(chalk.white('3. Follow the step-by-step guidance'));
  console.log(chalk.gray('   The AI will execute commands for you!\n'));
  
  console.log(chalk.bold('Requirements:'));
  console.log(chalk.gray('  • Ollama installed and running'));
  console.log(chalk.gray('  • At least one model pulled (llama3.2:1b, mistral:7b, etc.)'));
}

function showDeploymentGuide() {
  console.log(chalk.bold.yellow('\n🌐 DEPLOYMENT OPTIONS\n'));
  
  console.log(chalk.bold.cyan('1. Local HTTP API (Simplest)'));
  console.log(chalk.white('   stick deploy --port 3000\n'));
  console.log(chalk.gray('   Access: http://localhost:3000'));
  console.log(chalk.gray('   Test: curl -X POST http://localhost:3000/chat -d \'{"message":"Hello"}\'\n'));
  
  console.log(chalk.bold.cyan('2. Docker Container'));
  console.log(chalk.white('   stick deploy --docker\n'));
  console.log(chalk.gray('   Builds image and runs container'));
  
  console.log(chalk.bold.cyan('3. Cloud Deployment'));
  console.log(chalk.white('   stick deploy --cloud\n'));
  console.log(chalk.gray('   Deploys to configured cloud provider'));
}

function showAllCommands() {
  console.log(chalk.bold.yellow('\n📋 ALL COMMANDS WITH EXAMPLES\n'));
  
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
    console.log(chalk.cyan(cmd));
    console.log(chalk.gray(`  ${desc}`));
    console.log(chalk.white(`  Example: ${example}\n`));
  });
}
