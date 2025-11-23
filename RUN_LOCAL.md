# 🚀 Running stick.ai Locally

All the new features we built today are in the LOCAL version only.

## Quick Commands (Copy & Paste)

### From Project Root
```bash
cd ~/development/stickai-agent-framework

# Interactive menu
./stick.sh

# Test the framework
./test-framework.sh

# Run test agent
./stick.sh run test-agent/basic-agent --input "Hello!"
```

### From Test Agent Directory
```bash
cd ~/development/stickai-agent-framework/packages/cli/test-agent

# Interactive mode
node ../dist/cli.js run basic-agent --interactive

# Single command
node ../dist/cli.js run basic-agent --input "What time is it?"

# Check help
node ../dist/cli.js run --help
```

## 🎯 What Works Locally

✅ `--interactive` - Chat mode
✅ `--input "text"` - Single execution
✅ `--provider` - Choose AI (openai, anthropic, ollama)
✅ `--model` - Specify model
✅ `--temperature` - Creativity control
✅ All 17 tools loaded automatically
✅ Conversation history
✅ Special commands (exit, clear, history)

## 💡 Quick Test

```bash
cd ~/development/stickai-agent-framework
./test-framework.sh
```

Should show:
```
✓ Test 1 Passed: Basic agent execution
✓ Test 2 Passed: Tool loading
✓ Test 3 Passed: Agent response
✓ Test 4 Passed: Provider selection
🎉 All tests passed!
```

## 📍 Current Location
```bash
pwd
# Should show: /Users/austinstickley/development/stickai-agent-framework
```

## 🔧 Add to Your Shell (Optional)

Add this to your `~/.zshrc` or `~/.bashrc`:
```bash
alias stick-local='cd ~/development/stickai-agent-framework && ./stick.sh'
```

Then reload:
```bash
source ~/.zshrc
```

Now you can run `stick-local` from anywhere!

