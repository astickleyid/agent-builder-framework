'use client';

import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import TerminalAnimation from '@/components/TerminalAnimation';
import HolographicNodes from '@/components/HolographicNodes';
import FeatureCard from '@/components/FeatureCard';
import AgentIcon from '@/components/icons/AgentIcon';
import OrchestrationIcon from '@/components/icons/OrchestrationIcon';
import WorkflowIcon from '@/components/icons/WorkflowIcon';
import { Terminal, Cpu, Network, Database, ArrowRight, Github, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AIAssistant />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
        {/* Holographic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
        
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphic text-sm text-zinc-400 mb-8">
            <Sparkles className="w-4 h-4 text-accent-blue" />
            Enterprise-grade AI agent orchestration
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
            Build. Deploy. Scale.
            <br />
            <span className="gradient-text">
              Your AI Agents
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-3xl mx-auto leading-relaxed font-light">
            The most advanced local-first agent framework. Configure, orchestrate, and deploy specialized AI agents with enterprise-grade tooling.
          </p>
          
          <div className="mb-16">
            <TerminalAnimation />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-8 py-4 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md font-semibold transition-all flex items-center gap-2 shadow-lg shadow-accent-blue/20">
              Start Building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 glass-morphic hover:bg-surface text-white rounded-md font-semibold transition-all flex items-center gap-2">
              <Github className="w-5 h-5" />
              View on GitHub
            </button>
          </div>
        </div>
      </section>

      {/* Orchestration Visualization */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Agent Orchestration
            </h2>
            <p className="text-zinc-400 text-xl max-w-2xl mx-auto">
              Visualize and control complex agent workflows in real-time
            </p>
          </div>
          <HolographicNodes />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Enterprise-Grade Features
            </h2>
            <p className="text-zinc-400 text-xl">
              Everything you need to build, deploy, and scale AI agents
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Terminal}
              title="Local-First Architecture"
              description="Zero cloud dependencies. Run agents entirely on your infrastructure with complete data sovereignty and privacy."
              index={0}
            />
            <FeatureCard
              icon={Cpu}
              title="Multi-Agent Orchestration"
              description="Coordinate multiple specialized agents working together. Define dependencies, workflows, and handoffs declaratively."
              index={1}
            />
            <FeatureCard
              icon={Network}
              title="Real-Time Monitoring"
              description="Track agent performance, resource usage, and execution flows with built-in observability and debugging tools."
              index={2}
            />
            <FeatureCard
              icon={Database}
              title="State Management"
              description="Persistent agent state with automatic checkpointing. Resume workflows and maintain context across sessions."
              index={3}
            />
            <FeatureCard
              icon={Terminal}
              title="Developer Experience"
              description="CLI-first design with hot reload, type safety, and intelligent autocomplete. Built by developers, for developers."
              index={4}
            />
            <FeatureCard
              icon={Network}
              title="Extensible Tooling"
              description="Integrate with any API, database, or service. Create custom tools with our plugin architecture in minutes."
              index={5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-6 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/5 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Get Started in Minutes
            </h2>
            <p className="text-zinc-400 text-xl">
              From zero to production-ready agents
            </p>
          </div>
          
          <div className="space-y-12">
            {/* Step 1 */}
            <div className="flex gap-8 items-start glass-morphic p-8 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-blue/20 border-2 border-accent-blue flex items-center justify-center text-accent-blue font-bold text-xl">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Install stick.ai</h3>
                <p className="text-zinc-400 mb-6 text-lg">
                  One command to install the framework globally
                </p>
                <div className="p-6 bg-black/40 border border-border/50 rounded-lg terminal-text text-sm overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Terminal className="w-4 h-4" />
                    <span>bash</span>
                  </div>
                  <pre className="text-accent-cyan">
{`$ npm install -g stick-ai
✓ Installing dependencies...
✓ Setting up agent framework...
✓ stick.ai is ready`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-8 items-start glass-morphic p-8 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-cyan/20 border-2 border-accent-cyan flex items-center justify-center text-accent-cyan font-bold text-xl">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Configure Your Agent</h3>
                <p className="text-zinc-400 mb-6 text-lg">
                  Define behavior, tools, and capabilities with declarative JSON
                </p>
                <div className="p-6 bg-black/40 border border-border/50 rounded-lg terminal-text text-sm overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Terminal className="w-4 h-4" />
                    <span>agent.config.json</span>
                  </div>
                  <pre className="text-zinc-300">
{`{
  "name": "customer_support",
  "version": "1.0.0",
  "description": "24/7 customer support agent",
  "capabilities": ["chat", "email", "tickets"],
  "tools": ["database", "crm", "analytics"],
  "instructions": "Provide helpful support..."
}`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-8 items-start glass-morphic p-8 rounded-lg">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-blue/20 border-2 border-accent-blue flex items-center justify-center text-accent-blue font-bold text-xl">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-3">Deploy & Scale</h3>
                <p className="text-zinc-400 mb-6 text-lg">
                  Launch locally or deploy to your infrastructure
                </p>
                <div className="p-6 bg-black/40 border border-border/50 rounded-lg terminal-text text-sm overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Terminal className="w-4 h-4" />
                    <span>bash</span>
                  </div>
                  <pre className="text-accent-cyan">
{`$ stick deploy
✓ Building agent...
✓ Running health checks...
✓ Agent deployed at localhost:3000
✓ Ready to serve requests`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Simple, Transparent Pricing
            </h2>
            <p className="text-zinc-400 text-xl">
              Start free, scale as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="holographic-card p-8 rounded-lg border border-border/50">
              <h3 className="text-2xl font-bold mb-2">Open Source</h3>
              <div className="text-4xl font-bold mb-6">$0<span className="text-xl text-zinc-400 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Unlimited local agents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Core tooling & CLI</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Community support</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 glass-morphic hover:bg-surface border border-border text-white rounded-md font-semibold transition-all">
                Start Building
              </button>
            </div>

            {/* Pro Tier */}
            <div className="relative holographic-card p-8 rounded-lg border-2 border-accent-blue shadow-xl shadow-accent-blue/20">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-accent-blue text-white text-sm font-semibold rounded-full">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <div className="text-4xl font-bold mb-6">$49<span className="text-xl text-zinc-400 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Everything in Open Source</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Cloud deployment options</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Advanced monitoring & analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Priority support</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md font-semibold transition-all shadow-lg shadow-accent-blue/20">
                Get Started
              </button>
            </div>

            {/* Enterprise Tier */}
            <div className="holographic-card p-8 rounded-lg border border-border/50">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-6">Custom</div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Everything in Professional</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Dedicated infrastructure</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">Custom integrations & SLAs</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300">24/7 enterprise support</span>
                </li>
              </ul>
              <button className="w-full px-6 py-3 glass-morphic hover:bg-surface border border-border text-white rounded-md font-semibold transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Ready to Transform Your Workflow?
          </h2>
          <p className="text-zinc-400 text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of developers building the next generation of AI-powered applications with stick.ai
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-5 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-md font-bold transition-all text-lg shadow-lg shadow-accent-blue/20">
              Start Building Free
            </button>
            <button className="px-10 py-5 glass-morphic hover:bg-surface text-white rounded-md font-bold transition-all text-lg">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Terminal className="w-6 h-6 text-accent-blue" />
                <span className="text-xl font-bold">stick.ai</span>
              </div>
              <p className="text-zinc-400 text-sm">
                Enterprise-grade AI agent orchestration framework.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#docs" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-zinc-400 text-sm">
              © 2024 stick.ai. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <Terminal className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
