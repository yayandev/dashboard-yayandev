export default function Kbd({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded border border-line bg-surface font-mono text-[11px] leading-none text-muted ${className}`}
    >
      {children}
    </kbd>
  );
}
