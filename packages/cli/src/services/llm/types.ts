import { Message } from '../runtime';

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'ollama';
  model?: string;
  apiKey?: string;
  baseURL?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface StreamChunk {
  content: string;
  done: boolean;
}

export interface LLMProvider {
  generateResponse(
    messages: Message[],
    systemPrompt?: string
  ): Promise<LLMResponse>;
  
  streamResponse(
    messages: Message[],
    onChunk: (chunk: StreamChunk) => void,
    systemPrompt?: string
  ): Promise<void>;
}
