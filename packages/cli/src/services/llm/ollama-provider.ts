import { Ollama } from 'ollama';
import { LLMConfig, LLMProvider, LLMResponse, StreamChunk } from './types';
import { Message } from '../runtime';

export class OllamaProvider implements LLMProvider {
  private client: Ollama;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.client = new Ollama({
      host: config.baseURL || process.env.OLLAMA_HOST || 'http://localhost:11434',
    });
  }

  async generateResponse(
    messages: Message[],
    systemPrompt?: string
  ): Promise<LLMResponse> {
    const ollamaMessages: { role: string; content: string }[] = [];

    if (systemPrompt) {
      ollamaMessages.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'agent') {
        ollamaMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    const response = await this.client.chat({
      model: this.config.model || 'llama3.2',
      messages: ollamaMessages,
      options: {
        temperature: this.config.temperature ?? 0.7,
        num_predict: this.config.maxTokens ?? 4000,
      },
    });

    return {
      content: response.message.content,
      usage: response.prompt_eval_count && response.eval_count
        ? {
            promptTokens: response.prompt_eval_count,
            completionTokens: response.eval_count,
            totalTokens: response.prompt_eval_count + response.eval_count,
          }
        : undefined,
    };
  }

  async streamResponse(
    messages: Message[],
    onChunk: (chunk: StreamChunk) => void,
    systemPrompt?: string
  ): Promise<void> {
    const ollamaMessages: { role: string; content: string }[] = [];

    if (systemPrompt) {
      ollamaMessages.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'agent') {
        ollamaMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    const stream = await this.client.chat({
      model: this.config.model || 'llama3.2',
      messages: ollamaMessages,
      options: {
        temperature: this.config.temperature ?? 0.7,
        num_predict: this.config.maxTokens ?? 4000,
      },
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.message?.content) {
        onChunk({ content: chunk.message.content, done: false });
      }
      if (chunk.done) {
        onChunk({ content: '', done: true });
      }
    }
  }
}
