#!/usr/bin/env node
export declare class CLIAssistant {
    private agent;
    private context;
    private spinner;
    constructor();
    /**
     * Initialize the AI assistant
     */
    initialize(): Promise<void>;
    /**
     * Check if Ollama is available
     */
    private checkOllama;
    /**
     * Get system prompt for the assistant
     */
    private getSystemPrompt;
    /**
     * Start the conversational assistant
     */
    start(): Promise<void>;
    /**
     * Main conversation loop
     */
    private conversationLoop;
    /**
     * Get AI response
     */
    private getAIResponse;
    /**
     * Parse AI response for commands and questions
     */
    private parseResponse;
    /**
     * Execute commands
     */
    private executeCommands;
    /**
     * Ask a question
     */
    private askQuestion;
    /**
     * Modify the plan
     */
    private modifyPlan;
}
/**
 * Start the AI assistant
 */
export declare function startAssistant(): Promise<void>;
//# sourceMappingURL=ai-assistant.d.ts.map