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
        let projectName = name || '';
        if (!projectName) {
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'input',
                    name: 'projectName',
                    message: 'What is your agent name?',
                    default: 'my-agent',
                },
            ]);
            projectName = answers.projectName;
        }
        const projectPath = path_1.default.join(process.cwd(), projectName);
        if (await fs_extra_1.default.pathExists(projectPath)) {
            console.log(chalk_1.default.red(`✗ Directory ${projectName} already exists`));
            process.exit(1);
        }
        spinner.start('Creating agent project...');
        await fs_extra_1.default.ensureDir(projectPath);
        await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'config'));
        await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'tools'));
        await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, 'workflows'));
        const agentConfig = {
            name: projectName,
            version: '1.0.0',
            description: `${projectName} AI agent`,
            capabilities: ['chat', 'task-execution'],
            tools: ['bash', 'file-ops', 'http'],
            instructions: `You are ${projectName}, an AI agent designed to help with tasks.`,
            environment: {
                maxTokens: 4000,
                temperature: 0.7,
            },
            llm: {
                provider: 'none',
                model: '',
                apiKey: '',
                stream: false,
            },
        };
        await fs_extra_1.default.writeJson(path_1.default.join(projectPath, 'config', 'agent.json'), agentConfig, { spaces: 2 });
        const readme = `# ${projectName}

AI Agent powered by stick.ai

## Getting Started

\`\`\`bash
cd ${projectName}
stick deploy
stick run ${projectName}
\`\`\`

## Configuration

Edit \`config/agent.json\` to customize your agent's behavior.

### LLM Provider Setup

To use AI capabilities, configure an LLM provider in \`config/agent.json\`:

#### OpenAI
\`\`\`json
{
  "llm": {
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "your-api-key",
    "stream": true
  }
}
\`\`\`

#### Anthropic
\`\`\`json
{
  "llm": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "apiKey": "your-api-key",
    "stream": true
  }
}
\`\`\`

#### Ollama (Local Models)
\`\`\`json
{
  "llm": {
    "provider": "ollama",
    "model": "llama3.2",
    "baseURL": "http://localhost:11434",
    "stream": true
  }
}
\`\`\`

**Note**: You can also set API keys via environment variables:
- \`OPENAI_API_KEY\` for OpenAI
- \`ANTHROPIC_API_KEY\` for Anthropic
- \`OLLAMA_HOST\` for Ollama

## Learn More

Visit https://stick.ai/docs for full documentation.
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
AGENT_NAME=${projectName}
AGENT_PORT=3000

# LLM Provider Configuration
# Uncomment and configure one of the following providers:

# OpenAI
# OPENAI_API_KEY=your-api-key-here
# LLM_PROVIDER=openai
# LLM_MODEL=gpt-4o-mini

# Anthropic
# ANTHROPIC_API_KEY=your-api-key-here
# LLM_PROVIDER=anthropic
# LLM_MODEL=claude-3-5-sonnet-20241022

# Ollama (Local)
# OLLAMA_HOST=http://localhost:11434
# LLM_PROVIDER=ollama
# LLM_MODEL=llama3.2
`;
        await fs_extra_1.default.writeFile(path_1.default.join(projectPath, '.env.example'), envExample);
        spinner.succeed(chalk_1.default.green(`✓ Agent project "${projectName}" created successfully`));
        console.log('\n' + chalk_1.default.bold('Next steps:'));
        console.log(chalk_1.default.cyan(`  cd ${projectName}`));
        console.log(chalk_1.default.cyan('  stick deploy'));
        console.log(chalk_1.default.cyan('  stick run ' + projectName));
        console.log('\n' + chalk_1.default.dim('Learn more: https://stick.ai/docs'));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('✗ Failed to create agent project'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=init.js.map