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
export declare class AgentOrchestrator {
    private agents;
    private sharedState;
    private messageQueue;
    registerAgent(agent: Agent): void;
    unregisterAgent(agentName: string): void;
    getAgent(name: string): Agent | undefined;
    getAllAgents(): Agent[];
    setState(key: string, value: any): void;
    getState(key: string): any;
    clearState(): void;
    sendMessage(from: string, to: string, content: any): void;
    getMessages(agentName: string): Message[];
    clearMessages(): void;
    sequential(agentNames: string[], initialInput: string): Promise<WorkflowResult>;
    parallel(agentNames: string[], input: string): Promise<WorkflowResult>;
    conditional(input: string, condition: (input: string) => string, routes: Map<string, string>): Promise<WorkflowResult>;
    supervise(supervisorName: string, workerNames: string[], task: string): Promise<WorkflowResult>;
    getStats(): {
        totalAgents: number;
        stateSize: number;
        messageCount: number;
    };
}
//# sourceMappingURL=AgentOrchestrator.d.ts.map