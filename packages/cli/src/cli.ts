#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { deployCommand } from './commands/deploy';
import { listCommand } from './commands/list';
import { runCommand } from './commands/run';

const program = new Command();

program
  .name('stick')
  .description('Enterprise AI Agent Orchestration CLI')
  .version('1.0.0');

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

program.parse();
