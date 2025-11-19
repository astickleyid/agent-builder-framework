/**
 * Tool Usage Examples
 */

const { createTool, listTools } = require('../dist');

async function main() {
  console.log('🛠️  Tool Usage Examples\n');

  // List all tools
  const tools = listTools();
  console.log(`Total tools available: ${tools.length}`);
  console.log('Tools:', tools.join(', '));
  console.log();

  // Example 1: Text Tool
  console.log('1. Text Tool - Count words');
  const textTool = createTool('text');
  const countResult = await textTool.execute({
    operation: 'count',
    text: 'Hello world from stick.ai!'
  });
  console.log('Result:', countResult);
  console.log();

  // Example 2: DateTime Tool
  console.log('2. DateTime Tool - Get current time');
  const dtTool = createTool('datetime');
  const timeResult = await dtTool.execute({ operation: 'now' });
  console.log('Result:', timeResult);
  console.log();

  console.log('✨ All examples complete!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
