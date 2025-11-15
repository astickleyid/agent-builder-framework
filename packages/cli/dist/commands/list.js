"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const chalk_1 = __importDefault(require("chalk"));
const registry_1 = require("../services/registry");
async function listCommand() {
    try {
        const registry = new registry_1.AgentRegistryService();
        const agents = await registry.getAllAgents();
        if (agents.length === 0) {
            console.log(chalk_1.default.yellow('No agents configured yet.'));
            console.log(chalk_1.default.dim('Run "stick init" to create your first agent.'));
            return;
        }
        console.log(chalk_1.default.bold('\nConfigured Agents:\n'));
        for (const agent of agents) {
            const statusIcon = agent.status === 'running' ? chalk_1.default.green('●') : chalk_1.default.gray('○');
            const statusText = agent.status === 'running' ? chalk_1.default.green('running') : chalk_1.default.gray('stopped');
            console.log(statusIcon + ' ' + chalk_1.default.bold(agent.name) + chalk_1.default.dim(` (${statusText})`));
            console.log(chalk_1.default.dim(`  ${agent.description}`));
            console.log(chalk_1.default.dim(`  Version: ${agent.version}`));
            if (agent.status === 'running' && agent.port) {
                console.log(chalk_1.default.dim(`  URL: http://localhost:${agent.port}`));
                if (agent.pid) {
                    console.log(chalk_1.default.dim(`  PID: ${agent.pid}`));
                }
            }
            if (agent.deployedAt) {
                const deployedDate = new Date(agent.deployedAt);
                console.log(chalk_1.default.dim(`  Deployed: ${deployedDate.toLocaleString()}`));
            }
            console.log();
        }
        const runningCount = agents.filter(a => a.status === 'running').length;
        console.log(chalk_1.default.dim(`Total: ${agents.length} agent(s), ${runningCount} running\n`));
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to list agents'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=list.js.map