#!/usr/bin/env node
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
/**
 * Parse natural language input and extract intent
 */
export declare function parseIntent(input: string): Intent;
/**
 * Suggest command based on natural language input
 */
export declare function suggestCommand(intent: Intent): string;
/**
 * Get help text for unclear intents
 */
export declare function getHelpSuggestions(input: string): string[];
/**
 * Format intent explanation for user
 */
export declare function explainIntent(intent: Intent): string;
/**
 * Interactive NLP mode - ask for clarification
 */
export declare function clarifyIntent(input: string, intent: Intent): Promise<Intent>;
/**
 * Show example commands
 */
export declare function showExamples(): void;
export {};
//# sourceMappingURL=nlp.d.ts.map