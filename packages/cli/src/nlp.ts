#!/usr/bin/env node

import chalk from 'chalk';

/**
 * Natural Language Processing for CLI
 * Interprets user intent from natural language input
 */

interface Intent {
  action: string;
  entity?: string;
  params?: Record<string, any>;
  confidence: number;
}

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

const examples: Record<string, string[]> = {
  assistant: [
    'help me build an agent',
    'guide me through creating a chatbot',
    'I want to make something',
    'walk me through this'
  ],
  create: [
    'create a new agent',
    'make a chatbot',
    'initialize an assistant',
    'build a new bot'
  ],
  mcp: [
    'create an MCP server',
    'build a custom tool',
    'make an integration',
    'install MCP server'
  ],
  'multi-agent': [
    'create multi-agent system',
    'build multiple agents',
    'make an agent team',
    'coordinate agents'
  ],
  workflow: [
    'create a workflow',
    'build automation pipeline',
    'make a process',
    'automate tasks'
  ],
  list: [
    'list all agents',
    'show my bots',
    'what agents do I have',
    'see all assistants'
  ],
  run: [
    'run my agent',
    'execute the chatbot',
    'start the assistant',
    'use my-agent'
  ],
  deploy: [
    'deploy my agent',
    'publish the bot',
    'ship to production',
    'deploy as API'
  ],
  metrics: [
    'show metrics',
    'view performance',
    'get statistics',
    'monitor agents'
  ],
  logs: [
    'show logs',
    'view output',
    'see agent history',
    'tail logs'
  ]
};

/**
 * Parse natural language input and extract intent
 */
export function parseIntent(input: string): Intent {
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
function extractEntity(input: string, action: string): string | undefined {
  // Remove common words
  const cleaned = input
    .toLowerCase()
    .replace(/^(create|make|new|run|execute|deploy|list|show|view|get|see|stop|kill|start|launch|use|the|a|an|my)\s+/gi, '')
    .replace(/\s+(agent|bot|assistant|server|api)s?$/gi, '')
    .trim();
  
  // Extract quoted strings
  const quoted = input.match(/["']([^"']+)["']/);
  if (quoted) return quoted[1];
  
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
function extractParams(input: string, action: string): Record<string, any> {
  const params: Record<string, any> = {};
  
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
function calculateConfidence(input: string, action: string): number {
  let score = 0.5;
  
  const lower = input.toLowerCase();
  const [actionPattern, entityPattern] = patterns[action as keyof typeof patterns] || [];
  
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
export function suggestCommand(intent: Intent): string {
  const { action, entity, params } = intent;
  
  let cmd = `stick ${action}`;
  
  if (entity) {
    cmd += ` ${entity}`;
  }
  
  // Add common flags
  if (params?.interactive) cmd += ' --interactive';
  if (params?.verbose) cmd += ' --verbose';
  if (params?.port) cmd += ` --port ${params.port}`;
  if (params?.provider) cmd += ` --provider ${params.provider}`;
  if (params?.model) cmd += ` --model ${params.model}`;
  if (params?.template) cmd += ` --template ${params.template}`;
  
  return cmd;
}

/**
 * Get help text for unclear intents
 */
export function getHelpSuggestions(input: string): string[] {
  const suggestions: string[] = [];
  const lower = input.toLowerCase();
  
  // Find closest matching actions
  for (const [action, exampleList] of Object.entries(examples)) {
    const [pattern] = patterns[action as keyof typeof patterns] || [];
    if (pattern && pattern.test(lower)) {
      suggestions.push(...exampleList);
    }
  }
  
  return suggestions.slice(0, 3);
}

/**
 * Format intent explanation for user
 */
export function explainIntent(intent: Intent): string {
  const { action, entity, params, confidence } = intent;
  
  let explanation = chalk.cyan('I understood: ');
  
  if (confidence < 0.6) {
    explanation += chalk.yellow('(low confidence) ');
  }
  
  explanation += chalk.white(`${action}`);
  
  if (entity) {
    explanation += chalk.gray(' → ') + chalk.green(entity);
  }
  
  if (Object.keys(params || {}).length > 0) {
    explanation += chalk.gray(' with: ') + chalk.yellow(JSON.stringify(params));
  }
  
  return explanation;
}

/**
 * Interactive NLP mode - ask for clarification
 */
export async function clarifyIntent(input: string, intent: Intent): Promise<Intent> {
  const inquirer = (await import('inquirer')).default;
  
  if (intent.confidence < 0.7 && intent.action !== 'help') {
    console.log(chalk.yellow('\n🤔 I\'m not quite sure what you want to do.\n'));
    
    const suggestions = getHelpSuggestions(input);
    const choices = [
      ...suggestions.map((s, i) => ({ name: s, value: `suggest-${i}` })),
      new inquirer.Separator(),
      { name: chalk.gray('Show all commands'), value: 'help' },
      { name: chalk.gray('Try again'), value: 'retry' }
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
    } else if (choice === 'retry') {
      const { newInput } = await inquirer.prompt([
        {
          type: 'input',
          name: 'newInput',
          message: 'What would you like to do?'
        }
      ]);
      return parseIntent(newInput);
    } else if (choice.startsWith('suggest-')) {
      const idx = parseInt(choice.split('-')[1]);
      return parseIntent(suggestions[idx]);
    }
  }
  
  return intent;
}

/**
 * Show example commands
 */
export function showExamples() {
  console.log(chalk.cyan.bold('\n💡 Natural Language Examples:\n'));
  
  for (const [action, exampleList] of Object.entries(examples)) {
    console.log(chalk.yellow(`\n${action.toUpperCase()}:`));
    exampleList.forEach(ex => {
      const intent = parseIntent(ex);
      const cmd = suggestCommand(intent);
      console.log(chalk.gray(`  "${ex}"`));
      console.log(chalk.green(`  → ${cmd}`));
    });
  }
  
  console.log(chalk.cyan('\n✨ Just type naturally and I\'ll understand!\n'));
}
