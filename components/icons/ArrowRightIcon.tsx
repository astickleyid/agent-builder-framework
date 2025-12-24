'use client';

export default function ArrowRightIcon({ className = "w-5 h-5", ...props }: { className?: string; [key: string]: any }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <defs>
        <linearGradient id="arrow-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#0ea5e9', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="url(#arrow-gradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <circle cx="19" cy="12" r="2" fill="currentColor" opacity="0.2">
        <animate
          attributeName="r"
          values="2;3;2"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
