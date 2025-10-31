import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';

export async function initCommand(name?: string, options?: any) {
  const spinner = ora();

  try {
    if (!name) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your agent name?',
          default: 'my-agent',
        },
      ]);
      name = answers.projectName;
    }

    const projectPath = path.join(process.cwd(), name);

    if (await fs.pathExists(projectPath)) {
      console.log(chalk.red(`✗ Directory ${name} already exists`));
      process.exit(1);
    }

    spinner.start('Creating agent project...');

    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, 'config'));
    await fs.ensureDir(path.join(projectPath, 'tools'));
    await fs.ensureDir(path.join(projectPath, 'workflows'));

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

    await fs.writeJson(
      path.join(projectPath, 'config', 'agent.json'),
      agentConfig,
      { spaces: 2 }
    );

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

    await fs.writeFile(path.join(projectPath, 'README.md'), readme);

    const gitignore = `node_modules/
dist/
.env
.env.local
*.log
.DS_Store
`;

    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);

    const envExample = `# Agent Configuration
AGENT_NAME=${name}
AGENT_PORT=3000
`;

    await fs.writeFile(path.join(projectPath, '.env.example'), envExample);

    spinner.succeed(chalk.green(`✓ Agent project "${name}" created successfully`));

    console.log('\n' + chalk.bold('Next steps:'));
    console.log(chalk.cyan(`  cd ${name}`));
    console.log(chalk.cyan('  stick deploy'));
    console.log(chalk.cyan('  stick run ' + name));
    console.log('\n' + chalk.dim('Learn more: https://stick.ai/docs'));
  } catch (error) {
    spinner.fail(chalk.red('✗ Failed to create agent project'));
    console.error(error);
    process.exit(1);
  }
}
