"use client";

import { Suspense, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-dvh">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-[240px] min-h-dvh flex flex-col">
        <Suspense fallback={<div className="h-14 border-b border-line bg-surface/80" />}>
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        </Suspense>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10">{children}</main>
      </div>
    </div>
  );
}
