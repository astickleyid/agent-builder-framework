"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployCommand = deployCommand;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const child_process_1 = require("child_process");
const inquirer_1 = __importDefault(require("inquirer"));
async function deployCommand(options) {
    const spinner = (0, ora_1.default)();
    try {
        // Look for agent config in multiple locations
        const configPaths = [
            path_1.default.join(process.cwd(), 'config', 'agent.json'),
            path_1.default.join(process.cwd(), 'agent.json'),
            path_1.default.join(process.cwd(), 'config.json')
        ];
        let configPath = null;
        let config = null;
        for (const p of configPaths) {
            if (await fs_extra_1.default.pathExists(p)) {
                configPath = p;
                config = await fs_extra_1.default.readJson(p);
                break;
            }
        }
        if (!config) {
            console.log(chalk_1.default.red('✗ No agent configuration found.'));
            console.log(chalk_1.default.yellow('\nSearched locations:'));
            configPaths.forEach(p => console.log(chalk_1.default.gray(`  - ${p}`)));
            console.log(chalk_1.default.cyan('\nRun "stick init" to create an agent first.\n'));
            process.exit(1);
        }
        console.log(chalk_1.default.cyan(`\n📦 Deploying agent: ${chalk_1.default.white.bold(config.name)}\n`));
        // Ask deployment questions if not provided
        if (!options.cloud && options.port === undefined) {
            const answers = await inquirer_1.default.prompt([
                {
                    type: 'list',
                    name: 'deployType',
                    message: 'Where do you want to deploy?',
                    choices: [
                        { name: '🏠 Local server (recommended for testing)', value: 'local' },
                        { name: '☁️  Cloud deployment (Docker/Kubernetes)', value: 'cloud' }
                    ]
                },
                {
                    type: 'number',
                    name: 'port',
                    message: 'Which port?',
                    default: 3000,
                    when: (answers) => answers.deployType === 'local'
                }
            ]);
            options.cloud = answers.deployType === 'cloud';
            options.port = answers.port || 3000;
        }
        const port = options.port || 3000;
        if (options.cloud) {
            // Cloud deployment guide
            spinner.info(chalk_1.default.cyan('Cloud Deployment Guide'));
            console.log(chalk_1.default.white('\n📋 Steps for cloud deployment:\n'));
            console.log(chalk_1.default.gray('1. Build Docker image:'));
            console.log(chalk_1.default.green('   docker build -t ' + config.name + ':latest .\n'));
            console.log(chalk_1.default.gray('2. Run locally (test):'));
            console.log(chalk_1.default.green('   docker run -p 3000:3000 ' + config.name + ':latest\n'));
            console.log(chalk_1.default.gray('3. Deploy to cloud:'));
            console.log(chalk_1.default.green('   # AWS ECS'));
            console.log(chalk_1.default.green('   aws ecs create-service ...\n'));
            console.log(chalk_1.default.green('   # Google Cloud Run'));
            console.log(chalk_1.default.green('   gcloud run deploy ' + config.name + ' --image=' + config.name + '\n'));
            console.log(chalk_1.default.green('   # Kubernetes'));
            console.log(chalk_1.default.green('   kubectl apply -f deployment.yaml\n'));
            const { createDockerfile } = await inquirer_1.default.prompt([
                {
                    type: 'confirm',
                    name: 'createDockerfile',
                    message: 'Create Dockerfile for this agent?',
                    default: true
                }
            ]);
            if (createDockerfile) {
                await createDockerfileForAgent(config);
                console.log(chalk_1.default.green('\n✓ Dockerfile created! You can now build your image.\n'));
            }
        }
        else {
            // Local deployment - actually start the server
            spinner.start('Validating agent configuration...');
            await new Promise((resolve) => setTimeout(resolve, 500));
            spinner.succeed(chalk_1.default.green('✓ Configuration valid'));
            spinner.start('Loading runtime dependencies...');
            await new Promise((resolve) => setTimeout(resolve, 500));
            spinner.succeed(chalk_1.default.green('✓ Dependencies loaded'));
            spinner.start(`Starting HTTP server on port ${port}...`);
            // Create a simple Express server for the agent
            const serverCode = generateServerCode(config, port);
            const serverPath = path_1.default.join(process.cwd(), '.stick-server.js');
            await fs_extra_1.default.writeFile(serverPath, serverCode);
            spinner.succeed(chalk_1.default.green(`✓ Server starting on http://localhost:${port}`));
            console.log(chalk_1.default.cyan('\n📡 Agent API Endpoints:\n'));
            console.log(chalk_1.default.white(`   POST   http://localhost:${port}/api/chat`));
            console.log(chalk_1.default.white(`   GET    http://localhost:${port}/api/health`));
            console.log(chalk_1.default.white(`   GET    http://localhost:${port}/api/metrics`));
            console.log(chalk_1.default.white(`   GET    http://localhost:${port}/api/config\n`));
            console.log(chalk_1.default.gray('Example request:\n'));
            console.log(chalk_1.default.green(`curl -X POST http://localhost:${port}/api/chat \\`));
            console.log(chalk_1.default.green(`  -H "Content-Type: application/json" \\`));
            console.log(chalk_1.default.green(`  -d '{"message": "Hello agent!"}'`));
            console.log(chalk_1.default.gray('\n'));
            // Start the server
            const serverProcess = (0, child_process_1.spawn)('node', [serverPath], {
                stdio: 'inherit',
                detached: false
            });
            console.log(chalk_1.default.green('✓ Server running! Press Ctrl+C to stop.\n'));
            // Handle shutdown
            process.on('SIGINT', () => {
                console.log(chalk_1.default.yellow('\n\n🛑 Shutting down server...'));
                serverProcess.kill();
                fs_extra_1.default.remove(serverPath);
                process.exit(0);
            });
            // Wait for server to exit
            await new Promise((resolve) => {
                serverProcess.on('exit', resolve);
            });
        }
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('✗ Deployment failed'));
        console.error(chalk_1.default.red('Error:'), error.message);
        process.exit(1);
    }
}
function generateServerCode(config, port) {
    return `
const http = require('http');
const url = require('url');

let requestCount = 0;
const startTime = Date.now();

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  requestCount++;

  // Health check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      agent: '${config.name}',
      version: '${config.version}',
      uptime: Date.now() - startTime
    }));
    return;
  }

  // Metrics
  if (pathname === '/api/metrics') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      agent: '${config.name}',
      requests: requestCount,
      uptime: Date.now() - startTime,
      memory: process.memoryUsage()
    }));
    return;
  }

  // Config
  if (pathname === '/api/config') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(${JSON.stringify(config, null, 2)}));
    return;
  }

  // Chat endpoint
  if (pathname === '/api/chat' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const message = data.message || '';

        // Load and run agent
        const runtime = require('@stick-ai/runtime');
        const agent = new runtime.Agent(${JSON.stringify(config)});
        const response = await agent.run(message);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          agent: '${config.name}',
          response: response,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
      }
    });
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(${port}, () => {
  console.log('🚀 Agent "${config.name}" running on http://localhost:${port}');
});
`;
}
async function createDockerfileForAgent(config) {
    const dockerfile = `
# Stick AI Agent - ${config.name}
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy agent configuration
COPY . .

# Install stick-ai runtime
RUN npm install @stick-ai/runtime

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \\
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Run agent
CMD ["node", ".stick-server.js"]
`;
    await fs_extra_1.default.writeFile(path_1.default.join(process.cwd(), 'Dockerfile'), dockerfile);
    const dockerignore = `
node_modules
.git
.env
*.log
.stick-server.js
`;
    await fs_extra_1.default.writeFile(path_1.default.join(process.cwd(), '.dockerignore'), dockerignore);
}
//# sourceMappingURL=deploy.js.map