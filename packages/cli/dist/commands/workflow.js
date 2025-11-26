"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowCommand = workflowCommand;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const ora_1 = __importDefault(require("ora"));
async function workflowCommand(action, name) {
    if (!action) {
        // Interactive mode
        const { selectedAction } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'selectedAction',
                message: 'What would you like to do with workflows?',
                choices: [
                    { name: 'Create new workflow pipeline', value: 'create' },
                    { name: 'List existing workflows', value: 'list' },
                    { name: 'Run a workflow', value: 'run' },
                    { name: 'Delete a workflow', value: 'delete' }
                ]
            }
        ]);
        action = selectedAction;
    }
    switch (action) {
        case 'create':
            await createWorkflow(name);
            break;
        case 'list':
            await listWorkflows();
            break;
        case 'run':
            await runWorkflow(name);
            break;
        case 'delete':
            await deleteWorkflow(name);
            break;
        default:
            console.log(chalk_1.default.red(`Unknown action: ${action}`));
            console.log(chalk_1.default.cyan('Available actions: create, list, run, delete'));
    }
}
async function createWorkflow(name) {
    console.log(chalk_1.default.cyan('\n⚙️  Workflow Pipeline Builder\n'));
    if (!name) {
        const response = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'workflowName',
                message: 'Workflow name:',
                validate: (input) => input.trim().length > 0 || 'Name is required'
            }
        ]);
        name = response.workflowName;
    }
    const { description, steps } = await inquirer_1.default.prompt([
        {
            type: 'input',
            name: 'description',
            message: 'Workflow description:',
            default: `${name} workflow pipeline`
        },
        {
            type: 'input',
            name: 'steps',
            message: 'Number of steps in workflow:',
            default: '3',
            validate: (input) => {
                const num = parseInt(input);
                return (!isNaN(num) && num > 0) || 'Must be a positive number';
            }
        }
    ]);
    const numSteps = parseInt(steps);
    const workflowSteps = [];
    console.log(chalk_1.default.cyan('\n📝 Define each step:\n'));
    for (let i = 0; i < numSteps; i++) {
        const stepInfo = await inquirer_1.default.prompt([
            {
                type: 'input',
                name: 'name',
                message: `Step ${i + 1} name:`,
                default: `step-${i + 1}`
            },
            {
                type: 'list',
                name: 'type',
                message: `Step ${i + 1} type:`,
                choices: [
                    { name: 'Agent Task', value: 'agent' },
                    { name: 'API Call', value: 'api' },
                    { name: 'Data Transform', value: 'transform' },
                    { name: 'Condition', value: 'condition' },
                    { name: 'Custom Script', value: 'script' }
                ]
            },
            {
                type: 'input',
                name: 'config',
                message: `Step ${i + 1} configuration (JSON):`,
                default: '{}',
                validate: (input) => {
                    try {
                        JSON.parse(input);
                        return true;
                    }
                    catch {
                        return 'Must be valid JSON';
                    }
                }
            }
        ]);
        workflowSteps.push({
            ...stepInfo,
            config: JSON.parse(stepInfo.config)
        });
    }
    // Create workflow directory
    const workflowDir = path_1.default.join(process.cwd(), 'workflows', name);
    const spinner = (0, ora_1.default)('Creating workflow...').start();
    try {
        await fs_extra_1.default.ensureDir(workflowDir);
        const workflowConfig = {
            name,
            description,
            version: '1.0.0',
            steps: workflowSteps,
            created: new Date().toISOString()
        };
        await fs_extra_1.default.writeJSON(path_1.default.join(workflowDir, 'workflow.json'), workflowConfig, { spaces: 2 });
        // Create execution script
        const executionScript = `#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function runWorkflow() {
  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'workflow.json'), 'utf8')
  );

  console.log(\`Running workflow: \${config.name}\`);
  console.log(\`Description: \${config.description}\\n\`);

  for (const [index, step] of config.steps.entries()) {
    console.log(\`\\nExecuting Step \${index + 1}: \${step.name}\`);
    console.log(\`Type: \${step.type}\`);
    
    // Add your step execution logic here
    switch (step.type) {
      case 'agent':
        console.log('Running agent task...');
        // Execute agent
        break;
      case 'api':
        console.log('Making API call...');
        // Make API call
        break;
      case 'transform':
        console.log('Transforming data...');
        // Transform data
        break;
      case 'condition':
        console.log('Evaluating condition...');
        // Check condition
        break;
      case 'script':
        console.log('Running custom script...');
        // Run script
        break;
    }
  }

  console.log('\\n✅ Workflow completed!');
}

runWorkflow().catch(console.error);
`;
        await fs_extra_1.default.writeFile(path_1.default.join(workflowDir, 'run.js'), executionScript);
        await fs_extra_1.default.chmod(path_1.default.join(workflowDir, 'run.js'), '755');
        // Create README
        const readme = `# ${name} Workflow

${description}

## Steps

${workflowSteps.map((s, i) => `${i + 1}. **${s.name}** (${s.type})`).join('\n')}

## Usage

\`\`\`bash
stick workflow run ${name}
# or
node run.js
\`\`\`

## Configuration

Edit \`workflow.json\` to modify the workflow configuration.
`;
        await fs_extra_1.default.writeFile(path_1.default.join(workflowDir, 'README.md'), readme);
        spinner.succeed('Workflow created successfully!');
        console.log(chalk_1.default.green('\n✅ Workflow pipeline created!\n'));
        console.log(chalk_1.default.cyan(`Location: ${workflowDir}`));
        console.log(chalk_1.default.cyan(`\nRun with: stick workflow run ${name}`));
    }
    catch (error) {
        spinner.fail('Failed to create workflow');
        console.error(chalk_1.default.red('Error:'), error.message);
        throw error;
    }
}
async function listWorkflows() {
    const workflowsDir = path_1.default.join(process.cwd(), 'workflows');
    try {
        if (!await fs_extra_1.default.pathExists(workflowsDir)) {
            console.log(chalk_1.default.yellow('\n📋 No workflows found. Create one with: stick workflow create\n'));
            return;
        }
        const workflows = await fs_extra_1.default.readdir(workflowsDir);
        if (workflows.length === 0) {
            console.log(chalk_1.default.yellow('\n📋 No workflows found. Create one with: stick workflow create\n'));
            return;
        }
        console.log(chalk_1.default.cyan('\n📋 Available Workflows:\n'));
        for (const workflow of workflows) {
            const configPath = path_1.default.join(workflowsDir, workflow, 'workflow.json');
            if (await fs_extra_1.default.pathExists(configPath)) {
                const config = await fs_extra_1.default.readJSON(configPath);
                console.log(chalk_1.default.white(`  • ${chalk_1.default.bold(config.name)}`));
                console.log(chalk_1.default.gray(`    ${config.description}`));
                console.log(chalk_1.default.gray(`    Steps: ${config.steps.length}`));
                console.log();
            }
        }
    }
    catch (error) {
        console.error(chalk_1.default.red('Error listing workflows:'), error.message);
    }
}
async function runWorkflow(name) {
    const workflowsDir = path_1.default.join(process.cwd(), 'workflows');
    if (!name) {
        // List and select
        const workflows = await fs_extra_1.default.readdir(workflowsDir);
        const { selected } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'selected',
                message: 'Select workflow to run:',
                choices: workflows
            }
        ]);
        name = selected;
    }
    const workflowPath = path_1.default.join(workflowsDir, name);
    const runScript = path_1.default.join(workflowPath, 'run.js');
    if (!await fs_extra_1.default.pathExists(runScript)) {
        console.log(chalk_1.default.red(`\n❌ Workflow "${name}" not found\n`));
        return;
    }
    console.log(chalk_1.default.cyan(`\n⚙️  Running workflow: ${name}\n`));
    const { spawn } = await import('child_process');
    const child = spawn('node', [runScript], {
        stdio: 'inherit',
        cwd: workflowPath
    });
    child.on('close', (code) => {
        if (code === 0) {
            console.log(chalk_1.default.green('\n✅ Workflow completed successfully\n'));
        }
        else {
            console.log(chalk_1.default.red(`\n❌ Workflow failed with code ${code}\n`));
        }
    });
}
async function deleteWorkflow(name) {
    const workflowsDir = path_1.default.join(process.cwd(), 'workflows');
    if (!name) {
        const workflows = await fs_extra_1.default.readdir(workflowsDir);
        const { selected } = await inquirer_1.default.prompt([
            {
                type: 'list',
                name: 'selected',
                message: 'Select workflow to delete:',
                choices: workflows
            }
        ]);
        name = selected;
    }
    const { confirm } = await inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: chalk_1.default.yellow(`Are you sure you want to delete workflow "${name}"?`),
            default: false
        }
    ]);
    if (!confirm) {
        console.log(chalk_1.default.gray('\nCancelled\n'));
        return;
    }
    const workflowPath = path_1.default.join(workflowsDir, name);
    try {
        await fs_extra_1.default.remove(workflowPath);
        console.log(chalk_1.default.green(`\n✅ Workflow "${name}" deleted\n`));
    }
    catch (error) {
        console.error(chalk_1.default.red('Error:'), error.message);
    }
}
//# sourceMappingURL=workflow.js.map