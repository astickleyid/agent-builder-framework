'use client';

import { useState } from 'react';
import ProIcon from '@/components/icons/ProIcon';

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
  const [showLoadMenu, setShowLoadMenu] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const updateConfig = (field: string, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const getSavedAgents = () => {
    if (typeof window === 'undefined') return [];
    const saved: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('agent-')) {
        saved.push(key.replace('agent-', ''));
      }
    }
    return saved;
  };

  const loadAgent = (name: string) => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem(`agent-${name}`);
    if (saved) {
      onChange(JSON.parse(saved));
      setShowLoadMenu(false);
      alert(`✅ Agent "${name}" loaded successfully!`);
    }
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

  const savedAgents = getSavedAgents();

  return (
    <div className="space-y-6">
      {/* Saved Agents Menu */}
      {savedAgents.length > 0 && (
        <div className="holographic-card rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowLoadMenu(!showLoadMenu)}
              className="flex items-center gap-2 text-accent-blue hover:text-accent-cyan transition-colors"
            >
              <span className="text-lg">📂</span>
              <span className="font-medium">Load Saved Agent ({savedAgents.length})</span>
              <span className="text-xs">{showLoadMenu ? '▼' : '▶'}</span>
            </button>
          </div>
          {showLoadMenu && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              {savedAgents.map((name) => (
                <button
                  key={name}
                  onClick={() => loadAgent(name)}
                  className="px-4 py-3 bg-surface hover:bg-accent-blue/20 border border-border hover:border-accent-blue rounded-lg text-sm text-zinc-300 hover:text-white transition-all"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Configuration */}
        <div className="holographic-card rounded-xl border border-border p-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <ProIcon name="settings" size={28} className="text-accent-blue" />
              Basic Configuration
            </h2>
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
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.setItem(`agent-${config.name}`, JSON.stringify(config));
                  alert(`✅ Agent "${config.name}" saved successfully!`);
                }
              }}
              className="px-6 py-3 bg-accent-cyan text-white rounded-lg font-medium hover:bg-accent-cyan/90 transition-all shadow-lg shadow-accent-cyan/20 hover:scale-105 flex items-center justify-center gap-2"
            >
              <ProIcon name="save" size={18} />
              Save Agent
            </button>
            <button 
              onClick={() => {
                const deployCode = `# Deploy ${config.name} agent
docker run -d \\
  --name ${config.name} \\
  -p 3000:3000 \\
  -e PROVIDER=${config.provider.toUpperCase()} \\
  -e MODEL=${config.model} \\
  stick-ai/agent

# Or deploy with CLI
stick deploy ${config.name} --port 3000`;
                navigator.clipboard.writeText(deployCode);
                alert('🚀 Deployment commands copied to clipboard!');
              }}
              className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 transition-all shadow-lg shadow-accent-blue/20 hover:scale-105 flex items-center justify-center gap-2"
            >
              <ProIcon name="rocket" size={18} />
              Deploy
            </button>
            <button 
              onClick={() => {
                const jsonConfig = {
                  name: config.name,
                  version: "1.0.0",
                  description: config.description,
                  capabilities: config.capabilities,
                  tools: config.tools,
                  instructions: config.instructions,
                  llm: {
                    provider: config.provider,
                    model: config.model,
                    temperature: config.temperature,
                    maxTokens: config.maxTokens
                  }
                };
                const blob = new Blob([JSON.stringify(jsonConfig, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${config.name}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-6 py-3 glass-morphic text-white rounded-lg font-medium hover:bg-surface transition-all hover:scale-105 border border-border hover:border-accent-blue/50 flex items-center justify-center gap-2"
            >
              <ProIcon name="fileJson" size={18} />
              Export JSON
            </button>
            <button 
              onClick={() => {
                if (confirm('⚠️ Reset agent to default configuration? This cannot be undone.')) {
                  onChange({
                    name: 'my-agent',
                    description: 'A custom AI agent',
                    provider: 'ollama',
                    model: 'mistral:7b',
                    tools: ['datetime', 'text'],
                    instructions: 'You are a helpful AI assistant.',
                    temperature: 0.7,
                    maxTokens: 2000,
                    capabilities: ['chat', 'reasoning'],
                    mcpServers: []
                  });
                }
              }}
              className="px-6 py-3 glass-morphic text-zinc-400 rounded-lg font-medium hover:bg-surface hover:text-white transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              <ProIcon name="reset" size={18} />
              Reset
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
