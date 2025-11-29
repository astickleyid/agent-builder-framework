'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Terminal, ArrowLeft } from 'lucide-react';

export default function Dashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAgents();
    loadConversations();
  }, []);

  const loadAgents = async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents);
        if (data.agents.length > 0) {
          setSelectedAgent(data.agents[0].name);
        }
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const res = await fetch('/api/memory');
      const data = await res.json();
      if (data.success) {
        setConversations(data.conversations);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const sendMessage = async () => {
    if (!message.trim() || !selectedAgent) return;

    setLoading(true);
    const userMessage = { role: 'user', content: message, timestamp: Date.now() };
    setChatHistory([...chatHistory, userMessage]);
    setMessage('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentName: selectedAgent,
          message: message
        })
      });

      const data = await res.json();
      
      if (data.success) {
        const agentMessage = {
          role: 'agent',
          content: data.response,
          timestamp: Date.now()
        };
        setChatHistory(prev => [...prev, agentMessage]);
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const saveConversation = async () => {
    if (chatHistory.length === 0) return;

    const conversationId = `conv-${Date.now()}`;
    
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          agentName: selectedAgent,
          messages: chatHistory
        })
      });

      const data = await res.json();
      if (data.success) {
        alert('Conversation saved!');
        loadConversations();
      }
    } catch (error) {
      console.error('Failed to save conversation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <Terminal className="w-5 h-5 text-accent-blue" />
            <span className="font-semibold">stick.ai</span>
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8 gradient-text">stick.ai Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Selection */}
            <div className="holographic-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Select Agent</h2>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full p-3 bg-surface border border-border rounded-lg text-white focus:border-accent-blue focus:outline-none"
              >
                {agents.map((agent) => (
                  <option key={agent.name} value={agent.name}>
                    {agent.name} ({agent.provider})
                  </option>
                ))}
              </select>

              {selectedAgent && (
                <div className="mt-4 text-sm text-zinc-400">
                  {agents.find(a => a.name === selectedAgent)?.description}
                </div>
              )}
            </div>

            {/* Conversations */}
            <div className="holographic-card rounded-lg border border-border p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Conversations</h2>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 border border-border rounded-lg hover:bg-surface cursor-pointer transition-colors"
                  >
                    <div className="font-medium text-white">{conv.agentName}</div>
                    <div className="text-sm text-zinc-400">
                      {conv.messageCount} messages
                    </div>
                    <div className="text-xs text-zinc-500">
                      {new Date(conv.lastUpdate).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="holographic-card rounded-lg border border-border h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">
                  Chat with {selectedAgent}
                </h2>
                <button
                  onClick={saveConversation}
                  disabled={chatHistory.length === 0}
                  className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 disabled:opacity-50 transition-all"
                >
                  Save
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-accent-blue text-white'
                          : 'bg-surface border border-border text-white'
                      }`}
                    >
                      <div className="text-sm font-medium mb-1 opacity-80">
                        {msg.role === 'user' ? 'You' : selectedAgent}
                      </div>
                      <div>{msg.content}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-surface border border-border p-3 rounded-lg">
                      <div className="animate-pulse text-zinc-400">Thinking...</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-3 bg-surface border border-border rounded-lg text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    className="px-6 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 disabled:opacity-50 transition-all"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
