"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextTool = void 0;
const BaseTool_1 = require("./BaseTool");
class TextTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'text',
            description: 'Text manipulation and analysis utilities',
            parameters: {
                operation: 'string (count|search|replace|split|join|case|trim)',
                text: 'string',
                search: 'string (for search/replace)',
                replacement: 'string (for replace)',
                delimiter: 'string (for split/join)',
                caseType: 'string (upper|lower|title|camel|snake)'
            }
        });
    }
    async execute(params) {
        const { operation, text, search, replacement, delimiter, caseType } = params;
        try {
            switch (operation) {
                case 'count':
                    return {
                        success: true,
                        characters: text.length,
                        words: text.split(/\s+/).filter(w => w.length > 0).length,
                        lines: text.split('\n').length,
                        paragraphs: text.split(/\n\n+/).length
                    };
                case 'search':
                    if (!search) {
                        throw new Error('search parameter required');
                    }
                    const regex = new RegExp(search, 'gi');
                    const matches = text.match(regex) || [];
                    return {
                        success: true,
                        found: matches.length > 0,
                        count: matches.length,
                        matches: matches.slice(0, 10) // First 10 matches
                    };
                case 'replace':
                    if (!search) {
                        throw new Error('search parameter required');
                    }
                    const replaced = text.replace(new RegExp(search, 'g'), replacement || '');
                    return {
                        success: true,
                        original: text,
                        result: replaced,
                        replacements: (text.match(new RegExp(search, 'g')) || []).length
                    };
                case 'split':
                    const splitResult = delimiter
                        ? text.split(delimiter)
                        : text.split(/\s+/);
                    return {
                        success: true,
                        parts: splitResult,
                        count: splitResult.length
                    };
                case 'join':
                    if (!Array.isArray(text)) {
                        throw new Error('text must be array for join operation');
                    }
                    return {
                        success: true,
                        result: text.join(delimiter || ' ')
                    };
                case 'case':
                    if (!caseType) {
                        throw new Error('caseType required for case operation');
                    }
                    const converted = this.convertCase(text, caseType);
                    return {
                        success: true,
                        original: text,
                        result: converted,
                        caseType
                    };
                case 'trim':
                    return {
                        success: true,
                        original: text,
                        result: text.trim(),
                        trimStart: text.trimStart(),
                        trimEnd: text.trimEnd()
                    };
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
    convertCase(text, caseType) {
        switch (caseType) {
            case 'upper':
                return text.toUpperCase();
            case 'lower':
                return text.toLowerCase();
            case 'title':
                return text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
            case 'camel':
                return text
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
            case 'snake':
                return text
                    .replace(/([A-Z])/g, '_$1')
                    .toLowerCase()
                    .replace(/^_/, '');
            default:
                return text;
        }
    }
}
exports.TextTool = TextTool;
//# sourceMappingURL=TextTool.js.map