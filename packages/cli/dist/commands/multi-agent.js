#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiAgentCommand = multiAgentCommand;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
async function multiAgentCommand(action, name) {
    if (!action) {
        const { multiAction } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'multiAction',
                message: 'What would you like to do?',
                choices: [
                    { name: '🆕 Create multi-agent system', value: 'create' },
                    { name: '📋 List systems', value: 'list' },
                    { name: '▶️  Run system', value: 'run' },
                    { name: '📊 View system diagram', value: 'diagram' }
                ]
            }
        ]);
        action = multiAction;
    }
    switch (action) {
        case 'create':
            await createMultiAgentSystem(name);
            break;
        case 'list':
            await listSystems();
            break;
        case 'run':
            await runSystem(name);
            break;
        case 'diagram':
            await showDiagram(name);
            break;
    }
}
async function createMultiAgentSystem(systemName) {
    console.log(chalk_1.default.cyan.bold('\n🤖 Multi-Agent System Builder\n'));
    console.log(chalk_1.default.white('Build a coordinated system of AI agents!\n'));
    // Step 1: System basics
    const { name, description } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'System name:',
            default: systemName,
            validate: (input) => input.trim().length > 0 || 'Name is required'
        },
        {
            type: 'input',
            name: 'description',
            message: 'What does this system do?'
        }
    ]);
    // Step 2: Choose architecture
    const { workflow } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'workflow',
            message: 'System architecture:',
            choices: [
                {
                    name: '📝 Sequential - Agents work one after another',
                    value: 'sequential'
                },
                {
                    name: '⚡ Parallel - Agents work simultaneously',
                    value: 'parallel'
                },
                {
                    name: '🏢 Hierarchical - Manager coordinates workers',
                    value: 'hierarchical'
                },
                {
                    name: '🔧 Custom - Define your own flow',
                    value: 'custom'
                }
            ]
        }
    ]);
    const system = {
        name,
        description,
        coordinator: await createCoordinator(workflow),
        workers: [],
        workflow,
        communication: 'shared-memory'
    };
    // Step 3: Add worker agents
    console.log(chalk_1.default.cyan('\n👷 Add Worker Agents\n'));
    let addingWorkers = true;
    while (addingWorkers) {
        const { addWorker } = await inquirer_1.default.prompt([
            {
                type: 'confirm',
                name: 'addWorker',
                message: 'Add a worker agent?',
                default: system.workers.length === 0
            }
        ]);
        if (!addWorker)
            break;
        const worker = await createWorkerAgent();
        system.workers.push(worker);
        console.log(chalk_1.default.green(`✓ Agent "${worker.name}" added!\n`));
    }
    // Step 4: Communication method
    const { communication } = await inquirer_1.default.prompt([
        {
            type: 'list',
            name: 'communication',
            message: 'How should agents communicate?',
            choices: [
                {
                    name: '💾 Shared Memory - Fast, simple',
                    value: 'shared-memory'
                },
                {
                    name: '📨 Message Queue - Reliable, async',
                    value: 'message-queue'
                },
                {
                    name: '🔗 Direct - Point-to-point',
                    value: 'direct'
                }
            ]
        }
    ]);
    system.communication = communication;
    // Step 5: Generate system
    const spinner = (0, ora_1.default)('Creating multi-agent system...').start();
    try {
        await generateSystem(system);
        spinner.succeed('System created!');
        console.log(chalk_1.default.green('\n✅ Multi-agent system ready!\n'));
        console.log(chalk_1.default.cyan('System Overview:\n'));
        console.log(chalk_1.default.white(`  Name: ${system.name}`));
        console.log(chalk_1.default.white(`  Architecture: ${system.workflow}`));
        console.log(chalk_1.default.white(`  Coordinator: ${system.coordinator.name}`));
        console.log(chalk_1.default.white(`  Workers: ${system.workers.length}`));
        system.workers.forEach(w => console.log(chalk_1.default.gray(`    • ${w.name} (${w.role})`)));
        console.log(chalk_1.default.white(`  Communication: ${system.communication}\n`));
        console.log(chalk_1.default.cyan('Next steps:\n'));
        console.log(chalk_1.default.white(`  1. Review: multi-agent-systems/${system.name}/`));
        console.log(chalk_1.default.white(`  2. Customize: Edit agent configurations`));
        console.log(chalk_1.default.white(`  3. Run: stick multi-agent run ${system.name}\n`));
    }
    catch (error) {
        spinner.fail('Failed to create system');
        console.error(chalk_1.default.red('Error:'), error.message);
    }
}
async function createCoordinator(workflow) {
    console.log(chalk_1.default.cyan('\n👔 Configure Coordinator Agent\n'));
    const roles = {
        sequential: 'Task Sequencer',
        parallel: 'Work Distributor',
        hierarchical: 'Manager',
        custom: 'Orchestrator'
    };
    const { name, model, temperature } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Coordinator name:',
            default: 'coordinator'
        },
        {
            type: 'list',
            name: 'model',
            message: 'AI model:',
            choices: [
                'gpt-4',
                'gpt-3.5-turbo',
                'claude-3-opus',
                'mistral:latest',
                'llama2:latest'
            ]
        },
        {
            type: 'number',
            name: 'temperature',
            message: 'Temperature (0-1):',
            default: 0.7
        }
    ]);
    return {
        name,
        role: roles[workflow],
        capabilities: ['coordination', 'task-distribution', 'result-aggregation'],
        model,
        temperature
    };
}
async function createWorkerAgent() {
    const { name, role, capabilities, model } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Agent name:',
            validate: (input) => /^[a-z-]+$/i.test(input) || 'Use letters and hyphens only'
        },
        {
            type: 'input',
            name: 'role',
            message: 'Agent role (e.g., researcher, writer, analyst):'
        },
        {
            type: 'checkbox',
            name: 'capabilities',
            message: 'Agent capabilities:',
            choices: [
                { name: 'Web Search', value: 'web-search' },
                { name: 'File Operations', value: 'file-ops' },
                { name: 'Code Execution', value: 'code-exec' },
                { name: 'Data Analysis', value: 'data-analysis' },
                { name: 'Text Generation', value: 'text-gen' },
                { name: 'Image Processing', value: 'image-proc' },
                { name: 'Database Access', value: 'database' }
            ]
        },
        {
            type: 'list',
            name: 'model',
            message: 'AI model:',
            choices: [
                'gpt-4',
                'gpt-3.5-turbo',
                'claude-3-opus',
                'mistral:latest',
                'llama2:latest'
            ]
        }
    ]);
    return { name, role, capabilities, model };
}
async function generateSystem(system) {
    const systemDir = path_1.default.join(process.cwd(), 'multi-agent-systems', system.name);
    await fs_extra_1.default.ensureDir(systemDir);
    // Generate config
    await fs_extra_1.default.writeJSON(path_1.default.join(systemDir, 'config.json'), system, { spaces: 2 });
    // Generate coordinator
    await generateAgent(systemDir, system.coordinator, true);
    // Generate workers
    for (const worker of system.workers) {
        await generateAgent(systemDir, worker, false);
    }
    // Generate orchestrator
    await generateOrchestrator(systemDir, system);
    // Generate README
    await generateSystemReadme(systemDir, system);
}
async function generateAgent(systemDir, agent, isCoordinator) {
    const agentCode = `
import { IntelligentAgent } from '@stick-ai/runtime';

export const ${agent.name} = new IntelligentAgent(
  {
    name: '${agent.name}',
    version: '1.0.0',
    description: '${agent.role}',
    capabilities: ['chat'],
    tools: ['datetime', 'text'],
    instructions: '${agent.role}'
  },
  {
    provider: 'ollama',
    model: '${agent.model}',
    temperature: ${agent.temperature || 0.7}
  },
  capabilities: ${JSON.stringify(agent.capabilities)},
  ${isCoordinator ? `
  systemPrompt: \`You are the coordinator for the ${agent.name} system.
  Your role is to ${agent.role}.
  Manage and coordinate worker agents to complete tasks efficiently.\`
  ` : `
  systemPrompt: \`You are a ${agent.role}.
  Your capabilities include: ${agent.capabilities.join(', ')}.
  Work collaboratively with other agents to achieve system goals.\`
  `}
});
`;
    await fs_extra_1.default.writeFile(path_1.default.join(systemDir, `${agent.name}.ts`), agentCode);
}
async function generateOrchestrator(systemDir, system) {
    const orchestratorCode = `
import { ${system.coordinator.name} } from './${system.coordinator.name}';
${system.workers.map(w => `import { ${w.name} } from './${w.name}';`).join('\n')}

export class ${system.name}System {
  private coordinator = ${system.coordinator.name};
  private workers = [
    ${system.workers.map(w => w.name).join(',\n    ')}
  ];

  async run(task: string) {
    console.log('Starting ${system.name} system...');
    
    // ${system.workflow} workflow
    ${generateWorkflowCode(system.workflow)}
  }

  async ${system.workflow}Workflow(task: string) {
    // Coordinate agents based on ${system.workflow} pattern
    const plan = await this.coordinator.run(
      \`Create a plan for: \${task}\nWorkers: \${this.workers.map(w => w.name).join(', ')}\`
    );

    console.log('Plan:', plan);

    // Execute with workers
    ${system.workflow === 'sequential' ? `
    let result = task;
    for (const worker of this.workers) {
      result = await worker.run(result);
    }
    return result;
    ` : system.workflow === 'parallel' ? `
    const results = await Promise.all(
      this.workers.map(worker => worker.run(task))
    );
    return this.coordinator.run(\`Aggregate: \${JSON.stringify(results)}\`);
    ` : `
    // Custom workflow implementation
    return 'Custom workflow implementation needed';
    `}
  }
}

// Run system
if (import.meta.url === \`file://\${process.argv[1]}\`) {
  const system = new ${system.name}System();
  const task = process.argv[2] || 'Default task';
  system.run(task).then(console.log).catch(console.error);
}
`;
    await fs_extra_1.default.writeFile(path_1.default.join(systemDir, 'index.ts'), orchestratorCode);
}
function generateWorkflowCode(workflow) {
    switch (workflow) {
        case 'sequential':
            return 'return await this.sequentialWorkflow(task);';
        case 'parallel':
            return 'return await this.parallelWorkflow(task);';
        case 'hierarchical':
            return 'return await this.hierarchicalWorkflow(task);';
        default:
            return 'return await this.customWorkflow(task);';
    }
}
async function generateSystemReadme(systemDir, system) {
    const readme = `# ${system.name}

${system.description}

## Architecture: ${system.workflow}

### Coordinator
- **Name**: ${system.coordinator.name}
- **Role**: ${system.coordinator.role}
- **Model**: ${system.coordinator.model}

### Worker Agents
${system.workers.map(w => `
- **${w.name}**
  - Role: ${w.role}
  - Capabilities: ${w.capabilities.join(', ')}
  - Model: ${w.model}
`).join('\n')}

## Communication
${system.communication}

## Usage

\`\`\`bash
# Run the system
stick multi-agent run ${system.name} "Your task here"

# Or import in code
import { ${system.name}System } from './multi-agent-systems/${system.name}';

const system = new ${system.name}System();
const result = await system.run('Your task');
\`\`\`

## Workflow

${getWorkflowDescription(system.workflow)}
`;
    await fs_extra_1.default.writeFile(path_1.default.join(systemDir, 'README.md'), readme);
}
function getWorkflowDescription(workflow) {
    const descriptions = {
        sequential: 'Agents execute tasks one after another, with each agent building on the previous result.',
        parallel: 'All agents work simultaneously on the task, then results are aggregated.',
        hierarchical: 'A manager agent delegates tasks to workers and coordinates their efforts.',
        custom: 'Custom workflow logic defined in the orchestrator.'
    };
    return descriptions[workflow] || 'Custom workflow';
}
async function listSystems() {
    console.log(chalk_1.default.cyan('\n📋 Multi-Agent Systems\n'));
    const systemsDir = path_1.default.join(process.cwd(), 'multi-agent-systems');
    if (!await fs_extra_1.default.pathExists(systemsDir)) {
        console.log(chalk_1.default.yellow('No systems found.'));
        console.log(chalk_1.default.gray('\nCreate one with: stick multi-agent create\n'));
        return;
    }
    const systems = await fs_extra_1.default.readdir(systemsDir);
    if (systems.length === 0) {
        console.log(chalk_1.default.yellow('No systems found.'));
    }
    else {
        for (const system of systems) {
            const configPath = path_1.default.join(systemsDir, system, 'config.json');
            if (await fs_extra_1.default.pathExists(configPath)) {
                const config = await fs_extra_1.default.readJSON(configPath);
                console.log(chalk_1.default.green(`\n• ${config.name}`));
                console.log(chalk_1.default.gray(`  ${config.description}`));
                console.log(chalk_1.default.gray(`  Architecture: ${config.workflow}`));
                console.log(chalk_1.default.gray(`  Agents: ${config.workers.length + 1}`));
            }
        }
    }
    console.log();
}
async function runSystem(systemName) {
    if (!systemName) {
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'System name:'
            }
        ]);
        systemName = name;
    }
    const { task } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'task',
            message: 'What task should the system perform?'
        }
    ]);
    console.log(chalk_1.default.cyan(`\n▶️  Running ${systemName}...\n`));
    const spinner = (0, ora_1.default)('Executing...').start();
    try {
        const { exec } = await import('child_process');
        const { promisify } = await import('util');
        const execAsync = promisify(exec);
        const systemPath = path_1.default.join(process.cwd(), 'multi-agent-systems', systemName);
        const { stdout } = await execAsync(`npx tsx index.ts "${task}"`, { cwd: systemPath });
        spinner.succeed('Complete!');
        console.log(chalk_1.default.white('\nResult:\n'));
        console.log(stdout);
    }
    catch (error) {
        spinner.fail('Execution failed');
        console.error(chalk_1.default.red('Error:'), error.message);
    }
}
async function showDiagram(systemName) {
    if (!systemName) {
        const { name } = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'System name:'
            }
        ]);
        systemName = name;
    }
    const configPath = path_1.default.join(process.cwd(), 'multi-agent-systems', systemName, 'config.json');
    if (!await fs_extra_1.default.pathExists(configPath)) {
        console.log(chalk_1.default.red('\nSystem not found.\n'));
        return;
    }
    const config = await fs_extra_1.default.readJSON(configPath);
    console.log(chalk_1.default.cyan(`\n📊 ${config.name} System Diagram\n`));
    console.log(drawDiagram(config));
}
function drawDiagram(system) {
    let diagram = '';
    if (system.workflow === 'sequential') {
        diagram = `
    ┌─────────────────┐
    │  ${system.coordinator.name}  │
    └────────┬────────┘
             │
             ▼
${system.workers.map((w, i) => `    ┌─────────────────┐
    │     ${w.name}     │
    └────────${i < system.workers.length - 1 ? '┬' : '─'}────────┘${i < system.workers.length - 1 ? '\n             │\n             ▼' : ''}`).join('\n')}
`;
    }
    else if (system.workflow === 'parallel') {
        diagram = `
    ┌─────────────────┐
    │  ${system.coordinator.name}  │
    └────────┬────────┘
             │
     ┌───────┴───────┐
     │               │
     ▼               ▼
${system.workers.map(w => `┌───────────┐`).join('   ')}
${system.workers.map(w => `│  ${w.name}  │`).join('   ')}
${system.workers.map(w => `└───────────┘`).join('   ')}
`;
    }
    else {
        diagram = `
    ┌─────────────────┐
    │  ${system.coordinator.name}  │
    └─────────────────┘
             │
     ┌───────┼───────┐
     │       │       │
${system.workers.map(w => `     ▼\n  [${w.name}]`).join('   ')}
`;
    }
    return diagram;
}
//# sourceMappingURL=multi-agent.js.map