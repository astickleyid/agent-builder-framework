"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCommand = deployCommand;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const registry_1 = require("../services/registry");
const server_1 = require("../services/server");
const validator_1 = require("../services/validator");
async function deployCommand(options) {
    const spinner = (0, ora_1.default)();
    const registry = new registry_1.AgentRegistryService();
    const serverManager = new server_1.ServerManager();
    try {
        const configPath = path_1.default.join(process.cwd(), 'config', 'agent.json');
        if (!(await fs_extra_1.default.pathExists(configPath))) {
            console.log(chalk_1.default.red('✗ No agent configuration found. Run "stick init" first.'));
            process.exit(1);
        }
        const config = await fs_extra_1.default.readJson(configPath);
        // Validate configuration
        spinner.start('Validating agent configuration...');
        const validation = validator_1.ConfigValidator.validate(config);
        if (!validation.valid) {
            spinner.fail(chalk_1.default.red('✗ Invalid agent configuration'));
            console.log(chalk_1.default.red('\nErrors:'));
            validation.errors.forEach(error => {
                console.log(chalk_1.default.red(`  - ${error}`));
            });
            process.exit(1);
        }
        if (validation.warnings.length > 0) {
            spinner.warn(chalk_1.default.yellow('Configuration validated with warnings'));
            validation.warnings.forEach(warning => {
                console.log(chalk_1.default.yellow(`  ⚠ ${warning}`));
            });
        }
        else {
            spinner.succeed(chalk_1.default.green('✓ Configuration validated'));
        }
        // Register agent
        spinner.start('Registering agent...');
        await registry.registerAgent(config, process.cwd());
        spinner.succeed(chalk_1.default.green('✓ Agent registered'));
        const port = parseInt(options.port) || 3000;
        config.port = port;
        if (options.cloud) {
            spinner.start('Deploying to cloud...');
            spinner.info(chalk_1.default.yellow('Cloud deployment not yet implemented'));
            console.log(chalk_1.default.cyan(`\n  Cloud deployment will be available in a future release`));
            console.log(chalk_1.default.dim('  For now, you can deploy locally and use a reverse proxy'));
        }
        else {
            // Check if already running
            const isRunning = await serverManager.isServerRunning(config.name);
            if (isRunning) {
                console.log(chalk_1.default.yellow(`⚠ Agent "${config.name}" is already running`));
                console.log(chalk_1.default.dim('Stop it first with: stick stop ' + config.name));
                process.exit(1);
            }
            spinner.start(`Starting agent server on port ${port}...`);
            const serverProcess = await serverManager.startServer(config.name, config, port);
            // Update registry with running status
            await registry.updateAgentStatus(config.name, 'running', serverProcess.pid);
            spinner.succeed(chalk_1.default.green(`✓ Agent deployed at localhost:${port}`));
            console.log(chalk_1.default.cyan(`\n  Local URL: http://localhost:${port}`));
            console.log(chalk_1.default.dim(`  PID: ${serverProcess.pid}`));
            console.log(chalk_1.default.dim('\nAvailable endpoints:'));
            console.log(chalk_1.default.dim(`  GET  http://localhost:${port}/health`));
            console.log(chalk_1.default.dim(`  GET  http://localhost:${port}/config`));
            console.log(chalk_1.default.dim(`  POST http://localhost:${port}/chat`));
        }
        console.log(chalk_1.default.green('\n✓ Deployment complete\n'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('✗ Deployment failed'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=deploy.js.map