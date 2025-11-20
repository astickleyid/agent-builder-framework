'use client';

import { Terminal } from 'lucide-react';
import Link from 'next/link';

export default function CLIReference() {
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
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/docs" className="text-sm text-accent-blue hover:underline mb-4 inline-block">
            ← Back to Docs
          </Link>
          <h1 className="text-5xl font-bold mb-4">
            CLI <span className="gradient-text">Reference</span>
          </h1>
          <p className="text-xl text-zinc-400 mb-12">
            Complete CLI command documentation
          </p>

          <section className="glass-morphic rounded-lg p-6 border border-border mb-6">
            <h2 className="text-2xl font-bold mb-2 text-accent-cyan font-mono">stick</h2>
            <p className="text-zinc-400 mb-4">Launch interactive mode</p>
            <pre className="bg-surface/50 border border-border rounded-md p-4">
              <code className="text-accent-cyan">stick</code>
            </pre>
          </section>

          <section className="glass-morphic rounded-lg p-6 border border-border">
            <h2 className="text-2xl font-bold mb-2 text-accent-cyan font-mono">stick init</h2>
            <p className="text-zinc-400 mb-4">Create a new agent</p>
            <pre className="bg-surface/50 border border-border rounded-md p-4">
              <code className="text-accent-cyan">stick init &lt;name&gt;</code>
            </pre>
          </section>
        </div>
      </div>
    </main>
  );
}
