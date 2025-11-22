import { XmlTool } from '../../tools/XmlTool';

describe('XmlTool', () => {
  let tool: XmlTool;

  beforeEach(() => {
    tool = new XmlTool();
  });

  describe('parse operation', () => {
    it('should parse simple XML', async () => {
      const result = await tool.execute({
        operation: 'parse',
        data: '<name>John</name><age>30</age>'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
      expect(result.result.name).toBe('John');
      expect(result.result.age).toBe('30');
    });

    it('should require string data for parse', async () => {
      const result = await tool.execute({
        operation: 'parse',
        data: { invalid: 'object' }
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('data must be string');
    });
  });

  describe('stringify operation', () => {
    it('should convert object to XML', async () => {
      const result = await tool.execute({
        operation: 'stringify',
        data: { name: 'John', age: 30 }
      });

      expect(result.success).toBe(true);
      expect(result.xml).toBeDefined();
      expect(result.xml).toContain('<name>John</name>');
      expect(result.xml).toContain('<age>30</age>');
    });

    it('should require object data for stringify', async () => {
      const result = await tool.execute({
        operation: 'stringify',
        data: 'invalid string'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('data must be object');
    });
  });

  describe('validate operation', () => {
    it('should validate correct XML', async () => {
      const result = await tool.execute({
        operation: 'validate',
        data: '<root><item>value</item></root>'
      });

      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
    });

    it('should detect invalid XML', async () => {
      const result = await tool.execute({
        operation: 'validate',
        data: '<root><item>value</root>'
      });

      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
    });
  });

  describe('query operation', () => {
    it('should execute XPath query', async () => {
      const result = await tool.execute({
        operation: 'query',
        data: '<root><item>value</item></root>',
        xpath: '//item'
      });

      expect(result.success).toBe(true);
      expect(result.xpath).toBe('//item');
    });

    it('should require xpath parameter', async () => {
      const result = await tool.execute({
        operation: 'query',
        data: '<root></root>'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('xpath required');
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      const result = await tool.execute({
        operation: 'invalid' as any,
        data: 'test'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown operation');
    });
  });
});
