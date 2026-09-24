"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FiAlertCircle, FiArrowUpRight, FiCheck, FiPlus, FiRefreshCw } from "react-icons/fi";
import { useProjects } from "@/hooks/useProjects";
import { formatDate, type Project } from "@/lib/projects";
import PageHeader from "@/components/ui/PageHeader";
import ProjectImage from "@/components/ui/ProjectImage";

function missingFields(p: Project) {
  const missing: string[] = [];
  if (!p.image_url) missing.push("gambar");
  if (!p.demo_url) missing.push("demo");
  if (!p.github_url) missing.push("repo");
  if (p.tech_stack.length === 0) missing.push("tech stack");
  return missing;
}

function percent(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

export default function DashboardPage() {
  const { projects, loading, error, refetch } = useProjects();

  const stats = useMemo(() => {
    const techCount = new Map<string, number>();
    projects.forEach((p) => p.tech_stack.forEach((t) => techCount.set(t, (techCount.get(t) ?? 0) + 1)));
    const byDate = [...projects].sort(
      (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
    );
    const incomplete = byDate
      .map((p) => ({ project: p, missing: missingFields(p) }))
      .filter((x) => x.missing.length > 0);

    return {
      total: projects.length,
      techs: techCount.size,
      withDemo: projects.filter((p) => p.demo_url).length,
      withRepo: projects.filter((p) => p.github_url).length,
      topTech: [...techCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
      recent: byDate.slice(0, 6),
      latest: byDate[0],
      incomplete,
    };
  }, [projects]);

  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const metrics = [
    {
      label: "Project",
      value: stats.total,
      note: stats.latest ? `terakhir ${formatDate(stats.latest.created_at)}` : "belum ada",
    },
    { label: "Teknologi", value: stats.techs, note: "unik di semua project" },
    { label: "Live demo", value: stats.withDemo, note: `${percent(stats.withDemo, stats.total)}% dari project` },
    { label: "Repo GitHub", value: stats.withRepo, note: `${percent(stats.withRepo, stats.total)}% dari project` },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={today}
        actions={
          <button
            onClick={refetch}
            disabled={loading}
            className="h-8 px-2.5 rounded-md border border-line bg-surface text-sm flex items-center gap-2 text-muted hover:text-foreground transition disabled:opacity-60"
            aria-label="Muat ulang"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Muat ulang</span>
          </button>
        }
      />

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-md border border-danger/30 bg-danger-soft text-danger p-3 text-sm">
          <FiAlertCircle className="shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          <button onClick={refetch} className="font-medium underline underline-offset-2">
            Coba lagi
          </button>
        </div>
      )}

      {/* Metrics */}
      <section className="grid grid-cols-2 lg:grid-cols-4 rounded-lg border border-line bg-surface mb-8 overflow-hidden">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={`p-4 md:p-5 border-line ${i % 2 === 1 ? "border-l" : ""} ${
              i >= 2 ? "border-t lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l" : ""}`}
          >
            <p className="text-xs text-muted">{m.label}</p>
            {loading ? (
              <div className="h-7 w-12 mt-2 rounded bg-surface-muted animate-pulse" />
            ) : (
              <p className="font-mono text-[28px] leading-none tracking-tight mt-2 tabular-nums">{m.value}</p>
            )}
            <p className="text-xs text-muted mt-2 truncate">{loading ? " " : m.note}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8">
        {/* Recent projects */}
        <section>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-sm font-semibold">Project terbaru</h2>
            <Link href="/project" className="text-xs text-muted hover:text-foreground inline-flex items-center gap-0.5">
              Semua project <FiArrowUpRight />
            </Link>
          </div>

          <div className="rounded-lg border border-line bg-surface overflow-hidden">
            {loading ? (
              <ul className="divide-y divide-line">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-12 h-8 rounded bg-surface-muted animate-pulse" />
                    <div className="flex-1 h-3.5 max-w-48 rounded bg-surface-muted animate-pulse" />
                  </li>
                ))}
              </ul>
            ) : stats.recent.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <p className="text-sm text-muted">Belum ada project.</p>
                <Link
                  href="/create-project"
                  className="mt-3 h-8 px-3 rounded-md bg-primary text-background text-sm font-medium inline-flex items-center gap-1.5 hover:bg-primary-hover"
                >
                  <FiPlus /> Project baru
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {stats.recent.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/project/${p.id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted/60 transition-colors"
                    >
                      <ProjectImage src={p.image_url} alt="" className="w-12 h-8 rounded border border-line shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{p.title}</p>
                        <p className="text-xs text-muted truncate mt-0.5">
                          {p.tech_stack.length ? p.tech_stack.join(" · ") : "Tanpa tech stack"}
                        </p>
                      </div>
                      <span className="hidden sm:block font-mono text-xs text-muted shrink-0">
                        {formatDate(p.created_at)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <div className="space-y-8">
          {/* Tech stack */}
          <section>
            <h2 className="text-sm font-semibold mb-3">Tech stack</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-4 rounded bg-surface-muted animate-pulse" />
                ))}
              </div>
            ) : stats.topTech.length === 0 ? (
              <p className="text-sm text-muted">Belum ada data.</p>
            ) : (
              <ul className="space-y-2">
                {stats.topTech.map(([name, count]) => (
                  <li key={name}>
                    <Link
                      href={`/project?tech=${encodeURIComponent(name)}`}
                      className="group grid grid-cols-[96px_1fr_24px] items-center gap-3 text-sm"
                    >
                      <span className="truncate text-muted group-hover:text-foreground">{name}</span>
                      <span className="h-1.5 rounded-full bg-surface-muted overflow-hidden">
                        <span
                          className="block h-full rounded-full bg-foreground/70 group-hover:bg-accent transition-colors"
                          style={{ width: `${percent(count, stats.total)}%` }}
                        />
                      </span>
                      <span className="font-mono text-xs text-muted text-right tabular-nums">{count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Incomplete data */}
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-sm font-semibold">Perlu dilengkapi</h2>
              {!loading && stats.incomplete.length > 0 && (
                <span className="font-mono text-xs text-muted">{stats.incomplete.length}</span>
              )}
            </div>
            {loading ? (
              <div className="h-16 rounded-md bg-surface-muted animate-pulse" />
            ) : stats.incomplete.length === 0 ? (
              <p className="text-sm text-muted flex items-center gap-2">
                <FiCheck className="text-success" /> Semua project sudah lengkap.
              </p>
            ) : (
              <ul className="rounded-lg border border-line bg-surface divide-y divide-line">
                {stats.incomplete.slice(0, 5).map(({ project, missing }) => (
                  <li key={project.id}>
                    <Link href={`/project/${project.id}`} className="block px-3 py-2.5 hover:bg-surface-muted/60">
                      <p className="text-sm truncate">{project.title}</p>
                      <p className="text-xs text-accent mt-0.5">Tanpa {missing.join(", ")}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
