"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { FiAlertCircle, FiArrowLeft, FiExternalLink } from "react-icons/fi";
import FormProject from "@/components/FormProject";
import PageHeader from "@/components/ui/PageHeader";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { deleteProject, fetchProject, formatDate, updateProject, type Project, type ProjectInput } from "@/lib/projects";
import { getErrorMessage } from "@/lib/api";
import { button, panel } from "@/lib/ui";
import { useProjects } from "@/hooks/useProjects";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { projects } = useProjects();
  const techSuggestions = useMemo(() => [...new Set(projects.flatMap((p) => p.tech_stack))].sort(), [projects]);

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
      toast.success("Perubahan disimpan");
      router.push("/project");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menyimpan perubahan"));
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProject(id);
      toast.success(`"${project?.title}" dihapus`);
      router.push("/project");
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus project"));
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        trail={[{ href: "/project", label: "Projects" }]}
        title={project?.title ?? (error ? "Project" : "\u00a0")}
        description={
          project?.created_at ? `Ditambahkan ${formatDate(project.created_at, "long")}` : error ? undefined : "\u00a0"
        }
        actions={
          project?.demo_url ? (
            <a href={project.demo_url} target="_blank" rel="noreferrer" className={button("secondary", "sm")}>
              <FiExternalLink /> Lihat demo
            </a>
          ) : undefined
        }
      />

      {error ? (
        <div className={panel}>
          <EmptyState
            tone="danger"
            icon={<FiAlertCircle />}
            title="Project tidak dapat dimuat"
            description={error}
            action={
              <Link href="/project" className={button("secondary", "sm")}>
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
          techSuggestions={techSuggestions}
          footer={
            <section className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between rounded-lg border border-danger/25 p-5">
              <div>
                <h2 className="text-sm font-medium">Hapus project</h2>
                <p className="text-[13px] text-muted mt-1">Project akan hilang dari portfolio. Tidak bisa dibatalkan.</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className={button("secondary", "sm", "shrink-0 !text-danger hover:!bg-danger-soft hover:!border-danger/40")}
              >
                Hapus project
              </button>
            </section>
          }
        />
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Hapus project ini?"
        description={
          <>
            <span className="font-medium text-foreground">{project?.title}</span> akan dihapus dari portfolio. Tindakan
            ini tidak bisa dibatalkan.
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
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
      <div className={`${panel} divide-y divide-line`}>
        {[2, 2, 1].map((rows, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[200px_minmax(0,1fr)] gap-x-8 gap-y-4 p-5 md:p-6">
            <div className="space-y-2">
              <div className="h-3.5 w-20 rounded bg-surface-muted animate-pulse" />
              <div className="h-3 w-36 rounded bg-surface-muted animate-pulse" />
            </div>
            <div className="space-y-5">
              {Array.from({ length: rows }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-3 w-16 rounded bg-surface-muted animate-pulse" />
                  <div className="h-9 rounded-md bg-surface-muted animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={`${panel} p-4`}>
        <div className="aspect-[16/9] rounded-md bg-surface-muted animate-pulse" />
      </div>
    </div>
  );
}
