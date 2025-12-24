'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import AIAssistant from '@/components/AIAssistant';
import TerminalAnimation from '@/components/TerminalAnimation';
import HolographicNodes from '@/components/HolographicNodes';
import FeatureCard from '@/components/FeatureCard';
import ProIcon from '@/components/icons/ProIcon';
import SparklesIcon from '@/components/icons/SparklesIcon';
import GithubIcon from '@/components/icons/GithubIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import TerminalIcon from '@/components/icons/TerminalIcon';
import { Terminal } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <AIAssistant />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 overflow-hidden pt-20">
        {/* Holographic Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(14,165,233,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_90%)]" />
        
        {/* Animated glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-accent-blue/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-morphic text-xs sm:text-sm text-zinc-400 mb-6 sm:mb-8 animate-fade-in">
            <SparklesIcon className="w-3 h-3 sm:w-4 sm:h-4 text-accent-blue" />
            <span className="whitespace-nowrap">Enterprise-Grade AI Agent Orchestration • Local-First • Open Source</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 sm:mb-8 leading-tight animate-fade-in-up">
            Build. Deploy. Scale.
            <br />
            <span className="gradient-text">
              Intelligent AI Agents
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-zinc-400 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            The most powerful local-first AI agent framework. Orchestrate specialized agents with complete data sovereignty, zero cloud dependencies, and enterprise-grade security.
          </p>
          
          <div className="mb-12 sm:mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <TerminalAnimation />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center flex-wrap px-4 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <Link 
              href="/docs/quick-start" 
              className="group px-6 sm:px-10 py-3 sm:py-4 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-3 shadow-xl shadow-accent-blue/30 hover:shadow-accent-blue/50 hover:scale-105 text-sm sm:text-base"
            >
              Start Building Now
              <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/playground" 
              className="group px-6 sm:px-10 py-3 sm:py-4 glass-morphic hover:bg-white/10 border border-white/20 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-3 hover:scale-105 text-sm sm:text-base"
            >
              <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Try Interactive Demo
            </Link>
            <a 
              href="https://github.com/astickleyid/agent-builder-framework" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group px-6 sm:px-10 py-3 sm:py-4 glass-morphic hover:bg-surface border border-white/10 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-3 hover:scale-105 text-sm sm:text-base"
            >
              <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              Star on GitHub
            </a>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              <span>100% Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              <span>Zero Cloud Lock-in</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
              <span>Enterprise Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* Orchestration Visualization */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 animate-fade-in-up">
              Agent Orchestration
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Visualize and control complex agent workflows in real-time
            </p>
          </div>
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <HolographicNodes />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-morphic text-xs sm:text-sm text-accent-blue mb-4 sm:mb-6 font-semibold animate-fade-in">
              <ProIcon name="zap" size={16} />
              Powerful Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 animate-fade-in-up">
              Enterprise-Grade Capabilities
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Production-ready tools and infrastructure to build, deploy, and scale intelligent AI agents with confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard
              iconName="terminal"
              title="Local-First Architecture"
              description="Maintain complete data sovereignty with zero cloud dependencies. Deploy agents on your infrastructure with full control over security, privacy, and compliance."
              index={0}
            />
            <FeatureCard
              iconName="cpu"
              title="Multi-Agent Orchestration"
              description="Coordinate teams of specialized agents working in harmony. Define complex workflows, dependencies, and handoffs with simple declarative configurations."
              index={1}
            />
            <FeatureCard
              iconName="network"
              title="Real-Time Observability"
              description="Monitor agent performance, track resource utilization, and debug execution flows with enterprise-grade observability tools built directly into the framework."
              index={2}
            />
            <FeatureCard
              iconName="database"
              title="Intelligent State Management"
              description="Automatic checkpointing and persistent state ensure your agents never lose context. Resume interrupted workflows seamlessly across sessions."
              index={3}
            />
            <FeatureCard
              iconName="terminal"
              title="Superior Developer Experience"
              description="Enjoy CLI-first design with hot reload, full TypeScript support, and intelligent autocomplete. Purpose-built by developers for developers."
              index={4}
            />
            <FeatureCard
              iconName="network"
              title="Extensible Plugin System"
              description="Seamlessly integrate with any API, database, or service. Build custom tools and plugins using our intuitive architecture—deploy in minutes, not days."
              index={5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-blue/5 to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-block px-3 sm:px-4 py-2 rounded-full glass-morphic text-xs sm:text-sm text-accent-cyan mb-4 sm:mb-6 font-semibold animate-fade-in">
              🚀 Quick Start Guide
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 animate-fade-in-up">
              Launch Your First Agent in Minutes
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              From installation to production deployment—experience the fastest path to intelligent AI agents
            </p>
          </div>
          
          <div className="space-y-8 sm:space-y-12">
            {/* Step 1 */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start glass-morphic p-4 sm:p-8 rounded-lg animate-slide-in-left">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-blue/20 border-2 border-accent-blue flex items-center justify-center text-accent-blue font-bold text-lg sm:text-xl">
                1
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Install the Framework</h3>
                <p className="text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                  Deploy the complete agent framework with a single command—ready in seconds
                </p>
                <div className="p-4 sm:p-6 bg-black/40 border border-border/50 rounded-lg terminal-text text-xs sm:text-sm overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
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
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start glass-morphic p-4 sm:p-8 rounded-lg animate-slide-in-right">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-cyan/20 border-2 border-accent-cyan flex items-center justify-center text-accent-cyan font-bold text-lg sm:text-xl">
                2
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Configure Your Agent</h3>
                <p className="text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                  Define capabilities, behavior, and tools using intuitive declarative configuration
                </p>
                <div className="p-4 sm:p-6 bg-black/40 border border-border/50 rounded-lg terminal-text text-xs sm:text-sm overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
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
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-start glass-morphic p-4 sm:p-8 rounded-lg animate-slide-in-left">
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-blue/20 border-2 border-accent-blue flex items-center justify-center text-accent-blue font-bold text-lg sm:text-xl">
                3
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Deploy & Scale Instantly</h3>
                <p className="text-zinc-400 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                  Launch locally for testing or deploy to production infrastructure with zero friction
                </p>
                <div className="p-4 sm:p-6 bg-black/40 border border-border/50 rounded-lg terminal-text text-xs sm:text-sm overflow-x-auto">
                  <div className="flex items-center gap-2 mb-2 text-zinc-500">
                    <Terminal className="w-3 h-3 sm:w-4 sm:h-4" />
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
      <section id="pricing" className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-morphic text-xs sm:text-sm text-accent-blue mb-4 sm:mb-6 font-semibold animate-fade-in">
              <ProIcon name="dollar" size={16} />
              Flexible Plans
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 animate-fade-in-up">
              Simple, Transparent Pricing
            </h2>
            <p className="text-zinc-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              Start building for free with our open-source core. Scale with premium features as your needs grow.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Free Tier */}
            <div className="holographic-card p-6 sm:p-8 rounded-xl border border-border/50 hover:border-accent-blue/50 transition-all animate-scale-in">
              <div className="text-xs sm:text-sm font-semibold text-accent-cyan mb-3 sm:mb-4">FOREVER FREE</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Open Source</h3>
              <div className="text-4xl sm:text-5xl font-bold mb-2">$0</div>
              <div className="text-zinc-500 mb-6 sm:mb-8 text-sm sm:text-base">No credit card required</div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Unlimited local agents</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Full CLI & core tooling</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Community support via Discord</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Complete documentation access</span>
                </li>
              </ul>
              <Link href="/docs/quick-start" className="block w-full px-4 sm:px-6 py-3 sm:py-4 glass-morphic hover:bg-surface border border-border text-white rounded-xl font-semibold transition-all text-center hover:scale-105 text-sm sm:text-base">
                Start Building Now
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="relative holographic-card p-6 sm:p-8 rounded-xl border-2 border-accent-blue shadow-2xl shadow-accent-blue/30 transform hover:scale-105 transition-all animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 px-3 sm:px-4 py-1 sm:py-1.5 bg-accent-blue text-white text-xs font-bold rounded-full uppercase tracking-wide">
                Coming Soon
              </div>
              <div className="text-xs sm:text-sm font-semibold text-accent-blue mb-3 sm:mb-4">MOST POPULAR</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Professional</h3>
              <div className="text-4xl sm:text-5xl font-bold mb-2">$49</div>
              <div className="text-zinc-500 mb-6 sm:mb-8 text-sm sm:text-base">per user / month</div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Everything in Open Source</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Managed cloud deployment</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Advanced monitoring & analytics dashboard</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Priority email & chat support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">99.9% uptime SLA</span>
                </li>
              </ul>
              <a href="mailto:hello@stick.ai?subject=Professional Plan Early Access" className="block w-full px-4 sm:px-6 py-3 sm:py-4 bg-accent-blue/50 cursor-not-allowed text-white rounded-xl font-semibold text-center text-sm sm:text-base">
                Join Waitlist
              </a>
            </div>

            {/* Enterprise Tier */}
            <div className="holographic-card p-6 sm:p-8 rounded-xl border border-border/50 hover:border-accent-cyan/50 transition-all animate-scale-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.4s' }}>
              <div className="text-xs sm:text-sm font-semibold text-accent-cyan mb-3 sm:mb-4">ENTERPRISE SCALE</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl sm:text-5xl font-bold mb-2">Custom</div>
              <div className="text-zinc-500 mb-6 sm:mb-8 text-sm sm:text-base">Tailored to your needs</div>
              <ul className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Everything in Professional</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Dedicated cloud infrastructure</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Custom integrations & API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">Custom SLA & compliance support</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent-blue/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-accent-blue" />
                  </div>
                  <span className="text-zinc-300 text-sm sm:text-base">24/7 dedicated support team</span>
                </li>
              </ul>
              <a href="mailto:hello@stick.ai?subject=Enterprise Inquiry" className="block w-full px-4 sm:px-6 py-3 sm:py-4 glass-morphic hover:bg-surface border border-border text-white rounded-xl font-semibold transition-all text-center hover:scale-105 text-sm sm:text-base">
                Contact Sales Team
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 lg:py-32 px-4 sm:px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-blue/10 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 bg-accent-blue/10 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full glass-morphic text-xs sm:text-sm text-accent-blue mb-6 sm:mb-8 font-semibold animate-fade-in">
            <ProIcon name="sparkles" size={16} />
            Ready to Get Started?
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 sm:mb-6 leading-tight animate-fade-in-up">
            Transform Your Business with
            <br />
            <span className="gradient-text">Intelligent AI Agents</span>
          </h2>
          <p className="text-zinc-400 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Join innovative teams already leveraging stick.ai to build production-grade AI agents. Start free—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link 
              href="/docs/quick-start" 
              className="px-8 sm:px-12 py-4 sm:py-5 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-xl font-bold transition-all text-base sm:text-lg shadow-2xl shadow-accent-blue/40 hover:scale-105 hover:shadow-accent-blue/60"
            >
              Start Building Now →
            </Link>
            <a 
              href="mailto:hello@stick.ai?subject=Schedule Enterprise Demo" 
              className="px-8 sm:px-12 py-4 sm:py-5 glass-morphic hover:bg-surface border border-white/20 text-white rounded-xl font-bold transition-all text-base sm:text-lg hover:scale-105"
            >
              Schedule Enterprise Demo
            </a>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-6 sm:mt-8 animate-fade-in">
            💡 Free forever • No credit card • Full access to core features
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 px-4 sm:px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <TerminalIcon className="w-5 h-5 sm:w-6 sm:h-6 text-accent-blue" />
                <span className="text-lg sm:text-xl font-bold">stick.ai</span>
              </div>
              <p className="text-zinc-400 text-xs sm:text-sm">
                Enterprise-grade AI agent orchestration framework.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/examples" className="hover:text-white transition-colors">Examples</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Resources</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
                <li><Link href="/docs/quick-start" className="hover:text-white transition-colors">Getting Started</Link></li>
                <li><Link href="/docs/cli" className="hover:text-white transition-colors">CLI Reference</Link></li>
                <li><Link href="/docs/tools" className="hover:text-white transition-colors">Tools Guide</Link></li>
                <li><a href="https://github.com/astickleyid/agent-builder-framework" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Community</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-zinc-400">
                <li><a href="https://discord.gg/stickai" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://npmjs.com/package/@stick-ai/cli" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">npm</a></li>
                <li><a href="https://github.com/astickleyid/agent-builder-framework/issues" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Report Issue</a></li>
                <li><a href="mailto:hello@stick.ai" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-zinc-400 text-xs sm:text-sm text-center md:text-left">
              © 2024 stick.ai. All rights reserved.
            </div>
            <div className="flex gap-4 sm:gap-6">
              <a href="https://github.com/astickleyid/agent-builder-framework" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="https://npmjs.com/package/@stick-ai/cli" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
                <TerminalIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
