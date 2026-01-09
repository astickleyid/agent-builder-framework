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
        // Check if agent has LLM capabilities (extended by IntelligentAgent)
        // This base implementation provides a helpful response for non-intelligent agents
        const toolsAvailable = this.config.tools.length > 0
            ? `\n\nAvailable tools: ${this.config.tools.join(', ')}`
            : '';
        const capabilities = this.config.capabilities.length > 0
            ? `\n\nCapabilities: ${this.config.capabilities.join(', ')}`
            : '';
        return `Agent "${this.config.name}" received your request: "${input}"${toolsAvailable}${capabilities}\n\nNote: This is a base agent. For AI-powered responses, use IntelligentAgent with LLM configuration (OpenAI, Anthropic, or Ollama).`;
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