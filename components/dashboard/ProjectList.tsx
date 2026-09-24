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
import { button, panel } from "@/lib/ui";
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

  const resetFilters = () => {
    const params = new URLSearchParams();
    if (searchParams.get("sort")) params.set("sort", sort);
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, { scroll: false });
  };

  const allTech = useMemo(() => {
    const counts = new Map<string, number>();
    projects.forEach((p) => p.tech_stack.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
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
      toast.success(`"${toDelete.title}" dihapus`);
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
        description="Semua project yang tampil di portfolio."
        actions={
          <button onClick={refetch} disabled={loading} className={button("secondary", "sm")} aria-label="Muat ulang">
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Muat ulang</span>
          </button>
        }
      />

      {/* Toolbar */}
      <div className="space-y-3 mb-4">
        {allTech.length > 0 && (
          <div className="flex gap-1.5 overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
            {allTech.map(([t, count]) => {
              const active = tech.toLowerCase() === t.toLowerCase();
              return (
                <button
                  key={t}
                  onClick={() => setParam("tech", active ? "" : t)}
                  aria-pressed={active}
                  className={`shrink-0 inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-xs transition-colors ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "border-line bg-surface text-muted hover:text-foreground hover:border-line-strong"
                  }`}
                >
                  {t}
                  <span className={`font-mono text-[10px] ${active ? "opacity-60" : "text-subtle"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 min-h-8">
          <div className="flex flex-wrap items-center gap-2 mr-auto text-[13px] text-muted">
            {loading ? (
              "Memuat…"
            ) : (
              <span>
                <span className="font-mono text-foreground tabular-nums">{filtered.length}</span>
                {hasFilter && <> dari {projects.length}</>} project
              </span>
            )}
            {q && (
              <FilterChip onClear={() => setParam("q", "")} label="Hapus kata kunci">
                <FiSearch className="text-subtle" /> {q}
              </FilterChip>
            )}
            {tech && (
              <FilterChip onClear={() => setParam("tech", "")} label="Hapus filter teknologi">
                {tech}
              </FilterChip>
            )}
            {hasFilter && (
              <button onClick={resetFilters} className="text-xs text-subtle hover:text-foreground transition-colors">
                Reset
              </button>
            )}
          </div>

          <label className="sr-only" htmlFor="sort">
            Urutkan
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)}
            className="h-8 pl-2.5 pr-7 rounded-md border border-line bg-surface text-[13px] outline-none hover:border-line-strong focus:border-accent focus:ring-3 focus:ring-accent/15"
          >
            {(Object.keys(sortLabels) as Sort[]).map((s) => (
              <option key={s} value={s}>
                {sortLabels[s]}
              </option>
            ))}
          </select>

          <div className="flex rounded-md border border-line p-0.5 bg-surface" role="group" aria-label="Tampilan">
            {(
              [
                ["grid", FiGrid, "Grid"],
                ["table", FiList, "Tabel"],
              ] as const
            ).map(([v, Icon, label]) => (
              <button
                key={v}
                onClick={() => saveView(v)}
                aria-label={label}
                title={label}
                aria-pressed={view === v}
                className={`w-7 h-6 rounded-[4px] flex items-center justify-center text-[13px] transition-colors ${
                  view === v ? "bg-surface-muted text-foreground" : "text-subtle hover:text-foreground"
                }`}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <div className={panel}>
          <EmptyState
            tone="danger"
            icon={<FiAlertCircle />}
            title="Gagal memuat project"
            description={error}
            action={
              <button onClick={refetch} className={button("secondary", "sm")}>
                <FiRefreshCw /> Coba lagi
              </button>
            }
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className={`${panel} border-dashed`}>
          {hasFilter ? (
            <EmptyState
              icon={<FiSearch />}
              title="Tidak ada yang cocok"
              description="Coba kata kunci lain atau lepas filter yang aktif."
              action={
                <button onClick={resetFilters} className={button("secondary", "sm")}>
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
                <Link href="/create-project" className={button("primary", "sm")}>
                  <FiPlus /> Project baru
                </Link>
              }
            />
          )}
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProjectCard key={p.id} project={p} onDelete={() => setToDelete(p)} />
          ))}
        </div>
      ) : (
        <ProjectTable projects={filtered} onDelete={setToDelete} />
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Hapus project ini?"
        description={
          <>
            <span className="font-medium text-foreground">{toDelete?.title}</span> akan dihapus dari portfolio. Tindakan
            ini tidak bisa dibatalkan.
          </>
        }
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}

function FilterChip({ children, label, onClear }: { children: React.ReactNode; label: string; onClear: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 h-6 pl-2 pr-0.5 rounded-md border border-line bg-surface text-xs text-foreground">
      {children}
      <button
        onClick={onClear}
        aria-label={label}
        className="w-5 h-5 rounded flex items-center justify-center text-subtle hover:text-foreground"
      >
        <FiX />
      </button>
    </span>
  );
}

function IconLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className={button("ghost", "icon-sm")} aria-label={label} title={label}>
      {children}
    </a>
  );
}

function RowActions({ project, onDelete }: { project: Project; onDelete: () => void }) {
  return (
    <div className="flex items-center">
      {project.github_url && (
        <IconLink href={project.github_url} label="Repository GitHub">
          <FiGithub />
        </IconLink>
      )}
      {project.demo_url && (
        <IconLink href={project.demo_url} label="Live demo">
          <FiExternalLink />
        </IconLink>
      )}
      <Link
        href={`/project/${project.id}`}
        className={button("ghost", "icon-sm")}
        aria-label={`Edit ${project.title}`}
        title="Edit"
      >
        <FiEdit2 />
      </Link>
      <button
        onClick={onDelete}
        className={button("ghost", "icon-sm", "hover:!text-danger hover:!bg-danger-soft")}
        aria-label={`Hapus ${project.title}`}
        title="Hapus"
      >
        <FiTrash2 />
      </button>
    </div>
  );
}

function ProjectCard({ project, onDelete }: { project: Project; onDelete: () => void }) {
  return (
    <article className={`${panel} group flex flex-col overflow-hidden hover:border-line-strong transition-colors`}>
      <Link
        href={`/project/${project.id}`}
        className="block aspect-[16/9] overflow-hidden border-b border-line bg-surface-muted"
        tabIndex={-1}
        aria-hidden
      >
        <ProjectImage src={project.image_url} alt="" className="w-full h-full text-2xl" />
      </Link>

      <div className="flex-1 flex flex-col p-4">
        <h3 className="font-medium leading-snug line-clamp-1">
          <Link href={`/project/${project.id}`} className="hover:underline underline-offset-2 decoration-line-strong">
            {project.title}
          </Link>
        </h3>
        <p className="text-sm text-muted mt-1 line-clamp-2 flex-1">
          {project.description || <span className="text-subtle">Tanpa deskripsi</span>}
        </p>

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {project.tech_stack.slice(0, 4).map((t) => (
              <TechBadge key={t} name={t} />
            ))}
            {project.tech_stack.length > 4 && (
              <span className="font-mono text-[11px] text-subtle self-center">+{project.tech_stack.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <footer className="flex items-center justify-between h-10 pl-4 pr-1.5 border-t border-line">
        <time dateTime={project.created_at ?? undefined} className="font-mono text-[11px] text-subtle">
          {formatDate(project.created_at)}
        </time>
        <RowActions project={project} onDelete={onDelete} />
      </footer>
    </article>
  );
}

function ProjectTable({ projects, onDelete }: { projects: Project[]; onDelete: (p: Project) => void }) {
  return (
    <div className={`${panel} overflow-hidden`}>
      {/* Mobile: compact list */}
      <ul className="md:hidden divide-y divide-line">
        {projects.map((p) => (
          <li key={p.id} className="flex items-center gap-3 pl-3 pr-1.5 py-2.5">
            <ProjectImage src={p.image_url} alt="" className="w-12 h-9 rounded border border-line shrink-0 text-xs" />
            <div className="min-w-0 flex-1">
              <Link href={`/project/${p.id}`} className="text-sm font-medium line-clamp-1">
                {p.title}
              </Link>
              <p className="font-mono text-[11px] text-subtle mt-0.5">{formatDate(p.created_at)}</p>
            </div>
            <RowActions project={p} onDelete={() => onDelete(p)} />
          </li>
        ))}
      </ul>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs text-muted">
              <th className="h-9 px-4 font-medium">Project</th>
              <th className="h-9 px-4 font-medium">Tech stack</th>
              <th className="h-9 px-4 font-medium whitespace-nowrap">Ditambahkan</th>
              <th className="h-9 px-4 font-medium">
                <span className="sr-only">Aksi</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-surface-muted/50 transition-colors">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-3 min-w-[260px]">
                    <ProjectImage
                      src={p.image_url}
                      alt=""
                      className="w-12 h-8 rounded border border-line shrink-0 text-xs"
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/project/${p.id}`}
                        className="font-medium hover:underline underline-offset-2 decoration-line-strong line-clamp-1"
                      >
                        {p.title}
                      </Link>
                      <p className="text-xs text-muted line-clamp-1 mt-0.5 max-w-xs">{p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-4">
                  <div className="flex flex-wrap gap-1 max-w-[260px]">
                    {p.tech_stack.slice(0, 3).map((t) => (
                      <TechBadge key={t} name={t} />
                    ))}
                    {p.tech_stack.length > 3 && (
                      <span className="font-mono text-[11px] text-subtle self-center">+{p.tech_stack.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="py-2.5 px-4 font-mono text-xs text-muted whitespace-nowrap">
                  {formatDate(p.created_at)}
                </td>
                <td className="py-2.5 px-2">
                  <div className="flex justify-end">
                    <RowActions project={p} onDelete={() => onDelete(p)} />
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
        <div key={i} className={`${panel} overflow-hidden`}>
          <div className="aspect-[16/9] bg-surface-muted animate-pulse" />
          <div className="p-4 space-y-2.5">
            <div className="h-4 w-2/3 rounded bg-surface-muted animate-pulse" />
            <div className="h-3 w-full rounded bg-surface-muted animate-pulse" />
            <div className="h-3 w-4/5 rounded bg-surface-muted animate-pulse" />
          </div>
          <div className="h-10 border-t border-line" />
        </div>
      ))}
    </div>
  );
}
