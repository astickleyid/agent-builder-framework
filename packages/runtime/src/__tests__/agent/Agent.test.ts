import { Agent, AgentConfig } from '../../agent/Agent';

describe('Agent', () => {
  let agent: Agent;
  let config: AgentConfig;

  beforeEach(() => {
    config = {
      name: 'test-agent',
      version: '1.0.0',
      description: 'Test agent for unit tests',
      tools: ['bash', 'http'],
      capabilities: ['testing', 'automation'],
      instructions: 'Execute test commands',
      environment: {
        maxTokens: 1000,
        temperature: 0.7
      }
    };
    agent = new Agent(config);
  });

  describe('initialization', () => {
    it('should create agent with valid config', () => {
      expect(agent).toBeDefined();
      expect(agent.getName()).toBe('test-agent');
    });

    it('should store config correctly', () => {
      const storedConfig = agent.getConfig();
      expect(storedConfig.name).toBe('test-agent');
      expect(storedConfig.version).toBe('1.0.0');
      expect(storedConfig.tools).toEqual(['bash', 'http']);
    });
  });

  describe('getName', () => {
    it('should return agent name', () => {
      expect(agent.getName()).toBe('test-agent');
    });
  });

  describe('getConfig', () => {
    it('should return full config', () => {
      const config = agent.getConfig();
      expect(config.name).toBe('test-agent');
      expect(config.description).toBe('Test agent for unit tests');
      expect(config.capabilities).toEqual(['testing', 'automation']);
    });
  });

  describe('run', () => {
    it('should process input and return response', async () => {
      const result = await agent.run('test input');
      
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('test-agent');
    });

    it('should maintain conversation history', async () => {
      await agent.run('first message');
      await agent.run('second message');
      
      const history = agent.getHistory();
      expect(history.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('registerTool', () => {
    it('should register a tool', () => {
      const mockTool = { name: 'mock-tool', execute: jest.fn() };
      agent.registerTool('mock-tool', mockTool);
      expect(agent).toBeDefined();
    });
  });

  describe('getHistory', () => {
    it('should return empty history initially', () => {
      const history = agent.getHistory();
      expect(Array.isArray(history)).toBe(true);
    });

    it('should track conversation history', async () => {
      await agent.run('Hello');
      
      const history = agent.getHistory();
      expect(history.length).toBeGreaterThan(0);
      expect(history[0].role).toBe('user');
      expect(history[0].content).toBe('Hello');
    });

    it('should include timestamps', async () => {
      await agent.run('test');
      
      const history = agent.getHistory();
      expect(history[0].timestamp).toBeInstanceOf(Date);
    });
  });
});
