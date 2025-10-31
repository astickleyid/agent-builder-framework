import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import os from 'os';

export async function listCommand() {
  try {
    const configDir = path.join(os.homedir(), '.config', 'stick-ai', 'agents');

    if (!(await fs.pathExists(configDir))) {
      console.log(chalk.yellow('No agents configured yet.'));
      console.log(chalk.dim('Run "stick init" to create your first agent.'));
      return;
    }

    const agents = await fs.readdir(configDir);

    if (agents.length === 0) {
      console.log(chalk.yellow('No agents found.'));
      return;
    }

    console.log(chalk.bold('\nConfigured Agents:\n'));

    for (const agent of agents) {
      const agentPath = path.join(configDir, agent, 'config', 'agent.json');
      
      if (await fs.pathExists(agentPath)) {
        const config = await fs.readJson(agentPath);
        console.log(chalk.cyan('●') + ' ' + chalk.bold(config.name));
        console.log(chalk.dim(`  ${config.description}`));
        console.log(chalk.dim(`  Version: ${config.version}`));
        console.log();
      }
    }
  } catch (error) {
    console.error(chalk.red('✗ Failed to list agents'));
    console.error(error);
    process.exit(1);
  }
}
