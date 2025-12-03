'use client';

import Link from 'next/link';
import { Terminal, ArrowRight, BookOpen } from 'lucide-react';

import ProIcon from '@/components/icons/ProIcon';

const documentation = [
  {
    category: 'Getting Started',
    icon: 'rocket',
    docs: [
      { title: 'Quick Start', slug: 'quick-start', description: 'Launch your first agent in under 5 minutes' },
      { title: 'Installation', slug: 'installation', description: 'Install the framework and CLI tools' },
      { title: 'Your First Agent', slug: 'first-agent', description: 'Build and deploy your first intelligent agent' },
      { title: 'Configuration', slug: 'configuration', description: 'Configure agents with declarative JSON' }
    ]
  },
  {
    category: 'Core Concepts',
    icon: 'zap',
    docs: [
      { title: 'Agent Architecture', slug: 'agents', description: 'Understanding intelligent agent design patterns' },
      { title: 'Built-in Tools', slug: 'tools', description: '17 production-ready tools for agent capabilities' },
      { title: 'LLM Providers', slug: 'llm-providers', description: 'OpenAI, Anthropic, Ollama integration guide' },
      { title: 'Memory Systems', slug: 'memory', description: 'Persistent context and vector memory management' }
    ]
  },
  {
    category: 'Advanced Topics',
    icon: 'sparkles',
    docs: [
      { title: 'Multi-Agent Orchestration', slug: 'multi-agent', description: 'Coordinate multiple specialized agents' },
      { title: 'MCP Integration', slug: 'mcp', description: 'Model Context Protocol server configuration' },
      { title: 'Security & Sandboxing', slug: 'security', description: 'Enterprise-grade security and rate limiting' },
      { title: 'Production Deployment', slug: 'deployment', description: 'Deploy agents to production environments' }
    ]
  },
  {
    category: 'API Reference',
    icon: 'code',
    docs: [
      { title: 'REST API', slug: 'api-reference', description: 'Complete HTTP API endpoint documentation' },
      { title: 'CLI Commands', slug: 'cli', description: 'Command-line interface reference guide' },
      { title: 'TypeScript SDK', slug: 'sdk', description: 'Full TypeScript/JavaScript SDK documentation' },
      { title: 'Configuration Schema', slug: 'schema', description: 'JSON schema and validation reference' }
    ]
  },
  {
    category: 'Practical Guides',
    icon: 'graduation',
    docs: [
      { title: 'Building a Chatbot', slug: 'guide-chatbot', description: 'Step-by-step conversational agent tutorial' },
      { title: 'Research Pipeline', slug: 'guide-research', description: 'Multi-agent research automation system' },
      { title: 'Code Review Automation', slug: 'guide-code-review', description: 'Automated code review agent setup' },
      { title: 'Docker Deployment', slug: 'guide-docker', description: 'Containerized deployment with Docker' }
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
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 flex items-center justify-center">
                  <ProIcon name={section.icon as any} size={24} className="text-accent-blue" />
                </div>
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
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ProIcon name="message" size={28} className="text-accent-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Join Developer Community</h3>
            <p className="text-zinc-400 mb-4">Connect with developers building production AI agents. Get support, share insights, and collaborate.</p>
            <button className="px-5 py-2.5 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-all flex items-center gap-2">
              <ProIcon name="message" size={16} />
              Join Discord Server
            </button>
          </div>

          <div className="holographic-card rounded-xl p-8 border border-border hover:border-accent-cyan/50 transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-cyan/20 to-accent-blue/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ProIcon name="code" size={28} className="text-accent-cyan" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Contribute to Open Source</h3>
            <p className="text-zinc-400 mb-4">View source code, report issues, and contribute features to the framework. 100% open source.</p>
            <a href="https://github.com/astickleyid/agent-builder-framework" target="_blank" rel="noopener noreferrer" className="inline-block px-5 py-2.5 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all flex items-center gap-2">
              <ProIcon name="code" size={16} />
              Star on GitHub
            </a>
          </div>

          <div className="holographic-card rounded-xl p-8 border border-border hover:border-accent-blue/50 transition-all group cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-cyan/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <ProIcon name="graduation" size={28} className="text-accent-blue" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-white">Learn by Example</h3>
            <p className="text-zinc-400 mb-4">Explore production-ready agent templates and real-world implementation examples.</p>
            <Link href="/examples" className="inline-block px-5 py-2.5 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all flex items-center gap-2">
              <ProIcon name="graduation" size={16} />
              View Templates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
