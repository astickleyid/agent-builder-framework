# stick.ai Framework - Publishing Guide

## 📦 Pre-Publishing Checklist

### ✅ Build Verification
- [x] CLI package builds without errors
- [x] Runtime package builds without errors
- [x] All TypeScript compiles cleanly
- [x] Dependencies installed correctly
- [x] Tests pass (CLI commands work)

### ✅ Package Requirements
- [x] package.json configured correctly
- [x] README.md created for each package
- [x] LICENSE file present (MIT)
- [x] .npmignore or files field configured
- [x] Version numbers set (1.0.0)
- [x] Main entry points correct
- [x] TypeScript declarations generated

## 🚀 Publishing to npm

### Step 1: npm Login
```bash
npm login
# Enter your npm credentials
```

### Step 2: Verify Package Contents

#### CLI Package
```bash
cd ~/development/agent-builder-framework/packages/cli
npm pack --dry-run
```

Should include:
- dist/ folder
- package.json
- README.md
- LICENSE

#### Runtime Package
```bash
cd ~/development/agent-builder-framework/packages/runtime
npm pack --dry-run
```

Should include:
- dist/ folder  
- package.json
- README.md (to be created)
- LICENSE

### Step 3: Create README files for packages

#### CLI README
```bash
cd ~/development/agent-builder-framework/packages/cli
```

Create `README.md` with installation and usage instructions.

#### Runtime README
```bash
cd ~/development/agent-builder-framework/packages/runtime
```

Create `README.md` with API documentation.

### Step 4: Publish Packages

#### Publish Runtime First (CLI depends on it)
```bash
cd ~/development/agent-builder-framework/packages/runtime
npm publish --access=public
```

#### Then Publish CLI
```bash
cd ~/development/agent-builder-framework/packages/cli
npm publish --access=public
```

## 🔄 Update Website Installation Instructions

Once published, verify users can install:

```bash
npm install -g @stick-ai/cli
# or
npm install @stick-ai/runtime
```

## 📝 Post-Publishing Tasks

### 1. Test Installation
```bash
# In a fresh directory
npm install -g @stick-ai/cli
stick --version
stick init my-agent
```

### 2. Update GitHub Repository
- Push code to GitHub
- Create release tag v1.0.0
- Add release notes

### 3. Update Website
- Change installation instructions to use actual npm
- Remove any "Coming Soon" disclaimers
- Add link to npm packages

### 4. Social Media Announcement
- Twitter/X post
- LinkedIn update
- Product Hunt submission
- Hacker News post

## 🔐 Security Checklist

Before publishing:
- [ ] No API keys or secrets in code
- [ ] .npmignore properly configured
- [ ] Only necessary files included
- [ ] No sensitive environment variables
- [ ] Dependencies scanned for vulnerabilities

## 📊 Monitoring After Publishing

### Week 1
- Monitor npm download stats
- Watch for issues on GitHub
- Respond to user feedback
- Fix any critical bugs

### Month 1
- Gather feature requests
- Plan next release (v1.1.0)
- Add more tools
- Improve documentation

## 🎯 Success Metrics

Track these metrics:
- npm downloads per week
- GitHub stars
- Issues filed
- Community engagement
- Feature requests
- User testimonials

## ⚠️ Rollback Plan

If critical issues found:

### Unpublish (within 72 hours)
```bash
npm unpublish @stick-ai/cli@1.0.0
npm unpublish @stick-ai/runtime@1.0.0
```

### Or Deprecate
```bash
npm deprecate @stick-ai/cli@1.0.0 "Critical bug, please use v1.0.1"
```

### Then fix and republish as v1.0.1

## 📚 Documentation Links

After publishing, ensure these work:
- npm package pages
- GitHub repository
- Documentation site
- Example projects
- Tutorial videos

## ✅ Final Verification

Before hitting publish:
1. ✅ All tests pass
2. ✅ Documentation complete
3. ✅ Examples work
4. ✅ No console errors
5. ✅ TypeScript strict mode passes
6. ✅ Dependencies up to date
7. ✅ Security audit clean
8. ✅ README files complete
9. ✅ LICENSE file present
10. ✅ Version numbers correct

---

**Ready to publish!** 🚀

Run the commands in Step 4 when ready.
