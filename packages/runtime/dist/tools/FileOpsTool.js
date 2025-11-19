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
exports.FileOpsTool = void 0;
const BaseTool_1 = require("./BaseTool");
const fs = __importStar(require("fs/promises"));
class FileOpsTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'file-ops',
            description: 'File operations (read, write, delete, list)',
            parameters: {
                operation: 'string (read|write|delete|list)',
                path: 'string',
                content: 'string (for write)',
            }
        });
    }
    async execute(params) {
        const { operation, path: filePath, content } = params;
        try {
            switch (operation) {
                case 'read':
                    const data = await fs.readFile(filePath, 'utf-8');
                    return { success: true, content: data };
                case 'write':
                    if (!content) {
                        throw new Error('Content is required for write operation');
                    }
                    await fs.writeFile(filePath, content, 'utf-8');
                    return { success: true, message: 'File written successfully' };
                case 'delete':
                    await fs.unlink(filePath);
                    return { success: true, message: 'File deleted successfully' };
                case 'list':
                    const files = await fs.readdir(filePath);
                    return { success: true, files };
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
}
exports.FileOpsTool = FileOpsTool;
//# sourceMappingURL=FileOpsTool.js.map