#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const init_1 = require("./commands/init");
const deploy_1 = require("./commands/deploy");
const list_1 = require("./commands/list");
const run_1 = require("./commands/run");
const stop_1 = require("./commands/stop");
const program = new commander_1.Command();
program
    .name('stick')
    .description('Enterprise AI Agent Orchestration CLI')
    .version('1.0.0');
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
    .action(run_1.runCommand);
program
    .command('stop <agent>')
    .description('Stop a running agent')
    .action(stop_1.stopCommand);
program.parse();
//# sourceMappingURL=cli.js.map