import { BaseTool } from './BaseTool';
export declare class CsvTool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'parse' | 'stringify' | 'query' | 'filter';
        path?: string;
        data?: any;
        query?: Record<string, any>;
    }): Promise<any>;
    private parseCsv;
    private stringifyCsv;
    private filterData;
}
//# sourceMappingURL=CsvTool.d.ts.map