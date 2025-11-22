import { JsonTool } from '../../tools/JsonTool';

describe('JsonTool', () => {
  let tool: JsonTool;

  beforeEach(() => {
    tool = new JsonTool();
  });

  describe('parse operation', () => {
    it('should parse valid JSON string', async () => {
      const result = await tool.execute({
        operation: 'parse',
        data: '{"name":"John","age":30}'
      });

      expect(result.success).toBe(true);
      expect(result.result).toEqual({ name: 'John', age: 30 });
    });

    it('should parse JSON array', async () => {
      const result = await tool.execute({
        operation: 'parse',
        data: '[1,2,3]'
      });

      expect(result.success).toBe(true);
      expect(result.result).toEqual([1, 2, 3]);
    });

    it('should handle invalid JSON', async () => {
      const result = await tool.execute({
        operation: 'parse',
        data: '{invalid json}'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('stringify operation', () => {
    it('should stringify object', async () => {
      const result = await tool.execute({
        operation: 'stringify',
        data: { name: 'John', age: 30 }
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('"name": "John"');
      expect(result.result).toContain('"age": 30');
    });

    it('should stringify array', async () => {
      const result = await tool.execute({
        operation: 'stringify',
        data: [1, 2, 3]
      });

      expect(result.success).toBe(true);
      expect(result.result).toContain('[\n  1,\n  2,\n  3\n]');
    });

    it('should handle primitive values', async () => {
      const result = await tool.execute({
        operation: 'stringify',
        data: 'hello'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('"hello"');
    });
  });

  describe('validate operation', () => {
    it('should validate valid JSON string', async () => {
      const result = await tool.execute({
        operation: 'validate',
        data: '{"valid":true}'
      });

      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
    });

    it('should validate object', async () => {
      const result = await tool.execute({
        operation: 'validate',
        data: { valid: true }
      });

      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
    });

    it('should detect invalid JSON', async () => {
      const result = await tool.execute({
        operation: 'validate',
        data: '{invalid}'
      });

      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
    });
  });

  describe('query operation', () => {
    it('should query nested object', async () => {
      const result = await tool.execute({
        operation: 'query',
        data: { user: { name: 'John', age: 30 } },
        query: 'user.name'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('John');
    });

    it('should query deeply nested object', async () => {
      const result = await tool.execute({
        operation: 'query',
        data: { a: { b: { c: { d: 'deep' } } } },
        query: 'a.b.c.d'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('deep');
    });

    it('should return undefined for non-existent path', async () => {
      const result = await tool.execute({
        operation: 'query',
        data: { user: { name: 'John' } },
        query: 'user.email'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBeUndefined();
    });

    it('should require query parameter', async () => {
      const result = await tool.execute({
        operation: 'query',
        data: { test: 'value' }
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Query is required');
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      const result = await tool.execute({
        operation: 'invalid' as any,
        data: {}
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown operation');
    });
  });
});
