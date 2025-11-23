'use client';

import { useState } from 'react';

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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Basic Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Configuration</h2>
        </div>

        {/* Agent Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => updateConfig('name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="my-awesome-agent"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={config.description}
            onChange={(e) => updateConfig('description', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Describe what your agent does..."
          />
        </div>

        {/* LLM Provider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LLM Provider
          </label>
          <select
            value={config.provider}
            onChange={(e) => updateConfig('provider', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <select
            value={config.model}
            onChange={(e) => updateConfig('model', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Instructions
          </label>
          <textarea
            value={config.instructions}
            onChange={(e) => updateConfig('instructions', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={5}
            placeholder="You are a helpful AI assistant..."
          />
        </div>
      </div>

      {/* Tools & Advanced */}
      <div className="space-y-6">
        {/* Native Tools */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Native Tools</h3>
          <div className="grid grid-cols-2 gap-3">
            {AVAILABLE_TOOLS.map((tool) => (
              <button
                key={tool}
                onClick={() => toggleTool(tool)}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  config.tools.includes(tool)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        {/* MCP Servers */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">MCP Servers</h3>
          <div className="space-y-3">
            {MCP_SERVERS.map((server) => (
              <div
                key={server.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-800">{server.name}</div>
                  <div className="text-sm text-gray-500">{server.description}</div>
                </div>
                <button
                  onClick={() => addMCPServer(server.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    config.mcpServers?.find((s: any) => s.id === server.id)
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {config.mcpServers?.find((s: any) => s.id === server.id) ? '✓ Added' : '+ Add'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full text-xl font-bold text-gray-800 mb-4"
          >
            <span>Advanced Settings</span>
            <span>{showAdvanced ? '▼' : '▶'}</span>
          </button>

          {showAdvanced && (
            <div className="space-y-4">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature: {config.temperature}
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={config.temperature}
                  onChange={(e) => updateConfig('temperature', parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Focused</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>

              {/* Max Tokens */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={config.maxTokens}
                  onChange={(e) => updateConfig('maxTokens', parseInt(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  min="100"
                  max="8000"
                  step="100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-2 gap-4">
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              💾 Save Agent
            </button>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              🚀 Deploy
            </button>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              📋 Export JSON
            </button>
            <button className="px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors">
              🔄 Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
