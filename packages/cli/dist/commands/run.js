"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCommand = runCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
const readline = __importStar(require("readline"));
async function runCommand(agentName, options) {
    const spinner = (0, ora_1.default)();
    try {
        // Look for agent config
        const configPaths = [
            path.join(process.cwd(), `${agentName}.json`), // direct file match
            path.join(process.cwd(), agentName, 'agent.json'),
            path.join(process.cwd(), 'agent.json'),
            path.join(process.cwd(), agentName, 'config.json'),
            path.join(process.cwd(), 'config.json')
        ];
        let configPath = null;
        let config = null;
        for (const p of configPaths) {
            if (await fs.pathExists(p)) {
                configPath = p;
                config = await fs.readJson(p);
                break;
            }
        }
        if (!config) {
            spinner.fail(chalk_1.default.red(`✗ Could not find agent config for "${agentName}"`));
            console.log(chalk_1.default.gray('\nSearched locations:'));
            configPaths.forEach(p => console.log(chalk_1.default.gray(`  - ${p}`)));
            console.log(chalk_1.default.yellow('\nTip: Run "stick init" to create an agent'));
            process.exit(1);
        }
        spinner.start(`Loading agent: ${config.name}...`);
        // Check if @stick-ai/runtime is available
        let runtime;
        try {
            runtime = require('@stick-ai/runtime');
        }
        catch (e) {
            // Try local version
            const localRuntimePath = path.join(__dirname, '../../../runtime/dist/index.js');
            if (await fs.pathExists(localRuntimePath)) {
                runtime = require(localRuntimePath);
            }
            else {
                spinner.fail(chalk_1.default.red('✗ @stick-ai/runtime not found'));
                console.log(chalk_1.default.yellow('\nInstall it with: npm install @stick-ai/runtime'));
                process.exit(1);
            }
        }
        // Determine AI provider from config
        const llmConfig = extractLLMConfig(config, options);
        if (!llmConfig) {
            spinner.warn(chalk_1.default.yellow('⚠ No AI provider configured, using basic agent mode'));
        }
        // Create agent instance
        let agent;
        if (llmConfig && runtime.IntelligentAgent) {
            agent = new runtime.IntelligentAgent(config, llmConfig);
            spinner.succeed(chalk_1.default.green(`✓ Intelligent agent "${config.name}" loaded`));
        }
        else {
            agent = new runtime.Agent(config);
            spinner.succeed(chalk_1.default.green(`✓ Agent "${config.name}" loaded (basic mode)`));
        }
        // Load and register tools
        if (config.tools && config.tools.length > 0) {
            console.log(chalk_1.default.cyan(`\n📦 Loading ${config.tools.length} tools...`));
            for (const toolName of config.tools) {
                try {
                    const tool = runtime.createTool(toolName);
                    agent.registerTool(toolName, tool);
                    console.log(chalk_1.default.gray(`  ✓ ${toolName}`));
                }
                catch (e) {
                    console.log(chalk_1.default.yellow(`  ⚠ ${toolName} - ${e.message}`));
                }
            }
        }
        console.log();
        if (options.interactive) {
            await runInteractiveMode(agent, config);
        }
        else if (options.input) {
            await runSingleInput(agent, options.input);
        }
        else {
            console.log(chalk_1.default.dim('Agent loaded and ready'));
            console.log(chalk_1.default.dim('Use --interactive flag for chat mode'));
            console.log(chalk_1.default.dim('Use --input "your message" for single execution'));
        }
    }
    catch (error) {
        spinner.fail(chalk_1.default.red(`✗ Failed to run agent "${agentName}"`));
        console.error(chalk_1.default.red(error.message));
        if (options.verbose) {
            console.error(error);
        }
        process.exit(1);
    }
}
function extractLLMConfig(config, options) {
    // Check for provider in options or config
    const provider = options.provider || config.aiProvider || config.llm?.provider;
    if (!provider || provider === 'none') {
        return null;
    }
    // Get API key from environment or config
    const apiKey = process.env.OPENAI_API_KEY ||
        process.env.ANTHROPIC_API_KEY ||
        config.llm?.apiKey;
    const llmConfig = {
        provider: provider,
        model: options.model || config.llm?.model,
        temperature: options.temperature || config.environment?.temperature || 0.7,
        maxTokens: options.maxTokens || config.environment?.maxTokens || 1000
    };
    if (provider === 'openai' || provider === 'anthropic') {
        if (!apiKey) {
            console.log(chalk_1.default.yellow(`\n⚠ Warning: No API key found for ${provider}`));
            console.log(chalk_1.default.gray(`Set ${provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'} environment variable\n`));
            return null;
        }
        llmConfig.apiKey = apiKey;
    }
    else if (provider === 'ollama') {
        llmConfig.host = options.ollamaHost || config.llm?.host || 'http://localhost:11434';
    }
    return llmConfig;
}
async function runInteractiveMode(agent, config) {
    console.log(chalk_1.default.cyan.bold('🤖 Interactive Mode\n'));
    console.log(chalk_1.default.gray('Agent: ') + chalk_1.default.white(config.name));
    console.log(chalk_1.default.gray('Description: ') + chalk_1.default.white(config.description));
    console.log(chalk_1.default.gray('\nType your message and press Enter. Type "exit" or "quit" to stop.\n'));
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: chalk_1.default.cyan('You> ')
    });
    rl.prompt();
    rl.on('line', async (input) => {
        const trimmed = input.trim();
        if (!trimmed) {
            rl.prompt();
            return;
        }
        if (trimmed.toLowerCase() === 'exit' || trimmed.toLowerCase() === 'quit') {
            console.log(chalk_1.default.gray('\n👋 Goodbye!\n'));
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
            console.log(chalk_1.default.cyan('\n📜 Conversation History:\n'));
            history.forEach((msg) => {
                const role = msg.role === 'user' ? chalk_1.default.cyan('You') : chalk_1.default.green('Agent');
                console.log(`${role}: ${msg.content}\n`);
            });
            rl.prompt();
            return;
        }
        try {
            rl.pause();
            console.log();
            const spinner = (0, ora_1.default)(chalk_1.default.gray('Agent thinking...')).start();
            const response = await agent.run(trimmed);
            spinner.stop();
            console.log(chalk_1.default.green('Agent> ') + chalk_1.default.white(response));
            console.log();
        }
        catch (error) {
            console.log(chalk_1.default.red('\n✗ Error: ') + chalk_1.default.white(error.message));
            console.log();
        }
        rl.resume();
        rl.prompt();
    });
    rl.on('close', () => {
        console.log(chalk_1.default.gray('\n👋 Session ended\n'));
        process.exit(0);
    });
}
async function runSingleInput(agent, input) {
    console.log(chalk_1.default.cyan('User> ') + chalk_1.default.white(input));
    console.log();
    const spinner = (0, ora_1.default)(chalk_1.default.gray('Agent processing...')).start();
    try {
        const response = await agent.run(input);
        spinner.stop();
        console.log(chalk_1.default.green('Agent> ') + chalk_1.default.white(response));
        console.log();
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('Error'));
        console.log(chalk_1.default.red(error.message));
        if (error.stack) {
            console.log(chalk_1.default.gray(error.stack));
        }
        process.exit(1);
    }
}
//# sourceMappingURL=run.js.map