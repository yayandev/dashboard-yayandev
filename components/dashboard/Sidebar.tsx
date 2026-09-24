"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FiFolder, FiGrid, FiLogOut, FiMonitor, FiMoon, FiSun, FiX } from "react-icons/fi";
import { logout } from "@/lib/api";
import { useTheme, type ThemePreference } from "@/components/Providers";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import BrandMark from "@/components/ui/BrandMark";

const navItems = [
  { href: "/", label: "Ringkasan", icon: FiGrid, match: (p: string) => p === "/" },
  {
    href: "/project",
    label: "Projects",
    icon: FiFolder,
    match: (p: string) => p === "/project" || p.startsWith("/project/") || p === "/create-project",
  },
];

const themeOptions: { value: ThemePreference; label: string; icon: typeof FiSun }[] = [
  { value: "light", label: "Terang", icon: FiSun },
  { value: "dark", label: "Gelap", icon: FiMoon },
  { value: "system", label: "Sistem", icon: FiMonitor },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname() || "/";
  const { preference, setPreference } = useTheme();
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[98] transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-[99] h-dvh w-60 bg-background border-r border-line flex flex-col transition-transform duration-200 ease-out lg:translate-x-0 ${
          open ? "translate-x-0 shadow-pop" : "-translate-x-full"
        }`}
      >
        <div className="h-14 px-4 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-2.5 rounded-md">
            <BrandMark />
            <span className="text-sm font-semibold">YayanDev</span>
            <span className="font-mono text-[11px] text-subtle">console</span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 -mr-1.5 rounded-md flex items-center justify-center text-muted hover:bg-surface-muted"
            aria-label="Tutup menu"
          >
            <FiX />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5">
            {navItems.map(({ href, label, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 h-8 px-2.5 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-surface-muted text-foreground font-medium"
                        : "text-muted hover:bg-surface-muted/70 hover:text-foreground"
                    }`}
                  >
                    <Icon className={`shrink-0 ${active ? "text-accent" : ""}`} />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-2 border-t border-line space-y-1">
          <div className="flex items-center justify-between h-9 px-2.5">
            <span className="text-[13px] text-muted">Tema</span>
            <div role="radiogroup" aria-label="Tema" className="flex rounded-md border border-line p-0.5 bg-surface">
              {themeOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  role="radio"
                  aria-checked={preference === value}
                  aria-label={label}
                  title={label}
                  onClick={() => setPreference(value)}
                  className={`w-6 h-6 rounded-[4px] flex items-center justify-center text-[13px] transition-colors ${
                    preference === value ? "bg-surface-muted text-foreground" : "text-subtle hover:text-foreground"
                  }`}
                >
                  <Icon />
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full flex items-center gap-2.5 h-8 px-2.5 rounded-md text-sm text-muted hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            <FiLogOut className="shrink-0" />
            Keluar
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        tone="default"
        title="Keluar dari console?"
        description="Kamu perlu login lagi untuk mengelola project."
        confirmLabel="Keluar"
        onConfirm={logout}
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
}
