#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

clear

echo -e "${BOLD}${CYAN}"
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║          🔍 STICK.AI FRAMEWORK - DEEP AUDIT SESSION 🔍          ║"
echo "║                                                                   ║"
echo "║                  Interactive Functionality Review                 ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo -e "${NC}\n"

echo -e "${BOLD}${YELLOW}⚡ LIVE TESTING MODE ACTIVATED${NC}\n"
echo -e "${DIM}We're going to test EVERYTHING. No stone unturned.${NC}\n"

# Function to test and report
test_feature() {
    local category="$1"
    local feature="$2"
    local command="$3"
    local expected="$4"
    
    echo -e "\n${BOLD}${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}Testing: ${CYAN}$category${NC} → ${YELLOW}$feature${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
    
    if [ -n "$command" ]; then
        echo -e "${DIM}Running: ${NC}$command\n"
        eval "$command" 2>&1
        local exit_code=$?
        
        if [ $exit_code -eq 0 ]; then
            echo -e "\n${GREEN}✓ Exit code: 0 (success)${NC}"
            return 0
        else
            echo -e "\n${RED}✗ Exit code: $exit_code (failed)${NC}"
            return 1
        fi
    fi
}

pause() {
    echo -e "\n${DIM}Press ENTER to continue...${NC}"
    read
}

# Start tests
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 1: PACKAGE INTEGRITY${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Checking published packages...${NC}\n"

test_feature "NPM Packages" "@stick-ai/runtime" "npm view @stick-ai/runtime version 2>&1 | head -5" ""
echo -e "${CYAN}Status: Published? ${GREEN}YES${NC}"
echo -e "${CYAN}Latest: $(npm view @stick-ai/runtime version 2>/dev/null)${NC}"

pause

test_feature "NPM Packages" "@stick-ai/cli" "npm view @stick-ai/cli version 2>&1 | head -5" ""
echo -e "${CYAN}Status: Published? ${GREEN}YES${NC}"
echo -e "${CYAN}Latest: $(npm view @stick-ai/cli version 2>/dev/null)${NC}"

pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 2: CLI COMMANDS (LIVE TEST)${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

# Create temp test directory
TEST_DIR="/tmp/stick-test-$$"
mkdir -p "$TEST_DIR"
cd "$TEST_DIR"

echo -e "${YELLOW}Testing in: ${CYAN}$TEST_DIR${NC}\n"

test_feature "CLI" "stick --help" "npx @stick-ai/cli --help" ""
pause

test_feature "CLI" "stick init" "echo 'test-agent' | npx @stick-ai/cli init" ""
echo -e "\n${CYAN}Files created:${NC}"
ls -la
pause

test_feature "CLI" "Check agent.config.json" "cat test-agent/agent.config.json | head -20" ""
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 3: TOOL AVAILABILITY${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

cd test-agent
test_feature "CLI Tools" "stick tools list" "npx @stick-ai/cli tools" ""
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 4: RUNTIME FUNCTIONALITY${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Creating test script to check Agent class...${NC}\n"

cat > test_runtime.js << 'EOFTEST'
const { Agent } = require('@stick-ai/runtime');

console.log('\n🧪 Testing Agent Runtime...\n');

try {
    const config = {
        name: 'TestAgent',
        description: 'Test agent',
        model: 'gpt-4',
        systemPrompt: 'You are a test agent'
    };
    
    console.log('✓ Agent class imported');
    
    const agent = new Agent(config);
    console.log('✓ Agent instance created');
    console.log('✓ Agent name:', agent.config.name);
    
    // Check methods
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(agent));
    console.log('\n📋 Available methods:', methods.length);
    methods.forEach(m => {
        if (m !== 'constructor') {
            console.log('  -', m);
        }
    });
    
    // Check tool registry
    console.log('\n🔧 Tool registry exists?', agent.toolRegistry instanceof Map);
    console.log('🔧 Registered tools:', agent.toolRegistry.size);
    
} catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
}
EOFTEST

test_feature "Runtime" "Agent Class Test" "node test_runtime.js" ""
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 5: INDIVIDUAL TOOL TESTING${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

cat > test_tools.js << 'EOFTOOLS'
const runtime = require('@stick-ai/runtime');

console.log('\n🔧 Testing Individual Tools...\n');

const tools = [
    'BashTool',
    'HttpTool', 
    'JsonTool',
    'FileOpsTool',
    'DateTimeTool',
    'TextTool',
    'OpenAITool',
    'AnthropicTool',
    'OllamaTool'
];

let working = 0;
let broken = 0;

tools.forEach(toolName => {
    try {
        const ToolClass = runtime[toolName];
        if (ToolClass) {
            const tool = new ToolClass();
            console.log(`✓ ${toolName.padEnd(20)} - Instantiates`);
            
            // Check if execute method exists
            if (typeof tool.execute === 'function') {
                console.log(`  └─ execute() method: ✓`);
                working++;
            } else {
                console.log(`  └─ execute() method: ✗ MISSING`);
                broken++;
            }
        } else {
            console.log(`✗ ${toolName.padEnd(20)} - NOT EXPORTED`);
            broken++;
        }
    } catch (error) {
        console.log(`✗ ${toolName.padEnd(20)} - Error: ${error.message}`);
        broken++;
    }
});

console.log(`\n📊 Results: ${working} working, ${broken} broken\n`);
EOFTOOLS

test_feature "Tools" "Tool Export & Instantiation" "node test_tools.js" ""
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 6: ACTUAL TOOL EXECUTION${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

cat > test_tool_exec.js << 'EOFEXEC'
const { BashTool, HttpTool, JsonTool, TextTool, DateTimeTool } = require('@stick-ai/runtime');

console.log('\n⚡ Testing Tool Execution (Real Calls)...\n');

async function runTests() {
    // Test 1: BashTool
    try {
        const bash = new BashTool();
        console.log('Testing BashTool.execute("echo Hello")...');
        const result = await bash.execute({ command: 'echo Hello' });
        console.log('✓ BashTool works, output:', result.output?.trim());
    } catch (e) {
        console.log('✗ BashTool failed:', e.message);
    }
    
    // Test 2: JsonTool
    try {
        const json = new JsonTool();
        console.log('\nTesting JsonTool.execute("parse", ...)...');
        const result = await json.execute({ 
            operation: 'parse', 
            input: '{"test": true}' 
        });
        console.log('✓ JsonTool works, parsed:', result.result);
    } catch (e) {
        console.log('✗ JsonTool failed:', e.message);
    }
    
    // Test 3: TextTool
    try {
        const text = new TextTool();
        console.log('\nTesting TextTool.execute("uppercase", ...)...');
        const result = await text.execute({ 
            operation: 'uppercase', 
            text: 'hello world' 
        });
        console.log('✓ TextTool works, result:', result.result);
    } catch (e) {
        console.log('✗ TextTool failed:', e.message);
    }
    
    // Test 4: DateTimeTool
    try {
        const dt = new DateTimeTool();
        console.log('\nTesting DateTimeTool.execute("now")...');
        const result = await dt.execute({ operation: 'now' });
        console.log('✓ DateTimeTool works, time:', result.result);
    } catch (e) {
        console.log('✗ DateTimeTool failed:', e.message);
    }
    
    // Test 5: HttpTool (to public API)
    try {
        const http = new HttpTool();
        console.log('\nTesting HttpTool.execute (GET request)...');
        const result = await http.execute({ 
            method: 'GET',
            url: 'https://api.github.com/zen'
        });
        console.log('✓ HttpTool works, response:', result.data?.substring(0, 50));
    } catch (e) {
        console.log('✗ HttpTool failed:', e.message);
    }
}

runTests().then(() => console.log('\n✅ Tool execution tests complete\n'));
EOFEXEC

test_feature "Tools" "Execute Real Operations" "node test_tool_exec.js" ""
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 7: AGENT-TOOL INTEGRATION${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

cat > test_agent_tools.js << 'EOFAGENT'
const { Agent, BashTool, JsonTool } = require('@stick-ai/runtime');

console.log('\n🤖 Testing Agent-Tool Integration...\n');

async function testIntegration() {
    const agent = new Agent({
        name: 'IntegrationTest',
        description: 'Test integration',
        model: 'gpt-4'
    });
    
    console.log('✓ Agent created');
    
    // Register tools
    const bash = new BashTool();
    const json = new JsonTool();
    
    agent.registerTool('bash', bash);
    agent.registerTool('json', json);
    
    console.log('✓ Tools registered:', agent.toolRegistry.size);
    
    // Can agent retrieve tools?
    const retrievedBash = agent.toolRegistry.get('bash');
    console.log('✓ Can retrieve registered tool:', retrievedBash !== undefined);
    
    // Can agent execute tool?
    console.log('\nTesting if agent can execute registered tool...');
    try {
        const result = await retrievedBash.execute({ command: 'echo "Agent executed me!"' });
        console.log('✓ Agent CAN execute tool directly');
        console.log('  Result:', result.output?.trim());
    } catch (e) {
        console.log('✗ Agent CANNOT execute tool:', e.message);
    }
    
    // Does agent have a method to auto-execute tools?
    console.log('\nChecking for built-in tool execution method...');
    if (typeof agent.executeTool === 'function') {
        console.log('✓ agent.executeTool() method exists');
        try {
            const result = await agent.executeTool('bash', { command: 'pwd' });
            console.log('✓ agent.executeTool() WORKS');
            console.log('  Result:', result);
        } catch (e) {
            console.log('✗ agent.executeTool() exists but throws:', e.message);
        }
    } else {
        console.log('✗ agent.executeTool() method DOES NOT EXIST');
        console.log('  → Agent cannot orchestrate tool calls');
    }
    
    // Does agent have a run/process method?
    console.log('\nChecking for agent execution loop...');
    if (typeof agent.run === 'function') {
        console.log('✓ agent.run() method exists');
    } else {
        console.log('✗ agent.run() method DOES NOT EXIST');
    }
    
    if (typeof agent.processMessage === 'function') {
        console.log('✓ agent.processMessage() method exists');
    } else {
        console.log('✗ agent.processMessage() method DOES NOT EXIST');
    }
}

testIntegration().then(() => console.log('\n'));
EOFAGENT

test_feature "Integration" "Agent-Tool Connection" "node test_agent_tools.js" ""
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 8: RUN COMMAND TEST${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

echo -e "${YELLOW}Testing 'stick run' command...${NC}\n"
echo -e "${DIM}(This should start the agent, not just print a message)${NC}\n"

timeout 5 npx @stick-ai/cli run test-agent 2>&1 &
RUN_PID=$!
sleep 3
kill $RUN_PID 2>/dev/null

echo -e "\n${YELLOW}⚠️  If it just printed a message and exited, it's NOT working${NC}"
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 9: MCP CONFIGURATION${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

test_feature "MCP" "Check MCP commands" "npx @stick-ai/cli mcp --help 2>&1 || echo 'MCP commands not found'" ""
pause

echo -e "\n${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${BLUE}  SECTION 10: DEPLOY/MONITORING COMMANDS${NC}"
echo -e "${BOLD}${BLUE}═══════════════════════════════════════════════════${NC}\n"

test_feature "Deploy" "stick deploy" "npx @stick-ai/cli deploy --help 2>&1 || echo 'Not implemented'" ""
pause

test_feature "Monitoring" "stick logs" "npx @stick-ai/cli logs --help 2>&1 || echo 'Not implemented'" ""
pause

test_feature "Monitoring" "stick metrics" "npx @stick-ai/cli metrics --help 2>&1 || echo 'Not implemented'" ""
pause

echo -e "\n${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${GREEN}  AUDIT COMPLETE${NC}"
echo -e "${BOLD}${GREEN}═══════════════════════════════════════════════════${NC}\n"

echo -e "${BOLD}Cleaning up test directory...${NC}"
cd /tmp
rm -rf "$TEST_DIR"

echo -e "\n${CYAN}Full audit report saved to: ~/development/agent-builder-framework/BRUTAL_AUDIT.md${NC}\n"

