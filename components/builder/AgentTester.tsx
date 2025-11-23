'use client';

import { useState } from 'react';

interface AgentTesterProps {
  config: any;
}

export default function AgentTester({ config }: AgentTesterProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalMessages: 0, avgResponseTime: 0 });

  const testScenarios = [
    'What can you help me with?',
    'Tell me about your capabilities',
    'What tools do you have access to?',
    'Solve: 25 * 47 + 120',
    'What is the current date and time?'
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setLoading(true);
    const userMsg = { role: 'user', content: message, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const startTime = Date.now();

    try {
      // Simulate agent response (in production, call actual API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responseTime = Date.now() - startTime;
      const agentMsg = {
        role: 'agent',
        content: `[Simulated Response] I received your message: "${message}". In production, I would use the ${config.provider} ${config.model} model with ${config.tools.length} tools to provide a real response.`,
        timestamp: Date.now(),
        responseTime
      };

      setMessages(prev => [...prev, agentMsg]);
      setStats(prev => ({
        totalMessages: prev.totalMessages + 1,
        avgResponseTime: (prev.avgResponseTime * prev.totalMessages + responseTime) / (prev.totalMessages + 1)
      }));
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setStats({ totalMessages: 0, avgResponseTime: 0 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Chat Interface */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-lg h-[700px] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Test Agent</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Testing: {config.name} ({config.provider}/{config.model})
                </p>
              </div>
              <button
                onClick={clearChat}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200"
              >
                Clear Chat
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <div className="text-6xl mb-4">💬</div>
                <p>Start a conversation to test your agent</p>
                <p className="text-sm mt-2">Try the quick tests below ↓</p>
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">
                      {msg.role === 'user' ? '👤' : '🤖'}
                    </span>
                    <span className="font-medium text-sm">
                      {msg.role === 'user' ? 'You' : config.name}
                    </span>
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  <div className={`text-xs mt-2 ${msg.role === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                    {msg.responseTime && ` • ${msg.responseTime}ms`}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-gray-600">Agent is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-6 border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder="Type your test message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Quick Tests</h3>
          <div className="space-y-2">
            {testScenarios.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(scenario)}
                disabled={loading}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                {scenario}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Test Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Total Messages</div>
              <div className="text-3xl font-bold text-blue-600">{stats.totalMessages}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Avg Response Time</div>
              <div className="text-3xl font-bold text-green-600">
                {stats.avgResponseTime.toFixed(0)}ms
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Tools Available</div>
              <div className="text-3xl font-bold text-purple-600">{config.tools.length}</div>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">⚙️ Active Config</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Provider:</span>
              <span className="font-medium">{config.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Model:</span>
              <span className="font-medium">{config.model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Temperature:</span>
              <span className="font-medium">{config.temperature}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Max Tokens:</span>
              <span className="font-medium">{config.maxTokens}</span>
            </div>
          </div>
        </div>

        {/* Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex gap-2">
            <span className="text-yellow-600">⚠️</span>
            <div className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a simulation. Deploy the agent to test with real LLM responses.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
