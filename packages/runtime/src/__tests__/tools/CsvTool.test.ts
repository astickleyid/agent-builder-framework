import { CsvTool } from '../../tools/CsvTool';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';

describe('CsvTool', () => {
  let tool: CsvTool;
  let tempDir: string;
  let testCsvPath: string;

  beforeEach(async () => {
    tool = new CsvTool();
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'csv-tool-test-'));
    testCsvPath = path.join(tempDir, 'test.csv');
  });

  afterEach(async () => {
    try {
      await fs.rm(tempDir, { recursive: true, force: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  describe('stringify operation', () => {
    it('should convert array of objects to CSV', async () => {
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Los Angeles' }
      ];

      const result = await tool.execute({
        operation: 'stringify',
        data
      });

      expect(result.success).toBe(true);
      expect(result.csv).toContain('name,age,city');
      expect(result.csv).toContain('John,30,New York');
      expect(result.csv).toContain('Jane,25,Los Angeles');
      expect(result.rowCount).toBe(2);
    });

    it('should require data parameter', async () => {
      const result = await tool.execute({
        operation: 'stringify'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('data required');
    });
  });

  describe('parse operation', () => {
    it('should parse CSV file', async () => {
      const csvContent = 'name,age,city\nJohn,30,New York\nJane,25,Los Angeles';
      await fs.writeFile(testCsvPath, csvContent);

      const result = await tool.execute({
        operation: 'parse',
        path: testCsvPath
      });

      expect(result.success).toBe(true);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0]).toEqual({
        name: 'John',
        age: '30',
        city: 'New York'
      });
      expect(result.columns).toEqual(['name', 'age', 'city']);
    });

    it('should require path parameter', async () => {
      const result = await tool.execute({
        operation: 'parse'
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('path required');
    });

    it('should handle missing file', async () => {
      const result = await tool.execute({
        operation: 'parse',
        path: '/nonexistent/file.csv'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('filter operation', () => {
    it('should filter data based on query', async () => {
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'Los Angeles' },
        { name: 'Bob', age: 30, city: 'Chicago' }
      ];

      const result = await tool.execute({
        operation: 'filter',
        data,
        query: { age: 30 }
      });

      expect(result.success).toBe(true);
      expect(result.rows).toHaveLength(2);
      expect(result.rows[0].name).toBe('John');
      expect(result.rows[1].name).toBe('Bob');
    });

    it('should require data and query parameters', async () => {
      const result = await tool.execute({
        operation: 'filter',
        data: []
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('data and query required');
    });
  });

  describe('error handling', () => {
    it('should handle unknown operation', async () => {
      const result = await tool.execute({
        operation: 'invalid' as any
      });

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unknown operation');
    });
  });
});
