import { BaseTool } from './BaseTool';
import axios from 'axios';

export class OllamaTool extends BaseTool {
  constructor() {
    super({
      name: 'ollama',
      description: 'Interact with local Ollama LLM server',
      parameters: {
        operation: 'string (chat|generate|list|pull)',
        model: 'string (llama2, mistral, codellama, etc)',
        messages: 'array (for chat)',
        prompt: 'string (for generate)',
        host: 'string (optional, default: http://localhost:11434)',
        temperature: 'number (optional)',
        stream: 'boolean (optional, default: false)'
      }
    });
  }

  async execute(params: {
    operation: 'chat' | 'generate' | 'list' | 'pull';
    model?: string;
    messages?: Array<{ role: string; content: string }>;
    prompt?: string;
    host?: string;
    temperature?: number;
    stream?: boolean;
  }): Promise<any> {
    const {
      operation,
      model = 'llama2',
      messages,
      prompt,
      host = 'http://localhost:11434',
      temperature,
      stream = false
    } = params;

    try {
      switch (operation) {
        case 'chat':
          if (!messages || messages.length === 0) {
            throw new Error('messages required for chat operation');
          }

          const chatResponse = await axios.post(
            `${host}/api/chat`,
            {
              model,
              messages,
              stream,
              options: {
                ...(temperature !== undefined && { temperature })
              }
            },
            { timeout: 60000 } // 60 second timeout for LLM
          );

          return {
            success: true,
            response: chatResponse.data.message?.content || chatResponse.data.response,
            model: chatResponse.data.model,
            done: chatResponse.data.done
          };

        case 'generate':
          if (!prompt) {
            throw new Error('prompt required for generate operation');
          }

          const generateResponse = await axios.post(
            `${host}/api/generate`,
            {
              model,
              prompt,
              stream,
              options: {
                ...(temperature !== undefined && { temperature })
              }
            },
            { timeout: 60000 }
          );

          return {
            success: true,
            response: generateResponse.data.response,
            model: generateResponse.data.model,
            done: generateResponse.data.done
          };

        case 'list':
          const listResponse = await axios.get(`${host}/api/tags`);

          return {
            success: true,
            models: listResponse.data.models || []
          };

        case 'pull':
          if (!model) {
            throw new Error('model required for pull operation');
          }

          const pullResponse = await axios.post(
            `${host}/api/pull`,
            { name: model },
            { timeout: 300000 } // 5 minute timeout for pulling
          );

          return {
            success: true,
            status: pullResponse.data.status,
            model
          };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        details: error.response?.data
      };
    }
  }
}
