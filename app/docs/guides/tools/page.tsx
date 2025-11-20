'use client';

import { Terminal, Wrench } from 'lucide-react';
import Link from 'next/link';

const tools = [
  { name: 'bash', category: 'System', desc: 'Execute bash commands' },
  { name: 'python', category: 'System', desc: 'Run Python scripts' },
  { name: 'http', category: 'Web', desc: 'Make HTTP requests' },
  { name: 'web-scraper', category: 'Web', desc: 'Scrape web pages' },
  { name: 'json', category: 'Data', desc: 'Parse and manipulate JSON' },
  { name: 'csv', category: 'Data', desc: 'Work with CSV files' },
  { name: 'xml', category: 'Data', desc: 'Parse XML documents' },
  { name: 'database', category: 'Data', desc: 'Query databases' },
  { name: 'file-ops', category: 'Files', desc: 'Read/write files' },
  { name: 'email', category: 'Communication', desc: 'Send emails' },
  { name: 'slack', category: 'Communication', desc: 'Slack integration' },
  { name: 'github', category: 'Development', desc: 'GitHub API access' },
  { name: 'datetime', category: 'Utilities', desc: 'Date/time operations' },
  { name: 'text', category: 'Utilities', desc: 'Text manipulation' },
  { name: 'openai', category: 'AI', desc: 'OpenAI integration' },
  { name: 'anthropic', category: 'AI', desc: 'Anthropic Claude' },
  { name: 'ollama', category: 'AI', desc: 'Local Ollama models' }
];

const categories = ['System', 'Web', 'Data', 'Files', 'Communication', 'Development', 'Utilities', 'AI'];

export default function ToolsGuide() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-accent-blue" />
            <span className="text-xl font-bold">stick.ai</span>
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <Link href="/docs" className="text-sm text-accent-blue hover:underline mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">Tools</span> Guide
          </h1>
          <p className="text-xl text-zinc-400 mb-12">
            17 built-in tools for your AI agents
          </p>

          {categories.map(cat => (
            <section key={cat} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Wrench className="w-6 h-6 text-accent-blue" />
                {cat}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.filter(t => t.category === cat).map(tool => (
                  <div key={tool.name} className="glass-morphic rounded-lg p-4 border border-border">
                    <code className="text-accent-cyan font-mono text-sm">{tool.name}</code>
                    <p className="text-zinc-400 text-sm mt-2">{tool.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="mt-12 glass-morphic rounded-lg p-6 border border-accent-blue/20">
            <h2 className="text-2xl font-bold mb-4">Configuring Tools</h2>
            <p className="text-zinc-400 mb-4">Use the interactive CLI:</p>
            <pre className="bg-surface/50 border border-border rounded-md p-4">
              <code className="text-accent-cyan">stick{'\n'}→ Configure Tools</code>
            </pre>
          </section>
        </div>
      </div>
    </main>
  );
}
