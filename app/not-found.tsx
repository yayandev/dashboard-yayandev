import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { button } from "@/lib/ui";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center text-center p-6">
      <p className="font-mono text-sm text-subtle">404</p>
      <h1 className="text-xl font-semibold tracking-tight mt-2">Halaman tidak ditemukan</h1>
      <p className="text-sm text-muted mt-1.5 max-w-xs">Alamatnya mungkin salah ketik, atau halamannya sudah dipindah.</p>
      <Link href="/" className={button("secondary", "sm", "mt-6")}>
        <FiArrowLeft /> Kembali ke ringkasan
      </Link>
    </main>
  );
}
