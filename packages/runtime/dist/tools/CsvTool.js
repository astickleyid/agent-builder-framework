"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CsvTool = void 0;
const BaseTool_1 = require("./BaseTool");
const fs = __importStar(require("fs/promises"));
class CsvTool extends BaseTool_1.BaseTool {
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
    async execute(params) {
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
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    parseCsv(content) {
        const lines = content.trim().split('\n');
        if (lines.length === 0)
            return [];
        const headers = lines[0].split(',').map(h => h.trim());
        const rows = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            rows.push(row);
        }
        return rows;
    }
    stringifyCsv(data) {
        if (!Array.isArray(data) || data.length === 0)
            return '';
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
    filterData(data, query) {
        return data.filter(item => {
            return Object.entries(query).every(([key, value]) => {
                return item[key] === value;
            });
        });
    }
}
exports.CsvTool = CsvTool;
//# sourceMappingURL=CsvTool.js.map