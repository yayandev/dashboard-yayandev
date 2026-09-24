"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import {
  FiAlertCircle,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiMoon,
  FiSun,
  FiTerminal,
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
    <main className="min-h-dvh flex flex-col">
      <header className="h-14 px-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-primary text-background flex items-center justify-center">
            <FiTerminal className="text-sm" />
          </div>
          <span className="text-sm font-semibold">YayanDev</span>
          <span className="font-mono text-[10px] text-muted">console</span>
        </div>
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-md flex items-center justify-center text-muted hover:bg-surface-muted hover:text-foreground transition"
          aria-label="Ganti tema"
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
      </header>

      <section className="flex-1 flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">Masuk</h1>
            <p className="text-sm text-muted mt-1.5">Kelola project yang tampil di portfolio YayanDev.</p>
          </div>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-md border border-danger/30 bg-danger-soft text-danger px-3 py-2.5 mb-5 text-sm"
            >
              <FiAlertCircle className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="developer@yayandev.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full h-10 pl-9 pr-3 rounded-md border border-line bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-muted/70"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-10 pl-9 pr-11 rounded-md border border-line bg-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition placeholder:text-muted/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded flex items-center justify-center text-muted hover:text-foreground"
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
                className="w-4 h-4 rounded accent-zinc-900"
              />
              Ingat saya selama 7 hari
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group w-full h-10 rounded-md bg-primary text-background text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary-hover transition disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Spinner className="w-4 h-4" /> Memproses...
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

      <footer className="h-14 px-5 flex items-center justify-between font-mono text-[11px] text-muted">
        <span>© {new Date().getFullYear()} YayanDev</span>
      </footer>
    </main>
  );
}
