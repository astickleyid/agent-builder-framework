"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpTool = void 0;
const BaseTool_1 = require("./BaseTool");
const axios_1 = __importDefault(require("axios"));
class HttpTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'http',
            description: 'Make HTTP requests (GET, POST, PUT, DELETE)',
            parameters: {
                url: 'string',
                method: 'string (GET|POST|PUT|DELETE)',
                headers: 'object (optional)',
                data: 'any (optional)'
            }
        });
    }
    async execute(params) {
        const { url, method = 'GET', headers = {}, data } = params;
        try {
            const config = {
                url,
                method: method,
                headers,
                data,
                timeout: 30000
            };
            const response = await (0, axios_1.default)(config);
            return {
                success: true,
                status: response.status,
                statusText: response.statusText,
                headers: response.headers,
                data: response.data
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                status: error.response?.status,
                data: error.response?.data
            };
        }
    }
}
exports.HttpTool = HttpTool;
//# sourceMappingURL=HttpTool.js.map