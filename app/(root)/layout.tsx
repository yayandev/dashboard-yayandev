"use client";

import { Suspense, useCallback, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-dvh">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />

      <div className="lg:pl-60 min-h-dvh flex flex-col">
        <Suspense fallback={<div className="h-14 border-b border-line" />}>
          <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        </Suspense>

        <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">{children}</main>
      </div>
    </div>
  );
}
