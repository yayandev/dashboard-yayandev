"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import MobileSidebar from "@/components/dashboard/MobileSidebar";
import Topbar from "@/components/dashboard/Topbar";
import ProjectTable from "@/components/dashboard/ProjectTable";

export default function ProjectPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="bg-[#f3f3f3] text-[#1a1c1c] min-h-screen overflow-x-hidden">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="lg:ml-[280px]">
        <Topbar setOpenSidebar={setSidebarOpen} />

        <div className="pt-24 p-4 md:p-6 mt-12">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-[32px] leading-tight font-semibold tracking-[-0.01em]">
                Project Roster
              </h1>

              <p className="text-sm text-[#4c4546] mt-1">
                Manage and monitor your technical portfolio deployments.
              </p>
            </div>
          </div>

          <ProjectTable />
        </div>
      </div>
    </main>
  );
}
