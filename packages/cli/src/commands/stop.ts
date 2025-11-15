import chalk from 'chalk';
import ora from 'ora';
import { AgentRegistryService } from '../services/registry';
import { ServerManager } from '../services/server';

export async function stopCommand(agentName: string) {
  const spinner = ora();
  const registry = new AgentRegistryService();
  const serverManager = new ServerManager();

  try {
    spinner.start(`Stopping agent: ${agentName}...`);
    
    const agent = await registry.getAgent(agentName);
    
    if (!agent) {
      spinner.fail(chalk.red(`✗ Agent "${agentName}" not found`));
      console.log(chalk.yellow('Run "stick list" to see available agents'));
      process.exit(1);
    }

    const isRunning = await serverManager.isServerRunning(agentName);
    
    if (!isRunning) {
      spinner.info(chalk.yellow(`Agent "${agentName}" is not running`));
      return;
    }

    await serverManager.stopServer(agentName);
    await registry.updateAgentStatus(agentName, 'stopped');
    
    spinner.succeed(chalk.green(`✓ Agent "${agentName}" stopped successfully`));
  } catch (error) {
    spinner.fail(chalk.red(`✗ Failed to stop agent "${agentName}"`));
    console.error(error);
    process.exit(1);
  }
}
