/**
 * Lightweight agent implementation for web interface
 * Does not depend on Express or other server-only packages
 */

export interface SimpleAgentConfig {
  name: string;
  description: string;
  provider: string;
  model: string;
  instructions: string;
  temperature: number;
  maxTokens: number;
  tools: string[];
}

export interface LLMConfig {
  provider: string;
  model: string;
  apiKey?: string;
  host?: string;
  temperature: number;
  maxTokens: number;
}

export class SimpleAgent {
  private config: SimpleAgentConfig;
  private llmConfig: LLMConfig | null;
  private conversationHistory: Array<{ role: string; content: string }> = [];

  constructor(config: SimpleAgentConfig, llmConfig: LLMConfig | null = null) {
    this.config = config;
    this.llmConfig = llmConfig;
  }

  async run(input: string): Promise<string> {
    this.conversationHistory.push({ role: 'user', content: input });

    try {
      let response: string;

      if (!this.llmConfig) {
        // Simulation mode
        response = await this.simulateResponse(input);
      } else {
        // Real LLM mode
        response = await this.callLLM(input);
      }

      this.conversationHistory.push({ role: 'assistant', content: response });
      return response;
    } catch (error: any) {
      throw new Error(`Agent execution failed: ${error.message}`);
    }
  }

  private async simulateResponse(input: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));

    // Provide helpful guidance instead of just echoing
    const toolsInfo = this.config.tools.length > 0
      ? `\n\nConfigured tools: ${this.config.tools.join(', ')}`
      : '';

    return `⚠️ Agent Configuration Required\n\nThe agent "${this.config.name}" needs LLM credentials to generate real responses.\n\nProvider: ${this.config.provider}\nModel: ${this.config.model}${toolsInfo}\n\nTo enable real responses, configure your API credentials:\n• For OpenAI: Set OPENAI_API_KEY environment variable\n• For Anthropic: Set ANTHROPIC_API_KEY environment variable\n• For Ollama: Ensure Ollama is running locally (ollama serve)\n\nYour message: "${input}"`;
  }

  private async callLLM(input: string): Promise<string> {
    const provider = this.llmConfig!.provider;

    try {
      if (provider === 'ollama') {
        return await this.callOllama(input);
      } else if (provider === 'openai') {
        return await this.callOpenAI(input);
      } else if (provider === 'anthropic') {
        return await this.callAnthropic(input);
      } else {
        throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error: any) {
      // Fallback to simulation on error
      console.error('LLM call failed:', error);
      return await this.simulateResponse(input);
    }
  }

  private async callOllama(input: string): Promise<string> {
    const host = this.llmConfig!.host || 'http://localhost:11434';
    
    const messages = [
      { role: 'system', content: this.config.instructions },
      ...this.conversationHistory.slice(-10) // Keep last 10 messages
    ];

    const response = await fetch(`${host}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.llmConfig!.model,
        messages,
        stream: false,
        options: {
          temperature: this.llmConfig!.temperature,
          num_predict: this.llmConfig!.maxTokens
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.message?.content || 'No response from Ollama';
  }

  private async callOpenAI(input: string): Promise<string> {
    const apiKey = this.llmConfig!.apiKey;
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const messages = [
      { role: 'system', content: this.config.instructions },
      ...this.conversationHistory.slice(-10)
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: this.llmConfig!.model,
        messages,
        temperature: this.llmConfig!.temperature,
        max_tokens: this.llmConfig!.maxTokens
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response from OpenAI';
  }

  private async callAnthropic(input: string): Promise<string> {
    const apiKey = this.llmConfig!.apiKey;
    if (!apiKey) {
      throw new Error('Anthropic API key not configured');
    }

    const messages = this.conversationHistory.slice(-10);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.llmConfig!.model,
        max_tokens: this.llmConfig!.maxTokens,
        temperature: this.llmConfig!.temperature,
        system: this.config.instructions,
        messages
      })
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.content[0]?.text || 'No response from Anthropic';
  }

  getHistory() {
    return this.conversationHistory;
  }
}
