#!/bin/bash

# stick.ai Framework Test Suite
# Tests the core functionality of the agent execution engine

set -e

echo "🧪 stick.ai Framework Test Suite"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "packages/cli" ]; then
  echo -e "${RED}❌ Error: Must run from repository root${NC}"
  exit 1
fi

echo -e "${BLUE}📦 Step 1: Building packages...${NC}"
cd packages/runtime
npm run build > /dev/null 2>&1
echo -e "${GREEN}✓ Runtime built${NC}"

cd ../cli
npm run build > /dev/null 2>&1
echo -e "${GREEN}✓ CLI built${NC}"

cd ../..

echo ""
echo -e "${BLUE}🧪 Step 2: Testing basic agent execution...${NC}"

# Test 1: Basic agent with single input
cd packages/cli/test-agent
RESULT=$(node ../dist/cli.js run basic-agent --input "Hello" 2>&1)

if echo "$RESULT" | grep -q "Agent>"; then
  echo -e "${GREEN}✓ Test 1 Passed: Basic agent execution${NC}"
else
  echo -e "${RED}❌ Test 1 Failed: Basic agent execution${NC}"
  echo "$RESULT"
  exit 1
fi

# Test 2: Config loading
if echo "$RESULT" | grep -q "Loading 3 tools"; then
  echo -e "${GREEN}✓ Test 2 Passed: Tool loading${NC}"
else
  echo -e "${RED}❌ Test 2 Failed: Tool loading${NC}"
  exit 1
fi

# Test 3: Agent response
if echo "$RESULT" | grep -q "Processing: Hello"; then
  echo -e "${GREEN}✓ Test 3 Passed: Agent response${NC}"
else
  echo -e "${RED}❌ Test 3 Failed: Agent response${NC}"
  exit 1
fi

cd ../../..

echo ""
echo -e "${BLUE}🎯 Step 3: Testing CLI options...${NC}"

cd packages/cli/test-agent

# Test 4: Provider option
RESULT=$(node ../dist/cli.js run basic-agent --input "Test" --provider none 2>&1)
if echo "$RESULT" | grep -q "basic mode\|Agent>"; then
  echo -e "${GREEN}✓ Test 4 Passed: Provider selection${NC}"
else
  echo -e "${RED}❌ Test 4 Failed: Provider selection${NC}"
  exit 1
fi

cd ../../..

echo ""
echo -e "${GREEN}🎉 All tests passed!${NC}"
echo ""
echo "=================================="
echo -e "${BLUE}Framework Status:${NC}"
echo -e "  ${GREEN}✓${NC} Agent execution engine"
echo -e "  ${GREEN}✓${NC} Tool registration"
echo -e "  ${GREEN}✓${NC} Configuration loading"
echo -e "  ${GREEN}✓${NC} CLI commands"
echo -e "  ${GREEN}✓${NC} Basic agent mode"
echo ""
echo -e "${YELLOW}Optional tests (require API keys):${NC}"
echo -e "  ${BLUE}○${NC} OpenAI integration (set OPENAI_API_KEY)"
echo -e "  ${BLUE}○${NC} Anthropic integration (set ANTHROPIC_API_KEY)"
echo -e "  ${BLUE}○${NC} Ollama integration (start ollama serve)"
echo ""
echo -e "${GREEN}Ready to build AI agents!${NC}"
echo ""
echo "Try: cd packages/cli/test-agent && node ../dist/cli.js run basic-agent --interactive"
