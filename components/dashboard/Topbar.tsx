"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiMoon, FiPlus, FiSearch, FiSun, FiX } from "react-icons/fi";
import { useTheme } from "@/components/Providers";

interface Props {
  onOpenSidebar: () => void;
}

export default function Topbar({ onOpenSidebar }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  const q = searchParams.get("q") ?? "";
  const [value, setValue] = useState(q);
  const [prevQ, setPrevQ] = useState(q);

  // Keep the input in sync when the query is changed elsewhere (e.g. "clear" button).
  if (q !== prevQ) {
    setPrevQ(q);
    setValue(q);
  }

  const inputRef = useRef<HTMLInputElement>(null);

  // "/" or Ctrl/Cmd+K focuses search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
      if ((e.key === "/" && !typing) || (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onProjectList = pathname === "/project";

  const applySearch = (text: string, replace: boolean) => {
    const params = new URLSearchParams(onProjectList ? searchParams.toString() : "");
    if (text.trim()) params.set("q", text.trim());
    else params.delete("q");
    const url = `/project${params.toString() ? `?${params}` : ""}`;
    if (replace) router.replace(url, { scroll: false });
    else router.push(url);
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-background/90 backdrop-blur border-b border-line px-4 md:px-6 flex items-center gap-3">
      <button
        onClick={onOpenSidebar}
        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-muted"
        aria-label="Buka menu"
      >
        <FiMenu className="text-xl" />
      </button>

      <form
        role="search"
        className="relative flex-1 max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          applySearch(value, onProjectList);
        }}
      >
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Filter live when already on the project list.
            if (onProjectList) applySearch(e.target.value, true);
          }}
          placeholder="Cari project atau teknologi..."
          aria-label="Cari project"
          className="w-full h-9 pl-9 pr-12 bg-surface border border-line rounded-md text-sm outline-none placeholder:text-muted focus:bg-surface focus:border-primary focus:ring-2 focus:ring-primary/10 transition [&::-webkit-search-cancel-button]:hidden"
        />
        {!value && (
          <kbd className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 h-5 px-1.5 items-center rounded border border-line font-mono text-[10px] text-muted pointer-events-none">
            /
          </kbd>
        )}
        {value && (
          <button
            type="button"
            onClick={() => {
              setValue("");
              if (onProjectList) applySearch("", true);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted hover:text-foreground"
            aria-label="Hapus pencarian"
          >
            <FiX />
          </button>
        )}
      </form>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="hidden sm:flex w-9 h-9 items-center justify-center rounded-md text-muted hover:bg-surface-muted hover:text-foreground transition"
          aria-label="Ganti tema"
          title={theme === "dark" ? "Mode terang" : "Mode gelap"}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>

        <Link
          href="/create-project"
          className="h-9 w-9 sm:w-auto sm:px-3 bg-primary text-background rounded-md text-sm font-medium hover:bg-primary-hover transition flex items-center justify-center gap-2"
          aria-label="Tambah project"
        >
          <FiPlus />
          <span className="hidden sm:inline">Project Baru</span>
        </Link>
      </div>
    </header>
  );
}
