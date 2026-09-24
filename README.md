# YayanDev Engineering Console

Dashboard admin (Next.js 16 + Tailwind CSS v4) untuk mengelola project portfolio YayanDev.

## Fitur

- Login dengan token (cookie) + proteksi semua halaman dashboard lewat `proxy.js`
- Dashboard: statistik project, project terbaru, dan teknologi terpopuler
- Daftar project: pencarian, filter tech stack, sorting, tampilan grid / tabel
- Tambah & edit project: validasi form, input tech stack berbentuk chip (dengan autocomplete dari project lain), upload gambar drag & drop, peringatan perubahan belum disimpan
- Ringkasan menampilkan project yang datanya belum lengkap (gambar, demo, repo, tech stack)
- Hapus project dengan dialog konfirmasi
- Tema terang / gelap / ikuti sistem, layout responsif (mobile, tablet, desktop)

## Shortcut

| Tombol | Aksi |
| --- | --- |
| `/` | Fokus ke pencarian |
| `Esc` | Hapus / keluar dari pencarian, tutup dialog |
| `Ctrl` / `⌘` + `Enter` | Simpan form project |

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Opsional: atur `NEXT_PUBLIC_API_URL` untuk mengganti base URL API
(default `https://api-yayandev.vercel.app/api`).
