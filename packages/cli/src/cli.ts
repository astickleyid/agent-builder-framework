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

const program = new Command();

program
  .name('stick')
  .description('Enterprise AI Agent Orchestration CLI with Natural Language Support')
  .version('1.0.0');

// If no arguments, launch interactive mode
if (process.argv.length === 2) {
  interactiveMode().catch((error) => {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  });
} else if (process.argv.length > 2) {
  // Check if user is using natural language
  const firstArg = process.argv[2];
  const knownCommands = ['init', 'deploy', 'list', 'run', 'metrics', 'logs', 'help', '--help', '-h', '--version', '-v'];
  
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

  program
    .command('examples')
    .description('Show natural language examples')
    .action(() => {
      showExamples();
    });

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
      case 'create':
      case 'init':
        await initCommand(entity, params);
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
