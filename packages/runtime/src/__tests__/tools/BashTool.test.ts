import { BashTool } from '../../tools/BashTool';

describe('BashTool', () => {
  let tool: BashTool;

  beforeEach(() => {
    tool = new BashTool();
  });

  describe('command execution', () => {
    it('should execute simple echo command', async () => {
      const result = await tool.execute({
        command: 'echo "Hello World"'
      });

      expect(result.success).toBe(true);
      expect(result.stdout).toContain('Hello World');
      expect(result.command).toBe('echo "Hello World"');
    });

    it('should execute pwd command', async () => {
      const result = await tool.execute({
        command: 'pwd'
      });

      expect(result.success).toBe(true);
      expect(result.stdout).toBeTruthy();
    });

    it('should handle commands with stderr output', async () => {
      const result = await tool.execute({
        command: 'echo "error" >&2'
      });

      expect(result.success).toBe(true);
      expect(result.stderr).toContain('error');
    });
  });

  describe('error handling', () => {
    it('should handle invalid commands', async () => {
      const result = await tool.execute({
        command: 'nonexistentcommand12345'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle command that exits with error', async () => {
      const result = await tool.execute({
        command: 'exit 1'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('timeout handling', () => {
    it('should use default timeout', async () => {
      const result = await tool.execute({
        command: 'echo "test"'
      });

      expect(result.success).toBe(true);
    });

    it('should handle timeout for long-running commands', async () => {
      const result = await tool.execute({
        command: 'sleep 5',
        timeout: 100
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    }, 10000);
  });

  describe('command metadata', () => {
    it('should include command in result', async () => {
      const command = 'ls -la';
      const result = await tool.execute({ command });

      expect(result.command).toBe(command);
    });
  });
});
