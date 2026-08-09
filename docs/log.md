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
