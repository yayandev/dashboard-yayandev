const palette = [
  "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20",
  "bg-sky-500/10 text-sky-700 dark:text-sky-300 ring-sky-500/20",
  "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-500/20",
  "bg-amber-500/10 text-amber-700 dark:text-amber-300 ring-amber-500/20",
  "bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-500/20",
  "bg-violet-500/10 text-violet-700 dark:text-violet-300 ring-violet-500/20",
  "bg-teal-500/10 text-teal-700 dark:text-teal-300 ring-teal-500/20",
];

export function techColor(name: string) {
  let hash = 0;
  for (const ch of name.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return palette[hash % palette.length];
}

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
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ring-1 ring-inset whitespace-nowrap ${techColor(name)} ${className}`}
    >
      {name}
      {children}
    </span>
  );
}
