"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import FormProject from "@/components/FormProject";
import PageHeader from "@/components/ui/PageHeader";
import { useProjects } from "@/hooks/useProjects";
import { createProject, type ProjectInput } from "@/lib/projects";
import { getErrorMessage } from "@/lib/api";

export default function CreateProjectPage() {
  const router = useRouter();
  const { projects } = useProjects();
  const techSuggestions = useMemo(() => [...new Set(projects.flatMap((p) => p.tech_stack))].sort(), [projects]);

  const handleSubmit = async (values: ProjectInput) => {
    try {
      await createProject(values);
      toast.success(`"${values.title.trim()}" ditambahkan`);
      router.push("/project");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal membuat project"));
    }
  };

  return (
    <>
      <PageHeader
        trail={[{ href: "/project", label: "Projects" }]}
        title="Project baru"
        description="Tambahkan project ke portfolio."
      />
      <FormProject formType="create" onSubmit={handleSubmit} techSuggestions={techSuggestions} />
    </>
  );
}
