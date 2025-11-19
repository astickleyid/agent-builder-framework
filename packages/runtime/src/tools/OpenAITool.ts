import { BaseTool } from './BaseTool';
import axios from 'axios';

export class OpenAITool extends BaseTool {
  constructor() {
    super({
      name: 'openai',
      description: 'Interact with OpenAI API (GPT-4, GPT-3.5, embeddings)',
      parameters: {
        operation: 'string (chat|completion|embedding|image)',
        apiKey: 'string (OpenAI API key)',
        model: 'string (gpt-4, gpt-3.5-turbo, etc)',
        messages: 'array (for chat)',
        prompt: 'string (for completion)',
        temperature: 'number (0-2, optional)',
        maxTokens: 'number (optional)'
      }
    });
  }

  async execute(params: {
    operation: 'chat' | 'completion' | 'embedding' | 'image';
    apiKey: string;
    model?: string;
    messages?: Array<{ role: string; content: string }>;
    prompt?: string;
    temperature?: number;
    maxTokens?: number;
    text?: string;
  }): Promise<any> {
    const {
      operation,
      apiKey,
      model = 'gpt-3.5-turbo',
      messages,
      prompt,
      temperature = 0.7,
      maxTokens = 1000,
      text
    } = params;

    try {
      const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };

      switch (operation) {
        case 'chat':
          if (!messages || messages.length === 0) {
            throw new Error('messages required for chat operation');
          }

          const chatResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model,
              messages,
              temperature,
              max_tokens: maxTokens
            },
            { headers }
          );

          return {
            success: true,
            response: chatResponse.data.choices[0].message.content,
            usage: chatResponse.data.usage,
            model: chatResponse.data.model
          };

        case 'completion':
          if (!prompt) {
            throw new Error('prompt required for completion operation');
          }

          const completionResponse = await axios.post(
            'https://api.openai.com/v1/completions',
            {
              model: model === 'gpt-3.5-turbo' ? 'gpt-3.5-turbo-instruct' : model,
              prompt,
              temperature,
              max_tokens: maxTokens
            },
            { headers }
          );

          return {
            success: true,
            response: completionResponse.data.choices[0].text,
            usage: completionResponse.data.usage
          };

        case 'embedding':
          if (!text) {
            throw new Error('text required for embedding operation');
          }

          const embeddingResponse = await axios.post(
            'https://api.openai.com/v1/embeddings',
            {
              model: 'text-embedding-ada-002',
              input: text
            },
            { headers }
          );

          return {
            success: true,
            embedding: embeddingResponse.data.data[0].embedding,
            usage: embeddingResponse.data.usage
          };

        case 'image':
          if (!prompt) {
            throw new Error('prompt required for image operation');
          }

          const imageResponse = await axios.post(
            'https://api.openai.com/v1/images/generations',
            {
              prompt,
              n: 1,
              size: '1024x1024'
            },
            { headers }
          );

          return {
            success: true,
            url: imageResponse.data.data[0].url
          };

        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        status: error.response?.status,
        details: error.response?.data
      };
    }
  }
}
