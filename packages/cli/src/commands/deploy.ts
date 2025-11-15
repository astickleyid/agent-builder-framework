import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { AgentRegistryService } from '../services/registry';
import { ServerManager } from '../services/server';
import { ConfigValidator } from '../services/validator';

export async function deployCommand(options?: any) {
  const spinner = ora();
  const registry = new AgentRegistryService();
  const serverManager = new ServerManager();

  try {
    const configPath = path.join(process.cwd(), 'config', 'agent.json');

    if (!(await fs.pathExists(configPath))) {
      console.log(chalk.red('✗ No agent configuration found. Run "stick init" first.'));
      process.exit(1);
    }

    const config = await fs.readJson(configPath);

    // Validate configuration
    spinner.start('Validating agent configuration...');
    const validation = ConfigValidator.validate(config);
    
    if (!validation.valid) {
      spinner.fail(chalk.red('✗ Invalid agent configuration'));
      console.log(chalk.red('\nErrors:'));
      validation.errors.forEach(error => {
        console.log(chalk.red(`  - ${error}`));
      });
      process.exit(1);
    }
    
    if (validation.warnings.length > 0) {
      spinner.warn(chalk.yellow('Configuration validated with warnings'));
      validation.warnings.forEach(warning => {
        console.log(chalk.yellow(`  ⚠ ${warning}`));
      });
    } else {
      spinner.succeed(chalk.green('✓ Configuration validated'));
    }

    // Register agent
    spinner.start('Registering agent...');
    await registry.registerAgent(config, process.cwd());
    spinner.succeed(chalk.green('✓ Agent registered'));

    const port = parseInt(options.port) || 3000;
    config.port = port;

    if (options.cloud) {
      spinner.start('Deploying to cloud...');
      spinner.info(chalk.yellow('Cloud deployment not yet implemented'));
      console.log(chalk.cyan(`\n  Cloud deployment will be available in a future release`));
      console.log(chalk.dim('  For now, you can deploy locally and use a reverse proxy'));
    } else {
      // Check if already running
      const isRunning = await serverManager.isServerRunning(config.name);
      if (isRunning) {
        console.log(chalk.yellow(`⚠ Agent "${config.name}" is already running`));
        console.log(chalk.dim('Stop it first with: stick stop ' + config.name));
        process.exit(1);
      }

      spinner.start(`Starting agent server on port ${port}...`);
      const serverProcess = await serverManager.startServer(config.name, config, port);
      
      // Update registry with running status
      await registry.updateAgentStatus(config.name, 'running', serverProcess.pid);
      
      spinner.succeed(chalk.green(`✓ Agent deployed at localhost:${port}`));
      
      console.log(chalk.cyan(`\n  Local URL: http://localhost:${port}`));
      console.log(chalk.dim(`  PID: ${serverProcess.pid}`));
      console.log(chalk.dim('\nAvailable endpoints:'));
      console.log(chalk.dim(`  GET  http://localhost:${port}/health`));
      console.log(chalk.dim(`  GET  http://localhost:${port}/config`));
      console.log(chalk.dim(`  POST http://localhost:${port}/chat`));
      
      // Show tool endpoints if agent has tools configured
      if (config.tools && config.tools.length > 0) {
        console.log(chalk.dim(`  GET  http://localhost:${port}/tools`));
        console.log(chalk.dim(`  POST http://localhost:${port}/tools/execute`));
      }
    }

    console.log(chalk.green('\n✓ Deployment complete\n'));
  } catch (error) {
    spinner.fail(chalk.red('✗ Deployment failed'));
    console.error(error);
    process.exit(1);
  }
}
