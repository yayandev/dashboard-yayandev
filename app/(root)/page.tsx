"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  FiAlertCircle,
  FiArrowRight,
  FiCode,
  FiFolder,
  FiGithub,
  FiGlobe,
  FiLayers,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";
import { useProjects } from "@/hooks/useProjects";
import { formatDate } from "@/lib/projects";
import PageHeader from "@/components/ui/PageHeader";
import ProjectImage from "@/components/ui/ProjectImage";
import TechBadge from "@/components/ui/TechBadge";
import EmptyState from "@/components/ui/EmptyState";

function greeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 19) return "Selamat sore";
  return "Selamat malam";
}

export default function DashboardPage() {
  const { projects, loading, error, refetch } = useProjects();

  const stats = useMemo(() => {
    const techCount = new Map<string, number>();
    projects.forEach((p) =>
      p.tech_stack.forEach((t) => techCount.set(t, (techCount.get(t) ?? 0) + 1))
    );
    const topTech = [...techCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    const recent = [...projects]
      .sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      .slice(0, 5);

    return {
      total: projects.length,
      techs: techCount.size,
      withDemo: projects.filter((p) => p.demo_url).length,
      withRepo: projects.filter((p) => p.github_url).length,
      topTech,
      recent,
    };
  }, [projects]);

  const cards = [
    { label: "Total Project", value: stats.total, icon: FiFolder, tone: "from-indigo-500 to-violet-500" },
    { label: "Teknologi", value: stats.techs, icon: FiLayers, tone: "from-sky-500 to-cyan-500" },
    { label: "Live Demo", value: stats.withDemo, icon: FiGlobe, tone: "from-emerald-500 to-teal-500" },
    { label: "Repo GitHub", value: stats.withRepo, icon: FiGithub, tone: "from-amber-500 to-orange-500" },
  ];

  return (
    <>
      <PageHeader
        title={`${greeting()} 👋`}
        description="Ringkasan portfolio dan aktivitas project terbaru kamu."
        actions={
          <button
            onClick={refetch}
            disabled={loading}
            className="h-10 px-3.5 rounded-xl border border-line bg-surface text-sm font-medium flex items-center gap-2 hover:bg-surface-muted transition disabled:opacity-60"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Muat ulang</span>
          </button>
        }
      />

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-soft text-danger p-4 text-sm animate-fade-in">
          <FiAlertCircle className="text-lg shrink-0 mt-0.5" />
          <div className="flex-1">{error}</div>
          <button onClick={refetch} className="font-semibold underline underline-offset-2">
            Coba lagi
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4 mb-6">
        {cards.map(({ label, value, icon: Icon, tone }, i) => (
          <div
            key={label}
            style={{ animationDelay: `${i * 60}ms` }}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface p-4 md:p-5 animate-fade-in"
          >
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${tone} opacity-10`}
            />
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tone} text-white flex items-center justify-center shadow-md mb-3`}
            >
              <Icon className="text-lg" />
            </div>
            <p className="text-xs md:text-sm text-muted">{label}</p>
            {loading ? (
              <div className="h-8 w-14 mt-1 rounded-md bg-surface-muted animate-pulse" />
            ) : (
              <p className="text-2xl md:text-3xl font-semibold tracking-tight mt-0.5">{value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recent projects */}
        <section className="lg:col-span-2 rounded-2xl border border-line bg-surface animate-fade-in">
          <div className="flex items-center justify-between px-5 py-4 border-b border-line">
            <div>
              <h2 className="font-semibold">Project Terbaru</h2>
              <p className="text-xs text-muted mt-0.5">5 project terakhir yang ditambahkan</p>
            </div>
            <Link
              href="/project"
              className="text-sm font-medium text-primary flex items-center gap-1 hover:gap-2 transition-all"
            >
              Lihat semua <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <ul className="divide-y divide-line">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-16 h-11 rounded-lg bg-surface-muted animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-1/3 rounded bg-surface-muted animate-pulse" />
                    <div className="h-3 w-2/3 rounded bg-surface-muted animate-pulse" />
                  </div>
                </li>
              ))}
            </ul>
          ) : stats.recent.length === 0 ? (
            <EmptyState
              icon={<FiFolder />}
              title="Belum ada project"
              description="Mulai tambahkan project pertama ke portfolio kamu."
              action={
                <Link
                  href="/create-project"
                  className="h-10 px-4 rounded-xl bg-primary text-white dark:text-slate-950 text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary-hover transition"
                >
                  <FiPlus /> Tambah Project
                </Link>
              }
            />
          ) : (
            <ul className="divide-y divide-line">
              {stats.recent.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/project/${p.id}`}
                    className="group flex items-center gap-4 px-5 py-3.5 hover:bg-surface-muted/60 transition-colors"
                  >
                    <ProjectImage
                      src={p.image_url}
                      alt={p.title}
                      className="w-16 h-11 rounded-lg border border-line shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {p.title}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                        {p.tech_stack.slice(0, 3).map((t) => (
                          <TechBadge key={t} name={t} />
                        ))}
                        {p.tech_stack.length > 3 && (
                          <span className="text-[11px] text-muted">+{p.tech_stack.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <span className="hidden sm:block text-xs text-muted shrink-0">
                      {formatDate(p.created_at)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="space-y-4 md:space-y-6">
          {/* Top tech */}
          <section className="rounded-2xl border border-line bg-surface p-5 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <FiCode className="text-primary" />
              <h2 className="font-semibold">Teknologi Terpopuler</h2>
            </div>
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-6 rounded bg-surface-muted animate-pulse" />
                ))}
              </div>
            ) : stats.topTech.length === 0 ? (
              <p className="text-sm text-muted">Belum ada data teknologi.</p>
            ) : (
              <ul className="space-y-3.5">
                {stats.topTech.map(([name, count]) => (
                  <li key={name}>
                    <Link href={`/project?tech=${encodeURIComponent(name)}`} className="block group">
                      <div className="flex items-center justify-between text-sm mb-1.5">
                        <span className="font-medium group-hover:text-primary transition-colors">{name}</span>
                        <span className="text-muted tabular-nums">
                          {count} project
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-[width] duration-700"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Quick action */}
          <section className="relative overflow-hidden rounded-2xl p-5 text-white bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 animate-fade-in">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute right-10 -top-8 w-20 h-20 rounded-full bg-white/10" />
            <h2 className="font-semibold text-lg relative">Punya karya baru?</h2>
            <p className="text-sm text-white/80 mt-1 relative">
              Tampilkan project terbaru kamu ke portfolio dalam hitungan detik.
            </p>
            <div className="flex flex-wrap gap-2 mt-4 relative">
              <Link
                href="/create-project"
                className="h-9 px-3.5 rounded-lg bg-white text-indigo-700 text-sm font-semibold inline-flex items-center gap-2 hover:bg-white/90 transition"
              >
                <FiPlus /> Tambah Project
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
