'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';

interface AnimatedTerminalBlockProps {
  code: string;
  language?: string;
  animate?: boolean;
}

export default function AnimatedTerminalBlock({ 
  code, 
  language = 'bash',
  animate = false 
}: AnimatedTerminalBlockProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(!animate);

  useEffect(() => {
    if (animate && code) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= code.length) {
          setDisplayedText(code.slice(0, currentIndex));
          currentIndex++;
        } else {
          setAnimationComplete(true);
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    } else {
      setDisplayedText(code);
      setAnimationComplete(true);
    }
  }, [code, animate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCommand = code.trim().startsWith('$') || code.trim().startsWith('npm') || code.trim().startsWith('stick');

  return (
    <div className="relative group">
      <div className="glass-morphic rounded-lg overflow-hidden border border-border/50 shadow-lg">
        {/* Terminal Header */}
        <div className="px-4 py-2 bg-surface/50 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
            </div>
            <span className="text-xs text-zinc-500 ml-2">{language}</span>
          </div>
          
          <button
            onClick={handleCopy}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-surface rounded text-zinc-400 hover:text-white"
            title="Copy code"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-4 terminal-text text-sm overflow-x-auto">
          <pre className="m-0">
            <code className={`language-${language} ${isCommand ? 'text-accent-cyan' : 'text-zinc-300'}`}>
              {displayedText}
              {!animationComplete && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  _
                </motion.span>
              )}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
