import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center text-center p-6">
      <p className="font-mono text-sm text-muted">
        error 404
      </p>
      <h1 className="text-2xl font-semibold tracking-tight mt-2">Halaman tidak ditemukan</h1>
      <p className="text-muted mt-2 max-w-sm">Halaman yang kamu cari tidak ada atau sudah dipindahkan.</p>
      <Link
        href="/"
        className="mt-6 h-10 px-4 rounded-md bg-primary text-background text-sm font-semibold inline-flex items-center gap-2 hover:bg-primary-hover transition"
      >
        <FiArrowLeft /> Kembali ke Dashboard
      </Link>
    </main>
  );
}
