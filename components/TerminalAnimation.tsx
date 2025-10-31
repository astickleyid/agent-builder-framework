'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const commands = [
  { cmd: '$ npm install -g stick-ai', delay: 0 },
  { cmd: '✓ Installing dependencies...', delay: 1000 },
  { cmd: '✓ Setting up agent framework...', delay: 2000 },
  { cmd: '$ stick init my-agent', delay: 3500 },
  { cmd: '✓ Created agent configuration', delay: 4500 },
  { cmd: '✓ Ready to build', delay: 5500 },
];

export default function TerminalAnimation() {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    commands.forEach((cmd, index) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, index]);
      }, cmd.delay);
    });
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="glass-morphic rounded-lg overflow-hidden border border-border/50 shadow-2xl">
        {/* Terminal Header */}
        <div className="px-4 py-3 bg-surface/50 border-b border-border/50 flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-zinc-500 ml-2">bash</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 terminal-text text-sm space-y-2 min-h-[200px]">
          {commands.map((cmd, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={
                visibleLines.includes(index)
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: -20 }
              }
              transition={{ duration: 0.3 }}
              className={cmd.cmd.includes('✓') ? 'text-accent-cyan' : 'text-zinc-300'}
            >
              {cmd.cmd}
              {index === visibleLines.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="ml-1"
                >
                  _
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
