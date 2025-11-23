'use client';

interface AgentPreviewProps {
  config: any;
}

export default function AgentPreview({ config }: AgentPreviewProps) {
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
    },
    ...(config.mcpServers && config.mcpServers.length > 0 && {
      mcp: {
        servers: config.mcpServers.map((s: any) => ({
          name: s.id,
          command: "npx",
          args: ["-y", `@modelcontextprotocol/server-${s.id}`]
        }))
      }
    })
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(jsonConfig, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}.json`;
    a.click();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonConfig, null, 2));
    alert('Configuration copied to clipboard!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Visual Preview */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Agent Overview</h2>

        <div className="space-y-6">
          {/* Agent Card */}
          <div className="border-2 border-blue-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-3xl">
                🤖
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{config.name}</h3>
                <p className="text-gray-600 mt-1">{config.description}</p>
                <div className="flex gap-2 mt-3">
                  {config.capabilities.map((cap: string) => (
                    <span key={cap} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LLM Configuration */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">🧠 LLM Configuration</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500">Provider</div>
                <div className="font-medium">{config.provider}</div>
              </div>
              <div>
                <div className="text-gray-500">Model</div>
                <div className="font-medium">{config.model}</div>
              </div>
              <div>
                <div className="text-gray-500">Temperature</div>
                <div className="font-medium">{config.temperature}</div>
              </div>
              <div>
                <div className="text-gray-500">Max Tokens</div>
                <div className="font-medium">{config.maxTokens}</div>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">🛠️ Available Tools ({config.tools.length})</h4>
            <div className="flex flex-wrap gap-2">
              {config.tools.map((tool: string) => (
                <span key={tool} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* MCP Servers */}
          {config.mcpServers && config.mcpServers.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-3">🔌 MCP Servers ({config.mcpServers.length})</h4>
              <div className="space-y-2">
                {config.mcpServers.map((server: any) => (
                  <div key={server.id} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-700">{server.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions Preview */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">📝 System Instructions</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">{config.instructions}</p>
          </div>
        </div>
      </div>

      {/* JSON Configuration */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">JSON Configuration</h2>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm font-medium hover:bg-gray-700"
            >
              📋 Copy
            </button>
            <button
              onClick={downloadJSON}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              💾 Download
            </button>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6 overflow-auto max-h-[calc(100vh-200px)]">
          <pre className="text-green-400 text-sm font-mono">
            {JSON.stringify(jsonConfig, null, 2)}
          </pre>
        </div>

        {/* CLI Commands */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-3">🚀 Quick Start Commands</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-500 mb-1">Run Agent</div>
              <code className="block px-3 py-2 bg-gray-800 text-green-400 rounded text-sm">
                stick run {config.name} --interactive
              </code>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Deploy as API</div>
              <code className="block px-3 py-2 bg-gray-800 text-green-400 rounded text-sm">
                stick deploy {config.name} --port 3000
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
