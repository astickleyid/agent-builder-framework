import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import os from 'os';
import { AgentRegistryService } from '../services/registry';

export async function listCommand() {
  try {
    const registry = new AgentRegistryService();
    const agents = await registry.getAllAgents();

    if (agents.length === 0) {
      console.log(chalk.yellow('No agents configured yet.'));
      console.log(chalk.dim('Run "stick init" to create your first agent.'));
      return;
    }

    console.log(chalk.bold('\nConfigured Agents:\n'));

    for (const agent of agents) {
      const statusIcon = agent.status === 'running' ? chalk.green('●') : chalk.gray('○');
      const statusText = agent.status === 'running' ? chalk.green('running') : chalk.gray('stopped');
      
      console.log(statusIcon + ' ' + chalk.bold(agent.name) + chalk.dim(` (${statusText})`));
      console.log(chalk.dim(`  ${agent.description}`));
      console.log(chalk.dim(`  Version: ${agent.version}`));
      
      if (agent.status === 'running' && agent.port) {
        console.log(chalk.dim(`  URL: http://localhost:${agent.port}`));
        if (agent.pid) {
          console.log(chalk.dim(`  PID: ${agent.pid}`));
        }
      }
      
      if (agent.deployedAt) {
        const deployedDate = new Date(agent.deployedAt);
        console.log(chalk.dim(`  Deployed: ${deployedDate.toLocaleString()}`));
      }
      
      console.log();
    }
    
    const runningCount = agents.filter(a => a.status === 'running').length;
    console.log(chalk.dim(`Total: ${agents.length} agent(s), ${runningCount} running\n`));
  } catch (error) {
    console.error(chalk.red('✗ Failed to list agents'));
    console.error(error);
    process.exit(1);
  }
}
