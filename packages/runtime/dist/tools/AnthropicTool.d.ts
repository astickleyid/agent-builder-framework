import { BaseTool } from './BaseTool';
export declare class AnthropicTool extends BaseTool {
    constructor();
    execute(params: {
        operation: 'chat' | 'completion';
        apiKey: string;
        model?: string;
        messages?: Array<{
            role: string;
            content: string;
        }>;
        prompt?: string;
        temperature?: number;
        maxTokens?: number;
        system?: string;
    }): Promise<any>;
}
//# sourceMappingURL=AnthropicTool.d.ts.map