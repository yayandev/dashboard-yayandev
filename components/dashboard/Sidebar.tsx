"use client";

import Link from "next/link";

import {
  FiGrid,
  FiFolder,
  FiBarChart2,
  FiSettings,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import LogoutButton from "../LogoutButton";

interface Props {
  mobile?: boolean;
}

export default function Sidebar({ mobile = false }: Props) {
  return (
    <aside
      className={`
        w-[280px]
        h-screen
        bg-white
        border-r
        border-[#e2e2e2]
        shadow-sm
        flex
        flex-col
        py-6
        ${mobile ? "" : "hidden lg:flex fixed top-0 left-0 z-40"}
      `}
    >
      {/* Header */}
      <div className="px-6 pb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-[#e2e2e2] flex items-center justify-center font-bold">
          DP
        </div>

        <div>
          <h1 className="text-[24px] font-semibold">DevPortfolio</h1>

          <p className="text-xs text-[#4c4546]">Engineering Console</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        <NavItem icon={<FiGrid />} label="Dashboard" />

        <NavItem active icon={<FiFolder />} label="Projects" />

        <NavItem icon={<FiBarChart2 />} label="Analytics" />

        <NavItem icon={<FiSettings />} label="Settings" />
      </nav>

      {/* Footer */}
      <div className="px-3 pt-6 border-t border-[#e2e2e2] space-y-1">
        <NavItem icon={<FiHelpCircle />} label="Support" />

        <LogoutButton />
      </div>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href="#"
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
        active
          ? "bg-[#e2e2e2]/60 text-black border-r-4 border-black font-semibold"
          : "text-[#4c4546] hover:bg-[#eeeeee]"
      }`}
    >
      <span className="text-[20px]">{icon}</span>

      <span className="text-sm">{label}</span>
    </Link>
  );
}
