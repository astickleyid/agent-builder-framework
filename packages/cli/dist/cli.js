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
const program = new commander_1.Command();
program
    .name('stick')
    .description('Enterprise AI Agent Orchestration CLI')
    .version('1.0.0');
// If no arguments, launch interactive mode
if (process.argv.length === 2) {
    (0, interactive_1.interactiveMode)().catch((error) => {
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
    program.parse();
}
//# sourceMappingURL=cli.js.map