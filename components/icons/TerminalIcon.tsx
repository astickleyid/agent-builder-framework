'use client';

export default function TerminalIcon({ className = "w-6 h-6", ...props }: { className?: string; [key: string]: any }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="terminal-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        </linearGradient>
        <filter id="terminal-glow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#terminal-glow)">
        <rect
          x="2"
          y="4"
          width="20"
          height="16"
          rx="2"
          stroke="url(#terminal-gradient)"
          strokeWidth="2"
          fill="none"
        />
        <rect
          x="2"
          y="4"
          width="20"
          height="16"
          rx="2"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M7 10L10 12L7 14"
          stroke="url(#terminal-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="12"
          y1="14"
          x2="17"
          y2="14"
          stroke="url(#terminal-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="17" cy="7" r="1" fill="currentColor" opacity="0.5">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
}
