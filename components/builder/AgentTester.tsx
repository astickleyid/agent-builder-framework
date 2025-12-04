'use client';

import { useState } from 'react';
import ProIcon from '@/components/icons/ProIcon';

interface AgentTesterProps {
  config: any;
}

export default function AgentTester({ config }: AgentTesterProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalMessages: 0, avgResponseTime: 0 });
  const [deploymentStatus, setDeploymentStatus] = useState<string>('unknown');
  const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);

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

  // Check deployment status on mount and when config.id changes
  useEffect(() => {
    if (config.id) {
      checkDeploymentStatus();
    }
  }, [config.id]);

  const checkDeploymentStatus = async () => {
    if (!config.id) return;

    try {
      const response = await fetch(`${API_BASE}/api/agents/${config.id}/status`);
      if (response.ok) {
        const data = await response.json();
        setDeploymentStatus(data.status);
        setDeploymentUrl(data.url);
      }
    } catch (error) {
      console.error('Failed to check deployment status:', error);
    }
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    const userMsg = { role: 'user', content: message, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const startTime = Date.now();

    try {
      let response;
      let agentMsg;

      // Try to use deployed agent if available
      if (config.id && deploymentStatus === 'running') {
        const apiResponse = await fetch(`${API_BASE}/api/agents/${config.id}/test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: message })
        });

        if (apiResponse.ok) {
          const data = await apiResponse.json();
          const responseTime = Date.now() - startTime;
          agentMsg = {
            role: 'agent',
            content: data.result,
            timestamp: Date.now(),
            responseTime
          };
        } else {
          throw new Error('Agent request failed');
        }
      } else {
        // Fallback to simulation
        await new Promise(resolve => setTimeout(resolve, 1000));
        const responseTime = Date.now() - startTime;
        agentMsg = {
          role: 'agent',
          content: deploymentStatus === 'stopped' 
            ? `⚠️ Agent is not deployed. Deploy the agent first to get real responses.\n\n[Simulated] I would use ${config.provider} ${config.model} with ${config.tools.length} tools to respond.`
            : `⚠️ Please save and deploy the agent first.\n\n[Simulated Response]`,
          timestamp: Date.now(),
          responseTime
        };
      }

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
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    deploymentStatus === 'running' ? 'bg-green-500/20 text-green-400' :
                    deploymentStatus === 'starting' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      deploymentStatus === 'running' ? 'bg-green-400' :
                      deploymentStatus === 'starting' ? 'bg-yellow-400 animate-pulse' :
                      'bg-red-400'
                    }`}></span>
                    {deploymentStatus === 'running' ? 'Deployed' : 
                     deploymentStatus === 'starting' ? 'Starting' : 
                     'Not Deployed'}
                  </span>
                  {deploymentUrl && (
                    <span className="text-xs text-zinc-600">
                      {deploymentUrl}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={exportTestResults}
                  disabled={messages.length === 0}
                  className="px-4 py-2 bg-accent-cyan text-white rounded-lg text-sm font-medium hover:bg-accent-cyan/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ProIcon name="barChart" size={16} />
                  Export Results
                </button>
                <button
                  onClick={clearChat}
                  className="px-4 py-2 glass-morphic text-zinc-300 rounded-lg text-sm font-medium hover:bg-surface hover:text-white transition-all flex items-center gap-2"
                >
                  <ProIcon name="reset" size={16} />
                  Clear
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-zinc-500 mt-20">
                <div className="mb-4 flex justify-center">
                  <ProIcon name="message" size={64} className="text-zinc-700" />
                </div>
                <p className="text-lg font-medium">Start a conversation to test your agent</p>
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
                        <span key={tool} className="px-2 py-0.5 bg-accent-cyan/20 text-accent-cyan text-xs rounded flex items-center gap-1 inline-flex">
                          <ProIcon name="wrench" size={12} />
                          {tool}
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
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ProIcon name="target" size={20} className="text-accent-blue" />
              Quick Tests
            </h3>
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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ProIcon name="barChart" size={20} className="text-accent-cyan" />
            Test Statistics
          </h3>
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
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <ProIcon name="settings" size={20} className="text-accent-blue" />
            Active Config
          </h3>
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
        <div className={`glass-morphic border rounded-xl p-4 ${
          deploymentStatus === 'running' ? 'border-green-500/30' : 'border-accent-blue/30'
        }`}>
          <div className="flex gap-2">
            <span className={deploymentStatus === 'running' ? 'text-green-400' : 'text-accent-blue'}>
              {deploymentStatus === 'running' ? '✓' : '⚠️'}
            </span>
            <div className="text-sm text-zinc-400">
              <strong className="text-white">
                {deploymentStatus === 'running' ? 'Live Testing:' : 'Note:'}
              </strong>{' '}
              {deploymentStatus === 'running' 
                ? 'Connected to deployed agent. All responses are real LLM outputs.'
                : 'Deploy the agent first to test with real LLM responses. Currently showing simulated mode.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
