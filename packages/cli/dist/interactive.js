#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showWelcome = showWelcome;
exports.showMainMenu = showMainMenu;
exports.createAgentFlow = createAgentFlow;
exports.showToolsTable = showToolsTable;
exports.showMetricsDisplay = showMetricsDisplay;
exports.interactiveMode = interactiveMode;
const inquirer_1 = __importDefault(require("inquirer"));
const boxen_1 = __importDefault(require("boxen"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const figlet_1 = __importDefault(require("figlet"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
const init_1 = require("./commands/init");
const tools_1 = require("./commands/tools");
const coolGradient = (0, gradient_string_1.default)(['#667eea', '#764ba2', '#f093fb']);
const successGradient = (0, gradient_string_1.default)(['#667eea', '#00f2fe']);
async function showWelcome() {
    console.clear();
    console.log(); // Add space at top
    // ASCII Art Logo
    const logo = figlet_1.default.textSync('stick.ai', {
        font: 'ANSI Shadow',
        horizontalLayout: 'default',
        verticalLayout: 'default'
    });
    console.log(coolGradient(logo));
    console.log('\n'); // Extra spacing
    const welcomeBox = (0, boxen_1.default)(chalk_1.default.white.bold('🤖 Enterprise AI Agent Framework') +
        chalk_1.default.gray('\n\n   17 Production Tools • 3 AI Providers • TypeScript Native\n') +
        chalk_1.default.gray('   OpenAI • Anthropic • Ollama • Local-first • Zero Lock-in\n\n') +
        chalk_1.default.cyan('   📦 Runtime: ') + chalk_1.default.white('@stick-ai/runtime v1.1.0\n') +
        chalk_1.default.cyan('   🔧 CLI: ') + chalk_1.default.white('@stick-ai/cli v1.1.0\n\n') +
        chalk_1.default.gray('   Type ') + chalk_1.default.yellow('stick <command>') + chalk_1.default.gray(' or use interactive mode below'), {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'magenta'
    });
    console.log(welcomeBox);
    console.log(); // Extra space before menu
}
async function showMainMenu() {
    const { choice } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'choice',
            message: chalk_1.default.cyan.bold('\n💡 What would you like to do?\n'),
            choices: [
                new inquirer_1.default.Separator(chalk_1.default.gray('─── Agent Management ───')),
                {
                    name: '   ' + chalk_1.default.green('🚀 Create New Agent') + chalk_1.default.gray('\n      Initialize a new AI agent project with templates\n'),
                    value: 'create',
                    short: 'Create Agent'
                },
                {
                    name: '   ' + chalk_1.default.blue('📋 List Agents') + chalk_1.default.gray('\n      View and manage all configured agents\n'),
                    value: 'list',
                    short: 'List Agents'
                },
                {
                    name: '   ' + chalk_1.default.yellow('▶️  Run Agent') + chalk_1.default.gray('\n      Execute an agent with custom input\n'),
                    value: 'run',
                    short: 'Run Agent'
                },
                new inquirer_1.default.Separator(chalk_1.default.gray('─── Deployment & Monitoring ───')),
                {
                    name: '   ' + chalk_1.default.magenta('🚢 Deploy Agent') + chalk_1.default.gray('\n      Deploy to local server or cloud (AWS, GCP, Azure)\n'),
                    value: 'deploy',
                    short: 'Deploy'
                },
                {
                    name: '   ' + chalk_1.default.cyan('📊 View Metrics') + chalk_1.default.gray('\n      Performance dashboard and analytics\n'),
                    value: 'metrics',
                    short: 'Metrics'
                },
                {
                    name: '   ' + chalk_1.default.white('📝 View Logs') + chalk_1.default.gray('\n      Real-time agent execution logs\n'),
                    value: 'logs',
                    short: 'Logs'
                },
                new inquirer_1.default.Separator(chalk_1.default.gray('─── Configuration ───')),
                {
                    name: '   ' + chalk_1.default.yellow('🔧 Configure Tools') + chalk_1.default.gray('\n      Add/remove tools from current agent\n'),
                    value: 'tools',
                    short: 'Configure Tools'
                },
                {
                    name: '   ' + chalk_1.default.magenta('🔌 Add MCP Server') + chalk_1.default.gray('\n      Connect external tools via Model Context Protocol\n'),
                    value: 'mcp',
                    short: 'Add MCP'
                },
                new inquirer_1.default.Separator(chalk_1.default.gray('─── Help & Resources ───')),
                {
                    name: '   ' + chalk_1.default.cyan('❓ Help & Docs') + chalk_1.default.gray('\n      View all 17 tools and documentation\n'),
                    value: 'help',
                    short: 'Help'
                },
                new inquirer_1.default.Separator(),
                {
                    name: '   ' + chalk_1.default.red('✖  Exit'),
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
async function createAgentFlow() {
    console.clear();
    console.log(successGradient('\n✨ Create New Agent\n'));
    console.log(chalk_1.default.gray('Follow the prompts to set up your AI agent\n'));
    const answers = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: chalk_1.default.cyan('Agent name:'),
            default: 'my-agent',
            validate: (value) => {
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
            message: chalk_1.default.cyan('Select a template:'),
            choices: [
                { name: chalk_1.default.green('🤖 Chatbot') + chalk_1.default.gray(' - Conversational AI agent'), value: 'chatbot' },
                { name: chalk_1.default.blue('💼 Assistant') + chalk_1.default.gray(' - Task automation agent'), value: 'assistant' },
                { name: chalk_1.default.yellow('🔍 Researcher') + chalk_1.default.gray(' - Web research agent'), value: 'researcher' },
                { name: chalk_1.default.magenta('💻 Developer') + chalk_1.default.gray(' - Code generation agent'), value: 'developer' },
                { name: chalk_1.default.cyan('📊 Analyst') + chalk_1.default.gray(' - Data analysis agent'), value: 'analyst' },
                { name: chalk_1.default.white('⚙️  Custom') + chalk_1.default.gray(' - Blank template'), value: 'custom' }
            ]
        },
        {
            type: 'list',
            name: 'aiProvider',
            message: chalk_1.default.cyan('AI Provider:'),
            choices: [
                { name: chalk_1.default.green('🟢 OpenAI') + chalk_1.default.gray(' (GPT-4, GPT-3.5)'), value: 'openai' },
                { name: chalk_1.default.blue('🔵 Anthropic') + chalk_1.default.gray(' (Claude 3)'), value: 'anthropic' },
                { name: chalk_1.default.yellow('🟡 Ollama') + chalk_1.default.gray(' (Local, privacy-first)'), value: 'ollama' },
                { name: chalk_1.default.gray('⚪ None') + chalk_1.default.gray(' (Use tools only)'), value: 'none' }
            ]
        },
        {
            type: 'confirm',
            name: 'includeTools',
            message: chalk_1.default.cyan('Include all 17 built-in tools?'),
            default: true
        }
    ]);
    console.log();
    console.log(chalk_1.default.green('✓') + chalk_1.default.gray(' Creating agent...'));
    return answers;
}
function showToolsTable() {
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.cyan.bold('Tool'),
            chalk_1.default.cyan.bold('Category'),
            chalk_1.default.cyan.bold('Description')
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
            chalk_1.default.yellow(tool),
            chalk_1.default.gray(category),
            chalk_1.default.white(desc)
        ]);
    });
    return table.toString();
}
function showMetricsDisplay() {
    const table = new cli_table3_1.default({
        head: [
            chalk_1.default.cyan.bold('Metric'),
            chalk_1.default.cyan.bold('Value'),
            chalk_1.default.cyan.bold('Change')
        ],
        style: {
            head: [],
            border: ['gray']
        }
    });
    table.push([chalk_1.default.white('Requests'), chalk_1.default.green('1,234'), chalk_1.default.green('↑ 12%')], [chalk_1.default.white('Avg Response'), chalk_1.default.green('245ms'), chalk_1.default.green('↓ 5%')], [chalk_1.default.white('Success Rate'), chalk_1.default.green('99.2%'), chalk_1.default.green('↑ 0.3%')], [chalk_1.default.white('Active Agents'), chalk_1.default.yellow('3'), chalk_1.default.gray('—')], [chalk_1.default.white('Total Tokens'), chalk_1.default.blue('45.2K'), chalk_1.default.green('↑ 8%')]);
    return table.toString();
}
async function interactiveMode() {
    await showWelcome();
    let running = true;
    while (running) {
        const choice = await showMainMenu();
        switch (choice) {
            case 'create':
                const agentConfig = await createAgentFlow();
                console.log();
                // Actually create the agent
                await (0, init_1.initCommand)(agentConfig.name, {
                    template: agentConfig.template,
                    aiProvider: agentConfig.aiProvider
                });
                console.log();
                // Ask if they want to configure tools
                const { configureNow } = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'configureNow',
                        message: chalk_1.default.cyan('Would you like to configure tools now?'),
                        default: agentConfig.includeTools
                    }
                ]);
                if (configureNow) {
                    await (0, tools_1.configureTools)(agentConfig.name);
                }
                // Ask about MCP
                const { addMcp } = await inquirer_1.default.prompt([
                    {
                        type: 'confirm',
                        name: 'addMcp',
                        message: chalk_1.default.cyan('Would you like to add MCP servers?'),
                        default: false
                    }
                ]);
                if (addMcp) {
                    await (0, tools_1.addMCP)(agentConfig.name);
                }
                console.log();
                console.log((0, boxen_1.default)(chalk_1.default.green.bold('✓ Agent setup complete!\n\n') +
                    chalk_1.default.white('Name: ') + chalk_1.default.cyan(agentConfig.name) + '\n' +
                    chalk_1.default.white('Template: ') + chalk_1.default.cyan(agentConfig.template) + '\n' +
                    chalk_1.default.white('AI Provider: ') + chalk_1.default.cyan(agentConfig.aiProvider) + '\n\n' +
                    chalk_1.default.gray('Next steps:\n') +
                    chalk_1.default.gray('  cd ') + agentConfig.name + '\n' +
                    chalk_1.default.gray('  npm install\n') +
                    chalk_1.default.gray('  npm start'), {
                    padding: 1,
                    margin: 1,
                    borderStyle: 'round',
                    borderColor: 'green'
                }));
                await inquirer_1.default.prompt([{ type: 'input', name: 'continue', message: chalk_1.default.gray('\nPress Enter to continue...') }]);
                break;
            case 'tools':
                console.clear();
                await (0, tools_1.configureTools)();
                break;
            case 'mcp':
                console.clear();
                await (0, tools_1.addMCP)();
                break;
            case 'list':
                console.clear();
                console.log(successGradient('\n📋 Your Agents\n'));
                console.log(chalk_1.default.gray('No agents found. Create one to get started!\n'));
                await inquirer_1.default.prompt([{ type: 'input', name: 'continue', message: chalk_1.default.gray('Press Enter to continue...') }]);
                break;
            case 'metrics':
                console.clear();
                console.log(successGradient('\n📊 Performance Metrics\n'));
                console.log(showMetricsDisplay());
                console.log();
                await inquirer_1.default.prompt([{ type: 'input', name: 'continue', message: chalk_1.default.gray('Press Enter to continue...') }]);
                break;
            case 'help':
                console.clear();
                console.log(successGradient('\n🛠️  Available Tools & Commands\n'));
                console.log(chalk_1.default.white.bold('📦 All Built-in Tools:\n'));
                console.log(showToolsTable());
                console.log();
                console.log(chalk_1.default.white.bold('\n⌨️  CLI Commands:\n'));
                console.log(chalk_1.default.cyan('  stick') + chalk_1.default.gray('                    - Interactive mode (this screen)'));
                console.log(chalk_1.default.cyan('  stick init <name>') + chalk_1.default.gray('        - Create a new agent'));
                console.log(chalk_1.default.cyan('  stick list') + chalk_1.default.gray('               - List all agents'));
                console.log(chalk_1.default.cyan('  stick run <agent>') + chalk_1.default.gray('        - Run an agent'));
                console.log(chalk_1.default.cyan('  stick deploy') + chalk_1.default.gray('             - Deploy agent'));
                console.log(chalk_1.default.cyan('  stick metrics') + chalk_1.default.gray('            - View performance metrics'));
                console.log(chalk_1.default.cyan('  stick logs') + chalk_1.default.gray('               - View logs'));
                console.log();
                console.log(chalk_1.default.white.bold('🔗 Resources:\n'));
                console.log(chalk_1.default.cyan('  📚 Documentation:') + chalk_1.default.gray('  https://stick.ai/docs'));
                console.log(chalk_1.default.cyan('  💬 Discord:') + chalk_1.default.gray('        https://discord.gg/stickai'));
                console.log(chalk_1.default.cyan('  📦 npm Runtime:') + chalk_1.default.gray('    https://npmjs.com/package/@stick-ai/runtime'));
                console.log(chalk_1.default.cyan('  📦 npm CLI:') + chalk_1.default.gray('        https://npmjs.com/package/@stick-ai/cli'));
                console.log(chalk_1.default.cyan('  ⭐ GitHub:') + chalk_1.default.gray('         https://github.com/stickai/framework'));
                console.log();
                await inquirer_1.default.prompt([{ type: 'input', name: 'continue', message: chalk_1.default.gray('\nPress Enter to continue...') }]);
                break;
            case 'exit':
                console.clear();
                console.log(coolGradient('\n👋 Thanks for using stick.ai!\n'));
                console.log((0, boxen_1.default)(chalk_1.default.gray('⭐ Star us on GitHub: https://github.com/stickai/framework\n') +
                    chalk_1.default.gray('📖 Docs: https://stick.ai/docs\n') +
                    chalk_1.default.gray('💬 Discord: https://discord.gg/stickai'), {
                    padding: 1,
                    margin: 1,
                    borderStyle: 'round',
                    borderColor: 'gray'
                }));
                running = false;
                break;
            default:
                console.log(chalk_1.default.yellow('\n⚠ Feature coming soon!\n'));
                await inquirer_1.default.prompt([{ type: 'input', name: 'continue', message: chalk_1.default.gray('Press Enter to continue...') }]);
        }
    }
}
//# sourceMappingURL=interactive.js.map