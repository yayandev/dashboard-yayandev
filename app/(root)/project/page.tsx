import { Suspense } from "react";
import type { Metadata } from "next";
import ProjectList from "@/components/dashboard/ProjectList";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectPage() {
  return (
    <Suspense>
      <ProjectList />
    </Suspense>
  );
}
