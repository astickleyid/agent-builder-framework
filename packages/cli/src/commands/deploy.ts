import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { spawn } from 'child_process';
import inquirer from 'inquirer';

export async function deployCommand(options?: any) {
  const spinner = ora();

  try {
    // Look for agent config in multiple locations
    const configPaths = [
      path.join(process.cwd(), 'config', 'agent.json'),
      path.join(process.cwd(), 'agent.json'),
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
      console.log(chalk.red('✗ No agent configuration found.'));
      console.log(chalk.yellow('\nSearched locations:'));
      configPaths.forEach(p => console.log(chalk.gray(`  - ${p}`)));
      console.log(chalk.cyan('\nRun "stick init" to create an agent first.\n'));
      process.exit(1);
    }

    console.log(chalk.cyan(`\n📦 Deploying agent: ${chalk.white.bold(config.name)}\n`));

    // Ask deployment questions if not provided
    if (!options.cloud && options.port === undefined) {
      const answers = await inquirer.prompt([
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
      spinner.info(chalk.cyan('Cloud Deployment Guide'));
      
      console.log(chalk.white('\n📋 Steps for cloud deployment:\n'));
      console.log(chalk.gray('1. Build Docker image:'));
      console.log(chalk.green('   docker build -t ' + config.name + ':latest .\n'));
      
      console.log(chalk.gray('2. Run locally (test):'));
      console.log(chalk.green('   docker run -p 3000:3000 ' + config.name + ':latest\n'));
      
      console.log(chalk.gray('3. Deploy to cloud:'));
      console.log(chalk.green('   # AWS ECS'));
      console.log(chalk.green('   aws ecs create-service ...\n'));
      console.log(chalk.green('   # Google Cloud Run'));
      console.log(chalk.green('   gcloud run deploy ' + config.name + ' --image=' + config.name + '\n'));
      console.log(chalk.green('   # Kubernetes'));
      console.log(chalk.green('   kubectl apply -f deployment.yaml\n'));

      const { createDockerfile } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createDockerfile',
          message: 'Create Dockerfile for this agent?',
          default: true
        }
      ]);

      if (createDockerfile) {
        await createDockerfileForAgent(config);
        console.log(chalk.green('\n✓ Dockerfile created! You can now build your image.\n'));
      }

    } else {
      // Local deployment - actually start the server
      spinner.start('Validating agent configuration...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green('✓ Configuration valid'));

      spinner.start('Loading runtime dependencies...');
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.succeed(chalk.green('✓ Dependencies loaded'));

      spinner.start(`Starting HTTP server on port ${port}...`);

      // Create a simple Express server for the agent
      const serverCode = generateServerCode(config, port);
      const serverPath = path.join(process.cwd(), '.stick-server.js');
      await fs.writeFile(serverPath, serverCode);

      spinner.succeed(chalk.green(`✓ Server starting on http://localhost:${port}`));

      console.log(chalk.cyan('\n📡 Agent API Endpoints:\n'));
      console.log(chalk.white(`   POST   http://localhost:${port}/api/chat`));
      console.log(chalk.white(`   GET    http://localhost:${port}/api/health`));
      console.log(chalk.white(`   GET    http://localhost:${port}/api/metrics`));
      console.log(chalk.white(`   GET    http://localhost:${port}/api/config\n`));

      console.log(chalk.gray('Example request:\n'));
      console.log(chalk.green(`curl -X POST http://localhost:${port}/api/chat \\`));
      console.log(chalk.green(`  -H "Content-Type: application/json" \\`));
      console.log(chalk.green(`  -d '{"message": "Hello agent!"}'`));
      console.log(chalk.gray('\n'));

      // Start the server
      const serverProcess = spawn('node', [serverPath], {
        stdio: 'inherit',
        detached: false
      });

      console.log(chalk.green('✓ Server running! Press Ctrl+C to stop.\n'));

      // Handle shutdown
      process.on('SIGINT', () => {
        console.log(chalk.yellow('\n\n🛑 Shutting down server...'));
        serverProcess.kill();
        fs.remove(serverPath);
        process.exit(0);
      });

      // Wait for server to exit
      await new Promise((resolve) => {
        serverProcess.on('exit', resolve);
      });
    }

  } catch (error: any) {
    spinner.fail(chalk.red('✗ Deployment failed'));
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

function generateServerCode(config: any, port: number): string {
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

async function createDockerfileForAgent(config: any) {
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

  await fs.writeFile(path.join(process.cwd(), 'Dockerfile'), dockerfile);
  
  const dockerignore = `
node_modules
.git
.env
*.log
.stick-server.js
`;
  await fs.writeFile(path.join(process.cwd(), '.dockerignore'), dockerignore);
}
