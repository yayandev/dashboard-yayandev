export default function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center w-7 h-7 rounded-md bg-foreground text-background font-mono text-[13px] font-semibold ${className}`}
    >
      y/
    </span>
  );
}
