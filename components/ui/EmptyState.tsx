interface Props {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  tone?: "default" | "danger";
}

export default function EmptyState({ icon, title, description, action, tone = "default" }: Props) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div
        className={`w-10 h-10 rounded-md border border-line flex items-center justify-center text-lg mb-4 ${
          tone === "danger" ? "bg-danger-soft text-danger border-danger/30" : "bg-surface-muted text-muted"
        }`}
      >
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-muted mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
