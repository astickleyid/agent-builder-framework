"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const os_1 = __importDefault(require("os"));
async function listCommand() {
    try {
        const configDir = path_1.default.join(os_1.default.homedir(), '.config', 'stick-ai', 'agents');
        if (!(await fs_extra_1.default.pathExists(configDir))) {
            console.log(chalk_1.default.yellow('No agents configured yet.'));
            console.log(chalk_1.default.dim('Run "stick init" to create your first agent.'));
            return;
        }
        const agents = await fs_extra_1.default.readdir(configDir);
        if (agents.length === 0) {
            console.log(chalk_1.default.yellow('No agents found.'));
            return;
        }
        console.log(chalk_1.default.bold('\nConfigured Agents:\n'));
        for (const agent of agents) {
            const agentPath = path_1.default.join(configDir, agent, 'config', 'agent.json');
            if (await fs_extra_1.default.pathExists(agentPath)) {
                const config = await fs_extra_1.default.readJson(agentPath);
                console.log(chalk_1.default.cyan('●') + ' ' + chalk_1.default.bold(config.name));
                console.log(chalk_1.default.dim(`  ${config.description}`));
                console.log(chalk_1.default.dim(`  Version: ${config.version}`));
                console.log();
            }
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('✗ Failed to list agents'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=list.js.map