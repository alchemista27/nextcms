# Alfida CMS

Sebuah Content Management System (CMS) khusus yang dikembangkan untuk lingkungan Yayasan Alfida Bengkulu. Proyek ini ditujukan untuk mengelola profil yayasan dan unit pendidikan yang ada di lingkungan Yayasan Alfida, dengan integrasi otentikasi tersentralisasi (SIM).

---

## 📚 Dokumentasi

Dokumentasi lengkap proyek dapat ditemukan di direktori `docs/`:

1. **[Product Requirements Document (PRD)](./docs/PRD.md)**: Spesifikasi kebutuhan fungsional dan non-fungsional.
2. **[Technical Design Document (TDD)](./docs/TDD.md)**: Arsitektur sistem, struktur routing, integrasi eksternal, dan standar penulisan kode.
3. **[Database Schema](./docs/db-schema.md)**: Dokumentasi lengkap skema database Prisma (Multi-schema: `cms` & `shared`), relasi, dan enumerasi.
4. **[Sprint Plan](./docs/sprint-plan.md)**: Timeline pengembangan dan pembagian tugas per sprint.
5. **[Development Log](./docs/log.md)**: Catatan histori pengembangan.

### 🎨 UI Mockups
- **[Admin Wireframes](./docs/ui-wireframe/index.html)**
- **[Public Frontend (School Profile)](./docs/ui/school-profile/index.html)**

*(Buka file `index.html` di browser untuk melihat preview desain)*

---

## 🛠️ Stack Teknologi

- **Framework**: Next.js 15 (React · App Router)
- **Styling**: Tailwind CSS v4 (CSS-based theme, referensi: `DESIGN.md`)
- **Database & Auth**: Supabase (PostgreSQL & Supabase Auth SSR)
- **ORM**: Prisma 6.x (Fitur Multi-Schema)
- **Storage**: Cloudinary (Image & PDF storage)
- **Editor**: TipTap (Rich Text Editor)
- **Validation**: Zod
- **Icons**: Material UI Icons (Google)

---

## ⚙️ Persyaratan Sistem

- Node.js >= 18.17.0
- pnpm >= 8.x
- Akun Supabase (Database & Auth)
- Akun Cloudinary (Media Storage)

---

## 🚀 Panduan Setup (Local Development)

### 1. Instalasi Dependensi
Gunakan `pnpm` untuk menginstal dependensi:
```bash
pnpm install
```

### 2. Konfigurasi Environment
Salin file template `.env` dan sesuaikan nilainya:
```bash
cp .env.example .env.local
```
*(Isi kredensial Supabase dan Cloudinary pada `.env.local`)*

### 3. Setup Database (Prisma)
Proyek ini menggunakan fitur multi-schema Prisma. Jalankan migrasi:
```bash
pnpm prisma generate
pnpm prisma db push
```

### 4. Menjalankan Development Server
```bash
pnpm dev
```
Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

---

## 📁 Struktur Direktori Utama

```
├── src/
│   ├── app/           # Next.js App Router (Public & Admin Routes)
│   ├── components/    # Reusable React Components (Admin & Public)
│   ├── lib/           # Konfigurasi Prisma, Supabase, Cloudinary
│   ├── middleware.ts  # Supabase Auth Middleware
│   └── validators/    # Zod Schemas untuk form validation
├── docs/              # Dokumentasi proyek & referensi UI
├── prisma/            # Skema database Prisma
├── sistem-data/       # Info kredensial (gitignored)
```

---

## 🧑‍💻 Konvensi Pengembangan

Panduan ini wajib diikuti oleh seluruh agen AI dan *developer*:

- **TypeScript Strict**: Gunakan TypeScript untuk semua file baru. Hindari `any`.
- **Formatting**: *Auto-format* menggunakan Prettier, linting menggunakan ESLint.
- **Styling**: Gunakan Tailwind CSS. Ekstrak ke komponen jika pola berulang > 3 kali.
- **Commits**: Gunakan format *Conventional Commits* (`feat:`, `fix:`, `chore:`, dll).
- **Security**: 
  - Tidak boleh commit kunci API atau secret ke dalam *repository*.
  - Semua API routes dan Server Actions wajib memvalidasi autentikasi & peran (role) di *server-side*.
  - Gunakan Zod untuk memvalidasi *request payload*.

Selengkapnya baca di **[AGENTS.md](./AGENTS.md)**.

---

*Dikembangkan untuk Yayasan Alfida Bengkulu.*
