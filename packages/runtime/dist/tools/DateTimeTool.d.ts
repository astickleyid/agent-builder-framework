import { BaseTool } from './BaseTool';
export declare class DateTimeTool extends BaseTool {
    constructor();
    execute(params: {
        operation: string;
        date?: string;
        format?: string;
        amount?: number;
        unit?: string;
        date2?: string;
    }): Promise<any>;
    private unitToMs;
}
//# sourceMappingURL=DateTimeTool.d.ts.map