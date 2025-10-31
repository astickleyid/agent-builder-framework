import chalk from 'chalk';
import ora from 'ora';

export async function runCommand(agentName: string, options?: any) {
  const spinner = ora();

  try {
    spinner.start(`Starting agent: ${agentName}...`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    spinner.succeed(chalk.green(`✓ Agent "${agentName}" is running`));

    if (options.interactive) {
      console.log(chalk.cyan('\nInteractive mode - type your messages:\n'));
      console.log(chalk.dim('(Interactive mode implementation pending)'));
    } else {
      console.log(chalk.dim('Agent running in background'));
      console.log(chalk.dim('Use --interactive flag for interactive mode'));
    }
  } catch (error) {
    spinner.fail(chalk.red(`✗ Failed to run agent "${agentName}"`));
    console.error(error);
    process.exit(1);
  }
}
