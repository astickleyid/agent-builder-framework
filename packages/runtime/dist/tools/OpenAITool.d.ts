import { BaseTool } from './BaseTool';
export declare class OpenAITool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'chat' | 'completion' | 'embedding' | 'image';
        apiKey: string;
        model?: string;
        messages?: Array<{
            role: string;
            content: string;
        }>;
        prompt?: string;
        temperature?: number;
        maxTokens?: number;
        text?: string;
    }): Promise<any>;
}
//# sourceMappingURL=OpenAITool.d.ts.map