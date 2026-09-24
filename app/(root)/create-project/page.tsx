"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiChevronRight } from "react-icons/fi";
import FormProject from "@/components/FormProject";
import PageHeader from "@/components/ui/PageHeader";
import { createProject, type ProjectInput } from "@/lib/projects";
import { getErrorMessage } from "@/lib/api";

export default function CreateProjectPage() {
  const router = useRouter();

  const handleSubmit = async (values: ProjectInput) => {
    try {
      await createProject(values);
      toast.success("Project berhasil dibuat!");
      router.push("/project");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal membuat project"));
    }
  };

  return (
    <>
      <nav className="flex items-center gap-1 text-sm text-muted mb-3" aria-label="Breadcrumb">
        <Link href="/project" className="hover:text-foreground">
          Projects
        </Link>
        <FiChevronRight />
        <span className="text-foreground">Tambah</span>
      </nav>
      <PageHeader
        title="Tambah Project Baru"
        description="Isi detail di bawah untuk menambahkan project ke portfolio kamu."
      />
      <FormProject formType="create" onSubmit={handleSubmit} />
    </>
  );
}
