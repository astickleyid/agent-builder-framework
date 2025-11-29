'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';
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
      {/* Header */}
      <div className="glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <Terminal className="w-5 h-5 text-accent-blue" />
              <span className="font-semibold">stick.ai</span>
            </Link>
          </div>
          <h1 className="text-4xl font-bold gradient-text">
            Agent Builder Playground
          </h1>
          <p className="text-zinc-400 mt-2">
            Build, configure, and test AI agents visually
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="glass-morphic rounded-lg p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'builder'
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
          >
            🛠️ Builder
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
          >
            👁️ Preview
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'test'
                ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                : 'text-zinc-400 hover:bg-surface hover:text-white'
            }`}
          >
            🧪 Test
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-7xl mx-auto px-8 pb-8">
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
