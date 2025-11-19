import { BaseTool } from './BaseTool';
export declare class DatabaseTool extends BaseTool {
    private connections;
    constructor();
    execute(params: {
        operation: 'connect' | 'query' | 'close';
        type?: 'postgres' | 'mongodb' | 'mysql';
        connectionString?: string;
        query?: string;
        connectionId?: string;
    }): Promise<any>;
}
//# sourceMappingURL=DatabaseTool.d.ts.map