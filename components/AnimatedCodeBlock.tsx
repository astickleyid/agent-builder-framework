'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedCodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  animationSpeed?: number;
}

export default function AnimatedCodeBlock({ 
  code, 
  language = 'json',
  className = '',
  animationSpeed = 20 
}: AnimatedCodeBlockProps) {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayedCode('');
    setIsComplete(false);
    let currentIndex = 0;

    const timer = setInterval(() => {
      if (currentIndex <= code.length) {
        setDisplayedCode(code.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, animationSpeed);

    return () => clearInterval(timer);
  }, [code, animationSpeed]);

  const syntaxHighlight = (text: string) => {
    if (language !== 'json') return text;

    return text
      .replace(/"([^"]+)":/g, '<span class="text-accent-cyan">"$1"</span>:')
      .replace(/:\s*"([^"]*)"/g, ': <span class="text-amber-400">"$1"</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-green-400">$1</span>')
      .replace(/:\s*(true|false)/g, ': <span class="text-purple-400">$1</span>')
      .replace(/\[/g, '<span class="text-zinc-400">[</span>')
      .replace(/\]/g, '<span class="text-zinc-400">]</span>')
      .replace(/\{/g, '<span class="text-zinc-400">{</span>')
      .replace(/\}/g, '<span class="text-zinc-400">}</span>');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group ${className}`}
    >
      {/* Liquid glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 via-accent-cyan/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Glass surface shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      
      {/* Main code container */}
      <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
        {/* Top bar with language indicator */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{language}</span>
        </div>

        {/* Code content */}
        <div className="p-6 overflow-x-auto">
          <pre className="text-sm font-mono leading-relaxed">
            <code 
              dangerouslySetInnerHTML={{ 
                __html: syntaxHighlight(displayedCode) 
              }}
            />
            {!isComplete && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-accent-cyan ml-1"
              />
            )}
          </pre>
        </div>

        {/* Subtle glow effect on bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-cyan/50 to-transparent" />
      </div>

      {/* External glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-blue/20 via-accent-cyan/20 to-accent-blue/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 -z-10" />
    </motion.div>
  );
}
