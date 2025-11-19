"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseTool = void 0;
class BaseTool {
    config;
    constructor(config) {
        this.config = config;
    }
    getName() {
        return this.config.name;
    }
    getDescription() {
        return this.config.description;
    }
    getConfig() {
        return this.config;
    }
}
exports.BaseTool = BaseTool;
//# sourceMappingURL=BaseTool.js.map