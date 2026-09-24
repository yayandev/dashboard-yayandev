import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center text-center p-6 bg-grid">
      <p className="text-7xl font-bold tracking-tight bg-gradient-to-br from-indigo-500 to-fuchsia-500 bg-clip-text text-transparent">
        404
      </p>
      <h1 className="text-xl font-semibold mt-4">Halaman tidak ditemukan</h1>
      <p className="text-muted mt-2 max-w-sm">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link
        href="/"
        className="mt-6 h-10 px-4 rounded-xl bg-primary text-white dark:text-slate-950 text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary-hover transition"
      >
        <FiArrowLeft /> Kembali ke Dashboard
      </Link>
    </main>
  );
}
