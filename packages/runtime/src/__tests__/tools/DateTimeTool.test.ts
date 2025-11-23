import { DateTimeTool } from '../../tools/DateTimeTool';

describe('DateTimeTool', () => {
  let tool: DateTimeTool;

  beforeEach(() => {
    tool = new DateTimeTool();
  });

  describe('now operation', () => {
    it('should return current date and time', async () => {
      const before = Date.now();
      const result = await tool.execute({
        operation: 'now'
      });
      const after = Date.now();

      expect(result.success).toBe(true);
      expect(result.timestamp).toBeGreaterThanOrEqual(before);
      expect(result.timestamp).toBeLessThanOrEqual(after);
      expect(result.iso).toBeDefined();
      expect(result.formatted).toBeDefined();
    });
  });

  describe('format operation', () => {
    it('should format a date string', async () => {
      const result = await tool.execute({
        operation: 'format',
        date: '2025-11-22T10:30:00Z'
      });

      expect(result.success).toBe(true);
      expect(result.iso).toBe('2025-11-22T10:30:00.000Z');
      expect(result.timestamp).toBe(new Date('2025-11-22T10:30:00Z').getTime());
      expect(result.locale).toBeDefined();
      expect(result.utc).toBeDefined();
    });

    it('should require date parameter', async () => {
      const result = await tool.execute({
        operation: 'format'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('date required');
    });
  });

  describe('parse operation', () => {
    it('should parse a date string', async () => {
      const result = await tool.execute({
        operation: 'parse',
        date: '2025-11-22T10:30:45Z'
      });

      expect(result.success).toBe(true);
      expect(result.year).toBe(2025);
      expect(result.month).toBe(11);
      expect(result.day).toBe(22);
      expect(result.hours).toBe(10);
      expect(result.minutes).toBe(30);
      expect(result.seconds).toBe(45);
      expect(result.iso).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });

    it('should require date parameter', async () => {
      const result = await tool.execute({
        operation: 'parse'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('date required');
    });
  });

  describe('add operation', () => {
    it('should add days to date', async () => {
      const result = await tool.execute({
        operation: 'add',
        date: '2025-11-22T00:00:00Z',
        amount: 5,
        unit: 'days'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('2025-11-27T00:00:00.000Z');
      expect(result.operation).toBe('add 5 days');
    });

    it('should add hours to date', async () => {
      const result = await tool.execute({
        operation: 'add',
        date: '2025-11-22T10:00:00Z',
        amount: 3,
        unit: 'hours'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('2025-11-22T13:00:00.000Z');
    });

    it('should require all parameters', async () => {
      const result = await tool.execute({
        operation: 'add',
        date: '2025-11-22T00:00:00Z'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('date, amount, and unit required');
    });
  });

  describe('subtract operation', () => {
    it('should subtract days from date', async () => {
      const result = await tool.execute({
        operation: 'subtract',
        date: '2025-11-22T00:00:00Z',
        amount: 5,
        unit: 'days'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('2025-11-17T00:00:00.000Z');
      expect(result.operation).toBe('subtract 5 days');
    });

    it('should subtract hours from date', async () => {
      const result = await tool.execute({
        operation: 'subtract',
        date: '2025-11-22T10:00:00Z',
        amount: 2,
        unit: 'hours'
      });

      expect(result.success).toBe(true);
      expect(result.result).toBe('2025-11-22T08:00:00.000Z');
    });
  });

  describe('diff operation', () => {
    it('should calculate difference between dates', async () => {
      const result = await tool.execute({
        operation: 'diff',
        date: '2025-11-22T00:00:00Z',
        date2: '2025-11-27T00:00:00Z'
      });

      expect(result.success).toBe(true);
      expect(result.days).toBe(5);
      expect(result.hours).toBe(5 * 24);
      expect(result.minutes).toBe(5 * 24 * 60);
      expect(result.seconds).toBe(5 * 24 * 60 * 60);
      expect(result.milliseconds).toBe(5 * 24 * 60 * 60 * 1000);
    });

    it('should return absolute difference regardless of order', async () => {
      const result = await tool.execute({
        operation: 'diff',
        date: '2025-11-27T00:00:00Z',
        date2: '2025-11-22T00:00:00Z'
      });

      expect(result.success).toBe(true);
      expect(result.days).toBe(5);
    });

    it('should require both dates', async () => {
      const result = await tool.execute({
        operation: 'diff',
        date: '2025-11-22T00:00:00Z'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('date and date2 required');
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      const result = await tool.execute({
        operation: 'invalid'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown operation');
    });

    it('should handle invalid date format', async () => {
      const result = await tool.execute({
        operation: 'format',
        date: 'not-a-date'
      });

      // Invalid dates are handled by the catch block
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
