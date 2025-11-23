import { Express } from 'express';
import { Agent } from '../agent/Agent';
import { IntelligentAgent } from '../agent/IntelligentAgent';
export interface ServerConfig {
    port: number;
    host?: string;
    cors?: boolean;
    apiKey?: string;
    rateLimit?: {
        windowMs: number;
        maxRequests: number;
    };
}
export interface AgentRunRequest {
    input: string;
    stream?: boolean;
}
export interface AgentRunResponse {
    success: boolean;
    result?: string;
    error?: string;
    duration?: number;
}
/**
 * HTTPServer - Deploy agents as REST API
 */
export declare class HTTPServer {
    private app;
    private config;
    private agents;
    private requestCounts;
    constructor(config: ServerConfig);
    private setupMiddleware;
    private setupRoutes;
    /**
     * Register an agent
     */
    registerAgent(agent: Agent | IntelligentAgent): void;
    /**
     * Unregister an agent
     */
    unregisterAgent(name: string): void;
    /**
     * Start the server
     */
    start(): Promise<void>;
    /**
     * Get Express app (for testing or custom routes)
     */
    getApp(): Express;
}
//# sourceMappingURL=HTTPServer.d.ts.map