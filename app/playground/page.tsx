'use client';

import { useState } from 'react';
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Agent Builder Playground
          </h1>
          <p className="text-gray-600 mt-2">
            Build, configure, and test AI agents visually
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="bg-white rounded-lg shadow-sm p-2 flex gap-2">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'builder'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🛠️ Builder
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👁️ Preview
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all ${
              activeTab === 'test'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
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
