"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUILT_IN_TOOLS = exports.OllamaTool = exports.AnthropicTool = exports.OpenAITool = exports.TextTool = exports.DateTimeTool = exports.XmlTool = exports.SlackTool = exports.GitHubTool = exports.CsvTool = exports.WebScraperTool = exports.EmailTool = exports.DatabaseTool = exports.PythonTool = exports.JsonTool = exports.FileOpsTool = exports.HttpTool = exports.BashTool = exports.BaseTool = void 0;
exports.createTool = createTool;
exports.listTools = listTools;
var BaseTool_1 = require("./BaseTool");
Object.defineProperty(exports, "BaseTool", { enumerable: true, get: function () { return BaseTool_1.BaseTool; } });
var BashTool_1 = require("./BashTool");
Object.defineProperty(exports, "BashTool", { enumerable: true, get: function () { return BashTool_1.BashTool; } });
var HttpTool_1 = require("./HttpTool");
Object.defineProperty(exports, "HttpTool", { enumerable: true, get: function () { return HttpTool_1.HttpTool; } });
var FileOpsTool_1 = require("./FileOpsTool");
Object.defineProperty(exports, "FileOpsTool", { enumerable: true, get: function () { return FileOpsTool_1.FileOpsTool; } });
var JsonTool_1 = require("./JsonTool");
Object.defineProperty(exports, "JsonTool", { enumerable: true, get: function () { return JsonTool_1.JsonTool; } });
var PythonTool_1 = require("./PythonTool");
Object.defineProperty(exports, "PythonTool", { enumerable: true, get: function () { return PythonTool_1.PythonTool; } });
var DatabaseTool_1 = require("./DatabaseTool");
Object.defineProperty(exports, "DatabaseTool", { enumerable: true, get: function () { return DatabaseTool_1.DatabaseTool; } });
var EmailTool_1 = require("./EmailTool");
Object.defineProperty(exports, "EmailTool", { enumerable: true, get: function () { return EmailTool_1.EmailTool; } });
var WebScraperTool_1 = require("./WebScraperTool");
Object.defineProperty(exports, "WebScraperTool", { enumerable: true, get: function () { return WebScraperTool_1.WebScraperTool; } });
var CsvTool_1 = require("./CsvTool");
Object.defineProperty(exports, "CsvTool", { enumerable: true, get: function () { return CsvTool_1.CsvTool; } });
var GitHubTool_1 = require("./GitHubTool");
Object.defineProperty(exports, "GitHubTool", { enumerable: true, get: function () { return GitHubTool_1.GitHubTool; } });
var SlackTool_1 = require("./SlackTool");
Object.defineProperty(exports, "SlackTool", { enumerable: true, get: function () { return SlackTool_1.SlackTool; } });
var XmlTool_1 = require("./XmlTool");
Object.defineProperty(exports, "XmlTool", { enumerable: true, get: function () { return XmlTool_1.XmlTool; } });
var DateTimeTool_1 = require("./DateTimeTool");
Object.defineProperty(exports, "DateTimeTool", { enumerable: true, get: function () { return DateTimeTool_1.DateTimeTool; } });
var TextTool_1 = require("./TextTool");
Object.defineProperty(exports, "TextTool", { enumerable: true, get: function () { return TextTool_1.TextTool; } });
var OpenAITool_1 = require("./OpenAITool");
Object.defineProperty(exports, "OpenAITool", { enumerable: true, get: function () { return OpenAITool_1.OpenAITool; } });
var AnthropicTool_1 = require("./AnthropicTool");
Object.defineProperty(exports, "AnthropicTool", { enumerable: true, get: function () { return AnthropicTool_1.AnthropicTool; } });
var OllamaTool_1 = require("./OllamaTool");
Object.defineProperty(exports, "OllamaTool", { enumerable: true, get: function () { return OllamaTool_1.OllamaTool; } });
const BashTool_2 = require("./BashTool");
const HttpTool_2 = require("./HttpTool");
const FileOpsTool_2 = require("./FileOpsTool");
const JsonTool_2 = require("./JsonTool");
const PythonTool_2 = require("./PythonTool");
const DatabaseTool_2 = require("./DatabaseTool");
const EmailTool_2 = require("./EmailTool");
const WebScraperTool_2 = require("./WebScraperTool");
const CsvTool_2 = require("./CsvTool");
const GitHubTool_2 = require("./GitHubTool");
const SlackTool_2 = require("./SlackTool");
const XmlTool_2 = require("./XmlTool");
const DateTimeTool_2 = require("./DateTimeTool");
const TextTool_2 = require("./TextTool");
const OpenAITool_2 = require("./OpenAITool");
const AnthropicTool_2 = require("./AnthropicTool");
const OllamaTool_2 = require("./OllamaTool");
// Export registry for easy tool loading
exports.BUILT_IN_TOOLS = {
    bash: BashTool_2.BashTool,
    http: HttpTool_2.HttpTool,
    'file-ops': FileOpsTool_2.FileOpsTool,
    json: JsonTool_2.JsonTool,
    python: PythonTool_2.PythonTool,
    database: DatabaseTool_2.DatabaseTool,
    email: EmailTool_2.EmailTool,
    'web-scraper': WebScraperTool_2.WebScraperTool,
    csv: CsvTool_2.CsvTool,
    github: GitHubTool_2.GitHubTool,
    slack: SlackTool_2.SlackTool,
    xml: XmlTool_2.XmlTool,
    datetime: DateTimeTool_2.DateTimeTool,
    text: TextTool_2.TextTool,
    openai: OpenAITool_2.OpenAITool,
    anthropic: AnthropicTool_2.AnthropicTool,
    ollama: OllamaTool_2.OllamaTool,
};
function createTool(name) {
    const ToolClass = exports.BUILT_IN_TOOLS[name];
    if (!ToolClass) {
        throw new Error(`Unknown tool: ${name}`);
    }
    return new ToolClass();
}
// List all available tools
function listTools() {
    return Object.keys(exports.BUILT_IN_TOOLS);
}
//# sourceMappingURL=index.js.map