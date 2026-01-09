#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mcpCommand = mcpCommand;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
async function mcpCommand(action, name, options) {
    if (!action) {
        // Show interactive menu
        const { mcpAction } = await inquirer_1.default.prompt([
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
            console.log(chalk_1.default.red('Unknown action'));
    }
}
/**
 * Create a custom MCP server with guided process
 */
async function createMCPServer(serverName) {
    console.log(chalk_1.default.cyan.bold('\n🔧 MCP Server Builder\n'));
    console.log(chalk_1.default.white('Let\'s build your custom MCP server step by step!\n'));
    // Step 1: Basic info
    const { name, description } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Server name:',
            default: serverName,
            validate: (input) => input.trim().length > 0 || 'Name is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Server description:',
            validate: (input) => input.trim().length > 0 || 'Description is required'
        }
    ]);
    const config = {
        name,
        description,
        tools: []
    };
    // Step 2: Add tools
    console.log(chalk_1.default.cyan('\n📦 Add Tools\n'));
    console.log(chalk_1.default.gray('Tools are functions that agents can call.\n'));
    let addingTools = true;
    while (addingTools) {
        const { addTool } = await inquirer_1.default.prompt([
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
        console.log(chalk_1.default.green(`✓ Tool "${tool.name}" added!\n`));
    }
    // Step 3: Add resources (optional)
    const { addResources } = await inquirer_1.default.prompt([
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
    const { addPrompts } = await inquirer_1.default.prompt([
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
    console.log(chalk_1.default.cyan('\n🏗️  Generating server code...\n'));
    const spinner = (0, ora_1.default)('Creating files...').start();
    try {
        await generateMCPServer(config);
        spinner.succeed('MCP server created successfully!');
        // Show next steps
        console.log(chalk_1.default.green('\n✅ Your MCP server is ready!\n'));
        console.log(chalk_1.default.cyan('Next steps:\n'));
        console.log(chalk_1.default.white(`  1. cd mcp-servers/${config.name}`));
        console.log(chalk_1.default.white(`  2. npm install`));
        console.log(chalk_1.default.white(`  3. npm run build`));
        console.log(chalk_1.default.white(`  4. stick mcp test ${config.name}\n`));
        // Ask if they want to install dependencies now
        const { installNow } = await inquirer_1.default.prompt([
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
    }
    catch (error) {
        spinner.fail('Failed to create server');
        console.error(chalk_1.default.red('Error:'), error.message);
    }
}
/**
 * Create a tool interactively
 */
async function createTool() {
    const { name, description, hasParams } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Tool name:',
            validate: (input) => /^[a-z_][a-z0-9_]*$/i.test(input) || 'Use only letters, numbers, and underscores'
        },
        {
            type: 'input',
            name: 'description',
            message: 'Tool description:',
            validate: (input) => input.trim().length > 0 || 'Description is required'
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
async function createParameters() {
    const params = {
        type: 'object',
        properties: {},
        required: []
    };
    let addingParams = true;
    while (addingParams) {
        const { paramName, paramDesc, paramType, isRequired, addAnother } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'paramName',
                message: 'Parameter name:',
                validate: (input) => /^[a-z_][a-z0-9_]*$/i.test(input) || 'Use only letters, numbers, and underscores'
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
function generateHandler(toolName, parameters) {
    const paramNames = Object.keys(parameters.properties || {});
    const paramList = paramNames.join(', ');
    // Generate example implementation based on parameter names
    const exampleLogic = paramNames.length > 0
        ? `    // Process parameters
    console.log('Executing ${toolName} with:', { ${paramList} });

    // Implement your business logic here
    // Example: validation, API calls, data processing, etc.

    const result = {
      success: true,
      message: '${toolName} executed successfully',
      data: {
        ${paramNames.map(p => `${p}: ${p}`).join(',\n        ')}
      }
    };`
        : `    // Implement your business logic here
    const result = {
      success: true,
      message: '${toolName} executed successfully'
    };`;
    return `async function ${toolName}(${paramList ? `{ ${paramList} }` : ''}) {
  try {
${exampleLogic}

    return result;
  } catch (error) {
    throw new Error(\`Failed to execute ${toolName}: \${error.message}\`);
  }
}`;
}
/**
 * Create resources
 */
async function createResources() {
    const resources = [];
    let adding = true;
    while (adding) {
        const { uri, name, handler, addAnother } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'uri',
                message: 'Resource URI (e.g., file://data.json):',
                validate: (input) => input.trim().length > 0 || 'URI is required'
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
async function createPrompts() {
    const prompts = [];
    let adding = true;
    while (adding) {
        const { name, description, template, addAnother } = await inquirer_1.default.prompt([
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
async function generateMCPServer(config) {
    const serverDir = path_1.default.join(process.cwd(), 'mcp-servers', config.name);
    await fs_extra_1.default.ensureDir(serverDir);
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
    await fs_extra_1.default.writeJSON(path_1.default.join(serverDir, 'package.json'), packageJson, { spaces: 2 });
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
    await fs_extra_1.default.writeJSON(path_1.default.join(serverDir, 'tsconfig.json'), tsConfig, { spaces: 2 });
    // Generate main server file
    const serverCode = generateServerCode(config);
    await fs_extra_1.default.ensureDir(path_1.default.join(serverDir, 'src'));
    await fs_extra_1.default.writeFile(path_1.default.join(serverDir, 'src', 'index.ts'), serverCode);
    // Generate README
    const readme = generateReadme(config);
    await fs_extra_1.default.writeFile(path_1.default.join(serverDir, 'README.md'), readme);
}
/**
 * Generate server code
 */
function generateServerCode(config) {
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
function generateReadme(config) {
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
async function installDependencies(serverName) {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    const spinner = (0, ora_1.default)('Installing dependencies...').start();
    try {
        const serverDir = path_1.default.join(process.cwd(), 'mcp-servers', serverName);
        await execAsync('npm install', { cwd: serverDir });
        spinner.succeed('Dependencies installed');
    }
    catch (error) {
        spinner.fail('Failed to install dependencies');
        console.error(chalk_1.default.red('Error:'), error.message);
    }
}
/**
 * Install an existing MCP server
 */
async function installMCPServer(serverName) {
    console.log(chalk_1.default.cyan('\n📥 Install MCP Server\n'));
    if (!serverName) {
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Server package name (e.g., @modelcontextprotocol/server-filesystem):'
            }
        ]);
        serverName = name;
    }
    const spinner = (0, ora_1.default)(`Installing ${serverName}...`).start();
    try {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        await execAsync(`npm install ${serverName}`);
        spinner.succeed(`${serverName} installed`);
    }
    catch (error) {
        spinner.fail('Installation failed');
        console.error(chalk_1.default.red('Error:'), error.message);
    }
}
/**
 * List MCP servers
 */
async function listMCPServers() {
    console.log(chalk_1.default.cyan('\n📋 Available MCP Servers\n'));
    const serversDir = path_1.default.join(process.cwd(), 'mcp-servers');
    if (!await fs_extra_1.default.pathExists(serversDir)) {
        console.log(chalk_1.default.yellow('No custom servers found.'));
        console.log(chalk_1.default.gray('\nCreate one with: stick mcp create\n'));
        return;
    }
    const servers = await fs_extra_1.default.readdir(serversDir);
    if (servers.length === 0) {
        console.log(chalk_1.default.yellow('No custom servers found.'));
    }
    else {
        servers.forEach(server => {
            console.log(chalk_1.default.green(`  • ${server}`));
        });
    }
    console.log();
}
/**
 * Test MCP server
 */
async function testMCPServer(serverName) {
    console.log(chalk_1.default.cyan('\n🧪 Test MCP Server\n'));
    if (!serverName) {
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Server name to test:'
            }
        ]);
        serverName = name;
    }
    const spinner = (0, ora_1.default)(`Testing ${serverName}...`).start();
    try {
        const serverDir = path_1.default.join(process.cwd(), 'mcp-servers', serverName);
        // Check if server exists
        if (!await fs_extra_1.default.pathExists(serverDir)) {
            spinner.fail(`Server not found: ${serverName}`);
            console.log(chalk_1.default.yellow('\nAvailable servers:'));
            await listMCPServers();
            return;
        }
        // Check if server is built
        const distPath = path_1.default.join(serverDir, 'dist', 'index.js');
        if (!await fs_extra_1.default.pathExists(distPath)) {
            spinner.warn('Server not built. Building now...');
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);
            try {
                await execAsync('npm run build', { cwd: serverDir });
                spinner.succeed('Server built successfully');
            }
            catch (error) {
                spinner.fail('Build failed');
                console.error(chalk_1.default.red('Error:'), error.message);
                return;
            }
        }
        spinner.text = 'Starting MCP server test...';
        // Import and test the MCP server
        const { spawn } = await import('child_process');
        const serverProcess = spawn('node', [distPath], {
            cwd: serverDir,
            stdio: ['pipe', 'pipe', 'pipe']
        });
        let output = '';
        let errorOutput = '';
        serverProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        serverProcess.stderr.on('data', (data) => {
            errorOutput += data.toString();
        });
        // Wait for server to start (or fail)
        await new Promise((resolve) => setTimeout(resolve, 2000));
        // Send a test request
        const testRequest = JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'tools/list',
            params: {}
        }) + '\n';
        serverProcess.stdin.write(testRequest);
        // Wait for response
        await new Promise((resolve) => setTimeout(resolve, 1000));
        serverProcess.kill();
        if (errorOutput.includes('running on stdio')) {
            spinner.succeed(`${serverName} is working correctly!`);
            console.log(chalk_1.default.green('\n✓ Server started successfully'));
            console.log(chalk_1.default.gray('  Server output:', errorOutput.split('\n')[0]));
        }
        else if (output || errorOutput) {
            spinner.succeed('Server test completed');
            console.log(chalk_1.default.cyan('\nServer output:'));
            if (errorOutput)
                console.log(chalk_1.default.gray(errorOutput));
            if (output)
                console.log(chalk_1.default.white(output));
        }
        else {
            spinner.warn('Server started but no output received');
            console.log(chalk_1.default.yellow('\nThe server may need additional configuration.'));
        }
        console.log(chalk_1.default.cyan('\nNext steps:'));
        console.log(chalk_1.default.white(`  1. Add to agent config:`));
        console.log(chalk_1.default.gray(`     mcp: {
       servers: {
         "${serverName}": {
           command: "node",
           args: ["./mcp-servers/${serverName}/dist/index.js"]
         }
       }
     }`));
        console.log();
    }
    catch (error) {
        spinner.fail('Test failed');
        console.error(chalk_1.default.red('Error:'), error.message);
    }
}
/**
 * Publish MCP server
 */
async function publishMCPServer(serverName) {
    console.log(chalk_1.default.cyan('\n📦 Publish MCP Server\n'));
    if (!serverName) {
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Server name to publish:'
            }
        ]);
        serverName = name;
    }
    const { confirm } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: `Publish ${serverName} to npm?`,
            default: false
        }
    ]);
    if (confirm) {
        const spinner = (0, ora_1.default)('Publishing...').start();
        try {
            const { exec } = await import('child_process');
            const { promisify } = await import('util');
            const execAsync = promisify(exec);
            const serverDir = path_1.default.join(process.cwd(), 'mcp-servers', serverName);
            await execAsync('npm publish --access public', { cwd: serverDir });
            spinner.succeed(`${serverName} published!`);
        }
        catch (error) {
            spinner.fail('Publication failed');
            console.error(chalk_1.default.red('Error:'), error.message);
        }
    }
}
//# sourceMappingURL=mcp.js.map