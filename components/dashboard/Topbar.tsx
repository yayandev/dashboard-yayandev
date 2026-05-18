"use client";

import Link from "next/link";
import { FiBell, FiMenu, FiPlus, FiSearch, FiSettings } from "react-icons/fi";

interface Props {
  setOpenSidebar: (value: boolean) => void;
}

export default function Topbar({ setOpenSidebar }: Props) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-[280px] h-16 bg-white/95 backdrop-blur-sm border-b border-[#e2e2e2] z-30 px-4 md:px-6 flex items-center justify-between">
      {/* Left */}
      <div className="flex items-center gap-3 w-full max-w-md">
        {/* Hamburger */}
        <button
          onClick={() => setOpenSidebar(true)}
          className="lg:hidden flex items-center justify-center cursor-pointer"
        >
          <FiMenu className="text-2xl" />
        </button>
        {/* Search */}
        <div className="relative w-full">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4c4546]" />

          <input
            type="text"
            placeholder="Search projects, tags, or IDs..."
            className="w-full pl-10 pr-4 py-2 bg-[#f3f3f3] border border-[#e2e2e2] rounded-lg text-sm outline-none focus:border-black focus:ring-1 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Right */}
      <div className="hidden md:flex items-center gap-4 ml-4">
        <div className="flex items-center gap-2 pr-4 border-r border-[#e2e2e2]">
          <button className="p-2 rounded-full hover:bg-[#eeeeee] transition">
            <FiBell />
          </button>

          <button className="p-2 rounded-full hover:bg-[#eeeeee] transition">
            <FiSettings />
          </button>
        </div>

        <Link
          href={"/create-project"}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition flex items-center gap-2"
        >
          <FiPlus />
          Add New Project
        </Link>
      </div>
    </header>
  );
}
