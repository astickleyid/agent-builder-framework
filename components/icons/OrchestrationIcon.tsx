export default function OrchestrationIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="4" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="6" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="4" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="18" r="2" stroke="currentColor" strokeWidth="2" />
      <path d="M10 10L6 8" stroke="currentColor" strokeWidth="2" />
      <path d="M14 10L18 8" stroke="currentColor" strokeWidth="2" />
      <path d="M10 14L6 16" stroke="currentColor" strokeWidth="2" />
      <path d="M14 14L18 16" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
