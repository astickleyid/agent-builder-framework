'use client';

import { useState } from 'react';

interface AgentTesterProps {
  config: any;
}

export default function AgentTester({ config }: AgentTesterProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ 
    totalMessages: 0, 
    avgResponseTime: 0, 
    successRate: 100,
    totalTests: 0 
  });

  const testScenarios = [
    { 
      text: 'What can you help me with?', 
      category: 'General' 
    },
    { 
      text: 'Tell me about your capabilities', 
      category: 'Meta' 
    },
    { 
      text: 'What tools do you have access to?', 
      category: 'Tools' 
    },
    { 
      text: 'Solve: 25 * 47 + 120', 
      category: 'Calculator', 
      requiresTool: 'calculator' 
    },
    { 
      text: 'What is the current date and time?', 
      category: 'DateTime', 
      requiresTool: 'datetime' 
    }
  ];

  const sendMessage = async (message: string, scenario?: any) => {
    if (!message.trim()) return;

    setLoading(true);
    const userMsg = { role: 'user', content: message, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const startTime = Date.now();

    try {
      // Simulate more realistic agent response
      const thinkingTime = 800 + Math.random() * 700; // 800-1500ms
      await new Promise(resolve => setTimeout(resolve, thinkingTime));
      
      const responseTime = Date.now() - startTime;
      
      // Generate more realistic responses based on message content
      let responseContent = '';
      const hasRequiredTool = scenario?.requiresTool ? config.tools.includes(scenario.requiresTool) : true;
      
      if (scenario?.category === 'Calculator' && config.tools.includes('calculator')) {
        responseContent = `I can help with that calculation! Using the calculator tool:\n25 × 47 = 1,175\n1,175 + 120 = 1,295\n\nThe answer is 1,295.`;
      } else if (scenario?.category === 'DateTime' && config.tools.includes('datetime')) {
        const now = new Date();
        responseContent = `Current date and time:\n📅 ${now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}\n⏰ ${now.toLocaleTimeString()}`;
      } else if (scenario?.category === 'Tools') {
        responseContent = `I have access to ${config.tools.length} tools:\n${config.tools.map((t: string) => `• ${t}`).join('\n')}\n\nI'm using ${config.provider}/${config.model} as my language model.`;
      } else if (scenario?.category === 'General') {
        responseContent = `Hello! I'm ${config.name}, an AI agent powered by ${config.provider}/${config.model}. I can assist you with various tasks using my ${config.tools.length} available tools. How can I help you today?`;
      } else if (scenario?.category === 'Meta') {
        responseContent = `I'm configured with the following capabilities:\n• Provider: ${config.provider}\n• Model: ${config.model}\n• Tools: ${config.tools.length} (${config.tools.slice(0, 3).join(', ')}${config.tools.length > 3 ? '...' : ''})\n• Temperature: ${config.temperature}\n• Max Tokens: ${config.maxTokens}`;
      } else {
        responseContent = `[Test Mode] I'm processing your request: "${message}"\n\nConfiguration:\n• Model: ${config.provider}/${config.model}\n• Tools: ${config.tools.length} available\n• Temperature: ${config.temperature}\n\nIn production, I would provide a real response based on your query.`;
      }

      const agentMsg = {
        role: 'agent',
        content: responseContent,
        timestamp: Date.now(),
        responseTime,
        toolsUsed: scenario?.requiresTool && hasRequiredTool ? [scenario.requiresTool] : [],
        status: hasRequiredTool ? 'success' : 'warning'
      };

      setMessages(prev => [...prev, agentMsg]);
      setStats(prev => ({
        totalMessages: prev.totalMessages + 1,
        avgResponseTime: (prev.avgResponseTime * prev.totalMessages + responseTime) / (prev.totalMessages + 1),
        successRate: Math.round(((prev.totalTests * prev.successRate / 100) + (hasRequiredTool ? 1 : 0)) / (prev.totalTests + 1) * 100),
        totalTests: prev.totalTests + 1
      }));
    } catch (error) {
      console.error('Test failed:', error);
      setStats(prev => ({
        ...prev,
        successRate: Math.round((prev.totalTests * prev.successRate / 100) / (prev.totalTests + 1) * 100),
        totalTests: prev.totalTests + 1
      }));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStats({ totalMessages: 0, avgResponseTime: 0, successRate: 100, totalTests: 0 });
  };

  const exportTestResults = () => {
    const results = {
      agentName: config.name,
      provider: config.provider,
      model: config.model,
      testDate: new Date().toISOString(),
      statistics: stats,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp).toISOString(),
        responseTime: m.responseTime,
        toolsUsed: m.toolsUsed,
        status: m.status
      }))
    };
    
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name}-test-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const runAllTests = async () => {
    if (loading) return;
    clearChat();
    for (const scenario of testScenarios) {
      await sendMessage(scenario.text, scenario);
      await new Promise(resolve => setTimeout(resolve, 500)); // Pause between tests
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <div className="holographic-card rounded-xl border border-border h-[700px] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Test Agent</h2>
                <p className="text-sm text-zinc-500 mt-1">
                  Testing: {config.name} ({config.provider}/{config.model})
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportTestResults}
                  disabled={messages.length === 0}
                  className="px-4 py-2 bg-accent-cyan text-white rounded-lg text-sm font-medium hover:bg-accent-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  📊 Export Results
                </button>
                <button
                  onClick={clearChat}
                  className="px-4 py-2 glass-morphic text-zinc-300 rounded-lg text-sm font-medium hover:bg-surface hover:text-white transition-all"
                >
                  🗑️ Clear
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-zinc-500 mt-20">
                <div className="text-6xl mb-4">💬</div>
                <p>Start a conversation to test your agent</p>
                <p className="text-sm mt-2 text-zinc-600">Try the quick tests below ↓</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] p-4 rounded-xl ${
                    msg.role === 'user'
                      ? 'bg-accent-blue text-white'
                      : 'bg-surface border border-border text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </span>
                    <span className="font-medium text-sm opacity-80">
                      {msg.role === 'user' ? 'You' : config.name}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {msg.toolsUsed.map((tool: string) => (
                        <span key={tool} className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan text-xs rounded">
                          🛠️ {tool}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className={`text-xs mt-2 flex items-center gap-2 ${msg.role === 'user' ? 'opacity-70' : 'text-zinc-500'}`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    {msg.responseTime && <span>• {msg.responseTime}ms</span>}
                    {msg.status === 'success' && <span className="text-accent-cyan">✓</span>}
                    {msg.status === 'warning' && <span className="text-yellow-400">⚠</span>}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-surface border border-border p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-accent-blue border-t-transparent"></div>
                    <span className="text-sm text-zinc-400">Agent is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t border-border">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type your test message..."
                className="flex-1 px-4 py-3 bg-surface border border-border rounded-lg text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-accent-blue text-white rounded-lg font-medium hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Quick Tests & Stats */}
      <div className="space-y-6">
        {/* Quick Test Scenarios */}
        <div className="holographic-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">🎯 Quick Tests</h3>
            <button
              onClick={runAllTests}
              disabled={loading}
              className="px-3 py-1.5 bg-accent-blue text-white rounded-lg text-xs font-medium hover:bg-accent-blue/90 transition-all disabled:opacity-50"
            >
              Run All
            </button>
          </div>
          <div className="space-y-2">
            {testScenarios.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(scenario.text, scenario)}
                disabled={loading}
                className="w-full text-left px-4 py-3 bg-surface hover:bg-surface-hover rounded-lg text-sm text-zinc-300 hover:text-white transition-colors disabled:opacity-50 border border-border hover:border-accent-blue/50 group"
              >
                <div className="flex items-center justify-between">
                  <span>{scenario.text}</span>
                  {scenario.requiresTool && (
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      config.tools.includes(scenario.requiresTool)
                        ? 'bg-accent-cyan/20 text-accent-cyan'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {scenario.requiresTool}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="holographic-card rounded-xl border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-4">📊 Test Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-zinc-500">Total Tests</div>
              <div className="text-3xl font-bold text-accent-blue">{stats.totalTests}</div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Success Rate</div>
              <div className={`text-3xl font-bold ${stats.successRate >= 80 ? 'text-accent-cyan' : 'text-yellow-400'}`}>
                {stats.successRate}%
              </div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Avg Response Time</div>
              <div className="text-3xl font-bold text-accent-cyan">
                {stats.avgResponseTime.toFixed(0)}ms
              </div>
            </div>
            <div>
              <div className="text-sm text-zinc-500">Tools Available</div>
              <div className="text-3xl font-bold gradient-text">{config.tools.length}</div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="holographic-card rounded-xl border border-border p-6">
          <h3 className="text-xl font-bold text-white mb-4">⚙️ Active Config</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">Provider:</span>
              <span className="font-medium text-white">{config.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Model:</span>
              <span className="font-medium text-white">{config.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Temperature:</span>
              <span className="font-medium text-white">{config.temperature}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Max Tokens:</span>
              <span className="font-medium text-white">{config.maxTokens}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="glass-morphic border border-accent-blue/30 rounded-xl p-4">
          <div className="flex gap-2">
            <span className="text-accent-blue">⚠️</span>
            <div className="text-sm text-zinc-400">
              <strong className="text-white">Note:</strong> This is a simulation. Deploy the agent to test with real LLM responses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
