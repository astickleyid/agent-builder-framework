'use client';

import Link from 'next/link';
import { Terminal, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

const documentation = [
  {
    category: 'Getting Started',
    icon: '🚀',
    docs: [
      { title: 'Quick Start', slug: 'quick-start', description: 'Get up and running in 5 minutes' },
      { title: 'Installation', slug: 'installation', description: 'Install the framework and CLI' },
      { title: 'Your First Agent', slug: 'first-agent', description: 'Build your first AI agent' },
      { title: 'Configuration', slug: 'configuration', description: 'Configure agents and settings' }
    ]
  },
  {
    category: 'Core Concepts',
    icon: '🧠',
    docs: [
      { title: 'Agents', slug: 'agents', description: 'Understanding AI agents' },
      { title: 'Tools', slug: 'tools', description: '17 built-in tools explained' },
      { title: 'LLM Providers', slug: 'llm-providers', description: 'OpenAI, Anthropic, Ollama' },
      { title: 'Memory System', slug: 'memory', description: 'Persistent and vector memory' }
    ]
  },
  {
    category: 'Advanced',
    icon: '⚡',
    docs: [
      { title: 'Multi-Agent Systems', slug: 'multi-agent', description: 'Orchestrate multiple agents' },
      { title: 'MCP Integration', slug: 'mcp', description: 'Model Context Protocol servers' },
      { title: 'Security', slug: 'security', description: 'Sandboxing and rate limiting' },
      { title: 'Deployment', slug: 'deployment', description: 'Deploy to production' }
    ]
  },
  {
    category: 'API Reference',
    icon: '📚',
    docs: [
      { title: 'REST API', slug: 'api-reference', description: 'Complete API documentation' },
      { title: 'CLI Commands', slug: 'cli', description: 'Command line interface' },
      { title: 'SDK Reference', slug: 'sdk', description: 'TypeScript/JavaScript SDK' },
      { title: 'Configuration Schema', slug: 'schema', description: 'JSON configuration reference' }
    ]
  },
  {
    category: 'Guides',
    icon: '📖',
    docs: [
      { title: 'Building a Chatbot', slug: 'guide-chatbot', description: 'Create a conversational agent' },
      { title: 'Research Pipeline', slug: 'guide-research', description: 'Multi-agent research system' },
      { title: 'Code Review Bot', slug: 'guide-code-review', description: 'Automated code reviewer' },
      { title: 'Docker Deployment', slug: 'guide-docker', description: 'Deploy with Docker' }
    ]
  }
];

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <Terminal className="w-6 h-6 text-accent-blue" />
              <div className="absolute inset-0 blur-md bg-accent-blue/30" />
            </div>
            <span className="text-xl font-bold">stick.ai</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-white font-semibold">
              Docs
            </Link>
            <Link href="/examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Examples
            </Link>
            <Link href="/playground" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Playground
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphic text-sm text-zinc-400 mb-6">
              <BookOpen className="w-4 h-4 text-accent-blue" />
              Comprehensive Documentation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span className="gradient-text">Documentation Hub</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Complete guides, API references, and tutorials to master AI agent development with stick.ai
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-6 py-4 bg-surface border border-border rounded-xl text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none text-lg transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {documentation.map((section) => (
            <div key={section.category} className="holographic-card rounded-xl border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-white">{section.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.docs.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    className="group p-5 border border-border rounded-xl hover:border-accent-blue/50 hover:bg-surface/50 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white group-hover:text-accent-blue transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-zinc-400 mt-2 text-sm">{doc.description}</p>
                    <div className="flex items-center gap-2 mt-3 text-accent-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Read more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="holographic-card rounded-xl p-8 border border-border hover:border-accent-blue/50 transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-accent-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Join Community</h3>
            <p className="text-zinc-400 mb-4">Connect with other developers building AI agents on Discord</p>
            <button className="px-5 py-2.5 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-all">
              Join Discord Server
            </button>
          </div>

          <div className="holographic-card rounded-xl p-8 border border-border hover:border-accent-cyan/50 transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-accent-cyan/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">💻</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Contribute</h3>
            <p className="text-zinc-400 mb-4">View source code, report issues, and contribute to the project</p>
            <a href="https://github.com/astickleyid/agent-builder-framework" target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2.5 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all">
              Star on GitHub
            </a>
          </div>

          <div className="holographic-card rounded-xl p-8 border border-border hover:border-accent-blue/50 transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-accent-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <span className="text-3xl">🎓</span>
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Learn by Example</h3>
            <p className="text-zinc-400 mb-4">Explore production-ready templates and example projects</p>
            <Link href="/examples" className="inline-block px-5 py-2.5 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all">
              View Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
