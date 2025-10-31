# Contributing to stick.ai

Thank you for your interest in contributing to stick.ai! We welcome contributions from the community.

## Code of Conduct

Be respectful, inclusive, and professional. Harassment and discrimination are not tolerated.

## How to Contribute

### Reporting Bugs

1. Check if the bug already exists in [Issues](https://github.com/stickai/framework/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node version, etc.)
   - Screenshots if applicable

### Suggesting Features

1. Check [Discussions](https://github.com/stickai/framework/discussions) for similar ideas
2. Create a new discussion with:
   - Clear use case
   - Proposed solution
   - Alternatives considered
   - Mockups/examples if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**:
   - Follow existing code style
   - Add tests for new features
   - Update documentation
   - Keep commits atomic and well-described
4. **Test your changes**: `npm test`
5. **Push to your fork**: `git push origin feature/your-feature-name`
6. **Create a Pull Request**

### PR Guidelines

- **Title**: Clear, descriptive (e.g., "Add support for custom tool schemas")
- **Description**:
  - What does this PR do?
  - Why is this change needed?
  - How does it work?
  - Related issues/discussions
  - Screenshots/videos if UI changes
- **Size**: Keep PRs focused and reasonably sized
- **Tests**: Include tests for new functionality
- **Documentation**: Update docs if needed

## Development Setup

```bash
# Clone the repo
git clone https://github.com/stickai/framework.git
cd framework

# Install dependencies
npm install

# Build CLI
cd packages/cli
npm run build

# Run website locally
cd ../..
npm run dev
```

## Project Structure

```
agent-builder-framework/
├── app/                    # Next.js website
├── components/            # React components
├── packages/
│   └── cli/              # CLI package
├── docs/                 # Documentation
├── examples/             # Example agents
└── tests/                # Test suites
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Avoid `any` types
- Document complex types

### Style

- Use Prettier (auto-format on save)
- Follow ESLint rules
- 2-space indentation
- Semicolons required
- Single quotes for strings

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for workflow triggers
fix: resolve deployment timeout issue
docs: update configuration guide
test: add tests for agent orchestration
chore: update dependencies
```

### Testing

- Write tests for new features
- Maintain test coverage >80%
- Run `npm test` before submitting PR
- Add integration tests for major features

## Documentation

- Update relevant docs in `/docs`
- Add JSDoc comments for public APIs
- Include examples in documentation
- Keep README.md up to date

## Release Process

Maintainers handle releases:

1. Version bump following semver
2. Update CHANGELOG.md
3. Create GitHub release
4. Publish to npm

## Questions?

- 💬 [Discord](https://discord.gg/stickai)
- 📧 [Email](mailto:support@stick.ai)
- 🐛 [GitHub Issues](https://github.com/stickai/framework/issues)

Thank you for contributing to stick.ai! 🚀
