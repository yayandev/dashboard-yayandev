"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import { toast } from "react-toastify";
import {
  FiAlertCircle,
  FiEdit2,
  FiExternalLink,
  FiFolder,
  FiGithub,
  FiGrid,
  FiList,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import { useProjects } from "@/hooks/useProjects";
import { deleteProject, formatDate, type Project } from "@/lib/projects";
import { getErrorMessage } from "@/lib/api";
import PageHeader from "@/components/ui/PageHeader";
import ProjectImage from "@/components/ui/ProjectImage";
import TechBadge from "@/components/ui/TechBadge";
import EmptyState from "@/components/ui/EmptyState";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type Sort = "newest" | "oldest" | "az" | "za";
type View = "grid" | "table";

const sortLabels: Record<Sort, string> = {
  newest: "Terbaru",
  oldest: "Terlama",
  az: "Nama A–Z",
  za: "Nama Z–A",
};

// View preference is persisted per browser.
const viewListeners = new Set<() => void>();
function readView(): View {
  try {
    return localStorage.getItem("project-view") === "table" ? "table" : "grid";
  } catch {
    return "grid";
  }
}
function saveView(view: View) {
  try {
    localStorage.setItem("project-view", view);
  } catch {}
  viewListeners.forEach((l) => l());
}
function subscribeView(l: () => void) {
  viewListeners.add(l);
  return () => viewListeners.delete(l);
}

export default function ProjectList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { projects, loading, error, refetch, removeLocal } = useProjects();

  const view = useSyncExternalStore(subscribeView, readView, () => "grid" as View);
  const [toDelete, setToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const q = searchParams.get("q") ?? "";
  const tech = searchParams.get("tech") ?? "";
  const sort = (searchParams.get("sort") as Sort) || "newest";

  const setParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  };

  const allTech = useMemo(() => {
    const set = new Map<string, number>();
    projects.forEach((p) => p.tech_stack.forEach((t) => set.set(t, (set.get(t) ?? 0) + 1)));
    return [...set.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [projects]);

  const filtered = useMemo(() => {
    const keyword = q.toLowerCase();
    const result = projects.filter((p) => {
      const matchText =
        !keyword ||
        p.title.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword) ||
        p.tech_stack.some((t) => t.toLowerCase().includes(keyword));
      const matchTech = !tech || p.tech_stack.some((t) => t.toLowerCase() === tech.toLowerCase());
      return matchText && matchTech;
    });

    const time = (p: Project) => new Date(p.created_at ?? 0).getTime();
    return result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return time(a) - time(b);
        case "az":
          return a.title.localeCompare(b.title);
        case "za":
          return b.title.localeCompare(a.title);
        default:
          return time(b) - time(a);
      }
    });
  }, [projects, q, tech, sort]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteProject(toDelete.id);
      removeLocal(toDelete.id);
      toast.success(`Project "${toDelete.title}" berhasil dihapus`);
      setToDelete(null);
    } catch (err) {
      toast.error(getErrorMessage(err, "Gagal menghapus project"));
    } finally {
      setDeleting(false);
    }
  };

  const hasFilter = Boolean(q || tech);

  return (
    <>
      <PageHeader
        title="Projects"
        description="Kelola semua project yang tampil di portfolio kamu."
        actions={
          <button
            onClick={refetch}
            disabled={loading}
            className="h-10 px-3.5 rounded-xl border border-line bg-surface text-sm font-medium flex items-center gap-2 hover:bg-surface-muted transition disabled:opacity-60"
            aria-label="Muat ulang"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Muat ulang</span>
          </button>
        }
      />

      {/* Toolbar */}
      <div className="rounded-2xl border border-line bg-surface p-3 md:p-4 mb-4 space-y-3 animate-fade-in">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted mr-auto">
            {loading ? (
              "Memuat project..."
            ) : (
              <>
                Menampilkan <span className="font-semibold text-foreground">{filtered.length}</span> dari{" "}
                {projects.length} project
              </>
            )}
          </p>

          <select
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)}
            className="h-9 pl-3 pr-8 rounded-lg border border-line bg-surface text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/15"
            aria-label="Urutkan"
          >
            {(Object.keys(sortLabels) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {sortLabels[s]}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-line p-0.5 bg-surface-muted">
            {(
              [
                ["grid", FiGrid, "Tampilan grid"],
                ["table", FiList, "Tampilan tabel"],
              ] as const
            ).map(([v, Icon, label]) => (
              <button
                key={v}
                onClick={() => saveView(v)}
                aria-label={label}
                aria-pressed={view === v}
                className={`w-8 h-8 rounded-md flex items-center justify-center transition ${
                  view === v ? "bg-surface shadow-sm text-primary" : "text-muted hover:text-foreground"
                }`}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>

        {allTech.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1 pb-0.5">
            <button
              onClick={() => setParam("tech", "")}
              className={`shrink-0 h-8 px-3 rounded-full text-xs font-medium border transition ${
                !tech
                  ? "bg-primary text-white dark:text-slate-950 border-primary"
                  : "border-line text-muted hover:text-foreground hover:bg-surface-muted"
              }`}
            >
              Semua
            </button>
            {allTech.map((t) => {
              const active = tech.toLowerCase() === t.toLowerCase();
              return (
                <button
                  key={t}
                  onClick={() => setParam("tech", active ? "" : t)}
                  className={`shrink-0 h-8 px-3 rounded-full text-xs font-medium border transition ${
                    active
                      ? "bg-primary text-white dark:text-slate-950 border-primary"
                      : "border-line text-muted hover:text-foreground hover:bg-surface-muted"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        )}

        {hasFilter && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {q && (
              <span className="inline-flex items-center gap-1.5 h-7 pl-2.5 pr-1.5 rounded-full bg-primary-soft text-primary font-medium">
                <FiSearch /> &ldquo;{q}&rdquo;
                <button onClick={() => setParam("q", "")} aria-label="Hapus kata kunci" className="p-0.5 rounded-full hover:bg-primary/15">
                  <FiX />
                </button>
              </span>
            )}
            <button
              onClick={() => router.replace(pathname, { scroll: false })}
              className="text-muted hover:text-foreground underline underline-offset-2"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <div className="rounded-2xl border border-line bg-surface">
          <EmptyState
            tone="danger"
            icon={<FiAlertCircle />}
            title="Gagal memuat project"
            description={error}
            action={
              <button
                onClick={refetch}
                className="h-10 px-4 rounded-xl border border-line text-sm font-medium inline-flex items-center gap-2 hover:bg-surface-muted"
              >
                <FiRefreshCw /> Coba lagi
              </button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-line bg-surface">
          {hasFilter ? (
            <EmptyState
              icon={<FiSearch />}
              title="Tidak ada project yang cocok"
              description="Coba kata kunci lain atau hapus filter yang aktif."
              action={
                <button
                  onClick={() => router.replace(pathname)}
                  className="h-10 px-4 rounded-xl border border-line text-sm font-medium hover:bg-surface-muted"
                >
                  Reset filter
                </button>
              }
            />
          ) : (
            <EmptyState
              icon={<FiFolder />}
              title="Belum ada project"
              description="Project yang kamu tambahkan akan muncul di sini."
              action={
                <Link
                  href="/create-project"
                  className="h-10 px-4 rounded-xl bg-primary text-white dark:text-slate-950 text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary-hover"
                >
                  <FiPlus /> Tambah Project
                </Link>
              }
            />
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onDelete={() => setToDelete(p)} />
          ))}
        </div>
      ) : (
        <ProjectTable projects={filtered} onDelete={setToDelete} />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Hapus project?"
        description={
          <>
            Project <span className="font-semibold text-foreground">&ldquo;{toDelete?.title}&rdquo;</span> akan
            dihapus permanen dan tidak bisa dikembalikan.
          </>
        }
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}

function LinkButtons({ project }: { project: Project }) {
  return (
    <>
      {project.github_url && (
        <a
          href={project.github_url}
          target="_blank"
          rel="noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-muted transition"
          aria-label="Buka repository GitHub"
          title="GitHub"
        >
          <FiGithub />
        </a>
      )}
      {project.demo_url && (
        <a
          href={project.demo_url}
          target="_blank"
          rel="noreferrer"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-surface-muted transition"
          aria-label="Buka live demo"
          title="Live demo"
        >
          <FiExternalLink />
        </a>
      )}
    </>
  );
}

function ActionButtons({ project, onDelete }: { project: Project; onDelete: () => void }) {
  return (
    <>
      <Link
        href={`/project/${project.id}`}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-primary hover:bg-primary-soft transition"
        aria-label={`Edit ${project.title}`}
        title="Edit"
      >
        <FiEdit2 />
      </Link>
      <button
        onClick={onDelete}
        className="w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger-soft transition"
        aria-label={`Hapus ${project.title}`}
        title="Hapus"
      >
        <FiTrash2 />
      </button>
    </>
  );
}

function ProjectCard({ project, index, onDelete }: { project: Project; index: number; onDelete: () => void }) {
  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      className="group flex flex-col rounded-2xl border border-line bg-surface overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 hover:border-primary/40 transition-all duration-300 animate-fade-in"
    >
      <Link href={`/project/${project.id}`} className="relative block aspect-[16/9] overflow-hidden bg-surface-muted">
        <ProjectImage
          src={project.image_url}
          alt={project.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <span className="absolute top-3 left-3 text-[11px] font-medium px-2 py-1 rounded-md bg-slate-950/60 text-white backdrop-blur-sm">
          {formatDate(project.created_at)}
        </span>
      </Link>

      <div className="flex-1 flex flex-col p-4">
        <Link href={`/project/${project.id}`}>
          <h3 className="font-semibold leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </Link>
        <p className="text-sm text-muted mt-1.5 line-clamp-2 flex-1">{project.description || "Tanpa deskripsi"}</p>

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tech_stack.slice(0, 4).map((t) => (
              <TechBadge key={t} name={t} />
            ))}
            {project.tech_stack.length > 4 && (
              <span className="text-[11px] text-muted self-center">+{project.tech_stack.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center gap-1 mt-4 pt-3 border-t border-line -mx-1">
          <LinkButtons project={project} />
          <div className="ml-auto flex items-center gap-1">
            <ActionButtons project={project} onDelete={onDelete} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectTable({ projects, onDelete }: { projects: Project[]; onDelete: (p: Project) => void }) {
  return (
    <div className="rounded-2xl border border-line bg-surface overflow-hidden animate-fade-in">
      {/* Mobile: compact list */}
      <ul className="md:hidden divide-y divide-line">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center gap-3 p-3">
            <ProjectImage src={p.image_url} alt={p.title} className="w-16 h-12 rounded-lg border border-line shrink-0" />
            <div className="min-w-0 flex-1">
              <Link href={`/project/${p.id}`} className="text-sm font-medium line-clamp-1">
                {p.title}
              </Link>
              <p className="text-xs text-muted mt-0.5">{formatDate(p.created_at)}</p>
            </div>
            <div className="flex items-center">
              <ActionButtons project={p} onDelete={() => onDelete(p)} />
            </div>
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-surface-muted/60 text-xs uppercase tracking-wider text-muted">
              <th className="py-3 px-4 font-semibold">Project</th>
              <th className="py-3 px-4 font-semibold">Tech Stack</th>
              <th className="py-3 px-4 font-semibold whitespace-nowrap">Tanggal</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3 min-w-[260px]">
                    <ProjectImage
                      src={p.image_url}
                      alt={p.title}
                      className="w-16 h-11 rounded-lg border border-line shrink-0"
                    />
                    <div className="min-w-0">
                      <Link href={`/project/${p.id}`} className="font-medium hover:text-primary line-clamp-1">
                        {p.title}
                      </Link>
                      <p className="text-xs text-muted line-clamp-1 mt-0.5 max-w-xs">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex flex-wrap gap-1 max-w-[260px]">
                    {p.tech_stack.slice(0, 3).map((t) => (
                      <TechBadge key={t} name={t} />
                    ))}
                    {p.tech_stack.length > 3 && (
                      <span className="text-[11px] text-muted self-center">+{p.tech_stack.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4 text-muted whitespace-nowrap">{formatDate(p.created_at)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end">
                    <LinkButtons project={p} />
                    <ActionButtons project={p} onDelete={() => onDelete(p)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-line bg-surface overflow-hidden">
          <div className="aspect-[16/9] bg-surface-muted animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-4 w-2/3 rounded bg-surface-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-surface-muted animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-surface-muted animate-pulse" />
            <div className="flex gap-2 pt-1">
              <div className="h-5 w-14 rounded bg-surface-muted animate-pulse" />
              <div className="h-5 w-16 rounded bg-surface-muted animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
