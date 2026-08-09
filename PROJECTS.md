## Alfida Content Management System

Sebuah content management system bergaya WordPress. Memiliki dashboard admin seperti wordpress, namun untuk halaman tidak bisa menambah halaman secara custom. Hanya ada untuk menambah post, categories dan tags. Media disimpan di cloudinary, diatur hanya media yang diupload oleh admin dan contributor yang muncul di media library.

## Tech Stack
- **Frontend / Framework**: Next.js 15 (React 19, App Router)
- **Database & Auth**: Supabase (PostgreSQL & Supabase Auth)
- **ORM**: Prisma
- **Storage**: Cloudinary
- **Styling**: TailwindCSS

## Fitur
- Koneksi ke supabase project dengan multi schema. di supabase sudah ada schema sim untuk sistem informasi, schema shared untuk informasi yang di share antar sistem, dan schema cms untuk project ini.
- Pengaturan claudinary dan supabase ada di folder sistem-data/
- Gambar yang diupload bisa diakses di media library dan bisa dipilih dari post editor
- post editor menggunakan rich text editor (taptap) jadi bukan markdown editor
- gambar bisa di insert ke post dan bisa di resize, diatur alignment nya
- alur auth, informasi auth ada di supabase auth yang terhubung dengan tabel informasi user di schema shared, di schema cms pengaturan role diatur di dashboard yang terhubung berkaitan dengan tabel user role yang ada di schema cms.
- Ada pengaturan metadata, SEO di dashboard dan post seperti pada di YOAS plugin wordpress
- layout dari dashboard ada di folder ui-wireframe/ sementara untuk halaman public semua ada di folder ui/school-profile
- pewarnaan di ui-wireframe/ dan ui/school-profile/ disesuaikan dengan informasi DESIGN.md
- icon jangan menggunakan emoji, namun menggunakan material ui dari google.

## Struktur Halaman Frontend (Public)

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

## Kebutuhan UI Admin (Dashboard)

1. **Dashboard Overview**: Menampilkan statistik (jumlah postingan, guru, foto galeri).
2. **Posts**: CRUD berita/pengumuman.
3. **Categories & Tags**: Klasifikasi.
4. **Media**: Manajemen gambar dari Cloudinary.
5. **Team**: CRUD profil guru/staff (Nama, Jabatan, Bio, Foto).
6. **Gallery**: CRUD album/foto kegiatan.
7. **Testimonial**: CRUD testimoni.
8. **Menus**: Pengaturan menu navigasi frontend.
9. **Settings**: Pengaturan identitas dan kontak yayasan.