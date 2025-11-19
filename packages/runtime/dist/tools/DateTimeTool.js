"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTimeTool = void 0;
const BaseTool_1 = require("./BaseTool");
class DateTimeTool extends BaseTool_1.BaseTool {
    constructor() {
        super({
            name: 'datetime',
            description: 'Date and time operations (format, parse, calculate)',
            parameters: {
                operation: 'string (now|format|parse|add|subtract|diff)',
                date: 'string (ISO date string)',
                format: 'string (date format)',
                amount: 'number (for add/subtract)',
                unit: 'string (years|months|days|hours|minutes|seconds)'
            }
        });
    }
    async execute(params) {
        const { operation, date, format, amount, unit, date2 } = params;
        try {
            switch (operation) {
                case 'now':
                    return {
                        success: true,
                        timestamp: Date.now(),
                        iso: new Date().toISOString(),
                        formatted: new Date().toLocaleString()
                    };
                case 'format':
                    if (!date) {
                        throw new Error('date required for format operation');
                    }
                    const d = new Date(date);
                    return {
                        success: true,
                        iso: d.toISOString(),
                        locale: d.toLocaleString(),
                        utc: d.toUTCString(),
                        timestamp: d.getTime()
                    };
                case 'parse':
                    if (!date) {
                        throw new Error('date required for parse operation');
                    }
                    const parsed = new Date(date);
                    return {
                        success: true,
                        timestamp: parsed.getTime(),
                        iso: parsed.toISOString(),
                        year: parsed.getFullYear(),
                        month: parsed.getMonth() + 1,
                        day: parsed.getDate(),
                        hours: parsed.getHours(),
                        minutes: parsed.getMinutes(),
                        seconds: parsed.getSeconds()
                    };
                case 'add':
                case 'subtract':
                    if (!date || amount === undefined || !unit) {
                        throw new Error('date, amount, and unit required');
                    }
                    const baseDate = new Date(date);
                    const multiplier = operation === 'subtract' ? -1 : 1;
                    const ms = this.unitToMs(unit, amount * multiplier);
                    const resultDate = new Date(baseDate.getTime() + ms);
                    return {
                        success: true,
                        original: date,
                        result: resultDate.toISOString(),
                        operation: `${operation} ${amount} ${unit}`
                    };
                case 'diff':
                    if (!date || !date2) {
                        throw new Error('date and date2 required for diff operation');
                    }
                    const d1 = new Date(date);
                    const d2 = new Date(date2);
                    const diffMs = Math.abs(d2.getTime() - d1.getTime());
                    return {
                        success: true,
                        milliseconds: diffMs,
                        seconds: Math.floor(diffMs / 1000),
                        minutes: Math.floor(diffMs / (1000 * 60)),
                        hours: Math.floor(diffMs / (1000 * 60 * 60)),
                        days: Math.floor(diffMs / (1000 * 60 * 60 * 24))
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
    unitToMs(unit, amount) {
        const multipliers = {
            seconds: 1000,
            minutes: 1000 * 60,
            hours: 1000 * 60 * 60,
            days: 1000 * 60 * 60 * 24,
            months: 1000 * 60 * 60 * 24 * 30,
            years: 1000 * 60 * 60 * 24 * 365
        };
        return (multipliers[unit] || 0) * amount;
    }
}
exports.DateTimeTool = DateTimeTool;
//# sourceMappingURL=DateTimeTool.js.map