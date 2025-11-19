import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';

const AVAILABLE_TOOLS = [
  { name: 'bash', category: 'System', description: 'Execute shell commands' },
  { name: 'python', category: 'System', description: 'Run Python code' },
  { name: 'http', category: 'Web', description: 'HTTP/REST API calls' },
  { name: 'web-scraper', category: 'Web', description: 'Scrape websites' },
  { name: 'json', category: 'Data', description: 'JSON operations' },
  { name: 'csv', category: 'Data', description: 'CSV file handling' },
  { name: 'xml', category: 'Data', description: 'XML parsing' },
  { name: 'database', category: 'Data', description: 'Database queries' },
  { name: 'file-ops', category: 'Files', description: 'File operations' },
  { name: 'email', category: 'Communication', description: 'Send emails' },
  { name: 'slack', category: 'Communication', description: 'Slack integration' },
  { name: 'github', category: 'Development', description: 'GitHub API' },
  { name: 'datetime', category: 'Utilities', description: 'Date/time operations' },
  { name: 'text', category: 'Utilities', description: 'Text manipulation' },
  { name: 'openai', category: 'AI', description: 'GPT-4, GPT-3.5' },
  { name: 'anthropic', category: 'AI', description: 'Claude 3' },
  { name: 'ollama', category: 'AI', description: 'Local LLMs' }
];

export async function configureTools(agentPath?: string) {
  const configPath = agentPath 
    ? path.join(agentPath, 'config', 'agent.json')
    : path.join(process.cwd(), 'config', 'agent.json');

  if (!await fs.pathExists(configPath)) {
    console.log(chalk.red('✗ No agent configuration found. Run "stick init" first.'));
    return;
  }

  const config = await fs.readJson(configPath);
  const currentTools = config.tools || [];

  console.log(chalk.cyan.bold('\n🛠️  Configure Agent Tools\n'));
  console.log(chalk.gray(`Current tools: ${currentTools.join(', ') || 'none'}\n`));

  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        { name: '➕ Add tools', value: 'add' },
        { name: '➖ Remove tools', value: 'remove' },
        { name: '📋 View all available tools', value: 'view' },
        { name: '⬅️  Back', value: 'back' }
      ]
    }
  ]);

  if (action === 'back') return;

  if (action === 'view') {
    console.log(chalk.white.bold('\n📦 Available Tools:\n'));
    AVAILABLE_TOOLS.forEach(tool => {
      const installed = currentTools.includes(tool.name) ? chalk.green('✓') : chalk.gray('○');
      console.log(`  ${installed} ${chalk.yellow(tool.name.padEnd(15))} ${chalk.gray(tool.category.padEnd(15))} ${tool.description}`);
    });
    console.log();
    await inquirer.prompt([{ type: 'input', name: 'continue', message: chalk.gray('Press Enter to continue...') }]);
    return configureTools(agentPath);
  }

  if (action === 'add') {
    const availableToAdd = AVAILABLE_TOOLS.filter(t => !currentTools.includes(t.name));
    
    if (availableToAdd.length === 0) {
      console.log(chalk.yellow('\n⚠ All tools are already added!\n'));
      return;
    }

    const { tools } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Select tools to add:',
        choices: availableToAdd.map(tool => ({
          name: `${tool.name} - ${tool.description}`,
          value: tool.name,
          checked: false
        })),
        pageSize: 15
      }
    ]);

    if (tools.length > 0) {
      config.tools = [...currentTools, ...tools];
      await fs.writeJson(configPath, config, { spaces: 2 });
      console.log(chalk.green(`\n✓ Added ${tools.length} tool(s)\n`));
    }
  }

  if (action === 'remove') {
    if (currentTools.length === 0) {
      console.log(chalk.yellow('\n⚠ No tools to remove!\n'));
      return;
    }

    const { tools } = await inquirer.prompt([
      {
        type: 'checkbox',
        name: 'tools',
        message: 'Select tools to remove:',
        choices: currentTools.map((tool: string) => ({
          name: tool,
          value: tool
        }))
      }
    ]);

    if (tools.length > 0) {
      config.tools = currentTools.filter((t: string) => !tools.includes(t));
      await fs.writeJson(configPath, config, { spaces: 2 });
      console.log(chalk.green(`\n✓ Removed ${tools.length} tool(s)\n`));
    }
  }
}

export async function addMCP(agentPath?: string) {
  const configPath = agentPath 
    ? path.join(agentPath, 'config', 'agent.json')
    : path.join(process.cwd(), 'config', 'agent.json');

  if (!await fs.pathExists(configPath)) {
    console.log(chalk.red('✗ No agent configuration found. Run "stick init" first.'));
    return;
  }

  console.log(chalk.cyan.bold('\n🔌 Add MCP (Model Context Protocol) Server\n'));
  console.log(chalk.gray('Connect your agent to external tools and data sources via MCP\n'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'MCP Server name:',
      validate: (input) => input.trim().length > 0 || 'Name is required'
    },
    {
      type: 'list',
      name: 'type',
      message: 'Server type:',
      choices: [
        { name: 'HTTP/REST API', value: 'http' },
        { name: 'WebSocket', value: 'websocket' },
        { name: 'Local Process (stdio)', value: 'stdio' }
      ]
    },
    {
      type: 'input',
      name: 'endpoint',
      message: 'Server endpoint/URL:',
      when: (answers) => answers.type !== 'stdio',
      default: 'http://localhost:3001'
    },
    {
      type: 'input',
      name: 'command',
      message: 'Command to start server:',
      when: (answers) => answers.type === 'stdio',
      default: 'npx -y @modelcontextprotocol/server-example'
    },
    {
      type: 'confirm',
      name: 'requiresAuth',
      message: 'Does this server require authentication?',
      default: false
    },
    {
      type: 'input',
      name: 'apiKey',
      message: 'API Key:',
      when: (answers) => answers.requiresAuth
    }
  ]);

  const config = await fs.readJson(configPath);
  
  if (!config.mcp) {
    config.mcp = { servers: [] };
  }

  config.mcp.servers.push({
    name: answers.name,
    type: answers.type,
    endpoint: answers.endpoint || answers.command,
    ...(answers.apiKey && { apiKey: answers.apiKey })
  });

  await fs.writeJson(configPath, config, { spaces: 2 });
  
  console.log(chalk.green(`\n✓ MCP server "${answers.name}" added successfully\n`));
  console.log(chalk.gray('Your agent can now access tools from this MCP server\n'));
}
