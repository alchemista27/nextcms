# 🗓️ Sprint Development Plan — SIM Alfida

> Rencana pengembangan untuk pivot ke Sistem Informasi Manajemen Yayasan Alfida, dengan integrasi Supabase dan Cloudinary.

| Dokumen | Detail |
|---|---|
| **Referensi** | PRD.md, TDD.md, db-scheme.md |
| **Versi** | 2.0 (Pivot) |

---

## Ringkasan Modul (Post-Pivot)

| Sprint | Modul | Fokus | Status |
|---|---|---|---|
| **Selesai** | M1 - M5 | Foundation, Auth, Admin Layout, Rich Text, Posts | ✅ SELESAI |
| **Sprint 6** | M6 | Tech Pivot & Database Migration (Supabase, Cloudinary, hapus fitur `pages`) | ✅ SELESAI |
| **Sprint 7** | M7, M8 | Team Management & Gallery Management | ⏳ TODO |
| **Sprint 8** | M9, M10, M11 | Testimonial, Frontend Hardcoded Routes, Polish | ⏳ TODO |

---

## Sprint 6 — Tech Pivot & Migration

> **Goal:** Membersihkan fitur lama yang tidak diperlukan, memperbarui skema, dan menghubungkan Supabase serta Cloudinary.

### M6: Pivot Eksekusi

| # | Task | Detail | Estimasi | Status |
|---|---|---|---|---|
| 6.1 | Hapus Modul Pages | Hapus `src/app/admin/pages`, aksi, dan route yang terkait `Page`. Hapus model `Page` dari Prisma. | 1 jam | ✅ |
| 6.2 | Skema Baru | Tambah `TeamMember`, `GalleryImage`, `Testimonial` ke `schema.prisma`. Update provider ke PostgreSQL (Supabase multi-schema). | 1 jam | ✅ |
| 6.3 | Migrasi DB | Buat `.env` baru dengan kredensial Supabase. Jalankan `prisma db push`. | 30 mnt | ✅ |
| 6.4 | Integrasi Cloudinary | Konfigurasi SDK Cloudinary di `src/lib/cloudinary.ts`. | 1 jam | ✅ |
| 6.5 | Refactor Upload | Ubah `src/app/api/upload/route.ts` agar upload ke Cloudinary, kembalikan URL secure. Update schema file uploader UI. | 1 jam | ✅ |
| 6.6 | Update UI Admin | Terapkan warna `docs/DESIGN.md` (Tertiary: `#0f7f6d`) pada tema admin. Bersihkan sidebar dari menu lama. | 1 jam | ✅ |

---

## Sprint 7 — Team & Gallery

> **Goal:** Membangun CMS untuk profil guru/staff dan album foto.

### M7: Team Management

| # | Task | Detail | Estimasi | Status |
|---|---|---|---|---|
| 7.1 | UI Admin Team | Buat `src/app/admin/team/page.tsx` untuk tabel daftar guru. | 1 jam | ⏳ |
| 7.2 | CRUD Team | Form untuk tambah/edit (Nama, Posisi, Bio, Upload Foto Cloudinary). Integrasi server action. | 2 jam | ⏳ |

### M8: Gallery Management

| # | Task | Detail | Estimasi | Status |
|---|---|---|---|---|
| 8.1 | UI Admin Gallery | Buat grid view/tabel untuk manajemen foto kegiatan. | 1 jam | ⏳ |
| 8.2 | CRUD Gallery | Form upload foto (Cloudinary), kategori foto, deskripsi. | 2 jam | ⏳ |

---

## Sprint 8 — Testimonial, Frontend & Polish

> **Goal:** Menyelesaikan fitur backend terakhir dan merender frontend sesuai referensi desain.

### M9: Testimonial Management

| # | Task | Detail | Estimasi | Status |
|---|---|---|---|---|
| 9.1 | UI Admin Testimonial | Tabel daftar ulasan alumni/wali murid. | 1 jam | ⏳ |
| 9.2 | CRUD Testimonial | Form untuk nama, peran, isi, dan status tayang. | 1 jam | ⏳ |

### M10: Public Frontend Integration

| # | Task | Detail | Estimasi | Status |
|---|---|---|---|---|
| 10.1 | Hardcode Routes | Buat route spesifik: `/about`, `/team`, `/gallery`, `/testimony`, `/contact`. | 1 jam | ⏳ |
| 10.2 | Implementasi Desain | Gunakan referensi `docs/ui/school-profile/*.html` ke dalam komponen Next.js untuk masing-masing rute. | 4 jam | ⏳ |
| 10.3 | Fetch Data Dinamis | Hubungkan halaman Frontend ke database (Post, Team, Gallery, Testimoni). | 2 jam | ⏳ |

### M11: Final Polish & Testing

| # | Task | Detail | Estimasi | Status |
|---|---|---|---|---|
| 11.1 | QA Testing | Pastikan semua upload gambar masuk ke Cloudinary, dan semua halaman Frontend tidak error. | 2 jam | ⏳ |
| 11.2 | Dokumentasi | Panduan (Walkthrough) cara admin Yayasan Alfida mengelola website. | 1 jam | ⏳ |
