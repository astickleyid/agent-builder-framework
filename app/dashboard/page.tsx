'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Sparkles } from 'lucide-react';
import TerminalIcon from '@/components/icons/TerminalIcon';

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
    <div className="min-h-screen bg-background text-foreground">
      {/* Fixed Header */}
      <nav className="fixed top-0 w-full z-50 glass-morphic border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <TerminalIcon className="w-6 h-6 text-accent-blue" />
            </div>
            <span className="text-xl font-bold">stick.ai</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/docs" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="/examples" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Examples
            </Link>
            <Link href="/playground" className="text-sm text-zinc-400 hover:text-white transition-colors">
              Playground
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-morphic text-sm text-zinc-400 mb-6">
              <MessageSquare className="w-4 h-4 text-accent-blue" />
              Interactive Agent Chat
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Agent <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Interact with your AI agents in real-time and manage conversation history
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Selection */}
            <div className="holographic-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold mb-4 text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent-blue" />
                Select Agent
              </h2>
              <select
                value={selectedAgent}
                onChange={(e) => setSelectedAgent(e.target.value)}
                className="w-full p-3 bg-surface border border-border rounded-lg text-white focus:border-accent-blue focus:outline-none transition-all"
              >
                {agents.map((agent) => (
                  <option key={agent.name} value={agent.name}>
                    {agent.name} ({agent.provider})
                  </option>
                ))}
              </select>

              {selectedAgent && (
                <div className="mt-4 text-sm text-zinc-400 p-3 bg-surface/50 rounded-lg border border-border">
                  {agents.find(a => a.name === selectedAgent)?.description}
                </div>
              )}
            </div>

            {/* Conversations */}
            <div className="holographic-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold mb-4 text-white">Conversations</h2>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className="p-3 border border-border rounded-lg hover:bg-surface hover:border-accent-blue/50 cursor-pointer transition-all"
                    >
                      <div className="font-medium text-white">{conv.agentName}</div>
                      <div className="text-sm text-zinc-400">
                        {conv.messageCount} messages
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        {new Date(conv.lastUpdate).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="holographic-card rounded-xl border border-border h-[600px] flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex justify-between items-center bg-surface/30">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
                  Chat with {selectedAgent || 'Agent'}
                </h2>
                <button
                  onClick={saveConversation}
                  disabled={chatHistory.length === 0}
                  className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                >
                  💾 Save
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-zinc-500">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>Start a conversation with your agent</p>
                      <p className="text-sm mt-1 text-zinc-600">Type a message below to begin</p>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, idx) => (
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
                        <div className="text-xs font-medium mb-2 opacity-70">
                          {msg.role === 'user' ? 'You' : selectedAgent}
                        </div>
                        <div className="text-sm leading-relaxed">{msg.content}</div>
                        <div className="text-xs opacity-50 mt-2">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-surface border border-border p-4 rounded-xl">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-accent-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <span className="ml-2 text-sm">Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border bg-surface/30">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 p-3 bg-surface border border-border rounded-xl text-white placeholder-zinc-500 focus:border-accent-blue focus:outline-none transition-all"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading || !message.trim()}
                    className="px-6 py-3 bg-accent-blue text-white rounded-xl hover:bg-accent-blue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
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
