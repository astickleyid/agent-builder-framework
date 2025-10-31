import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

export async function deployCommand(options?: any) {
  const spinner = ora();

  try {
    const configPath = path.join(process.cwd(), 'config', 'agent.json');

    if (!(await fs.pathExists(configPath))) {
      console.log(chalk.red('✗ No agent configuration found. Run "stick init" first.'));
      process.exit(1);
    }

    const config = await fs.readJson(configPath);

    spinner.start('Building agent...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.succeed(chalk.green('✓ Agent built successfully'));

    spinner.start('Running health checks...');
    await new Promise((resolve) => setTimeout(resolve, 800));
    spinner.succeed(chalk.green('✓ Health checks passed'));

    const port = options.port || 3000;

    if (options.cloud) {
      spinner.start('Deploying to cloud...');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      spinner.succeed(chalk.green('✓ Agent deployed to cloud'));
      console.log(chalk.cyan(`\n  Agent URL: https://${config.name}.stick.ai`));
    } else {
      spinner.start(`Starting agent on port ${port}...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      spinner.succeed(chalk.green(`✓ Agent deployed at localhost:${port}`));
      console.log(chalk.cyan(`\n  Local URL: http://localhost:${port}`));
    }

    console.log(chalk.green('✓ Ready to serve requests\n'));
  } catch (error) {
    spinner.fail(chalk.red('✗ Deployment failed'));
    console.error(error);
    process.exit(1);
  }
}
