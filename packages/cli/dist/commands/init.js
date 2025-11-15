"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const inquirer_1 = __importDefault(require("inquirer"));
async function initCommand(name, options) {
    const spinner = (0, ora_1.default)();
    try {
        if (!name) {
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'What is your agent name?',
                    default: 'my-agent',
                },
            ]);
            name = answers.projectName;
        }
        const projectPath = path_1.default.join(process.cwd(), name);
        if (await fs_extra_1.default.pathExists(projectPath)) {
            console.log(chalk_1.default.red(`✗ Directory ${name} already exists`));
            process.exit(1);
        }
        spinner.start('Creating agent project...');
        await fs_extra_1.default.ensureDir(projectPath);
        await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'config'));
        await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'tools'));
        await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'workflows'));
        const agentConfig = {
            name: name,
            version: '1.0.0',
            description: `${name} AI agent`,
            capabilities: ['chat', 'task-execution'],
            tools: ['bash', 'file-ops', 'http'],
            instructions: `You are ${name}, an AI agent designed to help with tasks.`,
            environment: {
                maxTokens: 4000,
                temperature: 0.7,
            },
        };
        await fs_extra_1.default.writeJson(path_1.default.join(projectPath, 'config', 'agent.json'), agentConfig, { spaces: 2 });
        const readme = `# ${name}

AI Agent powered by stick.ai

## Getting Started

\`\`\`bash
cd ${name}
stick deploy
stick run ${name}
\`\`\`

## Configuration

Edit \`config/agent.json\` to customize your agent's behavior.
`;
        await fs_extra_1.default.writeFile(path_1.default.join(projectPath, 'README.md'), readme);
        const gitignore = `node_modules/
dist/
.env
.env.local
*.log
.DS_Store
`;
        await fs_extra_1.default.writeFile(path_1.default.join(projectPath, '.gitignore'), gitignore);
        const envExample = `# Agent Configuration
AGENT_NAME=${name}
AGENT_PORT=3000
`;
        await fs_extra_1.default.writeFile(path_1.default.join(projectPath, '.env.example'), envExample);
        spinner.succeed(chalk_1.default.green(`✓ Agent project "${name}" created successfully`));
        console.log('\n' + chalk_1.default.bold('Next steps:'));
        console.log(chalk_1.default.cyan(`  cd ${name}`));
        console.log(chalk_1.default.cyan('  stick deploy'));
        console.log(chalk_1.default.cyan('  stick run ' + name));
        console.log('\n' + chalk_1.default.dim('Learn more: https://stick.ai/docs'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('✗ Failed to create agent project'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map