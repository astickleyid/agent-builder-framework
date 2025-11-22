import { Agent } from '../agent/Agent';

export interface WorkflowResult {
  success: boolean;
  results?: any[];
  result?: any;
  error?: string;
  duration?: number;
}

export interface Message {
  from: string;
  to: string;
  content: any;
  timestamp: number;
}

/**
 * AgentOrchestrator - Coordinates multiple agents working together
 * Supports sequential, parallel, conditional, and supervised execution patterns
 */
export class AgentOrchestrator {
  private agents: Map<string, Agent> = new Map();
  private sharedState: Map<string, any> = new Map();
  private messageQueue: Message[] = [];

  registerAgent(agent: Agent): void {
    this.agents.set(agent.getName(), agent);
  }

  unregisterAgent(agentName: string): void {
    this.agents.delete(agentName);
  }

  getAgent(name: string): Agent | undefined {
    return this.agents.get(name);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  setState(key: string, value: any): void {
    this.sharedState.set(key, value);
  }

  getState(key: string): any {
    return this.sharedState.get(key);
  }

  clearState(): void {
    this.sharedState.clear();
  }

  sendMessage(from: string, to: string, content: any): void {
    this.messageQueue.push({ from, to, content, timestamp: Date.now() });
  }

  getMessages(agentName: string): Message[] {
    return this.messageQueue.filter(msg => msg.to === agentName);
  }

  clearMessages(): void {
    this.messageQueue = [];
  }

  async sequential(agentNames: string[], initialInput: string): Promise<WorkflowResult> {
    const startTime = Date.now();
    const results: any[] = [];
    let currentInput = initialInput;

    try {
      for (const agentName of agentNames) {
        const agent = this.agents.get(agentName);
        if (!agent) {
          throw new Error(`Agent not found: ${agentName}`);
        }

        const result = await agent.run(currentInput);
        results.push(result);
        currentInput = typeof result === 'string' ? result : JSON.stringify(result);
      }

      return { success: true, results, result: results[results.length - 1], duration: Date.now() - startTime };
    } catch (error: any) {
      return { success: false, error: error.message, results, duration: Date.now() - startTime };
    }
  }

  async parallel(agentNames: string[], input: string): Promise<WorkflowResult> {
    const startTime = Date.now();

    try {
      const promises = agentNames.map(agentName => {
        const agent = this.agents.get(agentName);
        if (!agent) {
          throw new Error(`Agent not found: ${agentName}`);
        }
        return agent.run(input);
      });

      const results = await Promise.all(promises);
      return { success: true, results, duration: Date.now() - startTime };
    } catch (error: any) {
      return { success: false, error: error.message, duration: Date.now() - startTime };
    }
  }

  async conditional(
    input: string,
    condition: (input: string) => string,
    routes: Map<string, string>
  ): Promise<WorkflowResult> {
    const startTime = Date.now();

    try {
      const route = condition(input);
      const agentName = routes.get(route);

      if (!agentName) {
        throw new Error(`No agent configured for route: ${route}`);
      }

      const agent = this.agents.get(agentName);
      if (!agent) {
        throw new Error(`Agent not found: ${agentName}`);
      }

      const result = await agent.run(input);
      return { success: true, result, duration: Date.now() - startTime };
    } catch (error: any) {
      return { success: false, error: error.message, duration: Date.now() - startTime };
    }
  }

  async supervise(supervisorName: string, workerNames: string[], task: string): Promise<WorkflowResult> {
    const startTime = Date.now();

    try {
      const supervisor = this.agents.get(supervisorName);
      if (!supervisor) {
        throw new Error(`Supervisor agent not found: ${supervisorName}`);
      }

      for (const workerName of workerNames) {
        if (!this.agents.get(workerName)) {
          throw new Error(`Worker agent not found: ${workerName}`);
        }
      }

      const supervisorDecision = await supervisor.run(
        `Task: ${task}\nWorkers available: ${workerNames.join(', ')}\nDecide how to distribute the work.`
      );

      const workerPromises = workerNames.map(workerName => {
        const worker = this.agents.get(workerName)!;
        return worker.run(task);
      });

      const workerResults = await Promise.all(workerPromises);

      const finalResult = await supervisor.run(
        `Worker results: ${JSON.stringify(workerResults)}\nSynthesize a final answer.`
      );

      return {
        success: true,
        result: finalResult,
        results: [supervisorDecision, ...workerResults, finalResult],
        duration: Date.now() - startTime
      };
    } catch (error: any) {
      return { success: false, error: error.message, duration: Date.now() - startTime };
    }
  }

  getStats(): { totalAgents: number; stateSize: number; messageCount: number } {
    return {
      totalAgents: this.agents.size,
      stateSize: this.sharedState.size,
      messageCount: this.messageQueue.length
    };
  }
}
