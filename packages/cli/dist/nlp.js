#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIntent = parseIntent;
exports.suggestCommand = suggestCommand;
exports.getHelpSuggestions = getHelpSuggestions;
exports.explainIntent = explainIntent;
exports.clarifyIntent = clarifyIntent;
exports.showExamples = showExamples;
const chalk_1 = __importDefault(require("chalk"));
const patterns = {
    assistant: [
        /assistant|ai|guide|help me|walk me through/i,
        /build|create|make/i
    ],
    create: [
        /create|make|new|init|initialize|start|build/i,
        /agent|bot|assistant/i
    ],
    mcp: [
        /mcp|server|tool|integration/i,
        /create|build|make|install/i
    ],
    'multi-agent': [
        /multi-agent|multi agent|multiple agents|agent system/i,
        /create|build|make/i
    ],
    workflow: [
        /workflow|pipeline|automation|process/i,
        /create|build|make/i
    ],
    list: [
        /list|show|display|view|get|see/i,
        /agents|bots|assistants|all|systems/i
    ],
    run: [
        /run|execute|start|launch|use/i,
        /agent|bot|assistant|system/i
    ],
    deploy: [
        /deploy|publish|release|ship/i,
        /agent|bot|server|api/i
    ],
    stop: [
        /stop|halt|kill|terminate|end/i,
        /agent|bot|server/i
    ],
    metrics: [
        /metrics|stats|statistics|performance|analytics|monitor/i
    ],
    logs: [
        /logs|log|history|events|output/i
    ],
    help: [
        /help|guide|tutorial|how|what|explain/i
    ],
    configure: [
        /configure|config|setup|settings|options/i,
        /tools|mcp|provider|model/i
    ],
    interactive: [
        /interactive|chat|talk|conversation/i,
        /mode|session/i
    ]
};
const examples = {
    assistant: [
        'help me build an agent',
        'guide me through creating a chatbot',
        'I want to make something',
        'walk me through building an AI system',
        'show me how to create agents',
        'I need help getting started'
    ],
    create: [
        'create a new agent',
        'make a chatbot',
        'initialize an assistant called mybot',
        'build a new bot',
        'new agent for customer support',
        'create agent with web search'
    ],
    mcp: [
        'create an MCP server',
        'build a custom tool',
        'make an integration',
        'install MCP server',
        'create GitHub integration tool',
        'build a database connector',
        'make a custom API tool'
    ],
    'multi-agent': [
        'create multi-agent system',
        'build multiple agents that work together',
        'make an agent team',
        'coordinate agents',
        'create agents that collaborate',
        'build a swarm of agents'
    ],
    workflow: [
        'create a workflow',
        'build automation pipeline',
        'make a process',
        'automate tasks',
        'create automated workflow',
        'build data processing pipeline'
    ],
    list: [
        'list all agents',
        'show my bots',
        'what agents do I have',
        'see all assistants',
        'show configured agents',
        'display my projects'
    ],
    run: [
        'run my agent',
        'execute the chatbot',
        'start the assistant',
        'use my-agent',
        'run mybot with ollama',
        'start agent in interactive mode',
        'execute my-assistant'
    ],
    deploy: [
        'deploy my agent',
        'publish the bot',
        'ship to production',
        'deploy as API',
        'start agent as server',
        'deploy to cloud',
        'make my agent available as API'
    ],
    metrics: [
        'show metrics',
        'view performance',
        'get statistics',
        'monitor agents',
        'show agent stats',
        'performance dashboard'
    ],
    logs: [
        'show logs',
        'view output',
        'see agent history',
        'tail logs',
        'show recent activity',
        'what did my agent do'
    ]
};
/**
 * Parse natural language input and extract intent
 */
function parseIntent(input) {
    const lower = input.toLowerCase().trim();
    // Check each action pattern
    for (const [action, [actionPattern, entityPattern]] of Object.entries(patterns)) {
        const actionMatch = actionPattern.test(lower);
        const entityMatch = entityPattern ? entityPattern.test(lower) : true;
        if (actionMatch && entityMatch) {
            const entity = extractEntity(input, action);
            const params = extractParams(input, action);
            return {
                action,
                entity,
                params,
                confidence: calculateConfidence(input, action)
            };
        }
    }
    // Check for direct commands
    if (/^(create|list|run|deploy|stop|metrics|logs|help)$/i.test(lower)) {
        return {
            action: lower,
            confidence: 1.0
        };
    }
    // Default to help if unclear
    return {
        action: 'help',
        confidence: 0.5
    };
}
/**
 * Extract entity name from input (agent name, tool name, etc.)
 */
function extractEntity(input, action) {
    // Remove common words
    const cleaned = input
        .toLowerCase()
        .replace(/^(create|make|new|run|execute|deploy|list|show|view|get|see|stop|kill|start|launch|use|the|a|an|my)\s+/gi, '')
        .replace(/\s+(agent|bot|assistant|server|api)s?$/gi, '')
        .trim();
    // Extract quoted strings
    const quoted = input.match(/["']([^"']+)["']/);
    if (quoted)
        return quoted[1];
    // Extract name-like patterns
    const nameMatch = cleaned.match(/\b([a-z0-9-_]+)\b/i);
    if (nameMatch && nameMatch[1].length > 2) {
        return nameMatch[1];
    }
    return undefined;
}
/**
 * Extract parameters from input
 */
function extractParams(input, action) {
    const params = {};
    // Extract flags and options
    const flagPatterns = {
        interactive: /\b(interactive|chat|conversation)\b/i,
        verbose: /\b(verbose|detailed|debug)\b/i,
        port: /\bport\s+(\d+)\b/i,
        provider: /\bprovider[:\s]+(\w+)\b/i,
        model: /\bmodel[:\s]+([a-z0-9-:\.]+)\b/i,
        temperature: /\btemperature[:\s]+([\d\.]+)\b/i,
        template: /\btemplate[:\s]+(\w+)\b/i
    };
    for (const [key, pattern] of Object.entries(flagPatterns)) {
        const match = input.match(pattern);
        if (match) {
            params[key] = match[1] || true;
        }
    }
    return params;
}
/**
 * Calculate confidence score for intent matching
 */
function calculateConfidence(input, action) {
    let score = 0.5;
    const lower = input.toLowerCase();
    const [actionPattern, entityPattern] = patterns[action] || [];
    // Strong action match
    if (actionPattern && actionPattern.test(lower)) {
        score += 0.3;
    }
    // Entity match
    if (entityPattern && entityPattern.test(lower)) {
        score += 0.2;
    }
    // Specific entity name
    if (extractEntity(input, action)) {
        score += 0.2;
    }
    return Math.min(score, 1.0);
}
/**
 * Suggest command based on natural language input
 */
function suggestCommand(intent) {
    const { action, entity, params } = intent;
    let cmd = `stick ${action}`;
    if (entity) {
        cmd += ` ${entity}`;
    }
    // Add common flags
    if (params?.interactive)
        cmd += ' --interactive';
    if (params?.verbose)
        cmd += ' --verbose';
    if (params?.port)
        cmd += ` --port ${params.port}`;
    if (params?.provider)
        cmd += ` --provider ${params.provider}`;
    if (params?.model)
        cmd += ` --model ${params.model}`;
    if (params?.template)
        cmd += ` --template ${params.template}`;
    return cmd;
}
/**
 * Get help text for unclear intents
 */
function getHelpSuggestions(input) {
    const suggestions = [];
    const lower = input.toLowerCase();
    // Find closest matching actions
    for (const [action, exampleList] of Object.entries(examples)) {
        const [pattern] = patterns[action] || [];
        if (pattern && pattern.test(lower)) {
            suggestions.push(...exampleList);
        }
    }
    return suggestions.slice(0, 3);
}
/**
 * Format intent explanation for user
 */
function explainIntent(intent) {
    const { action, entity, params, confidence } = intent;
    let explanation = chalk_1.default.cyan('I understood: ');
    if (confidence < 0.6) {
        explanation += chalk_1.default.yellow('(low confidence) ');
    }
    explanation += chalk_1.default.white(`${action}`);
    if (entity) {
        explanation += chalk_1.default.gray(' → ') + chalk_1.default.green(entity);
    }
    if (Object.keys(params || {}).length > 0) {
        explanation += chalk_1.default.gray(' with: ') + chalk_1.default.yellow(JSON.stringify(params));
    }
    return explanation;
}
/**
 * Interactive NLP mode - ask for clarification
 */
async function clarifyIntent(input, intent) {
    const inquirer = (await import('inquirer')).default;
    if (intent.confidence < 0.7 && intent.action !== 'help') {
        console.log(chalk_1.default.yellow('\n🤔 I\'m not quite sure what you want to do.\n'));
        const suggestions = getHelpSuggestions(input);
        const choices = [
            ...suggestions.map((s, i) => ({ name: s, value: `suggest-${i}` })),
            new inquirer.Separator(),
            { name: chalk_1.default.gray('Show all commands'), value: 'help' },
            { name: chalk_1.default.gray('Try again'), value: 'retry' }
        ];
        const { choice } = await inquirer.prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'Did you mean:',
                choices
            }
        ]);
        if (choice === 'help') {
            return { action: 'help', confidence: 1.0 };
        }
        else if (choice === 'retry') {
            const { newInput } = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'newInput',
                    message: 'What would you like to do?'
                }
            ]);
            return parseIntent(newInput);
        }
        else if (choice.startsWith('suggest-')) {
            const idx = parseInt(choice.split('-')[1]);
            return parseIntent(suggestions[idx]);
        }
    }
    return intent;
}
/**
 * Show example commands
 */
function showExamples() {
    console.log(chalk_1.default.cyan.bold('\n╔═══════════════════════════════════════════════════════════════════╗'));
    console.log(chalk_1.default.cyan.bold('║                                                                   ║'));
    console.log(chalk_1.default.cyan.bold('║           💡 Stick CLI - Natural Language Examples 💡            ║'));
    console.log(chalk_1.default.cyan.bold('║                                                                   ║'));
    console.log(chalk_1.default.cyan.bold('╚═══════════════════════════════════════════════════════════════════╝\n'));
    console.log(chalk_1.default.white('The Stick CLI understands natural language! Just type what you want to do.\n'));
    for (const [action, exampleList] of Object.entries(examples)) {
        console.log(chalk_1.default.yellow.bold(`\n${action.toUpperCase().replace('-', ' ')}:`));
        exampleList.slice(0, 3).forEach(ex => {
            const intent = parseIntent(ex);
            const cmd = suggestCommand(intent);
            console.log(chalk_1.default.gray(`  💬 "${ex}"`));
            console.log(chalk_1.default.green(`     → ${cmd}`));
        });
    }
    console.log(chalk_1.default.cyan.bold('\n✨ Tips:\n'));
    console.log(chalk_1.default.white('  • Just type what you want: ') + chalk_1.default.gray('stick create a chatbot'));
    console.log(chalk_1.default.white('  • Use the guided assistant: ') + chalk_1.default.gray('stick assistant'));
    console.log(chalk_1.default.white('  • Get help anytime: ') + chalk_1.default.gray('stick help'));
    console.log(chalk_1.default.white('  • Traditional commands work too: ') + chalk_1.default.gray('stick init my-agent'));
    console.log(chalk_1.default.cyan('\n✨ The CLI learns from your patterns and gets smarter over time!\n'));
}
//# sourceMappingURL=nlp.js.map