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
