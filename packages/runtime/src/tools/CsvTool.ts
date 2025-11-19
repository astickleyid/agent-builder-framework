import { BaseTool } from './BaseTool';
import * as fs from 'fs/promises';

export class CsvTool extends BaseTool {
  constructor() {
    super({
      name: 'csv',
      description: 'Parse, query, and manipulate CSV files',
      parameters: {
        operation: 'string (parse|stringify|query|filter)',
        path: 'string (file path, for parse)',
        data: 'string | object[] (for stringify)',
        query: 'object (for filter)'
      }
    });
  }

  async execute(params: {
    operation: 'parse' | 'stringify' | 'query' | 'filter';
    path?: string;
    data?: any;
    query?: Record<string, any>;
  }): Promise<any> {
    const { operation, path, data, query } = params;

    try {
      switch (operation) {
        case 'parse':
          if (!path) {
            throw new Error('path required for parse operation');
          }
          const content = await fs.readFile(path, 'utf-8');
          const rows = this.parseCsv(content);
          return {
            success: true,
            rows,
            rowCount: rows.length,
            columns: rows.length > 0 ? Object.keys(rows[0]) : []
          };

        case 'stringify':
          if (!data) {
            throw new Error('data required for stringify operation');
          }
          const csv = this.stringifyCsv(data);
          return {
            success: true,
            csv,
            rowCount: Array.isArray(data) ? data.length : 0
          };

        case 'filter':
          if (!data || !query) {
            throw new Error('data and query required for filter operation');
          }
          const filtered = this.filterData(data, query);
          return {
            success: true,
            rows: filtered,
            rowCount: filtered.length
          };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private parseCsv(content: string): Record<string, any>[] {
    const lines = content.trim().split('\n');
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: Record<string, any> = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return rows;
  }

  private stringifyCsv(data: any[]): string {
    if (!Array.isArray(data) || data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const rows = [headers.join(',')];

    for (const item of data) {
      const values = headers.map(h => {
        const value = item[h];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      });
      rows.push(values.join(','));
    }

    return rows.join('\n');
  }

  private filterData(data: any[], query: Record<string, any>): any[] {
    return data.filter(item => {
      return Object.entries(query).every(([key, value]) => {
        return item[key] === value;
      });
    });
  }
}
