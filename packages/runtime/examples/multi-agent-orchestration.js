/**
 * Multi-Agent Orchestration Example
 * 
 * This example demonstrates the AgentOrchestrator class with different workflow patterns:
 * 1. Sequential execution
 * 2. Parallel execution
 * 3. Conditional routing
 * 4. Supervisor pattern
 */

const { Agent, AgentOrchestrator } = require('../dist/index');

// Create specialized agents
const dataCollector = new Agent({
  name: 'data-collector',
  version: '1.0.0',
  description: 'Collects data from various sources',
  tools: ['http', 'database'],
  capabilities: ['data-fetching', 'api-calls'],
  instructions: 'Collect and aggregate data from multiple sources',
  environment: {}
});

const dataAnalyzer = new Agent({
  name: 'data-analyzer',
  version: '1.0.0',
  description: 'Analyzes collected data',
  tools: ['python', 'csv'],
  capabilities: ['analysis', 'statistics'],
  instructions: 'Perform statistical analysis on the data',
  environment: {}
});

const reportGenerator = new Agent({
  name: 'report-generator',
  version: '1.0.0',
  description: 'Generates reports from analyzed data',
  tools: ['text', 'file-ops'],
  capabilities: ['reporting', 'visualization'],
  instructions: 'Create comprehensive reports with visualizations',
  environment: {}
});

const qualityChecker = new Agent({
  name: 'quality-checker',
  version: '1.0.0',
  description: 'Validates data quality',
  tools: ['json'],
  capabilities: ['validation', 'quality-control'],
  instructions: 'Check data quality and flag issues',
  environment: {}
});

const supervisor = new Agent({
  name: 'supervisor',
  version: '1.0.0',
  description: 'Coordinates multiple agents',
  tools: [],
  capabilities: ['coordination', 'decision-making'],
  instructions: 'Coordinate multiple agents and make decisions',
  environment: {}
});

async function main() {
  console.log('🚀 Multi-Agent Orchestration Demo\n');

  // Create orchestrator
  const orchestrator = new AgentOrchestrator();

  // Register all agents
  orchestrator.registerAgent(dataCollector);
  orchestrator.registerAgent(dataAnalyzer);
  orchestrator.registerAgent(reportGenerator);
  orchestrator.registerAgent(qualityChecker);
  orchestrator.registerAgent(supervisor);

  console.log(`✅ Registered ${orchestrator.getStats().totalAgents} agents\n`);

  // Example 1: Sequential Workflow
  console.log('📊 Example 1: Sequential Workflow (Data Pipeline)');
  console.log('Flow: Collect → Analyze → Report\n');
  
  const sequentialResult = await orchestrator.sequential(
    ['data-collector', 'data-analyzer', 'report-generator'],
    'Process sales data for Q4 2024'
  );
  
  console.log(`Result: ${sequentialResult.success ? '✅ Success' : '❌ Failed'}`);
  console.log(`Duration: ${sequentialResult.duration}ms`);
  console.log(`Steps completed: ${sequentialResult.results.length}\n`);

  // Example 2: Parallel Workflow
  console.log('⚡ Example 2: Parallel Workflow (Multiple Sources)');
  console.log('Running data-collector on multiple sources simultaneously\n');
  
  const parallelResult = await orchestrator.parallel(
    ['data-collector', 'quality-checker', 'data-analyzer'],
    'Fetch data from all sources'
  );
  
  console.log(`Result: ${parallelResult.success ? '✅ Success' : '❌ Failed'}`);
  console.log(`Duration: ${parallelResult.duration}ms`);
  console.log(`Parallel tasks completed: ${parallelResult.results.length}\n`);

  // Example 3: Conditional Routing
  console.log('🔀 Example 3: Conditional Routing (Quality Check)');
  console.log('Route based on data quality\n');
  
  const routes = new Map([
    ['high-quality', 'data-analyzer'],
    ['low-quality', 'quality-checker'],
    ['invalid', 'data-collector']
  ]);
  
  // Condition function that determines routing
  const qualityCondition = (input) => {
    // In real scenario, this would analyze the input
    return 'high-quality';
  };
  
  const conditionalResult = await orchestrator.conditional(
    'Check and route this data',
    qualityCondition,
    routes
  );
  
  console.log(`Result: ${conditionalResult.success ? '✅ Success' : '❌ Failed'}`);
  console.log(`Duration: ${conditionalResult.duration}ms`);
  console.log(`Routed to: data-analyzer\n`);

  // Example 4: Supervisor Pattern
  console.log('👨‍💼 Example 4: Supervisor Pattern (Coordinated Work)');
  console.log('Supervisor coordinates multiple workers\n');
  
  const supervisedResult = await orchestrator.supervise(
    'supervisor',
    ['data-collector', 'data-analyzer'],
    'Generate comprehensive quarterly report'
  );
  
  console.log(`Result: ${supervisedResult.success ? '✅ Success' : '❌ Failed'}`);
  console.log(`Duration: ${supervisedResult.duration}ms`);
  console.log(`Total interactions: ${supervisedResult.results.length}\n`);

  // Example 5: Shared State
  console.log('🗄️  Example 5: Shared State Management\n');
  
  orchestrator.setState('project-id', 'PROJ-2024-001');
  orchestrator.setState('deadline', '2024-12-31');
  orchestrator.setState('priority', 'high');
  
  console.log(`Stored state: ${orchestrator.getStats().stateSize} items`);
  console.log(`Project ID: ${orchestrator.getState('project-id')}`);
  console.log(`Deadline: ${orchestrator.getState('deadline')}`);
  console.log(`Priority: ${orchestrator.getState('priority')}\n`);

  // Example 6: Agent Communication
  console.log('💬 Example 6: Agent-to-Agent Messaging\n');
  
  orchestrator.sendMessage('data-collector', 'data-analyzer', 'Data ready for analysis');
  orchestrator.sendMessage('data-analyzer', 'report-generator', 'Analysis complete');
  orchestrator.sendMessage('supervisor', 'data-analyzer', 'Priority task');
  
  const analyzerMessages = orchestrator.getMessages('data-analyzer');
  console.log(`Messages for data-analyzer: ${analyzerMessages.length}`);
  analyzerMessages.forEach(msg => {
    console.log(`  - From ${msg.from}: ${msg.content}`);
  });
  console.log();

  // Final Statistics
  console.log('📈 Final Statistics:');
  const stats = orchestrator.getStats();
  console.log(`  Total Agents: ${stats.totalAgents}`);
  console.log(`  Shared State Items: ${stats.stateSize}`);
  console.log(`  Message Queue Size: ${stats.messageCount}`);
  
  console.log('\n✨ Multi-Agent Orchestration Demo Complete!');
}

main().catch(console.error);
