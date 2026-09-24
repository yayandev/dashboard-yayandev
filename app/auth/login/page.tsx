"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiFolder,
  FiLayers,
  FiLock,
  FiMail,
  FiMoon,
  FiSun,
  FiTerminal,
  FiZap,
} from "react-icons/fi";
import api, { getErrorMessage, TOKEN_COOKIE } from "@/lib/api";
import { useTheme } from "@/components/Providers";
import Spinner from "@/components/ui/Spinner";

export default function LoginPage() {
  return (
    <Suspense>
      <LoginView />
    </Suspense>
  );
}

function LoginView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    searchParams.get("expired") ? "Sesi kamu telah berakhir. Silakan login kembali." : ""
  );

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email: email.trim(), password });
      const token = res.data?.token;
      if (!token) throw new Error("Token tidak ditemukan pada respon server.");

      Cookies.set(TOKEN_COOKIE, token, {
        expires: remember ? 7 : undefined,
        sameSite: "lax",
        secure: window.location.protocol === "https:",
      });

      const next = searchParams.get("next");
      router.replace(next && next.startsWith("/") && !next.startsWith("//") ? next : "/");
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, "Login gagal. Periksa email dan password kamu."));
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh grid lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600">
        <div className="absolute inset-0 opacity-20 [background-size:36px_36px] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
        <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center">
            <FiTerminal className="text-xl" />
          </div>
          <span className="font-semibold text-lg">YayanDev</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="text-4xl font-semibold leading-tight tracking-tight">
            Kelola portfolio kamu dari satu tempat.
          </h2>
          <p className="text-white/80 mt-4">
            Tambah, perbarui, dan pantau seluruh project yang tampil di website portfolio YayanDev.
          </p>

          <ul className="mt-10 space-y-4">
            {[
              { icon: FiFolder, text: "Kelola project dengan mudah" },
              { icon: FiLayers, text: "Pantau statistik tech stack" },
              { icon: FiZap, text: "Perubahan langsung tayang" },
            ].map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-white/90">
                <span className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center">
                  <Icon />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-white/60">© {new Date().getFullYear()} YayanDev</p>
      </section>

      {/* Form panel */}
      <section className="relative flex flex-col items-center justify-center p-6 sm:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 lg:hidden [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

        <button
          onClick={toggleTheme}
          className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:bg-surface-muted hover:text-foreground transition"
          aria-label="Ganti tema"
        >
          {theme === "dark" ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
        </button>

        <div className="relative w-full max-w-[400px] animate-fade-in">
          <div className="lg:hidden flex justify-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FiTerminal className="text-2xl" />
            </div>
          </div>

          <div className="text-center lg:text-left mb-8">
            <h1 className="text-3xl font-semibold tracking-tight">Selamat datang 👋</h1>
            <p className="text-muted mt-2">Masuk ke Engineering Console untuk melanjutkan.</p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger-soft text-danger px-4 py-3 mb-6 text-sm animate-fade-in"
            >
              <FiAlertCircle className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="developer@yayandev.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-line bg-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition placeholder:text-muted/70"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 pl-10 pr-12 rounded-xl border border-line bg-surface outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition placeholder:text-muted/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-muted hover:text-foreground"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-600"
              />
              Ingat saya selama 7 hari
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-12 rounded-xl bg-primary text-white dark:text-slate-950 font-semibold flex items-center justify-center gap-2 hover:bg-primary-hover transition shadow-lg shadow-indigo-500/25 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Spinner className="w-5 h-5" /> Memproses...
                </>
              ) : (
                <>
                  Masuk
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
