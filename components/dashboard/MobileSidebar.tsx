"use client";

import Sidebar from "./Sidebar";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function MobileSidebar({ open, setOpen }: Props) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-[98] transition-all duration-300 lg:hidden ${
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen z-[99] transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-[100%]"
        }`}
      >
        <Sidebar mobile />
      </div>
    </>
  );
}
