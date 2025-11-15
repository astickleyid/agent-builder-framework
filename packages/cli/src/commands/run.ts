import chalk from 'chalk';
import ora from 'ora';
import { AgentRegistryService } from '../services/registry';
import { InteractiveSession } from '../services/runtime';
import { ServerManager } from '../services/server';

export async function runCommand(agentName: string, options?: any) {
  const spinner = ora();
  const registry = new AgentRegistryService();
  const serverManager = new ServerManager();

  try {
    spinner.start(`Loading agent: ${agentName}...`);
    
    const agent = await registry.getAgent(agentName);
    
    if (!agent) {
      spinner.fail(chalk.red(`✗ Agent "${agentName}" not found`));
      console.log(chalk.yellow('Run "stick list" to see available agents'));
      console.log(chalk.dim('Or create a new agent with "stick init"'));
      process.exit(1);
    }

    spinner.succeed(chalk.green(`✓ Agent "${agentName}" loaded`));

    if (options.interactive) {
      console.log(chalk.cyan('\n🤖 Starting interactive mode...\n'));
      console.log(chalk.bold(`Agent: ${agent.name}`));
      console.log(chalk.dim(agent.description));
      
      const session = new InteractiveSession(agent);
      await session.start();
    } else {
      // Check if agent is deployed
      const isRunning = await serverManager.isServerRunning(agentName);
      
      if (isRunning) {
        console.log(chalk.green(`✓ Agent "${agentName}" is already running`));
        if (agent.port) {
          console.log(chalk.cyan(`\n  URL: http://localhost:${agent.port}`));
          console.log(chalk.dim('\nAvailable endpoints:'));
          console.log(chalk.dim(`  GET  http://localhost:${agent.port}/health`));
          console.log(chalk.dim(`  GET  http://localhost:${agent.port}/config`));
          console.log(chalk.dim(`  POST http://localhost:${agent.port}/chat`));
        }
        console.log(chalk.dim('\nUse --interactive flag for interactive mode'));
      } else {
        console.log(chalk.yellow(`⚠ Agent "${agentName}" is not deployed`));
        console.log(chalk.dim('Deploy it first with: stick deploy'));
        console.log(chalk.dim('Or use --interactive flag to run in interactive mode'));
      }
    }
  } catch (error) {
    spinner.fail(chalk.red(`✗ Failed to run agent "${agentName}"`));
    console.error(error);
    process.exit(1);
  }
}
