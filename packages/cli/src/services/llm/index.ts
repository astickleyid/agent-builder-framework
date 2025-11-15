import { LLMConfig, LLMProvider } from './types';
import { OpenAIProvider } from './openai-provider';
import { AnthropicProvider } from './anthropic-provider';
import { OllamaProvider } from './ollama-provider';

export function createLLMProvider(config: LLMConfig): LLMProvider {
  switch (config.provider) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    case 'ollama':
      return new OllamaProvider(config);
    default:
      throw new Error(`Unsupported LLM provider: ${config.provider}`);
  }
}

export * from './types';
export { OpenAIProvider } from './openai-provider';
export { AnthropicProvider } from './anthropic-provider';
export { OllamaProvider } from './ollama-provider';
