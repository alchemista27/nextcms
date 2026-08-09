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
