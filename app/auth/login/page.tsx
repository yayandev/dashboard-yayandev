"use client";

import { useState } from "react";
import Link from "next/link";

import {
  FiTerminal,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // simpan token
      Cookies.set("token", res.data.token, {
        expires: 7,
      });

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Login gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#1a1c1c] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-white border border-[#cfc4c5] rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.02),_0_12px_24px_rgba(0,0,0,0.04)] p-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-[#f3f3f3] border border-[#cfc4c5] rounded flex items-center justify-center mb-3">
            <FiTerminal className="text-2xl text-black" />
          </div>

          <h1 className="text-3xl font-semibold">YayanDev</h1>
          <p className="text-gray-500 mt-1">Engineering Console</p>
        </div>

        {error && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-6 text-sm">
            {error}
          </p>
        )}

        <hr className="border-[#cfc4c5] opacity-50 mb-6" />

        {/* Form */}
        <form className="flex flex-col gap-6" onSubmit={handleLogin}>
          {/* Email */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs uppercase tracking-wider font-semibold text-gray-500"
            >
              Email Address
            </label>

            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                id="email"
                type="email"
                placeholder="developer@yayandev.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-4 rounded border border-[#cfc4c5] bg-[#f9f9f9] focus:outline-none focus:ring-2 focus:ring-black transition"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-xs uppercase tracking-wider font-semibold text-gray-500"
              >
                Password
              </label>

              <button
                type="button"
                className="text-xs font-semibold hover:text-black transition"
              >
                Lupa Password?
              </button>
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-11 pl-10 pr-12 rounded border border-[#cfc4c5] bg-[#f9f9f9] focus:outline-none focus:ring-2 focus:ring-black transition"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition"
              >
                {showPassword ? (
                  <FiEye className="text-lg" />
                ) : (
                  <FiEyeOff className="text-lg" />
                )}
              </button>
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="h-11 bg-black hover:bg-neutral-800 text-white rounded font-semibold flex items-center justify-center gap-2 transition group"
          >
            {loading ? (
              <>
                Loading...
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  ></path>
                </svg>
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

      {/* Footer */}
      <footer className="relative z-10 mt-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition group"
        >
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Landing Page
        </Link>
      </footer>

      {/* Background Style */}
      <style jsx>{`
        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        }
      `}</style>
    </main>
  );
}
