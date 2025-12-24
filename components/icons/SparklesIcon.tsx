'use client';

export default function SparklesIcon({ className = "w-5 h-5", ...props }: { className?: string; [key: string]: any }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        fill="url(#sparkle-gradient)"
        className="animate-pulse"
      />
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
      <circle cx="17" cy="7" r="1" fill="currentColor" opacity="0.6">
        <animate
          attributeName="opacity"
          values="0.2;0.8;0.2"
          dur="2.5s"
          repeatCount="indefinite"
          begin="0.5s"
        />
      </circle>
      <circle cx="17" cy="17" r="1.5" fill="currentColor" opacity="0.7">
        <animate
          attributeName="opacity"
          values="0.3;1;0.3"
          dur="3s"
          repeatCount="indefinite"
          begin="1s"
        />
      </circle>
    </svg>
  );
}
