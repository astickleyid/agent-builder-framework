"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonTool = void 0;
const BaseTool_1 = require("./BaseTool");
class JsonTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'json',
            description: 'JSON parsing, validation, and manipulation',
            parameters: {
                operation: 'string (parse|stringify|validate|query)',
                data: 'string | object',
                query: 'string (for query operation)'
            }
        });
    }
    async execute(params) {
        const { operation, data, query } = params;
        try {
            switch (operation) {
                case 'parse':
                    const parsed = JSON.parse(data);
                    return { success: true, result: parsed };
                case 'stringify':
                    const stringified = JSON.stringify(data, null, 2);
                    return { success: true, result: stringified };
                case 'validate':
                    try {
                        JSON.parse(typeof data === 'string' ? data : JSON.stringify(data));
                        return { success: true, valid: true };
                    }
                    catch {
                        return { success: true, valid: false };
                    }
                case 'query':
                    if (!query) {
                        throw new Error('Query is required for query operation');
                    }
                    // Simple JSONPath-like query (basic implementation)
                    const result = this.queryJson(data, query);
                    return { success: true, result };
                default:
                    throw new Error(`Unknown operation: ${operation}`);
            }
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    queryJson(obj, query) {
        // Basic implementation - supports dot notation like "user.name"
        const keys = query.split('.');
        let result = obj;
        for (const key of keys) {
            result = result?.[key];
        }
        return result;
    }
}
exports.JsonTool = JsonTool;
//# sourceMappingURL=JsonTool.js.map