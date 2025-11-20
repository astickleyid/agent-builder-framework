'use client';

import { Terminal, Book, Code, Cpu, Wrench, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DocsHome() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-accent-blue" />
            <span className="text-xl font-bold">stick.ai</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-white font-semibold">
              Docs
            </Link>
            <Link href="/examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Examples
            </Link>
            <a 
              href="https://github.com/astickleyid/agent-builder-framework" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphic text-sm text-zinc-400 mb-6">
              <Book className="w-4 h-4 text-accent-blue" />
              Documentation
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">stick.ai</span> Documentation
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Everything you need to build, deploy, and scale AI agents
            </p>
          </div>

          {/* Quick Start */}
          <div className="mb-16 p-8 glass-morphic rounded-lg border border-accent-blue/20">
            <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
            <p className="text-zinc-400 mb-6">
              Get up and running in less than 5 minutes
            </p>
            <pre className="bg-surface/50 border border-border rounded-md p-4 mb-6">
              <code className="text-accent-cyan">$ npm install -g @stick-ai/cli{'\n'}$ stick</code>
            </pre>
            <Link 
              href="/docs/getting-started"
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md font-semibold transition-all"
            >
              Get Started
              <Sparkles className="w-4 h-4" />
            </Link>
          </div>

          {/* Main Sections */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <Link href="/docs/getting-started" className="p-6 glass-morphic rounded-lg border border-border hover:border-accent-blue/50 transition-all group">
              <Sparkles className="w-10 h-10 text-accent-blue mb-4" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                Getting Started
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Installation, first agent, and basic concepts
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>• Installation</li>
                <li>• Creating your first agent</li>
                <li>• Configuration basics</li>
              </ul>
            </Link>

            <Link href="/docs/reference/cli" className="p-6 glass-morphic rounded-lg border border-border hover:border-accent-cyan/50 transition-all group">
              <Terminal className="w-10 h-10 text-accent-cyan mb-4" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">
                CLI Reference
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Complete command-line interface documentation
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>• All CLI commands</li>
                <li>• Options and flags</li>
                <li>• Interactive mode</li>
              </ul>
            </Link>

            <Link href="/docs/guides/tools" className="p-6 glass-morphic rounded-lg border border-border hover:border-accent-blue/50 transition-all group">
              <Wrench className="w-10 h-10 text-accent-blue mb-4" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-accent-blue transition-colors">
                Tools Guide
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Learn about all 17 built-in tools
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>• System tools (bash, python)</li>
                <li>• Data tools (json, csv, database)</li>
                <li>• AI providers</li>
              </ul>
            </Link>

            <Link href="/docs/guides/mcp" className="p-6 glass-morphic rounded-lg border border-border hover:border-accent-cyan/50 transition-all group">
              <Cpu className="w-10 h-10 text-accent-cyan mb-4" />
              <h3 className="text-xl font-bold mb-2 group-hover:text-accent-cyan transition-colors">
                MCP Integration
              </h3>
              <p className="text-zinc-400 text-sm mb-4">
                Connect external tools and services
              </p>
              <ul className="space-y-2 text-sm text-zinc-500">
                <li>• Model Context Protocol</li>
                <li>• Adding MCP servers</li>
                <li>• Common integrations</li>
              </ul>
            </Link>
          </div>

          {/* Additional Resources */}
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/examples" className="p-4 glass-morphic rounded-md border border-border hover:border-accent-blue/30 transition-all">
              <Code className="w-6 h-6 text-accent-blue mb-2" />
              <h4 className="font-semibold mb-1">Examples</h4>
              <p className="text-sm text-zinc-400">Working agent examples</p>
            </Link>

            <a 
              href="https://github.com/astickleyid/agent-builder-framework" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 glass-morphic rounded-md border border-border hover:border-accent-cyan/30 transition-all"
            >
              <Terminal className="w-6 h-6 text-accent-cyan mb-2" />
              <h4 className="font-semibold mb-1">GitHub</h4>
              <p className="text-sm text-zinc-400">View source code</p>
            </a>

            <a 
              href="https://npmjs.com/package/@stick-ai/cli" 
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 glass-morphic rounded-md border border-border hover:border-accent-blue/30 transition-all"
            >
              <Book className="w-6 h-6 text-accent-blue mb-2" />
              <h4 className="font-semibold mb-1">npm Package</h4>
              <p className="text-sm text-zinc-400">CLI on npm</p>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
