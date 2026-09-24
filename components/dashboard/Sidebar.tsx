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
    label: "Tambah Project",
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
        className={`fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] z-[98] transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`fixed top-0 left-0 z-[99] h-dvh w-[272px] bg-surface border-r border-line flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 ${
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-line">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <FiTerminal className="text-lg" />
            </div>
            <div className="leading-tight">
              <p className="font-semibold">YayanDev</p>
              <p className="text-[11px] text-muted">Engineering Console</p>
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
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Menu</p>
          <ul className="space-y-1">
            {navItems.map(({ href, label, icon: Icon, match }) => {
              const active = match(pathname);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      active
                        ? "bg-primary-soft text-primary font-semibold"
                        : "text-muted hover:bg-surface-muted hover:text-foreground"
                    }`}
                  >
                    {active && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" />}
                    <Icon className="text-[18px] shrink-0" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-line space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:bg-surface-muted hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <FiSun className="text-[18px]" /> : <FiMoon className="text-[18px]" />}
            {theme === "dark" ? "Mode Terang" : "Mode Gelap"}
          </button>
          <button
            onClick={() => setConfirmLogout(true)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:bg-danger-soft hover:text-danger transition-colors"
          >
            <FiLogOut className="text-[18px]" />
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
