import OpenAI from 'openai';
import { LLMConfig, LLMProvider, LLMResponse, StreamChunk } from './types';
import { Message } from '../runtime';

export class OpenAIProvider implements LLMProvider {
  private client: OpenAI;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.client = new OpenAI({
      apiKey: config.apiKey || process.env.OPENAI_API_KEY,
      baseURL: config.baseURL,
    });
  }

  async generateResponse(
    messages: Message[],
    systemPrompt?: string
  ): Promise<LLMResponse> {
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      openaiMessages.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'agent') {
        openaiMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    const response = await this.client.chat.completions.create({
      model: this.config.model || 'gpt-4o-mini',
      messages: openaiMessages,
      temperature: this.config.temperature ?? 0.7,
      max_tokens: this.config.maxTokens ?? 4000,
    });

    return {
      content: response.choices[0]?.message?.content || '',
      usage: response.usage
        ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          }
        : undefined,
    };
  }

  async streamResponse(
    messages: Message[],
    onChunk: (chunk: StreamChunk) => void,
    systemPrompt?: string
  ): Promise<void> {
    const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [];

    if (systemPrompt) {
      openaiMessages.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'agent') {
        openaiMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    const stream = await this.client.chat.completions.create({
      model: this.config.model || 'gpt-4o-mini',
      messages: openaiMessages,
      temperature: this.config.temperature ?? 0.7,
      max_tokens: this.config.maxTokens ?? 4000,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk({ content, done: false });
      }
    }

    onChunk({ content: '', done: true });
  }
}
