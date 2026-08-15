# Development Log

- **Tanggal**: 8 Agustus 2026
- **Progress**: 
  - Menyelesaikan integrasi otentikasi multi-schema (`cms.users` dan `shared.users`) dan memperbaiki *type error* pada `session.user.id` yang menghambat proses *build*.
  - Melakukan sinkronisasi warna UI (*bulk replace*) secara menyeluruh di halaman login dan admin dashboard agar sesuai dengan referensi desain di `docs/DESIGN.md` (Primary: `#454545`, Tertiary: `#0f7f6d`).
  - Memperbaiki menu sidebar dengan menambahkan *link* "All Posts" dan "Add New Post".
  - Mengimplementasikan fitur Sprint 7: CRUD (Create, Read, Update, Delete) untuk modul **Team Member** dan **Gallery Image** beserta Server Actions dan validasi form Zod.
  - Memastikan *build* aplikasi berjalan sukses 100% tanpa ada error.
- **Commit Message**: `feat(cms): implement TeamMember and Gallery CRUD, fix multi-schema auth, and sync UI colors with DESIGN.md`

---

- **Tanggal**: 8 Agustus 2026
- **Progress**:
  - Memperbaiki bug pada *type-checker* Vercel terkait impor objek `Prisma` dari `@prisma/client` dalam mode *multi-schema* di file `prisma/seed.ts`.
  - Mengimplementasikan fitur Sprint 8: CRUD lengkap untuk modul **Testimonial** (Schema, Zod Validator, Server Actions, Admin Pages, dan UI Client) dan memunculkannya di Sidebar Admin.
  - Membangun *Public Frontend Routes* dengan menerapkan struktur *layout* baru (`PublicHeader` dan `PublicFooter`).
  - Menerjemahkan *wireframe* `home.html` menjadi kumpulan komponen React statis yang dinamis (mengambil data *live* dari database) seperti *Hero*, *Info Boxes*, *About*, *Stats*, *Teachers*, *Gallery*, *Testimonial*, *News*, dan *CTA*.
  - Melakukan kompilasi (*build*) untuk memastikan kode bebas error dari *type-checker* dan `eslint`.
- **Commit Message**: `feat: complete sprint 8 testimonials and public routes`

---

- **Tanggal**: 9 Agustus 2026
- **Progress**:
  - Menyusun dokumen **PRD.md** (Product Requirements Document) berdasarkan `AGENTS.md`, `DESIGN.md`, dan `PROJECTS.md` — mencakup 30+ kebutuhan fungsional dengan ID dan prioritas (P0/P1).
  - Menyusun dokumen **TDD.md** (Technical Design Document) berdasarkan PRD dan analisis langsung terhadap codebase — mencakup arsitektur, ER diagram, routing, data layer, media storage, SEO, security, dan dependency graph.
  - Mengupdate TDD.md dengan route structure lengkap dari *build manifest* (`.next/`), termasuk route baru: `appearance`, `profile`, `revisions`, `settings/*` (general, permalinks, seo), `theme/school-profile/*`, dan full CRUD routes untuk gallery/team/testimonials/users.
  - Menyusun dokumen **db-schema.md** berdasarkan Prisma schema aktual dari *build artifact* (`prisma_schema.prisma`) — mendokumentasikan 17 tabel, relasi, enum, dan mapping Prisma-ke-DB secara lengkap. Menemukan 5 model baru yang belum terdokumentasi: `GalleryAlbum`, `Menu`, `MenuItem`, `Revision`, `ThemeSection`.
  - Melakukan *bulk replace* warna pada **24 file HTML mockup** di `docs/ui-wireframe/` (12 file) dan `docs/ui/school-profile/` (12 file) — mengganti warna lama (`#00704A`, `#1E3932`, `#CBA258`, dll.) dengan warna sesuai `DESIGN.md` (`#0f7f6d`, `#454545`, `#06bfa2`, dll.).
  - Membuat halaman **index.html** di `docs/ui-wireframe/` dan `docs/ui/school-profile/` sebagai navigasi hub untuk mempermudah preview mockup di browser.
  - Menghapus referensi halaman **Register** dari index wireframe dan dokumen PRD/TDD karena registrasi user dilakukan di SIM (auth sharing via schema `shared`).
- **Commit Message**: `docs: create PRD, TDD, db-schema, sync UI mockup colors with DESIGN.md, add index pages`

---

- **Tanggal**: 9 Agustus 2026
- **Sprint**: Sprint 1 — Project Setup ✅
- **Progress**:
  - Restart project dari awal (clean slate). Init Next.js 16.3.0 dengan App Router, Turbopack, TypeScript, Tailwind CSS v4, ESLint.
  - Konfigurasi Prisma 7 multi-schema (`cms` + `shared`) dengan 17 tabel lengkap beserta relasi. Menggunakan `@prisma/adapter-pg` karena Prisma 7 memerlukan driver adapter eksplisit.
  - Setup Supabase Auth SSR (`@supabase/ssr`) — server client & browser client.
  - Setup Cloudinary SDK (`src/lib/cloudinary.ts`).
  - Konfigurasi design tokens Tailwind CSS v4 sesuai `docs/DESIGN.md` di `globals.css`.
  - Buat `.env.example` dan `.env` dengan credentials Supabase dari `sistem-data/supabase-info.md`.
  - Next.js 16 menggunakan `src/proxy.ts` sebagai pengganti `middleware.ts`.
- **Commit Message**: `feat: sprint 1 - project setup, prisma 7 multi-schema, supabase auth, cloudinary`

---

- **Tanggal**: 9 Agustus 2026
- **Sprint**: Sprint 2 — Auth & User Management ✅
- **Progress**:
  - Halaman Login (`(auth)/login/page.tsx`) + `login-form.tsx` + server action Supabase `signInWithPassword`.
  - Auth Guard di `src/proxy.ts` — redirect unauthenticated ke `/login`, authenticated ke `/admin`.
  - Auth helper `src/lib/auth.ts` — `getUser()` dan `requireAuth()`. Auto-create `SharedUser` & `CmsUser` on first login. Pengguna pertama otomatis `SUPER_ADMIN`.
  - Admin Layout (`admin/layout.tsx`) mengintegrasikan Sidebar dan Header.
  - Dashboard Overview (`admin/page.tsx`) dengan statistik ringkasan (post, team, gallery).
  - User List + Edit Role (`admin/users/`) — RBAC-aware, ADMIN tidak bisa ubah SUPER_ADMIN.
  - Profile Page (`admin/profile/page.tsx`).
- **Commit Message**: `feat: sprint 2 - auth guard, login, admin layout, sidebar, header, users CRUD, profile`

---

- **Tanggal**: 9 Agustus 2026
- **Sprint**: Sprint 3 — Posts & TipTap Editor ✅
- **Progress**:
  - Install TipTap (`@tiptap/react`, `@tiptap/starter-kit`, extension Image/Link/TextAlign/Underline), `zod`, `lucide-react`.
  - Validasi Zod `PostFormSchema` (`src/lib/validations/post.ts`).
  - API `GET /api/posts/check-slug` — validasi slug real-time dari sisi klien.
  - Post List Page (`admin/posts/page.tsx`) dengan filter tab status (All/Published/Draft/Archived).
  - TipTap Editor component (`src/components/editor/TipTapEditor.tsx`) — toolbar kustom dengan Material Icons.
  - PostForm (`PostForm.tsx`) — client component 2-kolom: editor utama + sidebar (status, SEO, featured image).
  - New Post (`admin/posts/new/page.tsx`) dan Edit Post (`admin/posts/[id]/edit/page.tsx`) dengan RBAC (Contributor hanya bisa edit miliknya).
  - Server actions: `savePostAction` + `deletePostAction`.
  - **Fix**: Tambah stylesheet Material Icons Outlined ke `src/app/layout.tsx` — ikon sebelumnya muncul sebagai teks literal.
  - Task yang ditunda ke Sprint 4: EDIT-02 (Media Library modal), EDIT-03 (resize gambar), EDIT-04 (Category/Tag picker).
- **Commit Message**: `feat: sprint 3 - posts CRUD, tiptap editor, zod validation, slug API, fix material icons`

---

- **Tanggal**: 9 Agustus 2026
- **Sprint**: Sprint 4 — Media Library & Taxonomy ✅
- **Progress**:
  - Refactor layout halaman Login (`(auth)/login/page.tsx`) dan form login agar *pixel-perfect* sesuai dengan wireframe HTML (gradien latar, icon hub, "Remember me", dll).
  - Merombak ulang halaman Dashboard utama (`admin/page.tsx`) agar identik dengan mockup 4-kolom stat, tabel Recent Posts, dan list Recent Activity.
  - Menyelaraskan icon pada `admin/sidebar.tsx` sesuai dengan yang tertera di `docs/ui-wireframe/dashboard.html`.
  - Menerapkan Zod Validator dan Schema untuk kategori dan tag di `src/lib/validations/taxonomy.ts`.
  - Mengimplementasikan halaman CRUD untuk Categories (`admin/categories`) dan Tags (`admin/tags`) dengan desain *split-view*.
  - Membuat *route handler* untuk upload gambar di `/api/upload` yang terintegrasi dengan SDK Cloudinary serta Prisma (`cms.media`).
  - Membangun halaman Media Library (`admin/media`) lengkap dengan *grid view*, fungsi upload instan, dan panel informasi aset gambar (*alt text*, *caption*).
  - Membuat *modal* `MediaPicker` yang diintegrasikan langsung pada form `PostForm.tsx` untuk kemudahan memilih *Featured Image*.
- **Commit Message**: `feat: sprint 4 - media library, taxonomy, cloudinary upload, media picker, UI sync`

---

- **Tanggal**: 13 Agustus 2026
- **Sprint**: Sprint 5 — Team, Gallery & Testimonials ✅
- **Progress**:
  - Mengupdate Prisma schema agar sesuai dengan DB yang ada, mempertahankan kolom `password_hash` untuk backward-compatibility, dan menambahkan model baru `TeamMember`, `GalleryAlbum`, `GalleryImage`, `Testimonial`.
  - Mengimplementasikan Zod Validator dan Server Actions terpusat untuk kelima model tersebut.
  - Membangun halaman CRUD untuk **Team Members**, dilengkapi dengan pengurutan posisi (Order) dan pemilihan foto via `MediaPicker`.
  - Membangun halaman **Gallery** dengan fitur grouping berdasarkan Album beserta fitur pengaturan urutan gambar dan cover album.
  - Membangun halaman CRUD untuk **Testimonials**, lengkap dengan komponen rating bintang kustom.
  - Mengintegrasikan sistem penyimpan revisi historis (Tabel `Revision`) ke dalam fitur `savePostAction`, sehingga mem-backup snapshot post setiap kali perubahan disimpan.
  - Melakukan update pada Sidebar komponen agar memunculkan menu Team Members, Gallery, dan Testimonials.
  - Memperbaiki build error terkait `prisma.config.ts` dan *type mapping* JSON di proses penyimpanan revision.
- **Commit Message**: `feat: sprint 5 - team members, gallery, testimonials CRUD and post revisions`

- **Tanggal**: 13 Agustus 2026
- **Sprint**: Sprint 6 — Settings, Menus & Theme ✅
- **Progress**:
  - Mengupdate `prisma/schema.prisma` dengan tabel `Menu`, `MenuItem`, dan `Appearance` beserta Enum `MenuItemType` untuk memfasilitasi konfigurasi situs, menyesuaikan struktur yang ada di DB.
  - Memperbaiki penamaan relasi (dari `_PostCategories` menjadi `PostCategories`) untuk mencegah crash saat pencarian tabel implicit many-to-many karena Prisma otomatis menambahkan prefix `_`.
  - Mengimplementasikan `zod` validator (`SettingsFormSchema`, `MenuFormSchema`, `MenuItemFormSchema`) pada `src/lib/validations/sprint6.ts`.
  - Membangun halaman antarmuka konfigurasi `General`, `SEO`, dan `Permalinks` di `/admin/settings/` menggunakan komponen `SettingsForm`.
  - Membuat sistem manajemen menu bersarang di `/admin/menus/` yang memungkinkan pembuatan `Menu` (header/footer) dan item di dalamnya (Custom, Page, Post, Category).
  - Menyusun panel konfigurasi tema spesifik (Hero, About, Stats) di `/admin/appearance/` yang memanfaatkan penyimpanan JSONB dinamis pada tabel `appearance`.
  - Menyematkan route untuk Settings, Menus, dan Appearance ke dalam *Sidebar* Admin.
  - Verifikasi kompatibilitas dengan eksekusi `pnpm build` sukses secara keseluruhan.
- **Commit Message**: `feat: sprint 6 - site settings, dynamic menus, appearance theme config, and implicit many-to-many schema fix`

---

- **Tanggal**: 15 Agustus 2026
- **Sprint**: Sprint 7 & 8 — Halaman Publik (Frontend) ✅
- **Progress**:
  - Menyelesaikan implementasi UI halaman beranda (`src/app/(public)/page.tsx`) dengan menambahkan seksi *Gallery & Achievements* serta *Call-to-Action* yang sepenuhnya dinamis dari database.
  - Membangun halaman profil detail guru/staff secara dinamis di `src/app/(public)/team/[slug]/page.tsx` yang mendukung *rich-text bio* dan menampilkan daftar staff lainnya.
  - Membangun halaman testimoni publik di `src/app/(public)/testimony/page.tsx` dengan variasi desain kartu *dark-mode* berselang-seling (masonry-style) sesuai mockup HTML asli.
  - Membangun Global 404 Error page di `src/app/not-found.tsx` dengan animasi floating kustom berbasis Tailwind dan *simplified header* independen.
  - Memastikan *type safety* pada properti HTML standar (seperti `alt`) untuk meminimalisir potensi error saat proses *build*.
  - Melakukan kompilasi (`pnpm build`) dengan status *exit code 0* yang memverifikasi 100% rute statis & dinamis berjalan mulus.
- **Commit Message**: `feat(public): complete sprint 7 and sprint 8 implementation`

---

- **Tanggal**: 15 Agustus 2026
- **Sprint**: Sprint 9 — Search, SEO, Performance & Polish ✅
- **Progress**:
  - Membangun antarmuka `/search?q=...` dengan fungsi pencarian global di tabel Post dan profil Staff secara simultan *case-insensitive*.
  - Mengimplementasikan standar SEO via `sitemap.ts` (Dynamic Sitemap Next.js) untuk perayapan otomatis semua route statis dan dinamis.
  - Memasang aturan `robots.ts` agar mesin pencari tidak mengindeks halaman panel admin (`/admin/`).
  - Menyempurnakan form Editor di `/admin/posts` dengan Yoast-style panel untuk live preview snippet Google Search dan *character counters*.
  - Menekan waktu pemuatan awal panel Editor dengan *Lazy-Loading* komponen editor TipTap via `next/dynamic`.
  - Migrasi seluruh *tags image standard* HTML di layout publik ke komponen optimasi `<Image />` dari library `next/image`.
  - Menyuntikkan perintah pembatalan cache ISR `revalidatePath('/', 'layout')` ke seluruh 9 endpoint Server Actions Admin untuk menjamin setiap perubahan langsung terlihat seketika di *frontend*.
  - Menyiapkan mode halaman *Coming Soon* `/coming-soon` dengan efek countdown interaktif dan animasi TailwindJS CSS.
- **Commit Message**: `feat(seo): implement sprint 9 search, sitemap, seo panel, and isr`

---

- **Tanggal**: 15 Agustus 2026
- **Sprint**: Sprint 10 — Testing & Deployment ✅
- **Progress**:
  - Menginstal `vitest` dan `@playwright/test` sebagai *framework testing* utama.
  - Membangun *unit test* spesifik pada `src/lib/auth.test.ts` untuk memverifikasi fungsionalitas logika autentikasi dan penanganan autorisasi berbasis peran admin.
  - Membangun *unit test* Server Action pada `src/app/admin/posts/actions.test.ts` yang memastikan ketahanan (robustness) validasi Form Zod dan generator UUID Prisma.
  - Membangun *unit test* proteksi API `src/app/api/upload/route.test.ts` untuk menangkal payload upload kosong.
  - Menyusun 3 buah shell skenario peramban *end-to-end* (E2E) pada direktori `tests/e2e` guna melatih *flow* CRUD esensial.
  - Membuat `docs/DEPLOYMENT.md` beserta `env.example` sebagai dokumentasi standar devops yang mendemonstrasikan peluncuran mandiri ke Vercel dan Supabase.
  - Verifikasi kompatibilitas tipe (*Typechecking*) dan kompilasi *build production* terkonfirmasi sempurna (0 error).
- **Commit Message**: `feat(test): implement sprint 10 automated testing suite and deployment guide`

---

- **Tanggal**: 15 Agustus 2026
- **Sprint**: Post-Launch Refinements & Bugfixes
- **Progress**:
  - **Public Header Fix**: Memperbaiki isu *header* publik dan *navbar* yang tidak muncul (invisible) akibat kelas utilitas animasi kustom Tailwind (`opacity-0 animate-[slideDown...]`) yang tidak terkonfigurasi secara global. Kelas tersebut telah dihapus sehingga navigasi kini tampil normal dan *fully visible*.
  - **General Settings Sync**: Menyelaraskan *key* penyimpanan di form *General Settings* (`general_siteTitle`, `general_siteDescription`) agar terhubung langsung dengan *metadata* situs.
  - **Dynamic Contact & Social Links**: Memastikan data nomor telepon, email, dan sosial media yang diinputkan di menu *General Settings* terender secara akurat pada *topbar* (bar hitam) di *header* publik.
  - **Favicon Management**: Menambahkan fitur untuk mengubah URL Favicon secara dinamis dari dalam dashboard *General Settings*, dan mengaplikasikan injeksi meta *icon* tersebut secara global via root `layout.tsx`.
  - **Dynamic Admin Dashboard**: Merombak total beranda admin (`/admin/page.tsx`) yang sebelumnya menggunakan data statis/placeholder:
    - Statistik atas kini menghitung total aktual untuk entri Posts, Team Members, Media, dan Users.
    - Mengaktifkan fitur formulir **Quick Draft** yang divalidasi dan disimpan secara langsung ke database sebagai *draft post* via Server Actions.
    - Grafik "Posts per Month" dikalkulasi otomatis berdasar akumulasi riwayat posting 6 bulan terakhir.
    - Tabel *Recent Posts* dan *Recent Activity* menampilkan data kreasi/modifikasi *post* yang paling baru.
- **Commit Message**: `fix: public header visibility, dynamic favicon, and integrate real database data into admin dashboard overview`
