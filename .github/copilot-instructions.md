# GitHub Copilot Instructions for stick.ai Framework

## About This Project

You are working on the **stick.ai Enterprise AI Agent Orchestration Framework** - an advanced local-first framework for building and deploying AI agents. This is a TypeScript-based monorepo project with a Next.js website and CLI packages.

## Commands

### Build Commands
```bash
# Build the website (Next.js)
npm run build

# Build CLI package specifically
cd packages/cli && npm run build

# Build runtime package
cd packages/runtime && npm run build
```

### Development Commands
```bash
# Start website in development mode (port 3002)
npm run dev

# Watch CLI for changes
cd packages/cli && npm run dev

# Watch runtime for changes
cd packages/runtime && npm run dev
```

### Testing Commands
```bash
# Run runtime tests
cd packages/runtime && npm test

# Run tests with coverage
cd packages/runtime && npm run test:coverage

# Watch mode for tests
cd packages/runtime && npm run test:watch
```

### Linting
```bash
# Lint the codebase
npm run lint
```

## Project Structure

```
stick.ai-framework/ (repository root)
├── .github/              # GitHub workflows and configurations
├── app/                  # Next.js website pages (App Router)
├── components/           # React UI components
├── packages/
│   ├── cli/             # CLI package (@stick-ai/cli)
│   │   ├── src/         # CLI source code
│   │   ├── dist/        # Compiled CLI output
│   │   └── test-agent/  # Test agent configurations
│   └── runtime/         # Runtime engine package (@stick-ai/runtime)
│       ├── src/         # Runtime source code
│       ├── dist/        # Compiled runtime output
│       └── examples/    # Example agents
├── docs/                 # Documentation files
├── public/              # Static assets for website
└── lib/                 # Shared utilities
```

## Technology Stack

### Core Framework
- **Language**: TypeScript 5.3+
- **Runtime**: Node.js 18+
- **Package Manager**: npm

### CLI Package
- **Commander.js**: Command-line interface framework
- **Inquirer**: Interactive command-line prompts
- **Chalk, Ora**: Terminal styling and spinners
- **Boxen, Figlet**: Terminal UI enhancements

### Runtime Package
- **Express**: HTTP server for agent deployment
- **WebSocket (ws)**: Real-time communication
- **Axios**: HTTP client
- **Model Context Protocol SDK**: MCP integration
- **Jest**: Testing framework

### Website
- **Framework**: Next.js 15 (App Router)
- **UI**: React 18
- **Styling**: Tailwind CSS 4.0
- **Components**: Radix UI
- **Animations**: Framer Motion
- **3D Graphics**: Three.js with React Three Fiber

## Code Style Guidelines

### TypeScript Standards
- **Always use TypeScript** for all new code
- **Enable strict mode** - avoid `any` types
- Use explicit type annotations for function parameters and return types
- Document complex types with JSDoc comments
- Prefer interfaces over type aliases for object shapes

### Formatting
- **Indentation**: 2 spaces (no tabs)
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Line Length**: 100 characters (soft limit)
- Follow ESLint rules configured in `eslint.config.mjs`

### Code Examples

#### TypeScript Function Example
```typescript
interface AgentConfig {
  name: string;
  version: string;
  capabilities: string[];
  instructions: string;
}

export async function createAgent(config: AgentConfig): Promise<void> {
  // Implementation
}
```

#### React Component Example
```typescript
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded">
      {label}
    </button>
  );
};
```

## Git Workflow

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for workflow triggers
fix: resolve deployment timeout issue
docs: update configuration guide
test: add tests for agent orchestration
chore: update dependencies
refactor: simplify agent initialization
style: format code with prettier
```

### Branch Naming
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `test/` - Test additions or updates
- `refactor/` - Code refactoring

### Pull Request Guidelines
- Keep PRs focused and reasonably sized
- Include tests for new functionality
- Update documentation if needed
- Add clear description of what changed and why

## Testing Guidelines

- **Write tests** for all new features in the runtime package
- **Maintain test coverage** above 80%
- Use **Jest** for unit and integration tests
- Place tests alongside source files or in `__tests__` directories
- Run tests before submitting PRs: `cd packages/runtime && npm test`

### Test Example
```typescript
import { describe, it, expect } from '@jest/globals';
import { createAgent } from './agent';

describe('createAgent', () => {
  it('should create an agent with valid config', async () => {
    const config = {
      name: 'test-agent',
      version: '1.0.0',
      capabilities: ['chat'],
      instructions: 'You are a helpful assistant'
    };
    
    await expect(createAgent(config)).resolves.not.toThrow();
  });
});
```

## Boundaries and Restrictions

### Files You MUST NOT Modify
- **Secret files**: `.env`, `.env.local`, API keys, credentials
- **Build artifacts**: `dist/`, `node_modules/`, `.next/`
- **Lock files**: Only modify if adding/removing dependencies
- **Git files**: `.git/`, `.gitignore` (unless specifically needed)

### Code You MUST NOT Remove
- Working test suites
- Production code unless fixing bugs or refactoring with approval
- Error handling and security checks
- Existing API contracts without migration plan

### Security Requirements
- **Never commit secrets** or API keys to source code
- Use environment variables for sensitive configuration
- Validate all user inputs
- Follow OWASP security best practices
- Use helmet.js for Express security headers (already configured)

## Documentation

### When to Update Documentation
- Adding new features or commands
- Changing existing APIs or behavior
- Fixing bugs that affect usage
- Adding new packages or dependencies

### Documentation Files
- **README.md**: Main project overview and quick start
- **docs/**: Detailed documentation
- **CONTRIBUTING.md**: Contribution guidelines
- **CLI_GUIDE.md**: CLI usage documentation
- **Package READMEs**: Update `packages/*/README.md` for package changes

### JSDoc Comments
Add JSDoc comments for all public APIs:

```typescript
/**
 * Creates a new AI agent with the specified configuration.
 * 
 * @param config - The agent configuration object
 * @param config.name - Unique name for the agent
 * @param config.capabilities - List of agent capabilities
 * @returns Promise that resolves when agent is created
 * @throws {ValidationError} If configuration is invalid
 * 
 * @example
 * ```typescript
 * await createAgent({
 *   name: 'my-agent',
 *   capabilities: ['chat', 'api']
 * });
 * ```
 */
export async function createAgent(config: AgentConfig): Promise<void> {
  // Implementation
}
```

## Dependencies

### Adding New Dependencies
- Prefer well-maintained, popular packages
- Check for security vulnerabilities before adding
- Update `package.json` in the appropriate package directory
- Run `npm install` and commit the lock file
- Document why the dependency is needed in PR description

### Current Key Dependencies
- **@modelcontextprotocol/sdk**: MCP integration
- **commander**: CLI framework
- **express**: HTTP server
- **next**: Web framework
- **typescript**: Type system

## AI Agent Context

This framework enables developers to:
1. Build AI agents with natural language interfaces
2. Deploy agents as HTTP APIs
3. Use local models (Ollama) or cloud providers (OpenAI, Anthropic)
4. Create custom MCP servers and tools
5. Orchestrate multi-agent workflows

When working on agent-related features, understand that agents:
- Are configured via JSON files
- Can have multiple capabilities (chat, email, API)
- Use tools (bash, http, database, etc.)
- Follow instructions defined in their config
- Support multiple LLM providers

## Common Tasks

### Adding a New CLI Command
1. Add command definition in `packages/cli/src/cli.ts`
2. Implement handler in `packages/cli/src/commands/`
3. Add tests in runtime if needed
4. Update CLI documentation

### Adding a New Tool
1. Create tool in `packages/runtime/src/tools/`
2. Register tool in the tool registry
3. Add tests for the tool
4. Update tool documentation

### Updating the Website
1. Modify pages in `app/`
2. Update components in `components/`
3. Test with `npm run dev`
4. Build to verify: `npm run build`

## Questions or Issues?

- Check existing documentation in `/docs`
- Review similar code in the codebase
- Check CONTRIBUTING.md for contribution guidelines
- Ensure changes align with the project's local-first philosophy
- Test changes thoroughly before submitting

## Remember

- This is a **local-first** framework - prioritize local execution and privacy
- Keep the developer experience simple and intuitive
- Maintain backward compatibility when possible
- Write clear, self-documenting code
- Test your changes thoroughly
