'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hi! I can help you set up stick.ai. Ask me about installation, dependencies, or configuration.'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // Simulated AI response
    setTimeout(() => {
      const response = getAIResponse(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 500);

    setInput('');
  };

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('install') || lowerQuery.includes('setup')) {
      return `To install stick.ai:\n\n\`\`\`bash\nnpm install -g stick-ai\nstick init\n\`\`\`\n\nThis will set up your agent framework locally.`;
    }
    
    if (lowerQuery.includes('config') || lowerQuery.includes('configure')) {
      return `Configuration is simple:\n\n1. Create \`stick.config.json\`\n2. Define your agent properties\n3. Run \`stick deploy\`\n\nNeed help with a specific config option?`;
    }
    
    if (lowerQuery.includes('agent')) {
      return `Agents in stick.ai are defined via JSON configs. Each agent can have:\n\n• Custom instructions\n• Tool access\n• Design preferences\n• Specialized knowledge\n\nWant to create your first agent?`;
    }
    
    return `I can help with:\n\n• Installation & setup\n• Agent configuration\n• Deployment\n• Troubleshooting\n\nWhat would you like to know?`;
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-accent-blue hover:bg-accent-blue/90 rounded-full flex items-center justify-center shadow-lg transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] glass-morphic rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 bg-accent-blue/20 rounded-full flex items-center justify-center">
                <Terminal className="w-4 h-4 text-accent-blue" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">stick.ai Assistant</h3>
                <p className="text-xs text-zinc-400">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg text-sm ${
                      msg.role === 'user'
                        ? 'bg-accent-blue text-white'
                        : 'bg-surface border border-border'
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about setup, config..."
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-accent-blue hover:bg-accent-blue/90 rounded-md transition-all"
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
