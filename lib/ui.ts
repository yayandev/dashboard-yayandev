type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "icon-sm" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-foreground text-background hover:bg-foreground/85",
  secondary: "border border-line bg-surface text-foreground hover:bg-surface-muted hover:border-line-strong",
  ghost: "text-muted hover:bg-surface-muted hover:text-foreground",
  danger: "bg-danger text-white hover:bg-danger/90 dark:text-background",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3",
  md: "h-9 px-3.5",
  "icon-sm": "h-7 w-7",
  icon: "h-9 w-9",
};

export function button(variant: Variant = "secondary", size: Size = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function input(hasError = false, extra = "") {
  return `w-full h-9 rounded-md border bg-surface px-3 text-sm outline-none transition-[border-color,box-shadow] placeholder:text-subtle ${
    hasError
      ? "border-danger focus:ring-3 focus:ring-danger/15"
      : "border-line hover:border-line-strong focus:border-accent focus:ring-3 focus:ring-accent/15"
  } ${extra}`;
}

export const panel = "rounded-lg border border-line bg-surface";
