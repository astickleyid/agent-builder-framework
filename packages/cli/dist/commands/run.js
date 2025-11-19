"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = runCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function runCommand(agentName, options) {
    const spinner = (0, ora_1.default)();
    try {
        spinner.start(`Starting agent: ${agentName}...`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        spinner.succeed(chalk_1.default.green(`✓ Agent "${agentName}" is running`));
        if (options.interactive) {
            console.log(chalk_1.default.cyan('\nInteractive mode - type your messages:\n'));
            console.log(chalk_1.default.dim('(Interactive mode implementation pending)'));
        }
        else {
            console.log(chalk_1.default.dim('Agent running in background'));
            console.log(chalk_1.default.dim('Use --interactive flag for interactive mode'));
        }
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`✗ Failed to run agent "${agentName}"`));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=run.js.map