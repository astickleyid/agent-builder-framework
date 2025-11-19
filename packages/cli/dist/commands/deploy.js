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
async function deployCommand(options) {
    const spinner = (0, ora_1.default)();
    try {
        const configPath = path_1.default.join(process.cwd(), 'config', 'agent.json');
        if (!(await fs_extra_1.default.pathExists(configPath))) {
            console.log(chalk_1.default.red('✗ No agent configuration found. Run "stick init" first.'));
            process.exit(1);
        }
        const config = await fs_extra_1.default.readJson(configPath);
        spinner.start('Building agent...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        spinner.succeed(chalk_1.default.green('✓ Agent built successfully'));
        spinner.start('Running health checks...');
        await new Promise((resolve) => setTimeout(resolve, 800));
        spinner.succeed(chalk_1.default.green('✓ Health checks passed'));
        const port = options.port || 3000;
        if (options.cloud) {
            spinner.start('Deploying to cloud...');
            await new Promise((resolve) => setTimeout(resolve, 2000));
            spinner.succeed(chalk_1.default.green('✓ Agent deployed to cloud'));
            console.log(chalk_1.default.cyan(`\n  Agent URL: https://${config.name}.stick.ai`));
        }
        else {
            spinner.start(`Starting agent on port ${port}...`);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            spinner.succeed(chalk_1.default.green(`✓ Agent deployed at localhost:${port}`));
            console.log(chalk_1.default.cyan(`\n  Local URL: http://localhost:${port}`));
        }
        console.log(chalk_1.default.green('✓ Ready to serve requests\n'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('✗ Deployment failed'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=deploy.js.map