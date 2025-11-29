'use client';

import Link from 'next/link';
import { Terminal, ArrowLeft, ArrowRight } from 'lucide-react';

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
      {/* Header */}
      <div className="glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <Terminal className="w-5 h-5 text-accent-blue" />
              <span className="font-semibold">stick.ai</span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold gradient-text">
            Documentation
          </h1>
          <p className="text-zinc-400 mt-2 text-lg">
            Everything you need to build amazing AI agents
          </p>

          {/* Search */}
          <div className="mt-6">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full max-w-2xl px-6 py-4 bg-surface border border-border rounded-xl text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none text-lg"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid gap-8">
          {documentation.map((section) => (
            <div key={section.category} className="holographic-card rounded-xl border border-border p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-4xl">{section.icon}</span>
                <h2 className="text-2xl font-bold text-white">{section.category}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.docs.map((doc) => (
                  <Link
                    key={doc.slug}
                    href={`/docs/${doc.slug}`}
                    className="group p-6 border border-border rounded-xl hover:border-accent-blue hover:bg-surface/50 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white group-hover:text-accent-blue transition-colors">
                      {doc.title}
                    </h3>
                    <p className="text-zinc-400 mt-2 text-sm">{doc.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-accent-blue text-sm font-medium">
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
          <div className="holographic-card rounded-xl p-6 border border-accent-blue/30">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="text-xl font-bold mb-2 text-white">Community</h3>
            <p className="text-zinc-400 mb-4">Join our Discord community</p>
            <button className="px-4 py-2 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-all">
              Join Discord
            </button>
          </div>

          <div className="holographic-card rounded-xl p-6 border border-accent-cyan/30">
            <div className="text-3xl mb-3">💻</div>
            <h3 className="text-xl font-bold mb-2 text-white">GitHub</h3>
            <p className="text-zinc-400 mb-4">View source code and contribute</p>
            <button className="px-4 py-2 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all">
              View on GitHub
            </button>
          </div>

          <div className="holographic-card rounded-xl p-6 border border-accent-blue/30">
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="text-xl font-bold mb-2 text-white">Examples</h3>
            <p className="text-zinc-400 mb-4">Explore example projects</p>
            <Link href="/examples" className="inline-block px-4 py-2 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all">
              Browse Examples
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
