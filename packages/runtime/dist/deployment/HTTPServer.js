"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const IntelligentAgent_1 = require("../agent/IntelligentAgent");
/**
 * HTTPServer - Deploy agents as REST API
 */
class HTTPServer {
    app;
    config;
    agents = new Map();
    requestCounts = new Map();
    constructor(config) {
        this.config = {
            host: '0.0.0.0',
            cors: true,
            ...config
        };
        this.app = (0, express_1.default)();
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        // Security
        this.app.use((0, helmet_1.default)());
        // CORS
        if (this.config.cors) {
            this.app.use((0, cors_1.default)());
        }
        // Body parser
        this.app.use(express_1.default.json());
        // API key auth (if configured)
        if (this.config.apiKey) {
            this.app.use((req, res, next) => {
                const apiKey = req.headers['x-api-key'] || req.query.apiKey;
                if (apiKey !== this.config.apiKey) {
                    return res.status(401).json({ error: 'Invalid API key' });
                }
                next();
            });
        }
        // Rate limiting
        if (this.config.rateLimit) {
            this.app.use((req, res, next) => {
                const ip = req.ip || 'unknown';
                const now = Date.now();
                const data = this.requestCounts.get(ip);
                if (!data || now > data.resetTime) {
                    this.requestCounts.set(ip, {
                        count: 1,
                        resetTime: now + this.config.rateLimit.windowMs
                    });
                    return next();
                }
                if (data.count >= this.config.rateLimit.maxRequests) {
                    return res.status(429).json({ error: 'Too many requests' });
                }
                data.count++;
                next();
            });
        }
    }
    setupRoutes() {
        // Health check
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                timestamp: Date.now(),
                agents: Array.from(this.agents.keys())
            });
        });
        // List agents
        this.app.get('/agents', (req, res) => {
            const agentList = Array.from(this.agents.entries()).map(([name, agent]) => ({
                name,
                type: agent instanceof IntelligentAgent_1.IntelligentAgent ? 'intelligent' : 'basic'
            }));
            res.json({ agents: agentList });
        });
        // Run agent
        this.app.post('/agents/:name/run', async (req, res) => {
            const { name } = req.params;
            const { input, stream } = req.body;
            if (!input) {
                return res.status(400).json({ error: 'Input required' });
            }
            const agent = this.agents.get(name);
            if (!agent) {
                return res.status(404).json({ error: `Agent not found: ${name}` });
            }
            const startTime = Date.now();
            try {
                const result = await agent.run(input);
                const duration = Date.now() - startTime;
                const response = {
                    success: true,
                    result,
                    duration
                };
                res.json(response);
            }
            catch (error) {
                const response = {
                    success: false,
                    error: error.message,
                    duration: Date.now() - startTime
                };
                res.status(500).json(response);
            }
        });
        // Get agent info
        this.app.get('/agents/:name', (req, res) => {
            const { name } = req.params;
            const agent = this.agents.get(name);
            if (!agent) {
                return res.status(404).json({ error: `Agent not found: ${name}` });
            }
            res.json({
                name: agent.getName(),
                type: agent instanceof IntelligentAgent_1.IntelligentAgent ? 'intelligent' : 'basic',
                tools: agent['config']?.tools || [],
                capabilities: agent['config']?.capabilities || []
            });
        });
        // Server stats
        this.app.get('/stats', (req, res) => {
            res.json({
                agents: this.agents.size,
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                timestamp: Date.now()
            });
        });
    }
    /**
     * Register an agent
     */
    registerAgent(agent) {
        this.agents.set(agent.getName(), agent);
        console.log(`[Server] Registered agent: ${agent.getName()}`);
    }
    /**
     * Unregister an agent
     */
    unregisterAgent(name) {
        this.agents.delete(name);
        console.log(`[Server] Unregistered agent: ${name}`);
    }
    /**
     * Start the server
     */
    async start() {
        return new Promise((resolve) => {
            this.app.listen(this.config.port, this.config.host, () => {
                console.log(`[Server] 🚀 HTTP server running on http://${this.config.host}:${this.config.port}`);
                console.log(`[Server] Registered agents: ${Array.from(this.agents.keys()).join(', ')}`);
                resolve();
            });
        });
    }
    /**
     * Get Express app (for testing or custom routes)
     */
    getApp() {
        return this.app;
    }
}
exports.HTTPServer = HTTPServer;
//# sourceMappingURL=HTTPServer.js.map