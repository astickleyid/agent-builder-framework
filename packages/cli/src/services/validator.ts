import { AgentConfig } from './registry';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ConfigValidator {
  static validate(config: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!config.name) {
      errors.push('Agent name is required');
    } else if (typeof config.name !== 'string') {
      errors.push('Agent name must be a string');
    } else if (!/^[a-z0-9-]+$/.test(config.name)) {
      errors.push('Agent name must contain only lowercase letters, numbers, and hyphens');
    }

    if (!config.version) {
      errors.push('Agent version is required');
    } else if (typeof config.version !== 'string') {
      errors.push('Agent version must be a string');
    }

    if (!config.description) {
      warnings.push('Agent description is recommended');
    }

    // Capabilities validation
    if (config.capabilities) {
      if (!Array.isArray(config.capabilities)) {
        errors.push('capabilities must be an array');
      } else if (config.capabilities.length === 0) {
        warnings.push('No capabilities defined');
      }
    } else {
      warnings.push('capabilities field is recommended');
    }

    // Tools validation
    if (config.tools) {
      if (!Array.isArray(config.tools)) {
        errors.push('tools must be an array');
      }
    }

    // Instructions validation
    if (!config.instructions) {
      warnings.push('Agent instructions are recommended for better behavior');
    } else if (typeof config.instructions !== 'string') {
      errors.push('instructions must be a string');
    }

    // Environment validation
    if (config.environment) {
      if (typeof config.environment !== 'object') {
        errors.push('environment must be an object');
      } else {
        if (config.environment.maxTokens !== undefined) {
          if (typeof config.environment.maxTokens !== 'number') {
            errors.push('environment.maxTokens must be a number');
          } else if (config.environment.maxTokens <= 0) {
            errors.push('environment.maxTokens must be positive');
          } else if (config.environment.maxTokens > 100000) {
            warnings.push('environment.maxTokens is very large, may cause issues');
          }
        }

        if (config.environment.temperature !== undefined) {
          if (typeof config.environment.temperature !== 'number') {
            errors.push('environment.temperature must be a number');
          } else if (config.environment.temperature < 0 || config.environment.temperature > 2) {
            errors.push('environment.temperature must be between 0 and 2');
          }
        }
      }
    }

    // LLM configuration validation
    if (config.llm) {
      if (typeof config.llm !== 'object') {
        errors.push('llm must be an object');
      } else {
        const validProviders = ['openai', 'anthropic', 'ollama', 'none'];
        if (!config.llm.provider) {
          warnings.push('llm.provider is not set, agent will use fallback responses');
        } else if (!validProviders.includes(config.llm.provider)) {
          errors.push(`llm.provider must be one of: ${validProviders.join(', ')}`);
        }

        if (config.llm.provider && config.llm.provider !== 'none') {
          if (!config.llm.model && !process.env.LLM_MODEL) {
            warnings.push(`llm.model is recommended for ${config.llm.provider} provider`);
          }

          // API key validation based on provider
          if (config.llm.provider === 'openai' && !config.llm.apiKey && !process.env.OPENAI_API_KEY) {
            warnings.push('OpenAI API key not found. Set llm.apiKey or OPENAI_API_KEY environment variable');
          }

          if (config.llm.provider === 'anthropic' && !config.llm.apiKey && !process.env.ANTHROPIC_API_KEY) {
            warnings.push('Anthropic API key not found. Set llm.apiKey or ANTHROPIC_API_KEY environment variable');
          }

          if (config.llm.provider === 'ollama' && !config.llm.baseURL && !process.env.OLLAMA_HOST) {
            warnings.push('Ollama host not configured. Using default http://localhost:11434');
          }
        }
      }
    } else {
      warnings.push('llm configuration not found, agent will use fallback responses');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static isValidAgentConfig(config: any): config is AgentConfig {
    const result = this.validate(config);
    return result.valid;
  }
}
