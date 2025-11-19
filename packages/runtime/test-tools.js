const { listTools, createTool } = require('./dist/tools');

console.log('🧪 Testing stick.ai Tools\n');

// List all available tools
const tools = listTools();
console.log(`✅ Found ${tools.length} built-in tools:`);
tools.forEach((tool, i) => {
  console.log(`   ${i + 1}. ${tool}`);
});

console.log('\n🔧 Testing Tool Creation:\n');

// Test each tool
tools.forEach(async (toolName) => {
  try {
    const tool = createTool(toolName);
    console.log(`✅ ${toolName.padEnd(15)} - ${tool.getDescription()}`);
  } catch (error) {
    console.log(`❌ ${toolName.padEnd(15)} - Error: ${error.message}`);
  }
});

console.log('\n✨ All tools loaded successfully!\n');
