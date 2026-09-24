import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export const TOKEN_COOKIE = "token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api-yayandev.vercel.app/api",
});

api.interceptors.request.use((config) => {
  const token = Cookies.get(TOKEN_COOKIE);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");
    // Session expired or invalid token: log out and go back to login.
    if (error.response?.status === 401 && !isLoginRequest && typeof window !== "undefined") {
      Cookies.remove(TOKEN_COOKIE);
      window.location.href = "/auth/login?expired=1";
    }
    return Promise.reject(error);
  }
);

export function getErrorMessage(err: unknown, fallback = "Terjadi kesalahan. Silakan coba lagi.") {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { error?: string; message?: string } | undefined;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    if (!err.response) return "Tidak dapat terhubung ke server. Periksa koneksi internet kamu.";
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

export function logout() {
  Cookies.remove(TOKEN_COOKIE);
  window.location.href = "/auth/login";
}

export default api;
