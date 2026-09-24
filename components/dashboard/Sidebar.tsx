"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FiFolder,
  FiGrid,
  FiLogOut,
  FiMoon,
  FiPlusSquare,
  FiSun,
  FiTerminal,
  FiX,
} from "react-icons/fi";
import { logout } from "@/lib/api";
import { useTheme } from "@/components/Providers";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const navItems = [
  { href: "/", label: "Dashboard", icon: FiGrid, match: (p: string) => p === "/" },
  {
    href: "/project",
    label: "Projects",
    icon: FiFolder,
    match: (p: string) => p === "/project" || p.startsWith("/project/"),
  },
  {
    href: "/create-project",
    label: "Project Baru",
    icon: FiPlusSquare,
    match: (p: string) => p === "/create-project",
  },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const pathname = usePathname() || "/";
  const { theme, toggleTheme } = useTheme();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-[98] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-[99] h-dvh w-[240px] bg-surface border-r border-line flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0 shadow-xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-line">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-primary text-background flex items-center justify-center">
              <FiTerminal className="text-sm" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">YayanDev</p>
              <p className="font-mono text-[10px] text-muted">console</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 rounded-lg text-muted hover:bg-surface-muted"
            aria-label="Tutup menu"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-4">
          <p className="px-2 mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">Menu</p>
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2.5 px-2 h-8 rounded-md text-sm transition-colors ${
                      active
                        ? "bg-surface-muted text-foreground font-medium"
                        : "text-muted hover:bg-surface-muted hover:text-foreground"
                    }`}
                  >
                    <Icon className="text-[15px] shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-2 border-t border-line space-y-0.5">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-2 h-8 rounded-md text-sm text-muted hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <FiSun className="text-[15px]" /> : <FiMoon className="text-[15px]" />}
            {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
          </button>
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full flex items-center gap-2.5 px-2 h-8 rounded-md text-sm text-muted hover:bg-danger-soft hover:text-danger transition-colors"
          >
            <FiLogOut className="text-[15px]" />
            Keluar
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmLogout}
        title="Keluar dari akun?"
        description="Kamu harus login kembali untuk mengakses dashboard."
        confirmLabel="Keluar"
        onConfirm={logout}
        onClose={() => setConfirmLogout(false)}
      />
    </>
  );
}
