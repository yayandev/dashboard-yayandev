"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FiMenu, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { button } from "@/lib/ui";
import Kbd from "@/components/ui/Kbd";

interface Props {
  onOpenSidebar: () => void;
}

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  return el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
}

export default function Topbar({ onOpenSidebar }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const q = searchParams.get("q") ?? "";
  const [value, setValue] = useState(q);
  const [prevQ, setPrevQ] = useState(q);

  // Keep the input in sync when the query is changed elsewhere (e.g. "clear" button).
  if (q !== prevQ) {
    setPrevQ(q);
    setValue(q);
  }

  // "/" focuses search from anywhere, like most dev tools.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !isTypingTarget(e.target)) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
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

  const clear = () => {
    setValue("");
    if (onProjectList) applySearch("", true);
  };

  return (
    <header className="sticky top-0 z-30 h-14 bg-background/85 backdrop-blur border-b border-line px-4 md:px-6 flex items-center gap-2">
      <button onClick={onOpenSidebar} className={button("ghost", "icon", "lg:hidden -ml-2")} aria-label="Buka menu">
        <FiMenu className="text-base" />
      </button>

      <form
        role="search"
        className="relative flex-1 max-w-sm"
        onSubmit={(e) => {
          e.preventDefault();
          applySearch(value, onProjectList);
        }}
      >
        <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-subtle pointer-events-none" />
        <input
          ref={inputRef}
          type="search"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            // Filter live when already on the project list.
            if (onProjectList) applySearch(e.target.value, true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              if (value) clear();
              else e.currentTarget.blur();
            }
          }}
          placeholder="Cari project atau teknologi"
          aria-label="Cari project"
          className="peer w-full h-8 pl-8 pr-8 rounded-md border border-line bg-surface text-sm outline-none placeholder:text-subtle hover:border-line-strong focus:border-accent focus:ring-3 focus:ring-accent/15 transition-[border-color,box-shadow] [&::-webkit-search-cancel-button]:hidden"
        />
        {value ? (
          <button
            type="button"
            onClick={clear}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded flex items-center justify-center text-muted hover:text-foreground"
            aria-label="Hapus pencarian"
          >
            <FiX />
          </button>
        ) : (
          <Kbd className="hidden sm:inline-flex absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none peer-focus:hidden">
            /
          </Kbd>
        )}
      </form>

      <div className="ml-auto">
        <Link href="/create-project" className={button("primary", "sm", "max-sm:w-8 max-sm:px-0")} aria-label="Tambah project">
          <FiPlus />
          <span className="hidden sm:inline">Project baru</span>
        </Link>
      </div>
    </header>
  );
}
