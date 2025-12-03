'use client';

import { useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

const AVAILABLE_TOOLS = [
  'datetime', 'text', 'json', 'csv', 'xml', 'yaml',
  'http', 'bash', 'filesystem', 'calculator',
  'web-search', 'github', 'database'
];

const PROVIDERS = [
  { id: 'ollama', name: 'Ollama (Local)', models: ['mistral:7b', 'llama2:13b', 'codellama:7b'] },
  { id: 'openai', name: 'OpenAI', models: ['gpt-4', 'gpt-3.5-turbo'] },
  { id: 'anthropic', name: 'Anthropic', models: ['claude-3-opus', 'claude-3-sonnet'] }
];

const MCP_SERVERS = [
  { id: 'filesystem', name: 'Filesystem', description: 'Read/write files' },
  { id: 'brave-search', name: 'Brave Search', description: 'Web search' },
  { id: 'github', name: 'GitHub', description: 'GitHub integration' },
  { id: 'sqlite', name: 'SQLite', description: 'SQLite database' },
  { id: 'postgres', name: 'PostgreSQL', description: 'PostgreSQL database' }
];

interface AgentBuilderProps {
  config: any;
  onChange: (config: any) => void;
}

export default function AgentBuilder({ config, onChange }: AgentBuilderProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const toggleTool = (tool: string) => {
    const tools = config.tools.includes(tool)
      ? config.tools.filter((t: string) => t !== tool)
      : [...config.tools, tool];
    updateConfig('tools', tools);
  };

  const addMCPServer = (serverId: string) => {
    const mcpServers = config.mcpServers || [];
    if (!mcpServers.find((s: any) => s.id === serverId)) {
      updateConfig('mcpServers', [...mcpServers, { id: serverId, enabled: true }]);
    }
  };

  const saveAgent = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE}/api/agents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Failed to save agent');
      }

      const data = await response.json();
      onChange({ ...config, id: data.agent.id });
      setMessage({ type: 'success', text: 'Agent saved successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const deployAgent = async () => {
    if (!config.id) {
      setMessage({ type: 'error', text: 'Please save the agent first' });
      return;
    }

    setDeploying(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE}/api/agents/${config.id}/deploy`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to deploy agent');
      }

      const data = await response.json();
      setMessage({ type: 'success', text: `Agent deployed at ${data.url}` });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setDeploying(false);
    }
  };

  const exportJSON = () => {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name || 'agent'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetConfig = () => {
    const defaultConfig = {
      name: 'my-agent',
      description: 'A custom AI agent',
      provider: 'ollama',
      model: 'mistral:7b',
      tools: ['datetime', 'text'],
      instructions: 'You are a helpful AI assistant.',
      temperature: 0.7,
      maxTokens: 2000,
      capabilities: ['chat', 'reasoning']
    };
    onChange(defaultConfig);
    setMessage({ type: 'success', text: 'Configuration reset' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Configuration */}
      <div className="holographic-card rounded-xl border border-border p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Basic Configuration</h2>
        </div>

        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => updateConfig('name', e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none"
            placeholder="my-awesome-agent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Description
          </label>
          <textarea
            value={config.description}
            onChange={(e) => updateConfig('description', e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none"
            rows={3}
            placeholder="Describe what your agent does..."
          />
        </div>

        {/* LLM Provider */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            LLM Provider
          </label>
          <select
            value={config.provider}
            onChange={(e) => updateConfig('provider', e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white focus:border-accent-blue focus:outline-none"
          >
            {PROVIDERS.map((provider) => (
              <option key={provider.id} value={provider.id}>
                {provider.name}
              </option>
            ))}
          </select>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Model
          </label>
          <select
            value={config.model}
            onChange={(e) => updateConfig('model', e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white focus:border-accent-blue focus:outline-none"
          >
            {PROVIDERS.find(p => p.id === config.provider)?.models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            System Instructions
          </label>
          <textarea
            value={config.instructions}
            onChange={(e) => updateConfig('instructions', e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none"
            rows={5}
            placeholder="You are a helpful AI assistant..."
          />
        </div>
      </div>

      {/* Tools & Advanced */}
      <div className="space-y-6">
        {/* Native Tools */}
        <div className="holographic-card rounded-xl border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-4">Native Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_TOOLS.map((tool) => (
              <button
                key={tool}
                onClick={() => toggleTool(tool)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  config.tools.includes(tool)
                    ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                    : 'bg-surface text-zinc-400 hover:bg-surface-hover hover:text-white border border-border'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* MCP Servers */}
        <div className="holographic-card rounded-xl border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-4">MCP Servers</h3>
          <div className="space-y-3">
            {MCP_SERVERS.map((server) => (
              <div
                key={server.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:border-accent-blue/50 transition-colors"
              >
                <div>
                  <div className="font-medium text-white">{server.name}</div>
                  <div className="text-sm text-zinc-500">{server.description}</div>
                </div>
                <button
                  onClick={() => addMCPServer(server.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    config.mcpServers?.find((s: any) => s.id === server.id)
                      ? 'bg-accent-cyan text-white'
                      : 'bg-accent-blue text-white hover:bg-accent-blue/90'
                  }`}
                >
                  {config.mcpServers?.find((s: any) => s.id === server.id) ? '✓ Added' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="holographic-card rounded-xl border border-border p-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xl font-bold text-white mb-4"
          >
            <span>Advanced Settings</span>
            <span className="text-accent-blue">{showAdvanced ? '▼' : '▶'}</span>
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Temperature: {config.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                  className="w-full accent-accent-blue"
                />
                <div className="flex justify-between text-xs text-zinc-500 mt-1">
                  <span>Focused</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-white focus:border-accent-blue focus:outline-none"
                  min="100"
                  max="8000"
                  step="100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {message && (
          <div className={`holographic-card rounded-xl border p-4 ${
            message.type === 'success' ? 'border-accent-cyan bg-accent-cyan/10' : 'border-red-500 bg-red-500/10'
          }`}>
            <p className={message.type === 'success' ? 'text-accent-cyan' : 'text-red-400'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="holographic-card rounded-xl border border-border p-6">
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={saveAgent}
              disabled={saving}
              className="px-6 py-3 bg-accent-cyan text-white rounded-lg font-medium hover:bg-accent-cyan/90 transition-all shadow-lg shadow-accent-cyan/20 disabled:opacity-50"
            >
              {saving ? '⏳ Saving...' : '💾 Save Agent'}
            </button>
            <button 
              onClick={deployAgent}
              disabled={deploying || !config.id}
              className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20 disabled:opacity-50"
            >
              {deploying ? '⏳ Deploying...' : '🚀 Deploy'}
            </button>
            <button 
              onClick={exportJSON}
              className="px-6 py-3 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all"
            >
              📋 Export JSON
            </button>
            <button 
              onClick={resetConfig}
              className="px-6 py-3 glass-morphic text-zinc-400 rounded-lg font-medium hover:bg-surface hover:text-white transition-all"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
