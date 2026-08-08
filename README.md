# 🚀 SIM Alfida (Sistem Informasi Manajemen Yayasan Alfida)

**SIM Alfida** adalah Content Management System (CMS) modern yang dibangun secara khusus untuk mengelola portal informasi Yayasan Pendidikan Alfida. Dibangun dengan framework **Next.js 14 (App Router)**, **Supabase**, dan **Cloudinary**, sistem ini menyediakan antarmuka manajemen konten yang cepat, aman, dan dirancang secara khusus untuk memenuhi kebutuhan yayasan.

---

## ✨ Fitur Utama

- **Desain Khusus Alfida**: UI/UX yang diimplementasikan secara spesifik mengikuti panduan desain resmi Yayasan Alfida (`docs/DESIGN.md`), menggunakan skema warna yang elegan (Primary: `#454545`, Secondary: `#06bfa2`, Tertiary: `#0f7f6d`).
- **Manajemen Konten Terstruktur**: Pengelolaan data yang dirancang khusus untuk entitas yayasan, seperti Artikel/Berita (Posts), Galeri Kegiatan, Profil Tim/Guru, dan Testimoni.
- **Media Storage Cloud**: Integrasi mulus dengan **Cloudinary** untuk penyimpanan aset gambar yang cepat, teroptimasi, dan handal.
- **Database Scalable**: Didukung oleh arsitektur **Supabase PostgreSQL** untuk manajemen data dan otentikasi.
- **Role-Based Access Control (RBAC)**: Pembagian peran pengguna (Admin, Editor, Author, dll) yang aman.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router), React, TypeScript
- **Database & Backend**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Storage**: Cloudinary
- **Styling**: Tailwind CSS & shadcn/UI
- **Forms & Validation**: React Hook Form + Zod
- **Rich Text Editor**: TipTap

---

## 🚀 Memulai (Getting Started)

### Prasyarat
- Node.js versi 18.x atau lebih baru
- Akun Supabase (untuk database)
- Akun Cloudinary (untuk storage media)

### 1. Kloning Repositori & Instalasi
```bash
git clone <repository-url> nextcms
cd nextcms
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env` di root direktori berdasarkan `.env.example`, lalu isi dengan kredensial Anda:

```env
# Supabase PostgreSQL connection
DATABASE_URL="postgresql://postgres.[YOUR-SUPABASE-ID]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[YOUR-SUPABASE-ID]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### 3. Setup Database (Supabase)
Jalankan perintah prisma untuk menyingkronkan skema ke database Supabase:
```bash
npx prisma generate
npx prisma db push
```

*(Opsional)* Anda dapat menjalankan seed untuk mengisi data awal:
```bash
npx prisma db seed
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Aplikasi dapat diakses di `http://localhost:3000`. Dasbor admin berada di `http://localhost:3000/admin`.

---

## 📚 Dokumentasi

Dokumentasi detail mengenai arsitektur, fitur, dan skema database terdapat di folder `/docs`:
- [`PRD.md`](./docs/PRD.md) - Product Requirements Document
- [`TDD.md`](./docs/TDD.md) - Technical Design Document (Arsitektur & Supabase/Cloudinary)
- [`DESIGN.md`](./docs/DESIGN.md) - Panduan Sistem Desain Alfida
- [`db-scheme.md`](./docs/db-scheme.md) - Skema struktur database relasional
- [`sprint-plan.md`](./docs/sprint-plan.md) - Rencana dan pelacakan sprint

---
© 2026 Yayasan Pendidikan Alfida & NextCMS Development Team.
