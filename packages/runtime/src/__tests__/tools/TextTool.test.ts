import { TextTool } from '../../tools/TextTool';

describe('TextTool', () => {
  let tool: TextTool;

  beforeEach(() => {
    tool = new TextTool();
  });

  describe('count operation', () => {
    it('should count characters, words, lines, and paragraphs', async () => {
      const result = await tool.execute({
        operation: 'count',
        text: 'Hello world!\nThis is a test.\n\nNew paragraph.'
      });

      expect(result.success).toBe(true);
      expect(result.characters).toBe(44); // Actual length of the string
      expect(result.words).toBe(8);
      expect(result.lines).toBe(4);
      expect(result.paragraphs).toBe(2);
    });

    it('should handle empty text', async () => {
      const result = await tool.execute({
        operation: 'count',
        text: ''
      });

      expect(result.success).toBe(true);
      expect(result.characters).toBe(0);
      expect(result.words).toBe(0);
    });
  });

  describe('search operation', () => {
    it('should find matches in text', async () => {
      const result = await tool.execute({
        operation: 'search',
        text: 'The quick brown fox jumps over the lazy dog',
        search: 'the'
      });

      expect(result.success).toBe(true);
      expect(result.found).toBe(true);
      expect(result.count).toBe(2);
      expect(result.matches.length).toBe(2);
    });

    it('should return no matches when pattern not found', async () => {
      const result = await tool.execute({
        operation: 'search',
        text: 'Hello world',
        search: 'xyz'
      });

      expect(result.success).toBe(true);
      expect(result.found).toBe(false);
      expect(result.count).toBe(0);
    });

    it('should require search parameter', async () => {
      const result = await tool.execute({
        operation: 'search',
        text: 'Hello'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('search parameter required');
    });
  });

  describe('replace operation', () => {
    it('should replace all occurrences', async () => {
      const result = await tool.execute({
        operation: 'replace',
        text: 'Hello world, hello universe',
        search: 'hello',
        replacement: 'hi'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('Hello world, hi universe'); // Regex is case-sensitive
      expect(result.replacements).toBe(1);
    });

    it('should replace with empty string when no replacement provided', async () => {
      const result = await tool.execute({
        operation: 'replace',
        text: 'Hello world',
        search: 'Hello '
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('world');
    });
  });

  describe('split operation', () => {
    it('should split by delimiter', async () => {
      const result = await tool.execute({
        operation: 'split',
        text: 'apple,banana,cherry',
        delimiter: ','
      });

      expect(result.success).toBe(true);
      expect(result.count).toBe(3);
      expect(result.parts).toEqual(['apple', 'banana', 'cherry']);
    });

    it('should split by whitespace when no delimiter', async () => {
      const result = await tool.execute({
        operation: 'split',
        text: 'hello world test'
      });

      expect(result.success).toBe(true);
      expect(result.count).toBe(3);
    });
  });

  describe('case operation', () => {
    it('should convert to uppercase', async () => {
      const result = await tool.execute({
        operation: 'case',
        text: 'hello world',
        caseType: 'upper'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('HELLO WORLD');
    });

    it('should convert to lowercase', async () => {
      const result = await tool.execute({
        operation: 'case',
        text: 'HELLO WORLD',
        caseType: 'lower'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('hello world');
    });

    it('should convert to title case', async () => {
      const result = await tool.execute({
        operation: 'case',
        text: 'hello world test',
        caseType: 'title'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('Hello World Test');
    });

    it('should convert to camel case', async () => {
      const result = await tool.execute({
        operation: 'case',
        text: 'hello world test',
        caseType: 'camel'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('helloWorldTest');
    });

    it('should convert to snake case', async () => {
      const result = await tool.execute({
        operation: 'case',
        text: 'HelloWorldTest',
        caseType: 'snake'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('hello_world_test');
    });

    it('should require caseType parameter', async () => {
      const result = await tool.execute({
        operation: 'case',
        text: 'hello'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('caseType required');
    });
  });

  describe('trim operation', () => {
    it('should trim whitespace', async () => {
      const result = await tool.execute({
        operation: 'trim',
        text: '  hello world  '
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('hello world');
      expect(result.trimStart).toBe('hello world  ');
      expect(result.trimEnd).toBe('  hello world');
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      const result = await tool.execute({
        operation: 'invalid',
        text: 'test'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown operation');
    });
  });
});
