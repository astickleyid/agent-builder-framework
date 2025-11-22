"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
class Agent {
    config;
    conversationHistory = [];
    toolRegistry = new Map();
    constructor(config) {
        this.config = config;
        this.initialize();
    }
    initialize() {
        console.log(`[Agent] Initializing ${this.config.name}...`);
        console.log(`[Agent] Tools: ${this.config.tools.join(', ')}`);
        console.log(`[Agent] Capabilities: ${this.config.capabilities.join(', ')}`);
    }
    async run(input) {
        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date()
        };
        this.conversationHistory.push(userMessage);
        // Simulate processing
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = await this.processInput(input);
        const assistantMessage = {
            role: 'assistant',
            content: response,
            timestamp: new Date()
        };
        this.conversationHistory.push(assistantMessage);
        return response;
    }
    async processInput(input) {
        // Basic response generation
        return `[${this.config.name}] Processing: ${input}`;
    }
    registerTool(name, tool) {
        this.toolRegistry.set(name, tool);
        console.log(`[Agent] Registered tool: ${name}`);
    }
    getHistory() {
        return this.conversationHistory;
    }
    getName() {
        return this.config.name;
    }
    getConfig() {
        return this.config;
    }
}
exports.Agent = Agent;
//# sourceMappingURL=Agent.js.map