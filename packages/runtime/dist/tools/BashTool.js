"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BashTool = void 0;
const BaseTool_1 = require("./BaseTool");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class BashTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'bash',
            description: 'Execute bash commands in a sandboxed environment',
            parameters: {
                command: 'string',
                timeout: 'number (optional, default: 30000ms)'
            }
        });
    }
    async execute(params) {
        const { command, timeout = 30000 } = params;
        try {
            const { stdout, stderr } = await execAsync(command, {
                timeout,
                maxBuffer: 1024 * 1024 // 1MB
            });
            return {
                success: true,
                stdout,
                stderr,
                command
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                command
            };
        }
    }
}
exports.BashTool = BashTool;
//# sourceMappingURL=BashTool.js.map