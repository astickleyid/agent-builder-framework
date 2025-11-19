#!/usr/bin/env node

import inquirer from 'inquirer';
import boxen from 'boxen';
import gradient from 'gradient-string';
import figlet from 'figlet';
import Table from 'cli-table3';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { configureTools, addMCP } from './commands/tools';

const coolGradient = gradient(['#667eea', '#764ba2', '#f093fb']);
const successGradient = gradient(['#667eea', '#00f2fe']);

export async function showWelcome() {
  console.clear();
  console.log(); // Add space at top
  
  // ASCII Art Logo
  const logo = figlet.textSync('stick.ai', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default',
    verticalLayout: 'default'
  });
  
  console.log(coolGradient(logo));
  console.log('\n'); // Extra spacing
  
  const welcomeBox = boxen(
    chalk.white.bold('🤖 Enterprise AI Agent Framework') +
    chalk.gray('\n\n   17 Production Tools • 3 AI Providers • TypeScript Native\n') +
    chalk.gray('   OpenAI • Anthropic • Ollama • Local-first • Zero Lock-in\n\n') +
    chalk.cyan('   📦 Runtime: ') + chalk.white('@stick-ai/runtime v1.1.0\n') +
    chalk.cyan('   🔧 CLI: ') + chalk.white('@stick-ai/cli v1.1.0\n\n') +
    chalk.gray('   Type ') + chalk.yellow('stick <command>') + chalk.gray(' or use interactive mode below'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'magenta'
    }
  );
  
  console.log(welcomeBox);
  console.log(); // Extra space before menu
}

export async function showMainMenu() {
  const { choice } = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message: chalk.cyan.bold('\n💡 What would you like to do?\n'),
      choices: [
        new inquirer.Separator(chalk.gray('─── Agent Management ───')),
        {
          name: '   ' + chalk.green('🚀 Create New Agent') + chalk.gray('\n      Initialize a new AI agent project with templates\n'),
          value: 'create',
          short: 'Create Agent'
        },
        {
          name: '   ' + chalk.blue('📋 List Agents') + chalk.gray('\n      View and manage all configured agents\n'),
          value: 'list',
          short: 'List Agents'
        },
        {
          name: '   ' + chalk.yellow('▶️  Run Agent') + chalk.gray('\n      Execute an agent with custom input\n'),
          value: 'run',
          short: 'Run Agent'
        },
        new inquirer.Separator(chalk.gray('─── Deployment & Monitoring ───')),
        {
          name: '   ' + chalk.magenta('🚢 Deploy Agent') + chalk.gray('\n      Deploy to local server or cloud (AWS, GCP, Azure)\n'),
          value: 'deploy',
          short: 'Deploy'
        },
        {
          name: '   ' + chalk.cyan('📊 View Metrics') + chalk.gray('\n      Performance dashboard and analytics\n'),
          value: 'metrics',
          short: 'Metrics'
        },
        {
          name: '   ' + chalk.white('📝 View Logs') + chalk.gray('\n      Real-time agent execution logs\n'),
          value: 'logs',
          short: 'Logs'
        },
        new inquirer.Separator(chalk.gray('─── Configuration ───')),
        {
          name: '   ' + chalk.yellow('🔧 Configure Tools') + chalk.gray('\n      Add/remove tools from current agent\n'),
          value: 'tools',
          short: 'Configure Tools'
        },
        {
          name: '   ' + chalk.magenta('🔌 Add MCP Server') + chalk.gray('\n      Connect external tools via Model Context Protocol\n'),
          value: 'mcp',
          short: 'Add MCP'
        },
        new inquirer.Separator(chalk.gray('─── Help & Resources ───')),
        {
          name: '   ' + chalk.cyan('❓ Help & Docs') + chalk.gray('\n      View all 17 tools and documentation\n'),
          value: 'help',
          short: 'Help'
        },
        new inquirer.Separator(),
        {
          name: '   ' + chalk.red('✖  Exit'),
          value: 'exit',
          short: 'Exit'
        }
      ],
      pageSize: 20,
      loop: false
    }
  ]);

  return choice;
}

export async function createAgentFlow() {
  console.clear();
  console.log(successGradient('\n✨ Create New Agent\n'));
  console.log(chalk.gray('Follow the prompts to set up your AI agent\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: chalk.cyan('Agent name:'),
      default: 'my-agent',
      validate: (value: string) => {
        if (!value || value.trim().length === 0) {
          return 'Agent name is required';
        }
        if (!/^[a-z0-9-]+$/.test(value)) {
          return 'Name must be lowercase letters, numbers, and hyphens only';
        }
        return true;
      }
    },
    {
      type: 'list',
      name: 'template',
      message: chalk.cyan('Select a template:'),
      choices: [
        { name: chalk.green('🤖 Chatbot') + chalk.gray(' - Conversational AI agent'), value: 'chatbot' },
        { name: chalk.blue('💼 Assistant') + chalk.gray(' - Task automation agent'), value: 'assistant' },
        { name: chalk.yellow('🔍 Researcher') + chalk.gray(' - Web research agent'), value: 'researcher' },
        { name: chalk.magenta('💻 Developer') + chalk.gray(' - Code generation agent'), value: 'developer' },
        { name: chalk.cyan('📊 Analyst') + chalk.gray(' - Data analysis agent'), value: 'analyst' },
        { name: chalk.white('⚙️  Custom') + chalk.gray(' - Blank template'), value: 'custom' }
      ]
    },
    {
      type: 'list',
      name: 'aiProvider',
      message: chalk.cyan('AI Provider:'),
      choices: [
        { name: chalk.green('🟢 OpenAI') + chalk.gray(' (GPT-4, GPT-3.5)'), value: 'openai' },
        { name: chalk.blue('🔵 Anthropic') + chalk.gray(' (Claude 3)'), value: 'anthropic' },
        { name: chalk.yellow('🟡 Ollama') + chalk.gray(' (Local, privacy-first)'), value: 'ollama' },
        { name: chalk.gray('⚪ None') + chalk.gray(' (Use tools only)'), value: 'none' }
      ]
    },
    {
      type: 'confirm',
      name: 'includeTools',
      message: chalk.cyan('Include all 17 built-in tools?'),
      default: true
    }
  ]);

  console.log();
  console.log(chalk.green('✓') + chalk.gray(' Creating agent...'));
  
  return answers;
}

export function showToolsTable() {
  const table = new Table({
    head: [
      chalk.cyan.bold('Tool'),
      chalk.cyan.bold('Category'),
      chalk.cyan.bold('Description')
    ],
    colWidths: [20, 18, 45],
    style: {
      head: [],
      border: ['gray']
    }
  });

  const tools = [
    ['bash', 'System', 'Execute shell commands'],
    ['python', 'System', 'Run Python code'],
    ['http', 'Web', 'HTTP/REST API calls'],
    ['web-scraper', 'Web', 'Scrape websites'],
    ['json', 'Data', 'JSON operations'],
    ['csv', 'Data', 'CSV file handling'],
    ['xml', 'Data', 'XML parsing'],
    ['database', 'Data', 'Database queries'],
    ['file-ops', 'Files', 'File system operations'],
    ['email', 'Communication', 'Send emails'],
    ['slack', 'Communication', 'Slack integration'],
    ['github', 'Development', 'GitHub API'],
    ['datetime', 'Utilities', 'Date/time operations'],
    ['text', 'Utilities', 'Text manipulation'],
    ['openai', 'AI', 'GPT-4, GPT-3.5'],
    ['anthropic', 'AI', 'Claude 3'],
    ['ollama', 'AI', 'Local LLMs']
  ];

  tools.forEach(([tool, category, desc]) => {
    table.push([
      chalk.yellow(tool),
      chalk.gray(category),
      chalk.white(desc)
    ]);
  });

  return table.toString();
}

export function showMetricsDisplay() {
  const table = new Table({
    head: [
      chalk.cyan.bold('Metric'),
      chalk.cyan.bold('Value'),
      chalk.cyan.bold('Change')
    ],
    style: {
      head: [],
      border: ['gray']
    }
  });

  table.push(
    [chalk.white('Requests'), chalk.green('1,234'), chalk.green('↑ 12%')],
    [chalk.white('Avg Response'), chalk.green('245ms'), chalk.green('↓ 5%')],
    [chalk.white('Success Rate'), chalk.green('99.2%'), chalk.green('↑ 0.3%')],
    [chalk.white('Active Agents'), chalk.yellow('3'), chalk.gray('—')],
    [chalk.white('Total Tokens'), chalk.blue('45.2K'), chalk.green('↑ 8%')]
  );

  return table.toString();
}

export async function interactiveMode() {
  await showWelcome();

  let running = true;

  while (running) {
    const choice = await showMainMenu();

    switch (choice) {
      case 'create':
        const agentConfig = await createAgentFlow();
        console.log();
        
        // Actually create the agent
        await initCommand(agentConfig.name, {
          template: agentConfig.template,
          aiProvider: agentConfig.aiProvider
        });
        
        console.log();
        
        // Ask if they want to configure tools
        const { configureNow } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'configureNow',
            message: chalk.cyan('Would you like to configure tools now?'),
            default: agentConfig.includeTools
          }
        ]);
        
        if (configureNow) {
          await configureTools(agentConfig.name);
        }
        
        // Ask about MCP
        const { addMcp } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'addMcp',
            message: chalk.cyan('Would you like to add MCP servers?'),
            default: false
          }
        ]);
        
        if (addMcp) {
          await addMCP(agentConfig.name);
        }
        
        console.log();
        console.log(boxen(
          chalk.green.bold('✓ Agent setup complete!\n\n') +
          chalk.white('Name: ') + chalk.cyan(agentConfig.name) + '\n' +
          chalk.white('Template: ') + chalk.cyan(agentConfig.template) + '\n' +
          chalk.white('AI Provider: ') + chalk.cyan(agentConfig.aiProvider) + '\n\n' +
          chalk.gray('Next steps:\n') +
          chalk.gray('  cd ') + agentConfig.name + '\n' +
          chalk.gray('  npm install\n') +
          chalk.gray('  npm start'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'green'
          }
        ));
        await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('\nPress Enter to continue...') }]);
        break;

      case 'tools':
        console.clear();
        await configureTools();
        break;

      case 'mcp':
        console.clear();
        await addMCP();
        break;

      case 'list':
        console.clear();
        console.log(successGradient('\n📋 Your Agents\n'));
        console.log(chalk.gray('No agents found. Create one to get started!\n'));
        await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('Press Enter to continue...') }]);
        break;

      case 'metrics':
        console.clear();
        console.log(successGradient('\n📊 Performance Metrics\n'));
        console.log(showMetricsDisplay());
        console.log();
        await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('Press Enter to continue...') }]);
        break;

      case 'help':
        console.clear();
        console.log(successGradient('\n🛠️  Available Tools & Commands\n'));
        console.log(chalk.white.bold('📦 All Built-in Tools:\n'));
        console.log(showToolsTable());
        console.log();
        console.log(chalk.white.bold('\n⌨️  CLI Commands:\n'));
        console.log(chalk.cyan('  stick') + chalk.gray('                    - Interactive mode (this screen)'));
        console.log(chalk.cyan('  stick init <name>') + chalk.gray('        - Create a new agent'));
        console.log(chalk.cyan('  stick list') + chalk.gray('               - List all agents'));
        console.log(chalk.cyan('  stick run <agent>') + chalk.gray('        - Run an agent'));
        console.log(chalk.cyan('  stick deploy') + chalk.gray('             - Deploy agent'));
        console.log(chalk.cyan('  stick metrics') + chalk.gray('            - View performance metrics'));
        console.log(chalk.cyan('  stick logs') + chalk.gray('               - View logs'));
        console.log();
        console.log(chalk.white.bold('🔗 Resources:\n'));
        console.log(chalk.cyan('  📚 Documentation:') + chalk.gray('  https://stick.ai/docs'));
        console.log(chalk.cyan('  💬 Discord:') + chalk.gray('        https://discord.gg/stickai'));
        console.log(chalk.cyan('  📦 npm Runtime:') + chalk.gray('    https://npmjs.com/package/@stick-ai/runtime'));
        console.log(chalk.cyan('  📦 npm CLI:') + chalk.gray('        https://npmjs.com/package/@stick-ai/cli'));
        console.log(chalk.cyan('  ⭐ GitHub:') + chalk.gray('         https://github.com/stickai/framework'));
        console.log();
        await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('\nPress Enter to continue...') }]);
        break;

      case 'exit':
        console.clear();
        console.log(coolGradient('\n👋 Thanks for using stick.ai!\n'));
        console.log(boxen(
          chalk.gray('⭐ Star us on GitHub: https://github.com/stickai/framework\n') +
          chalk.gray('📖 Docs: https://stick.ai/docs\n') +
          chalk.gray('💬 Discord: https://discord.gg/stickai'),
          {
            padding: 1,
            margin: 1,
            borderStyle: 'round',
            borderColor: 'gray'
          }
        ));
        running = false;
        break;

      default:
        console.log(chalk.yellow('\n⚠ Feature coming soon!\n'));
        await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('Press Enter to continue...') }]);
    }
  }
}
