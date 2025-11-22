import { AgentOrchestrator } from '../../orchestration/AgentOrchestrator';
import { Agent, AgentConfig } from '../../agent/Agent';

class MockAgent extends Agent {
  constructor(name: string) {
    const config: AgentConfig = {
      name,
      version: '1.0.0',
      description: 'Mock agent for testing',
      tools: [],
      capabilities: [],
      instructions: 'Mock instructions',
      environment: {}
    };
    super(config);
  }

  async run(input: string): Promise<string> {
    return `${this.getName()} processed: ${input}`;
  }
}

describe('AgentOrchestrator', () => {
  let orchestrator: AgentOrchestrator;
  let agent1: MockAgent;
  let agent2: MockAgent;
  let agent3: MockAgent;

  beforeEach(() => {
    orchestrator = new AgentOrchestrator();
    agent1 = new MockAgent('agent1');
    agent2 = new MockAgent('agent2');
    agent3 = new MockAgent('agent3');
  });

  describe('Agent Management', () => {
    it('should register an agent', () => {
      orchestrator.registerAgent(agent1);
      expect(orchestrator.getAgent('agent1')).toBe(agent1);
    });

    it('should unregister an agent', () => {
      orchestrator.registerAgent(agent1);
      orchestrator.unregisterAgent('agent1');
      expect(orchestrator.getAgent('agent1')).toBeUndefined();
    });

    it('should get all agents', () => {
      orchestrator.registerAgent(agent1);
      orchestrator.registerAgent(agent2);
      const agents = orchestrator.getAllAgents();
      expect(agents).toHaveLength(2);
      expect(agents).toContain(agent1);
      expect(agents).toContain(agent2);
    });

    it('should return undefined for non-existent agent', () => {
      expect(orchestrator.getAgent('nonexistent')).toBeUndefined();
    });
  });

  describe('State Management', () => {
    it('should set and get state', () => {
      orchestrator.setState('key1', 'value1');
      expect(orchestrator.getState('key1')).toBe('value1');
    });

    it('should clear state', () => {
      orchestrator.setState('key1', 'value1');
      orchestrator.setState('key2', 'value2');
      orchestrator.clearState();
      expect(orchestrator.getState('key1')).toBeUndefined();
      expect(orchestrator.getState('key2')).toBeUndefined();
    });
  });

  describe('Message Queue', () => {
    it('should send and retrieve messages', () => {
      orchestrator.sendMessage('agent1', 'agent2', 'Hello');
      const messages = orchestrator.getMessages('agent2');
      expect(messages).toHaveLength(1);
      expect(messages[0].from).toBe('agent1');
      expect(messages[0].to).toBe('agent2');
      expect(messages[0].content).toBe('Hello');
    });

    it('should filter messages by recipient', () => {
      orchestrator.sendMessage('agent1', 'agent2', 'msg1');
      orchestrator.sendMessage('agent1', 'agent3', 'msg2');
      
      const agent2Messages = orchestrator.getMessages('agent2');
      const agent3Messages = orchestrator.getMessages('agent3');
      
      expect(agent2Messages).toHaveLength(1);
      expect(agent3Messages).toHaveLength(1);
    });

    it('should clear message queue', () => {
      orchestrator.sendMessage('agent1', 'agent2', 'msg1');
      orchestrator.clearMessages();
      
      expect(orchestrator.getMessages('agent2')).toHaveLength(0);
    });
  });

  describe('Sequential Workflow', () => {
    it('should execute agents sequentially', async () => {
      orchestrator.registerAgent(agent1);
      orchestrator.registerAgent(agent2);
      orchestrator.registerAgent(agent3);

      const result = await orchestrator.sequential(
        ['agent1', 'agent2', 'agent3'],
        'initial input'
      );

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(3);
      expect(result.result).toBeDefined();
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle missing agent in sequential workflow', async () => {
      orchestrator.registerAgent(agent1);

      const result = await orchestrator.sequential(
        ['agent1', 'nonexistent'],
        'test'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Agent not found');
    });
  });

  describe('Parallel Workflow', () => {
    it('should execute agents in parallel', async () => {
      orchestrator.registerAgent(agent1);
      orchestrator.registerAgent(agent2);
      orchestrator.registerAgent(agent3);

      const result = await orchestrator.parallel(
        ['agent1', 'agent2', 'agent3'],
        'test input'
      );

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(3);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle missing agent in parallel workflow', async () => {
      orchestrator.registerAgent(agent1);

      const result = await orchestrator.parallel(
        ['agent1', 'nonexistent'],
        'test'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Agent not found');
    });
  });

  describe('Conditional Workflow', () => {
    it('should route to correct agent based on condition', async () => {
      orchestrator.registerAgent(agent1);
      orchestrator.registerAgent(agent2);

      const routes = new Map([
        ['route1', 'agent1'],
        ['route2', 'agent2']
      ]);

      const result = await orchestrator.conditional(
        'test input',
        (input) => 'route1',
        routes
      );

      expect(result.success).toBe(true);
      expect(result.result).toContain('agent1');
    });

    it('should handle missing route', async () => {
      orchestrator.registerAgent(agent1);

      const routes = new Map([['route1', 'agent1']]);

      const result = await orchestrator.conditional(
        'test',
        () => 'invalid_route',
        routes
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('No agent configured for route');
    });
  });

  describe('Supervised Workflow', () => {
    it('should execute supervisor pattern', async () => {
      orchestrator.registerAgent(agent1);
      orchestrator.registerAgent(agent2);
      orchestrator.registerAgent(agent3);

      const result = await orchestrator.supervise(
        'agent1',
        ['agent2', 'agent3'],
        'test task'
      );

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(4);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });

    it('should handle missing supervisor', async () => {
      orchestrator.registerAgent(agent2);
      orchestrator.registerAgent(agent3);

      const result = await orchestrator.supervise(
        'nonexistent',
        ['agent2', 'agent3'],
        'task'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Supervisor agent not found');
    });
  });

  describe('Statistics', () => {
    it('should return correct statistics', () => {
      orchestrator.registerAgent(agent1);
      orchestrator.registerAgent(agent2);
      orchestrator.setState('key1', 'value1');
      orchestrator.sendMessage('agent1', 'agent2', 'msg');

      const stats = orchestrator.getStats();

      expect(stats.totalAgents).toBe(2);
      expect(stats.stateSize).toBe(1);
      expect(stats.messageCount).toBe(1);
    });

    it('should return zero stats for empty orchestrator', () => {
      const stats = orchestrator.getStats();

      expect(stats.totalAgents).toBe(0);
      expect(stats.stateSize).toBe(0);
      expect(stats.messageCount).toBe(0);
    });
  });
});
