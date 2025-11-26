#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { deployCommand } from './commands/deploy';
import { listCommand } from './commands/list';
import { runCommand } from './commands/run';
import { metricsCommand } from './commands/metrics';
import { logsCommand } from './commands/logs';
import { interactiveMode } from './interactive';
import { parseIntent, suggestCommand, explainIntent, clarifyIntent, showExamples } from './nlp';
import { startAssistant } from './ai-assistant';
import { mcpCommand } from './commands/mcp';
import { multiAgentCommand } from './commands/multi-agent';
import { workflowCommand } from './commands/workflow';
import { guideCommand } from './commands/guide';

const program = new Command();

program
  .name('stick')
  .description('Enterprise AI Agent Orchestration CLI - Natural Language Interface')
  .version('1.1.0');

// If no arguments, launch Stick Agent assistant with AI auto-connected
if (process.argv.length === 2) {
  console.log(chalk.cyan('\n🤖 Launching Stick Agent with AI...\n'));
  console.log(chalk.gray('✨ AI Assistant automatically connected!\n'));
  startAssistant().catch((error) => {
    console.error(chalk.yellow('\n⚠️  AI Assistant unavailable (Ollama not running)'));
    console.log(chalk.cyan('   Run: ollama serve'));
    console.log(chalk.gray('\n   Falling back to interactive mode...\n'));
    interactiveMode().catch((err) => {
      console.error(chalk.red('Error:'), err.message);
      process.exit(1);
    });
  });
} else if (process.argv.length > 2) {
  // Check if user is using natural language
  const firstArg = process.argv[2];
  const knownCommands = ['init', 'deploy', 'list', 'run', 'metrics', 'logs', 'help', '--help', '-h', '--version', '-v', 'examples', 'assistant', 'ai', 'mcp', 'multi-agent', 'multi', 'workflow'];
  
  // If not a known command, try NLP
  if (!knownCommands.includes(firstArg) && !firstArg.startsWith('-')) {
    const fullInput = process.argv.slice(2).join(' ');
    handleNaturalLanguage(fullInput).catch((error) => {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    });
  } else {
  // Command-line mode
  program
    .command('init [name]')
    .description('Initialize a new agent project')
    .option('-t, --template <template>', 'Template to use', 'default')
    .action(initCommand);

  program
    .command('deploy')
    .description('Deploy agent to local or cloud infrastructure')
    .option('-p, --port <port>', 'Port to deploy on', '3000')
    .option('-c, --cloud', 'Deploy to cloud')
    .action(deployCommand);

  program
    .command('list')
    .description('List all configured agents')
    .action(listCommand);

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
    .action(runCommand);

  program
    .command('metrics')
    .description('View agent performance metrics')
    .action(metricsCommand);

  program
    .command('logs')
    .description('View agent logs')
    .option('-a, --agent <agent>', 'Specific agent name')
    .option('-t, --tail', 'Show last N lines', true)
    .option('-n, --lines <number>', 'Number of lines to show', '50')
    .option('-f, --follow', 'Follow log output')
    .action(logsCommand);

  // Override help to show detailed info
  program.addHelpText('after', `

${chalk.bold.cyan('DETAILED COMMAND REFERENCE:')}

${chalk.yellow('Basic Agent Commands:')}
  ${chalk.white('stick init <name> [options]')}           Create new agent project
    ${chalk.gray('-t, --template <name>           Use specific template')}
    
  ${chalk.white('stick run <agent> [options]')}           Run an agent
    ${chalk.gray('-i, --interactive              Interactive chat mode')}
    ${chalk.gray('--input <text>                 Single input to process')}
    ${chalk.gray('-p, --provider <name>          AI provider (openai/anthropic/ollama)')}
    ${chalk.gray('-m, --model <name>             Specific model to use')}
    ${chalk.gray('-t, --temperature <0-1>        Temperature for responses')}
    ${chalk.gray('--max-tokens <number>          Max tokens to generate')}
    ${chalk.gray('--ollama-host <url>            Ollama server URL')}
    ${chalk.gray('-v, --verbose                  Verbose output')}
    
  ${chalk.white('stick list')}                             List all agents
  ${chalk.white('stick metrics')}                          View performance metrics
  ${chalk.white('stick logs [options]')}                   View agent logs
    ${chalk.gray('-a, --agent <name>             Specific agent')}
    ${chalk.gray('-n, --lines <number>           Number of lines')}
    ${chalk.gray('-f, --follow                   Follow log output')}

${chalk.yellow('Deployment:')}
  ${chalk.white('stick deploy [options]')}                 Deploy as HTTP API
    ${chalk.gray('-p, --port <port>              Port number (default: 3000)')}
    ${chalk.gray('-c, --cloud                    Deploy to cloud')}

${chalk.yellow('Advanced Features:')}
  ${chalk.white('stick mcp <action> [name]')}              MCP Server Management
    ${chalk.gray('Actions: create, list, connect, disconnect, test')}
    
  ${chalk.white('stick multi-agent <action> [name]')}      Multi-Agent Systems
    ${chalk.gray('Actions: create, add-agent, run, status')}
    
  ${chalk.white('stick workflow <action> [name]')}         Workflow Pipelines
    ${chalk.gray('Actions: create, add-step, run, visualize')}

${chalk.yellow('AI Assistant:')}
  ${chalk.white('stick')}                                  Launch AI assistant (default)
  ${chalk.white('stick ai')} or ${chalk.white('stick assistant')}           Start AI assistant
  ${chalk.white('stick examples')}                         Show usage examples

${chalk.cyan('Examples:')}
  ${chalk.gray('stick init my-agent')}
  ${chalk.gray('stick run my-agent --interactive')}
  ${chalk.gray('stick run my-agent --provider ollama --model llama3.2:1b')}
  ${chalk.gray('stick deploy --port 8080')}
  ${chalk.gray('stick mcp create my-tool')}
  ${chalk.gray('stick multi-agent create research-team')}

${chalk.dim('For AI-guided setup, just run:')} ${chalk.bold.cyan('stick')}
  `);

  program
    .command('guide')
    .description('📖 Interactive guide - learn everything step-by-step')
    .action(async () => {
      await guideCommand();
    });

  program
    .command('examples')
    .description('Show natural language examples')
    .action(() => {
      showExamples();
    });

  program
    .command('assistant')
    .alias('ai')
    .description('Start AI assistant - guided agent building')
    .action(async () => {
      await startAssistant();
    });

  program
    .command('mcp')
    .description('MCP server management')
    .argument('[action]', 'Action: create, install, list, test, publish')
    .argument('[name]', 'Server name')
    .action(mcpCommand);

  program
    .command('multi-agent')
    .alias('multi')
    .description('Multi-agent system builder')
    .argument('[action]', 'Action: create, list, run, diagram')
    .argument('[name]', 'System name')
    .action(multiAgentCommand);

  program
    .command('workflow')
    .description('Workflow pipeline builder')
    .argument('[action]', 'Action: create, list, run, delete')
    .argument('[name]', 'Workflow name')
    .action(workflowCommand);

  program.parse();
  }
}

/**
 * Handle natural language input
 */
async function handleNaturalLanguage(input: string) {
  console.log(chalk.cyan('\n🧠 Natural Language Mode\n'));
  
  // Parse intent
  let intent = parseIntent(input);
  
  // Show what we understood
  console.log(explainIntent(intent));
  
  // Ask for clarification if confidence is low
  if (intent.confidence < 0.7) {
    intent = await clarifyIntent(input, intent);
  }
  
  // Suggest the command
  const suggestedCmd = suggestCommand(intent);
  console.log(chalk.gray('\nSuggested command: ') + chalk.green(suggestedCmd) + '\n');
  
  // Execute the action
  const { action, entity, params } = intent;
  
  try {
    switch (action) {
      case 'assistant':
        await startAssistant();
        break;
      case 'create':
      case 'init':
        await initCommand(entity, params);
        break;
      case 'mcp':
        await mcpCommand(params?.action, entity, params);
        break;
      case 'multi-agent':
        await multiAgentCommand(params?.action, entity);
        break;
      case 'workflow':
        console.log(chalk.cyan('\n⚙️  Workflow builder coming soon!\n'));
        break;
      case 'list':
        await listCommand();
        break;
      case 'run':
        if (!entity) {
          console.log(chalk.red('Error: Please specify an agent name'));
          console.log(chalk.gray('Example: "run my-agent"'));
          process.exit(1);
        }
        await runCommand(entity, params);
        break;
      case 'deploy':
        await deployCommand(params);
        break;
      case 'metrics':
        await metricsCommand();
        break;
      case 'logs':
        await logsCommand(params);
        break;
      case 'help':
        showExamples();
        program.help();
        break;
      default:
        console.log(chalk.yellow(`Unknown action: ${action}`));
        showExamples();
    }
  } catch (error: any) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}
