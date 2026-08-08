# 📋 Product Requirements Document (PRD)

## **SIM Alfida — Content Management System**

> CMS modern berbasis Next.js dengan fungsionalitas manajemen konten khusus untuk portal dan profil Yayasan Pendidikan Alfida. Dilengkapi manajemen Post, Galeri, Tim Pengajar, Testimoni, media via Cloudinary, dan dashboard admin profesional.

---

## 1. Ringkasan Produk

| Item | Detail |
| --- | --- |
| **Nama Produk** | SIM Alfida |
| **Tipe** | Content Management System (CMS) |
| **Framework** | Next.js 14 (App Router) |
| **Database** | PostgreSQL (di-hosting di Supabase) |
| **Storage Media** | Cloudinary |
| **UI Library** | shadcn/UI |
| **Design System** | Sistem Desain Khusus Yayasan Alfida (`docs/DESIGN.md`) |
| **Auth** | NextAuth.js (session-based) |
| **Editor** | Rich Text Editor (Tiptap) |
| **Target** | Admin Yayasan Alfida |

---

## 2. Tech Stack

| Layer | Teknologi |
| --- | --- |
| **Frontend** | Next.js 14+ (App Router), React 18+, TypeScript |
| **UI Components** | shadcn/UI |
| **Design Guideline** | Alfida Design System (`docs/DESIGN.md`) |
| **Styling** | Tailwind CSS |
| **Rich Text Editor** | Tiptap (headless, extensible) |
| **Backend/API** | Next.js Server Actions |
| **Database** | Supabase (PostgreSQL) |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js (session-based) |
| **File Upload** | Cloudinary |
| **Validasi** | Zod |
| **Icon Library** | Material UI Icons (`@mui/icons-material`) |

---

## 3. Arsitektur Sistem

Sistem ini didesain sebagai CMS statis/terstruktur untuk frontend, di mana halaman-halaman (Home, About, Contact, dll) dibuat secara statis/hardcoded di Next.js dengan data dinamis yang ditarik dari backend. Tidak ada fitur *page builder* dinamis.

Fitur CMS meliputi:
- **Artikel/Berita (Posts)**: Untuk blog dan pengumuman.
- **Kategori & Tag**: Untuk klasifikasi artikel.
- **Media Library**: Terintegrasi langsung dengan Cloudinary.
- **Guru/Staff (Team)**: Untuk menampilkan daftar profil tim pengajar.
- **Galeri**: Untuk manajemen foto-foto kegiatan.
- **Testimoni**: Manajemen ulasan dari alumni/wali murid.
- **Manajemen Menu**: Pengaturan menu navigasi frontend (Header & Footer).
- **Pengaturan Situs**: Identitas situs (Nama Yayasan, Logo, Kontak).

---

## 4. Struktur Halaman Frontend (Public)

Halaman frontend berpatokan sepenuhnya pada referensi desain `docs/ui/school-profile`:
- `/` (Home)
- `/about` (About Us)
- `/contact` (Contact)
- `/gallery` (Gallery)
- `/team` (Team / Teachers)
- `/team/[slug]` (Team Detail)
- `/testimony` (Testimonials)
- `/blog` (Archive)
- `/[slug]` (Single Post / Berita)

---

## 5. Kebutuhan UI Admin (Dashboard)

1. **Dashboard Overview**: Menampilkan statistik (jumlah postingan, guru, foto galeri).
2. **Posts**: CRUD berita/pengumuman.
3. **Categories & Tags**: Klasifikasi.
4. **Media**: Manajemen gambar dari Cloudinary.
5. **Team**: CRUD profil guru/staff (Nama, Jabatan, Bio, Foto).
6. **Gallery**: CRUD album/foto kegiatan.
7. **Testimonial**: CRUD testimoni.
8. **Menus**: Pengaturan menu navigasi frontend.
9. **Settings**: Pengaturan identitas dan kontak yayasan.

*Catatan: Semua UI di admin menggunakan sistem desain baru (Primary `#454545`, Secondary `#06bfa2`, Tertiary `#0f7f6d`) tanpa emoji.*
