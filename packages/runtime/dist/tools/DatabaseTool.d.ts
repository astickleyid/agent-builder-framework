import { BaseTool } from './BaseTool';
export declare class DatabaseTool extends BaseTool {
    private connections;
    constructor();
    private createConnection;
    execute(params: {
        operation: 'connect' | 'query' | 'close';
        type?: 'postgres' | 'mongodb' | 'mysql';
        connectionString?: string;
        query?: string;
        connectionId?: string;
        database?: string;
        collection?: string;
    }): Promise<any>;
    closeAllConnections(): Promise<void>;
}
//# sourceMappingURL=DatabaseTool.d.ts.map