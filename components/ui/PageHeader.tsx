interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6 animate-fade-in">
      <div className="min-w-0">
        <h1 className="text-2xl md:text-[30px] leading-tight font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted mt-1.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
