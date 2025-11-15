import Anthropic from '@anthropic-ai/sdk';
import { LLMConfig, LLMProvider, LLMResponse, StreamChunk } from './types';
import { Message } from '../runtime';

export class AnthropicProvider implements LLMProvider {
  private client: Anthropic;
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
    this.client = new Anthropic({
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
      baseURL: config.baseURL,
    });
  }

  async generateResponse(
    messages: Message[],
    systemPrompt?: string
  ): Promise<LLMResponse> {
    const anthropicMessages: Anthropic.MessageParam[] = [];

    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'agent') {
        anthropicMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    const response = await this.client.messages.create({
      model: this.config.model || 'claude-3-5-sonnet-20241022',
      max_tokens: this.config.maxTokens ?? 4000,
      temperature: this.config.temperature ?? 0.7,
      system: systemPrompt,
      messages: anthropicMessages,
    });

    const content =
      response.content[0]?.type === 'text' ? response.content[0].text : '';

    return {
      content,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens,
      },
    };
  }

  async streamResponse(
    messages: Message[],
    onChunk: (chunk: StreamChunk) => void,
    systemPrompt?: string
  ): Promise<void> {
    const anthropicMessages: Anthropic.MessageParam[] = [];

    for (const msg of messages) {
      if (msg.role === 'user' || msg.role === 'agent') {
        anthropicMessages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content,
        });
      }
    }

    const stream = await this.client.messages.create({
      model: this.config.model || 'claude-3-5-sonnet-20241022',
      max_tokens: this.config.maxTokens ?? 4000,
      temperature: this.config.temperature ?? 0.7,
      system: systemPrompt,
      messages: anthropicMessages,
      stream: true,
    });

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        onChunk({ content: event.delta.text, done: false });
      }
    }

    onChunk({ content: '', done: true });
  }
}
