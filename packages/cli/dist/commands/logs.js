"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logsCommand = logsCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function logsCommand(options = {}) {
    const spinner = (0, ora_1.default)();
    try {
        const agentName = options.agent || 'all agents';
        const lines = options.lines || 50;
        spinner.start(`Fetching logs for ${agentName}...`);
        await new Promise((resolve) => setTimeout(resolve, 800));
        spinner.succeed(chalk_1.default.green(`✓ Logs retrieved (last ${lines} lines)`));
        console.log('\n' + chalk_1.default.bold(`Logs: ${agentName}\n`));
        // Simulated log entries
        const logs = [
            { time: '18:45:23', level: 'INFO', msg: 'Agent initialized successfully' },
            { time: '18:45:24', level: 'INFO', msg: 'Loading configuration from agent.json' },
            { time: '18:45:25', level: 'INFO', msg: 'Tools registered: bash, http, file-ops' },
            { time: '18:45:26', level: 'INFO', msg: 'Agent ready to accept requests' },
            { time: '18:45:30', level: 'DEBUG', msg: 'Received request: /api/chat' },
            { time: '18:45:31', level: 'INFO', msg: 'Processing user input' },
            { time: '18:45:32', level: 'DEBUG', msg: 'Tool invoked: http.get' },
            { time: '18:45:33', level: 'INFO', msg: 'Response generated (234ms)' },
            { time: '18:45:35', level: 'WARN', msg: 'Rate limit approaching: 45/60 requests' },
            { time: '18:45:40', level: 'INFO', msg: 'Health check passed' },
        ];
        logs.forEach(log => {
            let levelColor = chalk_1.default.white;
            if (log.level === 'ERROR')
                levelColor = chalk_1.default.red;
            if (log.level === 'WARN')
                levelColor = chalk_1.default.yellow;
            if (log.level === 'INFO')
                levelColor = chalk_1.default.green;
            if (log.level === 'DEBUG')
                levelColor = chalk_1.default.blue;
            console.log(chalk_1.default.dim(log.time) + ' ' +
                levelColor(log.level.padEnd(6)) + ' ' +
                chalk_1.default.white(log.msg));
        });
        if (options.follow) {
            console.log('\n' + chalk_1.default.dim('Streaming logs... (Press Ctrl+C to exit)'));
        }
        console.log('');
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('✗ Failed to fetch logs'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=logs.js.map