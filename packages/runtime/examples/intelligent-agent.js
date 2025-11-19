/**
 * Intelligent Agent Example
 * 
 * This demonstrates an agent that can think and use tools
 * using LLMs (OpenAI, Anthropic, or Ollama)
 */

const { IntelligentAgent } = require('../dist');

async function main() {
  console.log('🤖 Intelligent Agent Demo\n');

  // Example: Using Ollama (local, no API key needed)
  console.log('Creating local AI agent with Ollama...\n');
  
  const agent = new IntelligentAgent(
    {
      name: 'local-agent',
      version: '1.0.0',
      description: 'AI agent powered by local LLM',
      capabilities: ['chat', 'tool-use'],
      tools: ['datetime', 'text'],
      instructions: 'You are a helpful local AI assistant. You can use tools to help users.',
      environment: {
        maxTokens: 500,
        temperature: 0.7
      }
    },
    {
      provider: 'ollama',
      model: 'llama2',
      host: 'http://localhost:11434'
    }
  );

  console.log('Agent created successfully!');
  console.log('Config:', agent.getConfig());
  console.log('LLM:', agent.getLLMConfig());
  console.log('\nNote: This example requires Ollama running locally');
  console.log('Install: https://ollama.ai');
  console.log('Start: ollama serve\n');

  console.log('✨ Demo complete!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
