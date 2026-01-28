'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import AnimatedTerminalBlock from './AnimatedTerminalBlock';

interface EnhancedMarkdownProps {
  content: string;
}

export default function EnhancedMarkdown({ content }: EnhancedMarkdownProps) {
  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]} 
      rehypePlugins={[rehypeHighlight]}
      components={{
        code: ({ node, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '');
          const codeString = String(children).replace(/\n$/, '');
          
          // Check if it's inline code
          const isInline = !className;
          
          // Render inline code normally
          if (isInline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
          
          // Check if it's a command that should be animated
          const isCommand = 
            codeString.trim().startsWith('npm') || 
            codeString.trim().startsWith('stick') ||
            codeString.trim().startsWith('$') ||
            codeString.trim().startsWith('yarn') ||
            codeString.trim().startsWith('git');
          
          // Use animated terminal block for code blocks
          return (
            <AnimatedTerminalBlock 
              code={codeString}
              language={match ? match[1] : 'bash'}
              animate={isCommand && codeString.length < 100} // Only animate short commands
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
