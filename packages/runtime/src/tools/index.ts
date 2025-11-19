export { BaseTool, ToolConfig } from './BaseTool';
export { BashTool } from './BashTool';
export { HttpTool } from './HttpTool';
export { FileOpsTool } from './FileOpsTool';
export { JsonTool } from './JsonTool';
export { PythonTool } from './PythonTool';
export { DatabaseTool } from './DatabaseTool';
export { EmailTool } from './EmailTool';
export { WebScraperTool } from './WebScraperTool';
export { CsvTool } from './CsvTool';
export { GitHubTool } from './GitHubTool';
export { SlackTool } from './SlackTool';
export { XmlTool } from './XmlTool';
export { DateTimeTool } from './DateTimeTool';
export { TextTool } from './TextTool';
export { OpenAITool } from './OpenAITool';
export { AnthropicTool } from './AnthropicTool';
export { OllamaTool } from './OllamaTool';

import { BashTool } from './BashTool';
import { HttpTool } from './HttpTool';
import { FileOpsTool } from './FileOpsTool';
import { JsonTool } from './JsonTool';
import { PythonTool } from './PythonTool';
import { DatabaseTool } from './DatabaseTool';
import { EmailTool } from './EmailTool';
import { WebScraperTool } from './WebScraperTool';
import { CsvTool } from './CsvTool';
import { GitHubTool } from './GitHubTool';
import { SlackTool } from './SlackTool';
import { XmlTool } from './XmlTool';
import { DateTimeTool } from './DateTimeTool';
import { TextTool } from './TextTool';
import { OpenAITool } from './OpenAITool';
import { AnthropicTool } from './AnthropicTool';
import { OllamaTool } from './OllamaTool';

// Export registry for easy tool loading
export const BUILT_IN_TOOLS = {
  bash: BashTool,
  http: HttpTool,
  'file-ops': FileOpsTool,
  json: JsonTool,
  python: PythonTool,
  database: DatabaseTool,
  email: EmailTool,
  'web-scraper': WebScraperTool,
  csv: CsvTool,
  github: GitHubTool,
  slack: SlackTool,
  xml: XmlTool,
  datetime: DateTimeTool,
  text: TextTool,
  openai: OpenAITool,
  anthropic: AnthropicTool,
  ollama: OllamaTool,
};

export function createTool(name: string): any {
  const ToolClass = BUILT_IN_TOOLS[name as keyof typeof BUILT_IN_TOOLS];
  if (!ToolClass) {
    throw new Error(`Unknown tool: ${name}`);
  }
  return new ToolClass();
}

// List all available tools
export function listTools(): string[] {
  return Object.keys(BUILT_IN_TOOLS);
}
