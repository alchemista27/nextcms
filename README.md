# 🚀 NextCMS

**NextCMS** adalah Content Management System (CMS) modern yang dibangun menggunakan framework **Next.js 14 (App Router)**. Proyek ini mengimplementasikan fungsionalitas pengelolaan konten yang lengkap, seperti pengelolaan halaman (Pages), pos (Posts), kategori, tag, media, menu, revisi, hingga multi-user dengan hak akses dinamis (RBAC), yang semuanya dibalut dalam tema desain yang premium menggunakan **shadcn/UI** dan **Tailwind CSS** dengan warna hijau khas yang elegan (#00704A dan #1E3932).

---

## 🛠️ Tech Stack & Fitur Utama

- **Core Framework**: Next.js 14+ (App Router), React 18+, TypeScript.
- **Styling & UI**: Tailwind CSS, shadcn/UI, Material UI Icons (`@mui/icons-material`).
- **Database & ORM**: PostgreSQL dengan Prisma ORM.
- **Autentikasi**: NextAuth.js (Session-based via JWT).
- **Editor**: Rich Text Editor berbasis Tiptap (headless, extensible).
- **Media Upload**: Local storage (`public/uploads`) dengan generator thumbnail (Sharp).
- **Validasi**: Schema validation menggunakan Zod.

### Fitur Lengkap
1. **Dashboard Statistik**: Panel metrik utama situs, ringkasan aktivitas, draf cepat, dan chart statistik pos per bulan (Recharts).
2. **Kelola Post & Page**: CRUD artikel dan halaman statis dengan auto-save draf, custom permalink/slug, dan pengaturan template.
3. **Rich Text Editor**: Editor WYSIWYG lengkap dengan format text, tabel, penyisipan media, blockquote, code block, dan Youtube embed.
4. **Kelola Taksonomi**: Pengelompokan konten lewat Kategori hierarkis (parent-child) dan Tag.
5. **Media Library**: Manajemen unggahan file (images, video, document) dengan drag & drop upload, penyesuaian metadata, dan reusable Media Picker.
6. **Menu Builder**: Penyusunan navigasi dinamis dengan dukungan sub-menu menggunakan interaksi drag & drop (@dnd-kit).
7. **User & RBAC**: Manajemen pengguna dengan role: Admin, Editor, Author, dan Subscriber.
8. **Pengaturan Tampilan (Appearance)**: Kustomisasi logo, favicon, warna utama, jenis font, custom CSS, dan script header/footer.
9. **Pengaturan Umum & Permalink**: Konfigurasi identitas situs, zona waktu, format tanggal/waktu, serta penyesuaian struktur URL (permalink).
10. **History Revision**: Pelacakan riwayat perubahan artikel, perbandingan versi (diff viewer), dan kemampuan memulihkan revisi lama (maksimal 25 revisi).
11. **Optimasi SEO**: Pengaturan meta title template, meta description global/per konten, custom OG:image, auto-generate `sitemap.xml`, dan robots.txt.

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- **Node.js** versi terbaru (v18 ke atas disarankan).
- **PostgreSQL** sudah berjalan di sistem lokal Anda.
  - Port default: `5432`
  - Username: `postgres`
  - Password: `181818`

### Langkah-langkah Setup Proyek

1. **Clone Proyek** (jika dari repositori Git).
2. **Pasang Dependensi**:
   ```bash
   npm install
   ```
3. **Konfigurasi Environment**:
   Salin file `.env.example` menjadi `.env` dan pastikan konfigurasi database serta rahasia autentikasi sudah sesuai.
   ```bash
   cp .env.example .env
   ```
4. **Jalankan Migrasi Database**:
   Lakukan inisialisasi tabel PostgreSQL melalui Prisma.
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Generate Prisma Client**:
   ```bash
   npx prisma generate
   ```
6. **Seed Data Awal**:
   Gunakan script seeder untuk membuat akun Administrator bawaan dan konfigurasi dasar.
   ```bash
   npx prisma db seed
   ```
   *Akun Admin bawaan:*
   - **Email**: `admin@nextcms.local`
   - **Password**: `admin123`

7. **Jalankan Server Development**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda untuk melihat halaman utama, atau akses dashboard admin di [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📂 Dokumentasi & Desain Teknis

Untuk memahami detail arsitektur, basis data, dan wireframe tampilan aplikasi ini, Anda dapat merujuk ke dokumen-dokumen berikut di dalam direktori `docs/`:

*   📄 **[Product Requirements Document (PRD)](./docs/PRD.md)** — Spesifikasi fungsional dan kebutuhan bisnis NextCMS.
*   📄 **[Tech Design Document (TDD)](./docs/TDD.md)** — Detail arsitektur folder, rute API, server actions, dan estimasi pengerjaan.
*   📄 **[Database Schema (db-scheme.md)](./docs/db-scheme.md)** — Desain relasional tabel (ERD) dan skema database lengkap.
*   📂 **[UI Wireframe](./docs/ui-wireframe/)** — Kumpulan file HTML statis yang mendemonstrasikan rancangan antarmuka CMS.
*   📄 **[Sprint Development Plan](./docs/sprint-plan.md)** — Panduan pengerjaan modular per sprint.
