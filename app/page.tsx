import { Terminal, Zap, Code2, Sparkles, ArrowRight, Github } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-surface border border-border text-sm text-zinc-400 mb-8">
            <Sparkles className="w-4 h-4 text-accent-purple" />
            Build AI agents locally, without limits
          </div>
          
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">
            Build Custom Agents
            <br />
            <span className="bg-gradient-to-r from-accent-purple via-accent-blue to-accent-cyan bg-clip-text text-transparent">
              In Minutes
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            A local-first framework for creating specialized AI agents. Define behavior, tools, and design preferences — no cloud required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-6 py-3 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-md font-medium transition-all flex items-center gap-2">
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-6 py-3 bg-transparent hover:bg-surface border border-border text-white rounded-md font-medium transition-all flex items-center gap-2">
              <Github className="w-4 h-4" />
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold mb-4">
              Everything you need
            </h2>
            <p className="text-zinc-400 text-lg">
              Purpose-built for AI agent development
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="group p-8 bg-surface hover:bg-surface-hover border border-border rounded-lg transition-all">
              <div className="w-12 h-12 bg-accent-purple/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6 text-accent-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Local-First</h3>
              <p className="text-zinc-400 leading-relaxed">
                Run everything on your machine. Full control over your agents, data, and execution environment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-surface hover:bg-surface-hover border border-border rounded-lg transition-all">
              <div className="w-12 h-12 bg-accent-blue/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-accent-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Fast Setup</h3>
              <p className="text-zinc-400 leading-relaxed">
                Define your agent with JSON config. Instructions, tools, design preferences — all in one file.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-surface hover:bg-surface-hover border border-border rounded-lg transition-all">
              <div className="w-12 h-12 bg-accent-cyan/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6 text-accent-cyan" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Tool Integration</h3>
              <p className="text-zinc-400 leading-relaxed">
                Access bash, file operations, GitHub APIs, and web search. Extend with custom tools easily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold mb-4">
              Simple by design
            </h2>
            <p className="text-zinc-400 text-lg">
              Three steps to your custom agent
            </p>
          </div>
          
          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center text-accent-purple font-semibold">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Define Your Agent</h3>
                <p className="text-zinc-400 mb-4">
                  Create a JSON config with name, description, instructions, and available tools.
                </p>
                <div className="p-4 bg-surface border border-border rounded-lg font-mono text-sm overflow-x-auto">
                  <pre className="text-zinc-300">
{`{
  "name": "build_architect",
  "description": "Technical build architect...",
  "instructions": "You are the Build Architect...",
  "tools": ["bash", "view", "edit", "create"]
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue font-semibold">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Register It</h3>
                <p className="text-zinc-400 mb-4">
                  Place your config in the agents directory where your CLI can find it.
                </p>
                <div className="p-4 bg-surface border border-border rounded-lg font-mono text-sm">
                  <pre className="text-zinc-300">~/.config/github-copilot-cli/agents/your-agent/</pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan font-semibold">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Use It</h3>
                <p className="text-zinc-400 mb-4">
                  Invoke your agent and let it execute with its specialized knowledge.
                </p>
                <div className="p-4 bg-surface border border-border rounded-lg font-mono text-sm">
                  <pre className="text-zinc-300">$ gh copilot --agent your_agent "build something"</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-semibold mb-6">
            Ready to build your agent?
          </h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
            Start creating specialized AI agents that understand your preferences and execute with precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-accent-purple hover:bg-accent-purple/90 text-white rounded-md font-medium transition-all text-lg">
              Get Started
            </button>
            <button className="px-8 py-4 bg-transparent hover:bg-surface border border-border text-white rounded-md font-medium transition-all text-lg">
              Read Docs
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-zinc-400 text-sm">
            © 2024 Agent Builder Framework. Built for AI creators.
          </div>
          <div className="flex gap-6 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">Examples</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
