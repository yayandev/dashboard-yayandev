"use client";

import { useEffect } from "react";
import { button } from "@/lib/ui";
import Spinner from "./Spinner";

interface Props {
  open: boolean;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string;
  loadingLabel?: string;
  tone?: "danger" | "default";
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Hapus",
  loadingLabel = "Menghapus...",
  tone = "danger",
  loading = false,
  onConfirm,
  onClose,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-desc"
    >
      <div className="absolute inset-0 bg-black/40 animate-overlay-in" onClick={() => !loading && onClose()} />
      <div className="relative w-full max-w-sm bg-surface border border-line rounded-lg shadow-pop animate-pop-in">
        <div className="p-5">
          <h2 id="confirm-title" className="font-semibold">
            {title}
          </h2>
          <div id="confirm-desc" className="text-sm text-muted mt-1.5 break-words">
            {description}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-3 border-t border-line bg-surface-muted/50 rounded-b-lg">
          {/* Cancel gets focus so a stray Enter never confirms a destructive action. */}
          <button type="button" onClick={onClose} disabled={loading} autoFocus className={button("secondary", "sm")}>
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={button(tone === "danger" ? "danger" : "primary", "sm")}
          >
            {loading && <Spinner className="w-3.5 h-3.5" />}
            {loading ? loadingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
