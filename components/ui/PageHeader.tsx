import Link from "next/link";
import { FiChevronRight } from "react-icons/fi";

interface Props {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Parent pages, rendered as a breadcrumb above the title. */
  trail?: { href: string; label: string }[];
}

export default function PageHeader({ title, description, actions, trail }: Props) {
  return (
    <div className="mb-6">
      {trail && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px] text-muted mb-2">
          {trail.map((t) => (
            <span key={t.href} className="flex items-center gap-1">
              <Link href={t.href} className="hover:text-foreground transition-colors">
                {t.label}
              </Link>
              <FiChevronRight className="text-subtle" />
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight truncate">{title}</h1>
          {description && <p className="text-sm text-muted mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
