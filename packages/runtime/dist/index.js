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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
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
exports.VERSION = exports.IntelligentAgent = exports.Agent = void 0;
exports.createAgent = createAgent;
exports.createIntelligentAgent = createIntelligentAgent;
var Agent_1 = require("./agent/Agent");
Object.defineProperty(exports, "Agent", { enumerable: true, get: function () { return Agent_1.Agent; } });
var IntelligentAgent_1 = require("./agent/IntelligentAgent");
Object.defineProperty(exports, "IntelligentAgent", { enumerable: true, get: function () { return IntelligentAgent_1.IntelligentAgent; } });
__exportStar(require("./tools"), exports);
// Version info
exports.VERSION = '1.1.0';
// Easy agent creation
async function createAgent(config) {
    const { Agent } = await Promise.resolve().then(() => __importStar(require('./agent/Agent')));
    return new Agent(config);
}
// Create intelligent agent with LLM
async function createIntelligentAgent(config, llmConfig) {
    const { IntelligentAgent } = await Promise.resolve().then(() => __importStar(require('./agent/IntelligentAgent')));
    return new IntelligentAgent(config, llmConfig);
}
//# sourceMappingURL=index.js.map