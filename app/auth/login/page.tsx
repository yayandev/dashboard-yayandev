"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { FiAlertCircle, FiEye, FiEyeOff, FiMoon, FiSun } from "react-icons/fi";
import api, { getErrorMessage, TOKEN_COOKIE } from "@/lib/api";
import { button, input } from "@/lib/ui";
import BrandMark from "@/components/ui/BrandMark";
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
      <header className="h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BrandMark />
          <span className="text-sm font-semibold">YayanDev</span>
          <span className="font-mono text-[11px] text-subtle">console</span>
        </div>
        <button
          onClick={toggleTheme}
          className={button("ghost", "icon")}
          aria-label={theme === "dark" ? "Mode terang" : "Mode gelap"}
          title={theme === "dark" ? "Mode terang" : "Mode gelap"}
        >
          {theme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
      </header>

      <section className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[360px]">
          <h1 className="text-xl font-semibold tracking-tight">Masuk</h1>
          <p className="text-sm text-muted mt-1">Kelola project yang tampil di portfolio.</p>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-md border border-danger/30 bg-danger-soft text-danger px-3 py-2.5 mt-6 text-[13px]"
            >
              <FiAlertCircle className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form className="space-y-4 mt-6" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-[13px] font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="kamu@yayandev.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className={input()}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-[13px] font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={input(false, "pr-10")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded flex items-center justify-center text-subtle hover:text-foreground"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-[13px] text-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded-sm accent-[var(--foreground)]"
              />
              Tetap masuk selama 7 hari
            </label>

            <button type="submit" disabled={loading} className={button("primary", "md", "w-full")}>
              {loading && <Spinner className="w-3.5 h-3.5" />}
              {loading ? "Memeriksa…" : "Masuk"}
            </button>
          </form>
        </div>
      </section>

      <footer className="h-12 px-4 md:px-6 flex items-center font-mono text-[11px] text-subtle">
        © {new Date().getFullYear()} YayanDev
      </footer>
    </main>
  );
}
