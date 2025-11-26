#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const init_1 = require("./commands/init");
const deploy_1 = require("./commands/deploy");
const list_1 = require("./commands/list");
const run_1 = require("./commands/run");
const metrics_1 = require("./commands/metrics");
const logs_1 = require("./commands/logs");
const interactive_1 = require("./interactive");
const nlp_1 = require("./nlp");
const ai_assistant_1 = require("./ai-assistant");
const mcp_1 = require("./commands/mcp");
const multi_agent_1 = require("./commands/multi-agent");
const workflow_1 = require("./commands/workflow");
const guide_1 = require("./commands/guide");
const program = new commander_1.Command();
program
    .name('stick')
    .description('Enterprise AI Agent Orchestration CLI - Natural Language Interface')
    .version('1.1.0');
// If no arguments, launch Stick Agent assistant with AI auto-connected
if (process.argv.length === 2) {
    console.log(chalk_1.default.cyan('\n🤖 Launching Stick Agent with AI...\n'));
    console.log(chalk_1.default.gray('✨ AI Assistant automatically connected!\n'));
    (0, ai_assistant_1.startAssistant)().catch((error) => {
        console.error(chalk_1.default.yellow('\n⚠️  AI Assistant unavailable (Ollama not running)'));
        console.log(chalk_1.default.cyan('   Run: ollama serve'));
        console.log(chalk_1.default.gray('\n   Falling back to interactive mode...\n'));
        (0, interactive_1.interactiveMode)().catch((err) => {
            console.error(chalk_1.default.red('Error:'), err.message);
            process.exit(1);
        });
    });
}
else if (process.argv.length > 2) {
    // Check if user is using natural language
    const firstArg = process.argv[2];
    const knownCommands = ['init', 'deploy', 'list', 'run', 'metrics', 'logs', 'help', '--help', '-h', '--version', '-v', 'examples', 'assistant', 'ai', 'mcp', 'multi-agent', 'multi', 'workflow'];
    // If not a known command, try NLP
    if (!knownCommands.includes(firstArg) && !firstArg.startsWith('-')) {
        const fullInput = process.argv.slice(2).join(' ');
        handleNaturalLanguage(fullInput).catch((error) => {
            console.error(chalk_1.default.red('Error:'), error.message);
            process.exit(1);
        });
    }
    else {
        // Command-line mode
        program
            .command('init [name]')
            .description('Initialize a new agent project')
            .option('-t, --template <template>', 'Template to use', 'default')
            .action(init_1.initCommand);
        program
            .command('deploy')
            .description('Deploy agent to local or cloud infrastructure')
            .option('-p, --port <port>', 'Port to deploy on', '3000')
            .option('-c, --cloud', 'Deploy to cloud')
            .action(deploy_1.deployCommand);
        program
            .command('list')
            .description('List all configured agents')
            .action(list_1.listCommand);
        program
            .command('run <agent>')
            .description('Run a specific agent')
            .option('-i, --interactive', 'Run in interactive mode')
            .option('--input <text>', 'Single input to process')
            .option('-p, --provider <provider>', 'AI provider (openai, anthropic, ollama)')
            .option('-m, --model <model>', 'Model to use')
            .option('-t, --temperature <temp>', 'Temperature (0-1)', parseFloat)
            .option('--max-tokens <tokens>', 'Max tokens to generate', parseInt)
            .option('--ollama-host <host>', 'Ollama host URL')
            .option('-v, --verbose', 'Verbose output')
            .action(run_1.runCommand);
        program
            .command('metrics')
            .description('View agent performance metrics')
            .action(metrics_1.metricsCommand);
        program
            .command('logs')
            .description('View agent logs')
            .option('-a, --agent <agent>', 'Specific agent name')
            .option('-t, --tail', 'Show last N lines', true)
            .option('-n, --lines <number>', 'Number of lines to show', '50')
            .option('-f, --follow', 'Follow log output')
            .action(logs_1.logsCommand);
        // Override help to show detailed info
        program.addHelpText('after', `

${chalk_1.default.bold.cyan('DETAILED COMMAND REFERENCE:')}

${chalk_1.default.yellow('Basic Agent Commands:')}
  ${chalk_1.default.white('stick init <name> [options]')}           Create new agent project
    ${chalk_1.default.gray('-t, --template <name>           Use specific template')}
    
  ${chalk_1.default.white('stick run <agent> [options]')}           Run an agent
    ${chalk_1.default.gray('-i, --interactive              Interactive chat mode')}
    ${chalk_1.default.gray('--input <text>                 Single input to process')}
    ${chalk_1.default.gray('-p, --provider <name>          AI provider (openai/anthropic/ollama)')}
    ${chalk_1.default.gray('-m, --model <name>             Specific model to use')}
    ${chalk_1.default.gray('-t, --temperature <0-1>        Temperature for responses')}
    ${chalk_1.default.gray('--max-tokens <number>          Max tokens to generate')}
    ${chalk_1.default.gray('--ollama-host <url>            Ollama server URL')}
    ${chalk_1.default.gray('-v, --verbose                  Verbose output')}
    
  ${chalk_1.default.white('stick list')}                             List all agents
  ${chalk_1.default.white('stick metrics')}                          View performance metrics
  ${chalk_1.default.white('stick logs [options]')}                   View agent logs
    ${chalk_1.default.gray('-a, --agent <name>             Specific agent')}
    ${chalk_1.default.gray('-n, --lines <number>           Number of lines')}
    ${chalk_1.default.gray('-f, --follow                   Follow log output')}

${chalk_1.default.yellow('Deployment:')}
  ${chalk_1.default.white('stick deploy [options]')}                 Deploy as HTTP API
    ${chalk_1.default.gray('-p, --port <port>              Port number (default: 3000)')}
    ${chalk_1.default.gray('-c, --cloud                    Deploy to cloud')}

${chalk_1.default.yellow('Advanced Features:')}
  ${chalk_1.default.white('stick mcp <action> [name]')}              MCP Server Management
    ${chalk_1.default.gray('Actions: create, list, connect, disconnect, test')}
    
  ${chalk_1.default.white('stick multi-agent <action> [name]')}      Multi-Agent Systems
    ${chalk_1.default.gray('Actions: create, add-agent, run, status')}
    
  ${chalk_1.default.white('stick workflow <action> [name]')}         Workflow Pipelines
    ${chalk_1.default.gray('Actions: create, add-step, run, visualize')}

${chalk_1.default.yellow('AI Assistant:')}
  ${chalk_1.default.white('stick')}                                  Launch AI assistant (default)
  ${chalk_1.default.white('stick ai')} or ${chalk_1.default.white('stick assistant')}           Start AI assistant
  ${chalk_1.default.white('stick examples')}                         Show usage examples

${chalk_1.default.cyan('Examples:')}
  ${chalk_1.default.gray('stick init my-agent')}
  ${chalk_1.default.gray('stick run my-agent --interactive')}
  ${chalk_1.default.gray('stick run my-agent --provider ollama --model llama3.2:1b')}
  ${chalk_1.default.gray('stick deploy --port 8080')}
  ${chalk_1.default.gray('stick mcp create my-tool')}
  ${chalk_1.default.gray('stick multi-agent create research-team')}

${chalk_1.default.dim('For AI-guided setup, just run:')} ${chalk_1.default.bold.cyan('stick')}
  `);
        program
            .command('guide')
            .description('📖 Interactive guide - learn everything step-by-step')
            .action(async () => {
            await (0, guide_1.guideCommand)();
        });
        program
            .command('examples')
            .description('Show natural language examples')
            .action(() => {
            (0, nlp_1.showExamples)();
        });
        program
            .command('assistant')
            .alias('ai')
            .description('Start AI assistant - guided agent building')
            .action(async () => {
            await (0, ai_assistant_1.startAssistant)();
        });
        program
            .command('mcp')
            .description('MCP server management')
            .argument('[action]', 'Action: create, install, list, test, publish')
            .argument('[name]', 'Server name')
            .action(mcp_1.mcpCommand);
        program
            .command('multi-agent')
            .alias('multi')
            .description('Multi-agent system builder')
            .argument('[action]', 'Action: create, list, run, diagram')
            .argument('[name]', 'System name')
            .action(multi_agent_1.multiAgentCommand);
        program
            .command('workflow')
            .description('Workflow pipeline builder')
            .argument('[action]', 'Action: create, list, run, delete')
            .argument('[name]', 'Workflow name')
            .action(workflow_1.workflowCommand);
        program.parse();
    }
}
/**
 * Handle natural language input
 */
async function handleNaturalLanguage(input) {
    console.log(chalk_1.default.cyan('\n🧠 Natural Language Mode\n'));
    // Parse intent
    let intent = (0, nlp_1.parseIntent)(input);
    // Show what we understood
    console.log((0, nlp_1.explainIntent)(intent));
    // Ask for clarification if confidence is low
    if (intent.confidence < 0.7) {
        intent = await (0, nlp_1.clarifyIntent)(input, intent);
    }
    // Suggest the command
    const suggestedCmd = (0, nlp_1.suggestCommand)(intent);
    console.log(chalk_1.default.gray('\nSuggested command: ') + chalk_1.default.green(suggestedCmd) + '\n');
    // Execute the action
    const { action, entity, params } = intent;
    try {
        switch (action) {
            case 'assistant':
                await (0, ai_assistant_1.startAssistant)();
                break;
            case 'create':
            case 'init':
                await (0, init_1.initCommand)(entity, params);
                break;
            case 'mcp':
                await (0, mcp_1.mcpCommand)(params?.action, entity, params);
                break;
            case 'multi-agent':
                await (0, multi_agent_1.multiAgentCommand)(params?.action, entity);
                break;
            case 'workflow':
                console.log(chalk_1.default.cyan('\n⚙️  Workflow builder coming soon!\n'));
                break;
            case 'list':
                await (0, list_1.listCommand)();
                break;
            case 'run':
                if (!entity) {
                    console.log(chalk_1.default.red('Error: Please specify an agent name'));
                    console.log(chalk_1.default.gray('Example: "run my-agent"'));
                    process.exit(1);
                }
                await (0, run_1.runCommand)(entity, params);
                break;
            case 'deploy':
                await (0, deploy_1.deployCommand)(params);
                break;
            case 'metrics':
                await (0, metrics_1.metricsCommand)();
                break;
            case 'logs':
                await (0, logs_1.logsCommand)(params);
                break;
            case 'help':
                (0, nlp_1.showExamples)();
                program.help();
                break;
            default:
                console.log(chalk_1.default.yellow(`Unknown action: ${action}`));
                (0, nlp_1.showExamples)();
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error.message);
        process.exit(1);
    }
}
//# sourceMappingURL=cli.js.map