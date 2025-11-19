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

const program = new Command();

program
  .name('stick')
  .description('Enterprise AI Agent Orchestration CLI')
  .version('1.0.0');

// If no arguments, launch interactive mode
if (process.argv.length === 2) {
  interactiveMode().catch((error) => {
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

  program.parse();
}
