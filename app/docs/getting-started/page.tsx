'use client';

import { Terminal, Cpu, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function GettingStarted() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const CodeBlock = ({ code, index, language = 'bash' }: { code: string; index: number; language?: string }) => (
    <div className="relative group">
      <button
        onClick={() => copyToClipboard(code, index)}
        className="absolute right-2 top-2 p-2 rounded-md bg-surface/50 hover:bg-surface opacity-0 group-hover:opacity-100 transition-all"
      >
        {copiedIndex === index ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-zinc-400" />
        )}
      </button>
      <pre className="bg-surface/50 border border-border rounded-md p-4 overflow-x-auto text-sm">
        <code className="text-accent-cyan">{code}</code>
      </pre>
    </div>
  );

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
            <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
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

      {/* Content */}
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          {/* Hero */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphic text-sm text-zinc-400 mb-6">
              <Sparkles className="w-4 h-4 text-accent-blue" />
              Getting Started Guide
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Build Your First
              <br />
              <span className="gradient-text">AI Agent</span>
            </h1>
            <p className="text-xl text-zinc-400">
              Create a production-ready AI agent in less than 5 minutes. No complex setup, no cloud dependencies.
            </p>
          </div>

          {/* Installation */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-sm font-bold">
                1
              </div>
              Installation
            </h2>
            <p className="text-zinc-400 mb-6">
              Install the stick.ai CLI globally using npm:
            </p>
            <CodeBlock code="npm install -g @stick-ai/cli" index={0} />
            
            <div className="mt-6 p-4 glass-morphic rounded-md border border-accent-blue/20">
              <p className="text-sm text-zinc-300">
                <strong className="text-accent-blue">Note:</strong> Requires Node.js 18+ and npm 9+
              </p>
            </div>
          </section>

          {/* Create Agent */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-sm font-bold">
                2
              </div>
              Create Your First Agent
            </h2>
            <p className="text-zinc-400 mb-6">
              Launch the interactive CLI to create your agent:
            </p>
            <CodeBlock code="stick" index={1} />
            
            <div className="mt-8 space-y-4">
              <div className="p-4 glass-morphic rounded-md">
                <h3 className="font-semibold text-lg mb-2">Interactive Mode</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  The CLI will guide you through:
                </p>
                <ul className="space-y-2 text-sm text-zinc-300">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    </div>
                    Choosing an agent name
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    </div>
                    Selecting a template (Chatbot, Assistant, Researcher, Developer, Analyst)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    </div>
                    Picking an AI provider (OpenAI, Anthropic, Ollama, or none)
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-accent-blue" />
                    </div>
                    Configuring tools (17 built-in tools available)
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-surface/30 border border-border rounded-md">
                <h4 className="font-semibold mb-2 text-sm">Or use the command-line directly:</h4>
                <CodeBlock 
                  code="stick init my-agent --template chatbot --ai openai" 
                  index={2} 
                />
              </div>
            </div>
          </section>

          {/* Configure & Run */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center text-accent-blue text-sm font-bold">
                3
              </div>
              Install Dependencies & Run
            </h2>
            <p className="text-zinc-400 mb-6">
              Navigate to your agent directory and install dependencies:
            </p>
            <CodeBlock 
              code={`cd my-agent\nnpm install`} 
              index={3} 
            />
            
            <div className="mt-6 p-4 glass-morphic rounded-md">
              <h3 className="font-semibold mb-2">Set Up API Keys (if using AI providers)</h3>
              <p className="text-sm text-zinc-400 mb-4">
                Create a <code className="text-accent-cyan">.env</code> file:
              </p>
              <CodeBlock 
                code={`# For OpenAI\nOPENAI_API_KEY=sk-your-key-here\n\n# For Anthropic\nANTHROPIC_API_KEY=your-key-here\n\n# For Ollama (local)\nOLLAMA_BASE_URL=http://localhost:11434`}
                index={4}
              />
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-4">Start Your Agent</h3>
              <CodeBlock code="npm start" index={5} />
            </div>
          </section>

          {/* What's Next */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6">What's Next?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <Link href="/docs/guides/tools" className="p-6 glass-morphic rounded-md border border-border hover:border-accent-blue/50 transition-all group">
                <Cpu className="w-8 h-8 text-accent-blue mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-blue transition-colors">
                  Explore Tools
                </h3>
                <p className="text-sm text-zinc-400">
                  Learn about the 17 built-in tools and how to configure them
                </p>
              </Link>
              
              <Link href="/docs/guides/mcp" className="p-6 glass-morphic rounded-md border border-border hover:border-accent-blue/50 transition-all group">
                <Terminal className="w-8 h-8 text-accent-cyan mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-cyan transition-colors">
                  MCP Integration
                </h3>
                <p className="text-sm text-zinc-400">
                  Connect external tools via Model Context Protocol
                </p>
              </Link>
              
              <Link href="/examples" className="p-6 glass-morphic rounded-md border border-border hover:border-accent-blue/50 transition-all group">
                <Sparkles className="w-8 h-8 text-accent-blue mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-blue transition-colors">
                  Example Agents
                </h3>
                <p className="text-sm text-zinc-400">
                  Browse working examples and copy-paste templates
                </p>
              </Link>
              
              <Link href="/docs/reference/cli" className="p-6 glass-morphic rounded-md border border-border hover:border-accent-blue/50 transition-all group">
                <Terminal className="w-8 h-8 text-accent-cyan mb-3" />
                <h3 className="font-semibold text-lg mb-2 group-hover:text-accent-cyan transition-colors">
                  CLI Reference
                </h3>
                <p className="text-sm text-zinc-400">
                  Complete command-line interface documentation
                </p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="text-center p-8 glass-morphic rounded-lg border border-accent-blue/20">
            <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
            <p className="text-zinc-400 mb-6">
              Join our community on Discord or check out the full documentation
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="https://discord.gg/stickai" 
                className="px-6 py-3 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md font-semibold transition-all"
              >
                Join Discord
              </a>
              <Link 
                href="/docs" 
                className="px-6 py-3 glass-morphic hover:bg-surface text-white rounded-md font-semibold transition-all"
              >
                Full Docs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
