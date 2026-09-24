"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiAlertCircle, FiArrowLeft, FiChevronRight, FiTrash2 } from "react-icons/fi";
import FormProject from "@/components/FormProject";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { deleteProject, fetchProject, formatDate, updateProject, type Project, type ProjectInput } from "@/lib/projects";
import { getErrorMessage } from "@/lib/api";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchProject(id)
      .then((data) => !cancelled && setProject(data))
      .catch((err) => !cancelled && setError(getErrorMessage(err, "Project tidak ditemukan")));
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleSubmit = async (values: ProjectInput) => {
    try {
      await updateProject(id, values);
      toast.success("Perubahan berhasil disimpan");
      router.push("/project");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan perubahan"));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      toast.success("Project berhasil dihapus");
      router.push("/project");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus project"));
      setDeleting(false);
    }
  };

  return (
    <>
      <nav className="flex items-center gap-1 text-sm text-muted mb-3" aria-label="Breadcrumb">
        <Link href="/project" className="hover:text-foreground">
          Projects
        </Link>
        <FiChevronRight />
        <span className="text-foreground truncate">{project?.title ?? "Edit"}</span>
      </nav>

      <PageHeader
        title="Edit Project"
        description={
          project?.created_at
            ? `Ditambahkan pada ${formatDate(project.created_at, "long")}`
            : "Perbarui detail project dan simpan perubahan."
        }
      />

      {error ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            tone="danger"
            icon={<FiAlertCircle />}
            title="Project tidak dapat dimuat"
            description={error}
            action={
              <Link
                href="/project"
                className="h-10 px-4 rounded-xl border border-line text-sm font-medium inline-flex items-center gap-2 hover:bg-surface-muted"
              >
                <FiArrowLeft /> Kembali ke Projects
              </Link>
            }
          />
        </div>
      ) : !project ? (
        <FormSkeleton />
      ) : (
        <FormProject
          formType="edit"
          initialValues={{
            title: project.title,
            description: project.description,
            githubUrl: project.github_url ?? "",
            demoUrl: project.demo_url ?? "",
            techStack: project.tech_stack,
            imageUrl: project.image_url ?? null,
          }}
          onSubmit={handleSubmit}
          footer={
            <section className="rounded-2xl border border-danger/30 bg-surface p-5 md:p-6">
              <h2 className="font-semibold text-danger">Zona Berbahaya</h2>
              <p className="text-sm text-muted mt-0.5 mb-4">Menghapus project bersifat permanen.</p>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="w-full h-10 rounded-xl border border-danger/40 text-danger text-sm font-semibold flex items-center justify-center gap-2 hover:bg-danger-soft transition"
              >
                <FiTrash2 /> Hapus Project
              </button>
            </section>
          }
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Hapus project?"
        description={
          <>
            Project <span className="font-semibold text-foreground">&ldquo;{project?.title}&rdquo;</span> akan dihapus
            permanen dan tidak bisa dikembalikan.
          </>
        }
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  );
}

function FormSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        {[3, 3].map((rows, i) => (
          <div key={i} className="rounded-2xl border border-line bg-surface p-6 space-y-5">
            <div className="h-4 w-40 rounded bg-surface-muted animate-pulse" />
            {Array.from({ length: rows }).map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-24 rounded bg-surface-muted animate-pulse" />
                <div className="h-11 rounded-xl bg-surface-muted animate-pulse" />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-2xl border border-line bg-surface p-6 space-y-4">
          <div className="h-4 w-32 rounded bg-surface-muted animate-pulse" />
          <div className="aspect-[16/10] rounded-xl bg-surface-muted animate-pulse" />
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6 space-y-3">
          <div className="h-11 rounded-xl bg-surface-muted animate-pulse" />
          <div className="h-11 rounded-xl bg-surface-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
