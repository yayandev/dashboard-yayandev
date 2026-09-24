"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { FiAlertCircle, FiArrowRight, FiCheck, FiFolder, FiPlus, FiRefreshCw } from "react-icons/fi";
import { useProjects } from "@/hooks/useProjects";
import { formatDate, missingFields, timeAgo } from "@/lib/projects";
import { button, panel } from "@/lib/ui";
import PageHeader from "@/components/ui/PageHeader";
import ProjectImage from "@/components/ui/ProjectImage";
import EmptyState from "@/components/ui/EmptyState";

const noop = () => () => {};

// Rendered on the client only, so server and browser never disagree on "today".
function useToday() {
  return useSyncExternalStore(
    noop,
    () => new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    () => null
  );
}

function pct(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

export default function DashboardPage() {
  const { projects, loading, error, refetch } = useProjects();
  const today = useToday();

  const stats = useMemo(() => {
    const techCount = new Map<string, number>();
    projects.forEach((p) => p.tech_stack.forEach((t) => techCount.set(t, (techCount.get(t) ?? 0) + 1)));
    const topTech = [...techCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
    const recent = [...projects]
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, 6);
    const incomplete = projects
      .map((p) => ({ project: p, missing: missingFields(p) }))
      .filter((x) => x.missing.length > 0)
      .sort((a, b) => b.missing.length - a.missing.length);
    const tagTotal = projects.reduce((n, p) => n + p.tech_stack.length, 0);

    return {
      total: projects.length,
      techs: techCount.size,
      avgTech: projects.length ? (tagTotal / projects.length).toFixed(1) : "0",
      withDemo: projects.filter((p) => p.demo_url).length,
      withRepo: projects.filter((p) => p.github_url).length,
      topTech,
      maxTech: topTech[0]?.[1] ?? 1,
      recent,
      incomplete,
    };
  }, [projects]);

  const cells = [
    {
      label: "Project",
      value: stats.total,
      sub: stats.recent[0] ? `terakhir ${timeAgo(stats.recent[0].created_at)}` : "belum ada",
    },
    { label: "Teknologi", value: stats.techs, sub: `± ${stats.avgTech} per project` },
    {
      label: "Live demo",
      value: stats.withDemo,
      sub: `${pct(stats.withDemo, stats.total)}% dari project`,
      ratio: pct(stats.withDemo, stats.total),
    },
    {
      label: "Repo GitHub",
      value: stats.withRepo,
      sub: `${pct(stats.withRepo, stats.total)}% dari project`,
      ratio: pct(stats.withRepo, stats.total),
    },
  ];

  return (
    <>
      <PageHeader
        title="Ringkasan"
        description={today ?? " "}
        actions={
          <button onClick={refetch} disabled={loading} className={button("secondary", "sm")}>
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Muat ulang
          </button>
        }
      />

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-lg border border-danger/30 bg-danger-soft px-4 py-3 text-sm text-danger"
        >
          <FiAlertCircle className="shrink-0" />
          <p className="flex-1">{error}</p>
          <button onClick={refetch} className="font-medium underline underline-offset-2">
            Coba lagi
          </button>
        </div>
      )}

      {/* Stats */}
      <section
        aria-label="Statistik"
        className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line rounded-lg overflow-hidden mb-6"
      >
        {cells.map((c) => (
          <div key={c.label} className="bg-surface p-4">
            <p className="text-[13px] text-muted">{c.label}</p>
            {loading ? (
              <>
                <div className="h-7 w-10 mt-1.5 rounded bg-surface-muted animate-pulse" />
                <div className="h-3 w-24 mt-2 rounded bg-surface-muted animate-pulse" />
              </>
            ) : (
              <>
                <p className="font-mono text-2xl font-medium tabular-nums mt-1">{c.value}</p>
                <p className="text-xs text-subtle mt-1">{c.sub}</p>
                {c.ratio !== undefined && (
                  <div className="h-0.5 mt-3 bg-surface-muted rounded-full overflow-hidden">
                    <div className="h-full bg-foreground/70 rounded-full" style={{ width: `${c.ratio}%` }} />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent projects */}
        <section className={`${panel} lg:col-span-2 self-start`}>
          <header className="flex items-center justify-between h-11 px-4 border-b border-line">
            <h2 className="text-sm font-medium">Terbaru ditambahkan</h2>
            <Link
              href="/project"
              className="text-[13px] text-muted hover:text-foreground flex items-center gap-1 transition-colors"
            >
              Semua project <FiArrowRight />
            </Link>
          </header>

          {loading ? (
            <ul className="divide-y divide-line">
              {Array.from({ length: 5 }).map((_, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-12 h-8 rounded bg-surface-muted animate-pulse" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3.5 w-1/3 rounded bg-surface-muted animate-pulse" />
                    <div className="h-3 w-1/2 rounded bg-surface-muted animate-pulse" />
                  </div>
                </li>
              ))}
            </ul>
          ) : stats.recent.length === 0 ? (
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
          ) : (
            <ul className="divide-y divide-line">
              {stats.recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/project/${p.id}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-muted/60 transition-colors"
                  >
                    <ProjectImage
                      src={p.image_url}
                      alt=""
                      className="w-12 h-8 rounded border border-line shrink-0 text-xs"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{p.title}</p>
                      <p className="font-mono text-[11px] text-subtle truncate mt-0.5">
                        {p.tech_stack.length ? p.tech_stack.join(" · ") : "tanpa tech stack"}
                      </p>
                    </div>
                    <time
                      dateTime={p.created_at ?? undefined}
                      title={formatDate(p.created_at, "long")}
                      className="hidden sm:block font-mono text-[11px] text-subtle shrink-0"
                    >
                      {timeAgo(p.created_at)}
                    </time>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-6">
          {/* Tech usage */}
          <section className={panel}>
            <header className="flex items-center justify-between h-11 px-4 border-b border-line">
              <h2 className="text-sm font-medium">Tech stack</h2>
              {!loading && stats.techs > 0 && (
                <span className="font-mono text-[11px] text-subtle">{stats.techs} total</span>
              )}
            </header>
            <div className="p-4">
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-5 rounded bg-surface-muted animate-pulse" />
                  ))}
                </div>
              ) : stats.topTech.length === 0 ? (
                <p className="text-sm text-muted">Belum ada data.</p>
              ) : (
                <ul className="space-y-2.5">
                  {stats.topTech.map(([name, count]) => (
                    <li key={name}>
                      <Link href={`/project?tech=${encodeURIComponent(name)}`} className="group block">
                        <div className="flex items-baseline justify-between text-[13px]">
                          <span className="group-hover:text-accent transition-colors truncate">{name}</span>
                          <span className="font-mono text-[11px] text-subtle tabular-nums">
                            {count}/{stats.total}
                          </span>
                        </div>
                        <div className="h-1 mt-1.5 bg-surface-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent/80"
                            style={{ width: `${(count / stats.maxTech) * 100}%` }}
                          />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Completeness */}
          <section className={panel}>
            <header className="flex items-center justify-between h-11 px-4 border-b border-line">
              <h2 className="text-sm font-medium">Perlu dilengkapi</h2>
              {!loading && stats.incomplete.length > 0 && (
                <span className="font-mono text-[11px] text-subtle">{stats.incomplete.length} project</span>
              )}
            </header>
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-8 rounded bg-surface-muted animate-pulse" />
                ))}
              </div>
            ) : stats.incomplete.length === 0 ? (
              <p className="flex items-center gap-2 p-4 text-sm text-muted">
                <FiCheck className="text-success" />
                {stats.total ? "Semua project sudah lengkap." : "Belum ada project."}
              </p>
            ) : (
              <ul className="divide-y divide-line">
                {stats.incomplete.slice(0, 5).map(({ project: p, missing }) => (
                  <li key={p.id}>
                    <Link
                      href={`/project/${p.id}`}
                      className="block px-4 py-2.5 hover:bg-surface-muted/60 transition-colors"
                    >
                      <p className="text-[13px] font-medium truncate">{p.title}</p>
                      <p className="text-xs text-subtle mt-0.5">
                        Belum ada <span className="text-muted">{missing.join(", ")}</span>
                      </p>
                    </Link>
                  </li>
                ))}
                {stats.incomplete.length > 5 && (
                  <li className="px-4 py-2.5 text-xs text-subtle">+{stats.incomplete.length - 5} lainnya</li>
                )}
              </ul>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
