export default function TechBadge({
  name,
  children,
  className = "",
}: {
  name: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 h-5 px-1.5 rounded border border-line bg-surface-muted font-mono text-[11px] text-muted whitespace-nowrap ${className}`}
    >
      {name}
      {children}
    </span>
  );
}
