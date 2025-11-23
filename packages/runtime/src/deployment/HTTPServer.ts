import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
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
export class HTTPServer {
  private app: Express;
  private config: ServerConfig;
  private agents: Map<string, Agent | IntelligentAgent> = new Map();
  private requestCounts: Map<string, { count: number; resetTime: number }> = new Map();

  constructor(config: ServerConfig) {
    this.config = {
      host: '0.0.0.0',
      cors: true,
      ...config
    };
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    // Security
    this.app.use(helmet());

    // CORS
    if (this.config.cors) {
      this.app.use(cors());
    }

    // Body parser
    this.app.use(express.json());

    // API key auth (if configured)
    if (this.config.apiKey) {
      this.app.use((req: Request, res: Response, next: any) => {
        const apiKey = req.headers['x-api-key'] || req.query.apiKey;
        if (apiKey !== this.config.apiKey) {
          return res.status(401).json({ error: 'Invalid API key' });
        }
        next();
      });
    }

    // Rate limiting
    if (this.config.rateLimit) {
      this.app.use((req: Request, res: Response, next: any) => {
        const ip = req.ip || 'unknown';
        const now = Date.now();
        const data = this.requestCounts.get(ip);

        if (!data || now > data.resetTime) {
          this.requestCounts.set(ip, {
            count: 1,
            resetTime: now + this.config.rateLimit!.windowMs
          });
          return next();
        }

        if (data.count >= this.config.rateLimit!.maxRequests) {
          return res.status(429).json({ error: 'Too many requests' });
        }

        data.count++;
        next();
      });
    }
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({
        status: 'healthy',
        timestamp: Date.now(),
        agents: Array.from(this.agents.keys())
      });
    });

    // List agents
    this.app.get('/agents', (req: Request, res: Response) => {
      const agentList = Array.from(this.agents.entries()).map(([name, agent]) => ({
        name,
        type: agent instanceof IntelligentAgent ? 'intelligent' : 'basic'
      }));
      res.json({ agents: agentList });
    });

    // Run agent
    this.app.post('/agents/:name/run', async (req: Request, res: Response) => {
      const { name } = req.params;
      const { input, stream }: AgentRunRequest = req.body;

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

        const response: AgentRunResponse = {
          success: true,
          result,
          duration
        };

        res.json(response);
      } catch (error: any) {
        const response: AgentRunResponse = {
          success: false,
          error: error.message,
          duration: Date.now() - startTime
        };
        res.status(500).json(response);
      }
    });

    // Get agent info
    this.app.get('/agents/:name', (req: Request, res: Response) => {
      const { name } = req.params;
      const agent = this.agents.get(name);

      if (!agent) {
        return res.status(404).json({ error: `Agent not found: ${name}` });
      }

      res.json({
        name: agent.getName(),
        type: agent instanceof IntelligentAgent ? 'intelligent' : 'basic',
        tools: agent['config']?.tools || [],
        capabilities: agent['config']?.capabilities || []
      });
    });

    // Server stats
    this.app.get('/stats', (req: Request, res: Response) => {
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
  registerAgent(agent: Agent | IntelligentAgent): void {
    this.agents.set(agent.getName(), agent);
    console.log(`[Server] Registered agent: ${agent.getName()}`);
  }

  /**
   * Unregister an agent
   */
  unregisterAgent(name: string): void {
    this.agents.delete(name);
    console.log(`[Server] Unregistered agent: ${name}`);
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
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
  getApp(): Express {
    return this.app;
  }
}
