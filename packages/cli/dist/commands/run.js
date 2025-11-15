"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = runCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const registry_1 = require("../services/registry");
const runtime_1 = require("../services/runtime");
const server_1 = require("../services/server");
async function runCommand(agentName, options) {
    const spinner = (0, ora_1.default)();
    const registry = new registry_1.AgentRegistryService();
    const serverManager = new server_1.ServerManager();
    try {
        spinner.start(`Loading agent: ${agentName}...`);
        const agent = await registry.getAgent(agentName);
        if (!agent) {
            spinner.fail(chalk_1.default.red(`✗ Agent "${agentName}" not found`));
            console.log(chalk_1.default.yellow('Run "stick list" to see available agents'));
            console.log(chalk_1.default.dim('Or create a new agent with "stick init"'));
            process.exit(1);
        }
        spinner.succeed(chalk_1.default.green(`✓ Agent "${agentName}" loaded`));
        if (options.interactive) {
            console.log(chalk_1.default.cyan('\n🤖 Starting interactive mode...\n'));
            console.log(chalk_1.default.bold(`Agent: ${agent.name}`));
            console.log(chalk_1.default.dim(agent.description));
            const session = new runtime_1.InteractiveSession(agent);
            await session.start();
        }
        else {
            // Check if agent is deployed
            const isRunning = await serverManager.isServerRunning(agentName);
            if (isRunning) {
                console.log(chalk_1.default.green(`✓ Agent "${agentName}" is already running`));
                if (agent.port) {
                    console.log(chalk_1.default.cyan(`\n  URL: http://localhost:${agent.port}`));
                    console.log(chalk_1.default.dim('\nAvailable endpoints:'));
                    console.log(chalk_1.default.dim(`  GET  http://localhost:${agent.port}/health`));
                    console.log(chalk_1.default.dim(`  GET  http://localhost:${agent.port}/config`));
                    console.log(chalk_1.default.dim(`  POST http://localhost:${agent.port}/chat`));
                }
                console.log(chalk_1.default.dim('\nUse --interactive flag for interactive mode'));
            }
            else {
                console.log(chalk_1.default.yellow(`⚠ Agent "${agentName}" is not deployed`));
                console.log(chalk_1.default.dim('Deploy it first with: stick deploy'));
                console.log(chalk_1.default.dim('Or use --interactive flag to run in interactive mode'));
            }
        }
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`✗ Failed to run agent "${agentName}"`));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=run.js.map