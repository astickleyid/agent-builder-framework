import { BaseTool } from './BaseTool';
export declare class OllamaTool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'chat' | 'generate' | 'list' | 'pull';
        model?: string;
        messages?: Array<{
            role: string;
            content: string;
        }>;
        prompt?: string;
        host?: string;
        temperature?: number;
        stream?: boolean;
    }): Promise<any>;
}
//# sourceMappingURL=OllamaTool.d.ts.map