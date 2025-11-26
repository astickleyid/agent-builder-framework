#!/usr/bin/env node
/**
 * Test script to verify agent works with Ollama
 * Run: node test-agent-ollama.js
 */

const { createIntelligentAgent } = require('./packages/runtime/dist/index.js');

async function testOllamaAgent() {
  console.log('🤖 Testing stick.ai Agent with Ollama...\n');
  
  try {
    // Create agent with Ollama
    const agent = await createIntelligentAgent(
      {
        name: 'TestAgent',
        instructions: 'You are a helpful assistant. Be concise.',
        tools: ['datetime', 'calculator']
      },
      {
        provider: 'ollama',
        model: 'llama3.2:1b',
        host: 'http://localhost:11434',
        temperature: 0.7,
        maxTokens: 500
      }
    );
    
    console.log('✅ Agent created successfully\n');
    
    // Test basic question
    console.log('📝 Question: "What is 15 + 27?"');
    const response = await agent.run('What is 15 + 27?');
    console.log('💬 Response:', response);
    console.log('\n✅ Ollama integration working!\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('\nMake sure:');
    console.error('1. Ollama is running: ollama serve');
    console.error('2. Model is installed: ollama pull llama3.2:1b');
    process.exit(1);
  }
}

testOllamaAgent();
