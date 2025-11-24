#!/usr/bin/env node

import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';

/**
 * MCP Server Builder - Guided process for creating custom MCP servers
 */

interface MCPServerConfig {
  name: string;
  description: string;
  tools: Array<{
    name: string;
    description: string;
    parameters: any;
    handler: string;
  }>;
  resources?: Array<{
    uri: string;
    name: string;
    handler: string;
  }>;
  prompts?: Array<{
    name: string;
    description: string;
    template: string;
  }>;
}

export async function mcpCommand(action?: string, name?: string, options?: any) {
  if (!action) {
    // Show interactive menu
    const { mcpAction } = await inquirer.prompt([
      {
        type: 'list',
        name: 'mcpAction',
        message: 'What would you like to do with MCP servers?',
        choices: [
          { name: '🆕 Create a new MCP server', value: 'create' },
          { name: '📥 Install an MCP server', value: 'install' },
          { name: '📋 List available MCP servers', value: 'list' },
          { name: '🧪 Test an MCP server', value: 'test' },
          { name: '📦 Publish an MCP server', value: 'publish' }
        ]
      }
    ]);

    action = mcpAction;
  }

  switch (action) {
    case 'create':
      await createMCPServer(name);
      break;
    case 'install':
      await installMCPServer(name);
      break;
    case 'list':
      await listMCPServers();
      break;
    case 'test':
      await testMCPServer(name);
      break;
    case 'publish':
      await publishMCPServer(name);
      break;
    default:
      console.log(chalk.red('Unknown action'));
  }
}

/**
 * Create a custom MCP server with guided process
 */
async function createMCPServer(serverName?: string) {
  console.log(chalk.cyan.bold('\n🔧 MCP Server Builder\n'));
  console.log(chalk.white('Let\'s build your custom MCP server step by step!\n'));

  // Step 1: Basic info
  const { name, description } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Server name:',
      default: serverName,
      validate: (input: string) => input.trim().length > 0 || 'Name is required'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Server description:',
      validate: (input: string) => input.trim().length > 0 || 'Description is required'
    }
  ]);

  const config: MCPServerConfig = {
    name,
    description,
    tools: []
  };

  // Step 2: Add tools
  console.log(chalk.cyan('\n📦 Add Tools\n'));
  console.log(chalk.gray('Tools are functions that agents can call.\n'));

  let addingTools = true;
  while (addingTools) {
    const { addTool } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'addTool',
        message: 'Add a tool?',
        default: config.tools.length === 0
      }
    ]);

    if (!addTool) {
      addingTools = false;
      break;
    }

    const tool = await createTool();
    config.tools.push(tool);
    console.log(chalk.green(`✓ Tool "${tool.name}" added!\n`));
  }

  // Step 3: Add resources (optional)
  const { addResources } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addResources',
      message: 'Add resources? (files, data sources, etc.)',
      default: false
    }
  ]);

  if (addResources) {
    config.resources = await createResources();
  }

  // Step 4: Add prompts (optional)
  const { addPrompts } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'addPrompts',
      message: 'Add prompt templates?',
      default: false
    }
  ]);

  if (addPrompts) {
    config.prompts = await createPrompts();
  }

  // Step 5: Generate server code
  console.log(chalk.cyan('\n🏗️  Generating server code...\n'));
  const spinner = ora('Creating files...').start();

  try {
    await generateMCPServer(config);
    spinner.succeed('MCP server created successfully!');

    // Show next steps
    console.log(chalk.green('\n✅ Your MCP server is ready!\n'));
    console.log(chalk.cyan('Next steps:\n'));
    console.log(chalk.white(`  1. cd mcp-servers/${config.name}`));
    console.log(chalk.white(`  2. npm install`));
    console.log(chalk.white(`  3. npm run build`));
    console.log(chalk.white(`  4. stick mcp test ${config.name}\n`));

    // Ask if they want to install dependencies now
    const { installNow } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'installNow',
        message: 'Install dependencies now?',
        default: true
      }
    ]);

    if (installNow) {
      await installDependencies(config.name);
    }

  } catch (error: any) {
    spinner.fail('Failed to create server');
    console.error(chalk.red('Error:'), error.message);
  }
}

/**
 * Create a tool interactively
 */
async function createTool() {
  const { name, description, hasParams } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Tool name:',
      validate: (input: string) => /^[a-z_][a-z0-9_]*$/i.test(input) || 'Use only letters, numbers, and underscores'
    },
    {
      type: 'input',
      name: 'description',
      message: 'Tool description:',
      validate: (input: string) => input.trim().length > 0 || 'Description is required'
    },
    {
      type: 'confirm',
      name: 'hasParams',
      message: 'Does this tool need parameters?',
      default: true
    }
  ]);

  let parameters = {};
  if (hasParams) {
    parameters = await createParameters();
  }

  // Generate handler function
  const handler = generateHandler(name, parameters);

  return {
    name,
    description,
    parameters,
    handler
  };
}

/**
 * Create parameters for a tool
 */
async function createParameters(): Promise<any> {
  const params: any = {
    type: 'object',
    properties: {},
    required: []
  };

  let addingParams = true;
  while (addingParams) {
    const { paramName, paramDesc, paramType, isRequired, addAnother } = await inquirer.prompt([
      {
        type: 'input',
        name: 'paramName',
        message: 'Parameter name:',
        validate: (input: string) => /^[a-z_][a-z0-9_]*$/i.test(input) || 'Use only letters, numbers, and underscores'
      },
      {
        type: 'input',
        name: 'paramDesc',
        message: 'Parameter description:'
      },
      {
        type: 'list',
        name: 'paramType',
        message: 'Parameter type:',
        choices: ['string', 'number', 'boolean', 'array', 'object']
      },
      {
        type: 'confirm',
        name: 'isRequired',
        message: 'Is this parameter required?',
        default: true
      },
      {
        type: 'confirm',
        name: 'addAnother',
        message: 'Add another parameter?',
        default: false
      }
    ]);

    params.properties[paramName] = {
      type: paramType,
      description: paramDesc
    };

    if (isRequired) {
      params.required.push(paramName);
    }

    addingParams = addAnother;
  }

  return params;
}

/**
 * Generate handler function code
 */
function generateHandler(toolName: string, parameters: any): string {
  const paramNames = Object.keys(parameters.properties || {});
  const paramList = paramNames.join(', ');

  return `async function ${toolName}(${paramList ? `{ ${paramList} }` : ''}) {
  // TODO: Implement ${toolName}
  
  // Example implementation:
  try {
    // Your logic here
    const result = {
      success: true,
      data: 'Implementation needed'
    };
    
    return result;
  } catch (error) {
    throw new Error(\`Failed to execute ${toolName}: \${error.message}\`);
  }
}`;
}

/**
 * Create resources
 */
async function createResources(): Promise<any[]> {
  const resources: any[] = [];
  let adding = true;

  while (adding) {
    const { uri, name, handler, addAnother } = await inquirer.prompt([
      {
        type: 'input',
        name: 'uri',
        message: 'Resource URI (e.g., file://data.json):',
        validate: (input: string) => input.trim().length > 0 || 'URI is required'
      },
      {
        type: 'input',
        name: 'name',
        message: 'Resource name:'
      },
      {
        type: 'input',
        name: 'handler',
        message: 'Handler function name:',
        default: 'handleResource'
      },
      {
        type: 'confirm',
        name: 'addAnother',
        message: 'Add another resource?',
        default: false
      }
    ]);

    resources.push({ uri, name, handler });
    adding = addAnother;
  }

  return resources;
}

/**
 * Create prompts
 */
async function createPrompts(): Promise<any[]> {
  const prompts: any[] = [];
  let adding = true;

  while (adding) {
    const { name, description, template, addAnother } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Prompt name:'
      },
      {
        type: 'input',
        name: 'description',
        message: 'Prompt description:'
      },
      {
        type: 'editor',
        name: 'template',
        message: 'Prompt template:'
      },
      {
        type: 'confirm',
        name: 'addAnother',
        message: 'Add another prompt?',
        default: false
      }
    ]);

    prompts.push({ name, description, template });
    adding = addAnother;
  }

  return prompts;
}

/**
 * Generate MCP server files
 */
async function generateMCPServer(config: MCPServerConfig) {
  const serverDir = path.join(process.cwd(), 'mcp-servers', config.name);
  await fs.ensureDir(serverDir);

  // Generate package.json
  const packageJson = {
    name: `@stickai/mcp-${config.name}`,
    version: '1.0.0',
    description: config.description,
    main: 'dist/index.js',
    type: 'module',
    scripts: {
      build: 'tsc',
      watch: 'tsc --watch',
      start: 'node dist/index.js'
    },
    dependencies: {
      '@modelcontextprotocol/sdk': '^1.0.0'
    },
    devDependencies: {
      '@types/node': '^20.0.0',
      'typescript': '^5.0.0'
    }
  };

  await fs.writeJSON(path.join(serverDir, 'package.json'), packageJson, { spaces: 2 });

  // Generate TypeScript config
  const tsConfig = {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'node',
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true
    },
    include: ['src/**/*'],
    exclude: ['node_modules']
  };

  await fs.writeJSON(path.join(serverDir, 'tsconfig.json'), tsConfig, { spaces: 2 });

  // Generate main server file
  const serverCode = generateServerCode(config);
  await fs.ensureDir(path.join(serverDir, 'src'));
  await fs.writeFile(path.join(serverDir, 'src', 'index.ts'), serverCode);

  // Generate README
  const readme = generateReadme(config);
  await fs.writeFile(path.join(serverDir, 'README.md'), readme);
}

/**
 * Generate server code
 */
function generateServerCode(config: MCPServerConfig): string {
  const toolHandlers = config.tools.map(tool => tool.handler).join('\n\n');
  
  const toolDefs = config.tools.map(tool => `
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [{
      name: '${tool.name}',
      description: '${tool.description}',
      inputSchema: ${JSON.stringify(tool.parameters, null, 2)}
    }]
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (request.params.name === '${tool.name}') {
      const result = await ${tool.name}(request.params.arguments);
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(result)
        }]
      };
    }
  });`).join('\n');

  return `#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Tool handlers
${toolHandlers}

// Create server
const server = new Server(
  {
    name: '${config.name}',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register tools
${toolDefs}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error('${config.name} MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
`;
}

/**
 * Generate README
 */
function generateReadme(config: MCPServerConfig): string {
  return `# ${config.name} MCP Server

${config.description}

## Tools

${config.tools.map(tool => `### ${tool.name}

${tool.description}

**Parameters:**
\`\`\`json
${JSON.stringify(tool.parameters, null, 2)}
\`\`\`
`).join('\n')}

## Installation

\`\`\`bash
npm install
npm run build
\`\`\`

## Usage

Add to your agent configuration:

\`\`\`typescript
{
  mcpServers: {
    '${config.name}': {
      command: 'node',
      args: ['./mcp-servers/${config.name}/dist/index.js']
    }
  }
}
\`\`\`

## Development

\`\`\`bash
npm run watch
\`\`\`
`;
}

/**
 * Install dependencies
 */
async function installDependencies(serverName: string) {
  const { exec } = await import('child_process');
  const { promisify } = await import('util');
  const execAsync = promisify(exec);

  const spinner = ora('Installing dependencies...').start();

  try {
    const serverDir = path.join(process.cwd(), 'mcp-servers', serverName);
    await execAsync('npm install', { cwd: serverDir });
    spinner.succeed('Dependencies installed');
  } catch (error: any) {
    spinner.fail('Failed to install dependencies');
    console.error(chalk.red('Error:'), error.message);
  }
}

/**
 * Install an existing MCP server
 */
async function installMCPServer(serverName?: string) {
  console.log(chalk.cyan('\n📥 Install MCP Server\n'));

  if (!serverName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Server package name (e.g., @modelcontextprotocol/server-filesystem):'
      }
    ]);
    serverName = name;
  }

  const spinner = ora(`Installing ${serverName}...`).start();

  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

    await execAsync(`npm install ${serverName}`);
    spinner.succeed(`${serverName} installed`);
  } catch (error: any) {
    spinner.fail('Installation failed');
    console.error(chalk.red('Error:'), error.message);
  }
}

/**
 * List MCP servers
 */
async function listMCPServers() {
  console.log(chalk.cyan('\n📋 Available MCP Servers\n'));

  const serversDir = path.join(process.cwd(), 'mcp-servers');
  
  if (!await fs.pathExists(serversDir)) {
    console.log(chalk.yellow('No custom servers found.'));
    console.log(chalk.gray('\nCreate one with: stick mcp create\n'));
    return;
  }

  const servers = await fs.readdir(serversDir);
  
  if (servers.length === 0) {
    console.log(chalk.yellow('No custom servers found.'));
  } else {
    servers.forEach(server => {
      console.log(chalk.green(`  • ${server}`));
    });
  }
  
  console.log();
}

/**
 * Test MCP server
 */
async function testMCPServer(serverName?: string) {
  console.log(chalk.cyan('\n🧪 Test MCP Server\n'));

  if (!serverName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Server name to test:'
      }
    ]);
    serverName = name;
  }

  console.log(chalk.yellow(`Testing ${serverName}...\n`));
  console.log(chalk.gray('(Test functionality coming soon)\n'));
}

/**
 * Publish MCP server
 */
async function publishMCPServer(serverName?: string) {
  console.log(chalk.cyan('\n📦 Publish MCP Server\n'));

  if (!serverName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Server name to publish:'
      }
    ]);
    serverName = name;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Publish ${serverName} to npm?`,
      default: false
    }
  ]);

  if (confirm) {
    const spinner = ora('Publishing...').start();
    
    try {
      const { exec } = await import('child_process');
      const { promisify } = await import('util');
      const execAsync = promisify(exec);

      const serverDir = path.join(process.cwd(), 'mcp-servers', serverName);
      await execAsync('npm publish --access public', { cwd: serverDir });
      
      spinner.succeed(`${serverName} published!`);
    } catch (error: any) {
      spinner.fail('Publication failed');
      console.error(chalk.red('Error:'), error.message);
    }
  }
}
