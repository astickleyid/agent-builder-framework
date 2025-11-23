import chalk from 'chalk';
import ora from 'ora';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as readline from 'readline';

export async function runCommand(agentName: string, options?: any) {
  const spinner = ora();

  try {
    // Look for agent config
    const configPaths = [
      path.join(process.cwd(), `${agentName}.json`), // direct file match
      path.join(process.cwd(), agentName, 'agent.json'),
      path.join(process.cwd(), 'agent.json'),
      path.join(process.cwd(), agentName, 'config.json'),
      path.join(process.cwd(), 'config.json')
    ];

    let configPath: string | null = null;
    let config: any = null;

    for (const p of configPaths) {
      if (await fs.pathExists(p)) {
        configPath = p;
        config = await fs.readJson(p);
        break;
      }
    }

    if (!config) {
      spinner.fail(chalk.red(`✗ Could not find agent config for "${agentName}"`));
      console.log(chalk.gray('\nSearched locations:'));
      configPaths.forEach(p => console.log(chalk.gray(`  - ${p}`)));
      console.log(chalk.yellow('\nTip: Run "stick init" to create an agent'));
      process.exit(1);
    }

    spinner.start(`Loading agent: ${config.name}...`);

    // Check if @stick-ai/runtime is available
    let runtime: any;
    try {
      runtime = require('@stick-ai/runtime');
    } catch (e) {
      // Try local version
      const localRuntimePath = path.join(__dirname, '../../../runtime/dist/index.js');
      if (await fs.pathExists(localRuntimePath)) {
        runtime = require(localRuntimePath);
      } else {
        spinner.fail(chalk.red('✗ @stick-ai/runtime not found'));
        console.log(chalk.yellow('\nInstall it with: npm install @stick-ai/runtime'));
        process.exit(1);
      }
    }

    // Determine AI provider from config
    const llmConfig = extractLLMConfig(config, options);
    
    if (!llmConfig) {
      spinner.warn(chalk.yellow('⚠ No AI provider configured, using basic agent mode'));
    }

    // Create agent instance
    let agent: any;
    
    if (llmConfig && runtime.IntelligentAgent) {
      agent = new runtime.IntelligentAgent(config, llmConfig);
      spinner.succeed(chalk.green(`✓ Intelligent agent "${config.name}" loaded`));
    } else {
      agent = new runtime.Agent(config);
      spinner.succeed(chalk.green(`✓ Agent "${config.name}" loaded (basic mode)`));
    }

    // Load and register tools
    if (config.tools && config.tools.length > 0) {
      console.log(chalk.cyan(`\n📦 Loading ${config.tools.length} tools...`));
      for (const toolName of config.tools) {
        try {
          const tool = runtime.createTool(toolName);
          agent.registerTool(toolName, tool);
          console.log(chalk.gray(`  ✓ ${toolName}`));
        } catch (e: any) {
          console.log(chalk.yellow(`  ⚠ ${toolName} - ${e.message}`));
        }
      }
    }

    console.log();

    if (options.interactive) {
      await runInteractiveMode(agent, config);
    } else if (options.input) {
      await runSingleInput(agent, options.input);
    } else {
      console.log(chalk.dim('Agent loaded and ready'));
      console.log(chalk.dim('Use --interactive flag for chat mode'));
      console.log(chalk.dim('Use --input "your message" for single execution'));
    }

  } catch (error: any) {
    spinner.fail(chalk.red(`✗ Failed to run agent "${agentName}"`));
    console.error(chalk.red(error.message));
    if (options.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

function extractLLMConfig(config: any, options: any): any | null {
  // Check for provider in options or config
  const provider = options.provider || config.aiProvider || config.llm?.provider;
  
  if (!provider || provider === 'none') {
    return null;
  }

  // Get API key from environment or config
  const apiKey = 
    process.env.OPENAI_API_KEY || 
    process.env.ANTHROPIC_API_KEY ||
    config.llm?.apiKey;

  const llmConfig: any = {
    provider: provider,
    model: options.model || config.llm?.model,
    temperature: options.temperature || config.environment?.temperature || 0.7,
    maxTokens: options.maxTokens || config.environment?.maxTokens || 1000
  };

  if (provider === 'openai' || provider === 'anthropic') {
    if (!apiKey) {
      console.log(chalk.yellow(`\n⚠ Warning: No API key found for ${provider}`));
      console.log(chalk.gray(`Set ${provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'} environment variable\n`));
      return null;
    }
    llmConfig.apiKey = apiKey;
  } else if (provider === 'ollama') {
    llmConfig.host = options.ollamaHost || config.llm?.host || 'http://localhost:11434';
  }

  return llmConfig;
}

async function runInteractiveMode(agent: any, config: any) {
  console.log(chalk.cyan.bold('🤖 Interactive Mode\n'));
  console.log(chalk.gray('Agent: ') + chalk.white(config.name));
  console.log(chalk.gray('Description: ') + chalk.white(config.description));
  console.log(chalk.gray('\nType your message and press Enter. Type "exit" or "quit" to stop.\n'));
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: chalk.cyan('You> ')
  });

  rl.prompt();

  rl.on('line', async (input: string) => {
    const trimmed = input.trim();
    
    if (!trimmed) {
      rl.prompt();
      return;
    }

    if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
      console.log(chalk.gray('\n👋 Goodbye!\n'));
      rl.close();
      process.exit(0);
    }

    if (trimmed.toLowerCase() === 'clear') {
      console.clear();
      rl.prompt();
      return;
    }

    if (trimmed.toLowerCase() === 'history') {
      const history = agent.getHistory();
      console.log(chalk.cyan('\n📜 Conversation History:\n'));
      history.forEach((msg: any) => {
        const role = msg.role === 'user' ? chalk.cyan('You') : chalk.green('Agent');
        console.log(`${role}: ${msg.content}\n`);
      });
      rl.prompt();
      return;
    }

    try {
      rl.pause();
      console.log();
      
      const spinner = ora(chalk.gray('Agent thinking...')).start();
      const response = await agent.run(trimmed);
      spinner.stop();
      
      console.log(chalk.green('Agent> ') + chalk.white(response));
      console.log();
    } catch (error: any) {
      console.log(chalk.red('\n✗ Error: ') + chalk.white(error.message));
      console.log();
    }
    
    rl.resume();
    rl.prompt();
  });

  rl.on('close', () => {
    console.log(chalk.gray('\n👋 Session ended\n'));
    process.exit(0);
  });
}

async function runSingleInput(agent: any, input: string) {
  console.log(chalk.cyan('User> ') + chalk.white(input));
  console.log();
  
  const spinner = ora(chalk.gray('Agent processing...')).start();
  
  try {
    const response = await agent.run(input);
    spinner.stop();
    console.log(chalk.green('Agent> ') + chalk.white(response));
    console.log();
  } catch (error: any) {
    spinner.fail(chalk.red('Error'));
    console.log(chalk.red(error.message));
    if (error.stack) {
      console.log(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}
