# Product Requirements Document (PRD)

## Alfida Content Management System

| Field | Value |
| --- | --- |
| **Produk** | Alfida CMS |
| **Versi** | Alpha |
| **Tanggal** | 9 Agustus 2026 |
| **Organisasi** | Yayasan Alfida Bengkulu |

---

## 1. Ringkasan Produk

Alfida CMS adalah content management system yang dikembangkan khusus untuk lingkungan Yayasan Alfida Bengkulu. Sistem ini melayani kebutuhan profil yayasan dan unit pendidikan di bawah naungannya. CMS ini bergaya WordPress — memiliki dashboard admin seperti WordPress, namun halaman publik bersifat statis (tidak bisa menambah halaman custom). Fokus utama adalah manajemen post, kategori, tags, media, tim/guru, galeri, dan testimoni.

---

## 2. Tujuan & Sasaran

### 2.1. Tujuan Bisnis
- Menyediakan platform digital untuk profil yayasan dan unit pendidikan Yayasan Alfida Bengkulu.
- Memudahkan pengelolaan konten (berita, pengumuman, galeri, tim) tanpa perlu keahlian teknis.
- Meningkatkan visibilitas online yayasan melalui halaman publik yang SEO-friendly.

### 2.2. Sasaran Pengguna
| Peran | Deskripsi |
| --- | --- |
| **Super Admin** | Mengelola seluruh sistem, pengaturan, dan akses pengguna. |
| **Admin** | Mengelola konten (post, media, tim, galeri, testimoni). |
| **Contributor** | Membuat dan mengedit post miliknya sendiri. |
| **Pengunjung (Public)** | Mengakses halaman publik profil sekolah/yayasan. |

---

## 3. Tech Stack

| Layer | Teknologi |
| --- | --- |
| **Framework** | Next.js 15 (React 19, App Router) |
| **Database & Auth** | Supabase (PostgreSQL & Supabase Auth SSR) |
| **ORM** | Prisma (via Supabase Transaction Pooler) |
| **Storage** | Cloudinary (Image & PDF) |
| **Styling** | Tailwind CSS |
| **Icons** | Material UI Icons (Google) — emoji dilarang |
| **Rich Text Editor** | TipTap |

---

## 4. Arsitektur Database (Multi-Schema Supabase)

Sistem menggunakan multi-schema pada satu project Supabase:

| Schema | Fungsi |
| --- | --- |
| `cms` | Tabel-tabel khusus CMS: posts, categories, tags, media, gallery, testimonial, team, menus, settings, serta user roles CMS. |
| `shared` | Informasi user yang di-share antar sistem (terhubung dengan Supabase Auth). |
| `sim` | Schema untuk Sistem Informasi Manajemen (sistem terpisah, sudah ada). |

---

## 5. Fitur & Kebutuhan Fungsional

### 5.1. Autentikasi & Otorisasi

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| AUTH-01 | Login menggunakan Supabase Auth SSR. Tidak ada registrasi di CMS — user dibuat di SIM dan di-sync ke `shared.users`. | P0 |
| AUTH-02 | Informasi user tersimpan di schema `shared`, terintegrasi dengan Supabase Auth. | P0 |
| AUTH-03 | Role management (Super Admin, Admin, Contributor) dikelola di dashboard dan tersimpan di tabel user role pada schema `cms`. | P0 |
| AUTH-04 | Setiap API route wajib melakukan pengecekan autentikasi DAN otorisasi di server-side. | P0 |
| AUTH-05 | Tidak boleh bergantung pada client-side guard saja. | P0 |

### 5.2. Dashboard Admin

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| DASH-01 | **Dashboard Overview** — Menampilkan statistik: jumlah postingan, guru, foto galeri. | P0 |
| DASH-02 | **Posts** — CRUD berita/pengumuman dengan rich text editor (TipTap). | P0 |
| DASH-03 | **Categories & Tags** — Klasifikasi post dengan categories dan tags. | P0 |
| DASH-04 | **Media Library** — Manajemen gambar dari Cloudinary. Hanya menampilkan media yang diupload oleh admin/contributor yang sedang login. | P0 |
| DASH-05 | **Team** — CRUD profil guru/staff (Nama, Jabatan, Bio, Foto). | P1 |
| DASH-06 | **Gallery** — CRUD album/foto kegiatan. | P1 |
| DASH-07 | **Testimonial** — CRUD testimoni. | P1 |
| DASH-08 | **Menus** — Pengaturan menu navigasi frontend. | P1 |
| DASH-09 | **Settings** — Pengaturan identitas dan kontak yayasan. | P0 |
| DASH-10 | **SEO & Metadata** — Pengaturan metadata dan SEO per-post maupun global, mirip plugin Yoast di WordPress. | P1 |

### 5.3. Post Editor

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| EDIT-01 | Rich text editor menggunakan TipTap (bukan markdown editor). | P0 |
| EDIT-02 | Insert gambar ke dalam post dari media library. | P0 |
| EDIT-03 | Gambar di dalam post bisa di-resize dan diatur alignment-nya. | P0 |
| EDIT-04 | Pemilihan kategori dan tags saat membuat/mengedit post. | P0 |
| EDIT-05 | Pengaturan SEO metadata per-post (title, description, slug, OG image). | P1 |

### 5.4. Media Library

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| MEDIA-01 | Upload gambar ke Cloudinary melalui dashboard. | P0 |
| MEDIA-02 | Hanya media milik user yang sedang login yang ditampilkan (scoped per-user). | P0 |
| MEDIA-03 | Gambar dapat dipilih dari media library saat mengedit post. | P0 |
| MEDIA-04 | Konfigurasi Cloudinary tersimpan di folder `sistem-data/`. | P0 |

### 5.5. Halaman Publik (Frontend)

| ID | Route | Halaman | Prioritas |
| --- | --- | --- | --- |
| PUB-01 | `/` | Home | P0 |
| PUB-02 | `/about` | About Us | P0 |
| PUB-03 | `/contact` | Contact | P0 |
| PUB-04 | `/gallery` | Gallery | P1 |
| PUB-05 | `/team` | Team / Teachers | P1 |
| PUB-06 | `/team/[slug]` | Team Detail | P1 |
| PUB-07 | `/testimony` | Testimonials | P1 |
| PUB-08 | `/blog` | Archive (daftar berita) | P0 |
| PUB-09 | `/[slug]` | Single Post / Berita | P0 |

> [!NOTE]
> Halaman frontend sepenuhnya berpatokan pada referensi desain di `docs/ui/school-profile`. Tidak ada fitur untuk membuat halaman custom melalui dashboard.

---

## 6. Desain & UI

### 6.1. Design Tokens

#### Warna
| Token | Hex | Penggunaan |
| --- | --- | --- |
| `colors.primary` | #454545 | Teks utama |
| `colors.secondary` | #06bfa2 | Aksen sekunder |
| `colors.tertiary` | #0f7f6d | Aksen utama / CTA |
| `colors.neutral` | #F7F8F8 | Background warm neutral |
| `colors.surface` | #FFFFFF | Background kartu / elevated surface |
| `colors.on-tertiary` | #F7F8F8 | Teks di atas warna tertiary |
| `colors.border` | #E3E8E7 | Garis pembatas |

#### Tipografi
| Token | Font | Size | Weight |
| --- | --- | --- | --- |
| `h1` | Roboto | 3rem | 700 |
| `body-md` | Inter | 1rem | 400 |
| `label-caps` | Inter | 0.75rem | 600 |

#### Spacing
| Token | Nilai |
| --- | --- |
| `spacing.sm` | 8px |
| `spacing.md` | 16px |
| `spacing.lg` | 24px |

#### Border Radius
| Token | Nilai |
| --- | --- |
| `rounded.sm` | 4px |
| `rounded.md` | 8px |

### 6.2. Prinsip Desain
- Gunakan warna `tertiary` secara hemat — hanya untuk aksi paling penting (highest-emphasis).
- Maksimal dua font family dalam satu layar.
- Default background menggunakan `neutral`; `surface` (putih) hanya untuk card/elevated element.
- Kedalaman (depth) disampaikan melalui tonal layering dan border tipis, bukan drop shadow.
- Gambar full-width harus diberi margin bawah yang cukup.
- Gunakan Material UI Icons (Google) untuk semua ikon — emoji tidak boleh digunakan.

### 6.3. Komponen Utama

| Komponen | Background | Text Color | Rounded | Padding |
| --- | --- | --- | --- | --- |
| `button-primary` | `tertiary` | `on-tertiary` | `sm` (4px) | 12px 20px |
| `button-secondary` | transparent | `tertiary` | `sm` (4px) | 12px 20px |
| `card` | `surface` | `primary` | `md` (8px) | 20px |
| `input` | `surface` | `primary` | `sm` (4px) | 10px 14px |

### 6.4. Referensi Wireframe & UI
- **Dashboard**: Layout ada di folder `docs/ui-wireframe/`
- **Halaman Publik**: Semua desain ada di folder `docs/ui/school-profile/`
- Pewarnaan di kedua folder tersebut harus sesuai dengan `DESIGN.md`.

---

## 7. Kebutuhan Non-Fungsional

### 7.1. Keamanan
| ID | Kebutuhan |
| --- | --- |
| SEC-01 | Tidak boleh commit secret (API key, token, credential) ke repository. Gunakan `.env.local` dan `.env.example`. |
| SEC-02 | Validasi semua input eksternal dengan Zod atau Valibot (request body, URL params, JSON). |
| SEC-03 | Setiap API route wajib mengecek autentikasi DAN otorisasi di server-side. |

### 7.2. Code Quality
| ID | Kebutuhan |
| --- | --- |
| QA-01 | TypeScript wajib di semua file baru. Hindari `any`, gunakan `unknown` lalu narrow. |
| QA-02 | ESLint enforced — jalankan `pnpm lint --fix` sebelum commit. |
| QA-03 | Prettier auto-format. |
| QA-04 | Tailwind CSS utility classes — extract ke komponen jika pola berulang 3+ kali. |
| QA-05 | Naming: kebab-case file, PascalCase component, camelCase variable, SCREAMING_SNAKE env var. |
| QA-06 | Import di-sort: external → internal → relative. Gunakan path alias. |

### 7.3. Testing
| ID | Kebutuhan |
| --- | --- |
| TEST-01 | Vitest untuk unit test — co-locate `*.test.ts` dengan source file. Cover happy path + minimal satu edge case. |
| TEST-02 | Playwright untuk e2e — spesifikasi di `tests/e2e`. Jalankan `pnpm test:e2e`. |
| TEST-03 | Accessibility checks otomatis pada halaman kritis. Manual keyboard test sebelum merge UI. |

### 7.4. Performance
| ID | Kebutuhan |
| --- | --- |
| PERF-01 | Optimasi gambar menggunakan Next.js Image component + Cloudinary transformations. |
| PERF-02 | Static generation (SSG) atau ISR untuk halaman publik yang jarang berubah. |
| PERF-03 | Lazy loading untuk komponen berat (editor, media library). |

### 7.5. SEO
| ID | Kebutuhan |
| --- | --- |
| SEO-01 | Title tag dan meta description yang proper per halaman. |
| SEO-02 | Open Graph dan Twitter Card meta tags. |
| SEO-03 | Semantic HTML dengan heading hierarchy yang benar. |
| SEO-04 | Sitemap dan robots.txt otomatis. |
| SEO-05 | Pengaturan SEO mirip Yoast WordPress (di dashboard dan per-post). |

---

## 8. Konfigurasi & Environment

| Item | Lokasi |
| --- | --- |
| Konfigurasi Cloudinary | `sistem-data/` |
| Konfigurasi Supabase | `sistem-data/` |
| Environment variables | `.env.local` (gitignored), template di `.env.example` |
| Prisma schema | Terhubung via Supabase Transaction Pooler |

---

## 9. Workflow Development

### Setup
```bash
pnpm install          # Install dependencies
pnpm dev              # Development server
pnpm build            # Production build
pnpm lint             # Linting
pnpm test             # Unit tests
pnpm tsc --noEmit     # Type checking
```

### Git Workflow
- Conventional Commits: `feat:`, `fix:`, `chore:`, dll. Imperative mood, lowercase, tanpa titik.
- PR kecil dan fokus — satu perubahan logis per PR, target < 400 baris diff.
- Test disertakan dalam PR yang sama dengan perubahan.
- Jalankan `pnpm lint && pnpm test && pnpm build` sebelum push.

---

## 10. Batasan & Constraint

- Halaman publik bersifat statis — tidak ada fitur page builder atau halaman custom melalui dashboard.
- Hanya ada fitur untuk menambah/mengelola post, categories, dan tags (bukan halaman).
- Media library bersifat scoped per-user (admin/contributor hanya melihat media miliknya sendiri).
- Emoji tidak boleh digunakan sebagai ikon di UI — wajib Material UI Icons.
- Tidak ada halaman registrasi di CMS — registrasi user dilakukan di SIM (Sistem Informasi Manajemen) yang berbagi schema `shared`.

---

## 11. Referensi Dokumen

| Dokumen | Path | Deskripsi |
| --- | --- | --- |
| AGENTS.md | `/AGENTS.md` | Konteks repository untuk AI coding agent |
| DESIGN.md | `/DESIGN.md` | Design system & tokens |
| PROJECTS.md | `/PROJECTS.md` | Spesifikasi fitur & struktur project |
| UI Wireframe | `/docs/ui-wireframe/` | Wireframe layout dashboard admin |
| UI School Profile | `/docs/ui/school-profile/` | Desain halaman publik |
| Log | `/docs/log.md` | Log pengembangan |
