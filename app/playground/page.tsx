'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import ProIcon from '@/components/icons/ProIcon';
import TerminalIcon from '@/components/icons/TerminalIcon';
import AgentBuilder from '@/components/builder/AgentBuilder';
import AgentPreview from '@/components/builder/AgentPreview';
import AgentTester from '@/components/builder/AgentTester';

export default function Playground() {
  const [agentConfig, setAgentConfig] = useState({
    name: 'my-agent',
    description: 'A custom AI agent',
    provider: 'ollama',
    model: 'mistral:7b',
    tools: ['datetime', 'text'],
    instructions: 'You are a helpful AI assistant.',
    temperature: 0.7,
    maxTokens: 2000,
    capabilities: ['chat', 'reasoning']
  });

  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'test'>('builder');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <TerminalIcon className="w-6 h-6 text-accent-blue" />
            </div>
            <span className="text-xl font-bold">stick.ai</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Examples
            </Link>
            <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphic text-sm text-zinc-400 mb-6">
              <Sparkles className="w-4 h-4 text-accent-blue animate-pulse" />
              Interactive Visual Builder
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Agent Builder <span className="gradient-text">Playground</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Design, configure, and test intelligent AI agents with our intuitive visual interface—no code required
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="glass-morphic rounded-xl p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3 ${
              activeTab === 'builder'
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
          >
            <ProIcon name="wrench" size={20} />
            Builder
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3 ${
              activeTab === 'preview'
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
          >
            <ProIcon name="eye" size={20} />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-3 ${
              activeTab === 'test'
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
          >
            <ProIcon name="test" size={20} />
            Test
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {activeTab === 'builder' && (
          <AgentBuilder config={agentConfig} onChange={setAgentConfig} />
        )}
        {activeTab === 'preview' && (
          <AgentPreview config={agentConfig} />
        )}
        {activeTab === 'test' && (
          <AgentTester config={agentConfig} />
        )}
      </div>
    </div>
  );
}
