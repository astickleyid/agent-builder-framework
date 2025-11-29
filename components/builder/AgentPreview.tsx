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
      <div className="holographic-card rounded-xl border border-border p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Agent Overview</h2>

        <div className="space-y-6">
          {/* Agent Card */}
          <div className="border border-accent-blue/30 rounded-lg p-6 bg-gradient-to-br from-accent-blue/10 to-accent-cyan/10">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-accent-blue/20 rounded-xl flex items-center justify-center text-3xl border border-accent-blue/30">
                🤖
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">{config.name}</h3>
                <p className="text-zinc-400 mt-1">{config.description}</p>
                <div className="flex gap-2 mt-3">
                  {config.capabilities.map((cap: string) => (
                    <span key={cap} className="px-3 py-1 bg-accent-blue/20 text-accent-blue rounded-full text-sm font-medium">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* LLM Configuration */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">🧠 LLM Configuration</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-zinc-500">Provider</div>
                <div className="font-medium text-white">{config.provider}</div>
              </div>
              <div>
                <div className="text-zinc-500">Model</div>
                <div className="font-medium text-white">{config.model}</div>
              </div>
              <div>
                <div className="text-zinc-500">Temperature</div>
                <div className="font-medium text-white">{config.temperature}</div>
              </div>
              <div>
                <div className="text-zinc-500">Max Tokens</div>
                <div className="font-medium text-white">{config.maxTokens}</div>
              </div>
            </div>
          </div>

          {/* Tools */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">🛠️ Available Tools ({config.tools.length})</h4>
            <div className="flex flex-wrap gap-2">
              {config.tools.map((tool: string) => (
                <span key={tool} className="px-3 py-1 bg-surface text-zinc-300 rounded-lg text-sm border border-border">
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* MCP Servers */}
          {config.mcpServers && config.mcpServers.length > 0 && (
            <div className="border border-border rounded-lg p-4">
              <h4 className="font-semibold text-white mb-3">🔌 MCP Servers ({config.mcpServers.length})</h4>
              <div className="space-y-2">
                {config.mcpServers.map((server: any) => (
                  <div key={server.id} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-accent-cyan rounded-full"></span>
                    <span className="text-sm text-zinc-300">{server.id}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions Preview */}
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">📝 System Instructions</h4>
            <p className="text-sm text-zinc-400 whitespace-pre-wrap">{config.instructions}</p>
          </div>
        </div>
      </div>

      {/* JSON Configuration */}
      <div className="holographic-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">JSON Configuration</h2>
          <div className="flex gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 glass-morphic text-white rounded-lg text-sm font-medium hover:bg-surface transition-all"
            >
              📋 Copy
            </button>
            <button
              onClick={downloadJSON}
              className="px-4 py-2 bg-accent-blue text-white rounded-lg text-sm font-medium hover:bg-accent-blue/90 transition-all"
            >
              💾 Download
            </button>
          </div>
        </div>

        <div className="bg-black/40 border border-border/50 rounded-lg p-6 overflow-auto max-h-[calc(100vh-200px)]">
          <pre className="text-accent-cyan text-sm terminal-text">
            {JSON.stringify(jsonConfig, null, 2)}
          </pre>
        </div>

        {/* CLI Commands */}
        <div className="mt-6 p-4 glass-morphic rounded-lg">
          <h3 className="font-semibold text-white mb-3">🚀 Quick Start Commands</h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-zinc-500 mb-1">Run Agent</div>
              <code className="block px-3 py-2 bg-black/40 border border-border/50 text-accent-cyan rounded text-sm terminal-text">
                stick run {config.name} --interactive
              </code>
            </div>
            <div>
              <div className="text-xs text-zinc-500 mb-1">Deploy as API</div>
              <code className="block px-3 py-2 bg-black/40 border border-border/50 text-accent-cyan rounded text-sm terminal-text">
                stick deploy {config.name} --port 3000
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
