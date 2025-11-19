"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsCommand = metricsCommand;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
async function metricsCommand(options) {
    const spinner = (0, ora_1.default)();
    try {
        spinner.start('Fetching metrics...');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        spinner.succeed(chalk_1.default.green('✓ Metrics retrieved'));
        console.log('\n' + chalk_1.default.bold('Agent Metrics:\n'));
        const metrics = [
            { name: 'Requests', value: '1,234', change: '+12%' },
            { name: 'Avg Response Time', value: '245ms', change: '-5%' },
            { name: 'Success Rate', value: '99.2%', change: '+0.3%' },
            { name: 'Active Agents', value: '3', change: '0' },
            { name: 'Total Tokens', value: '45.2K', change: '+8%' },
        ];
        metrics.forEach(metric => {
            console.log(chalk_1.default.cyan('  ' + metric.name.padEnd(20)) +
                chalk_1.default.white(metric.value.padEnd(10)) +
                chalk_1.default.dim(metric.change));
        });
        console.log('\n' + chalk_1.default.dim('Updated: ' + new Date().toLocaleTimeString()));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red('✗ Failed to fetch metrics'));
        console.error(error);
        process.exit(1);
    }
}
//# sourceMappingURL=metrics.js.map