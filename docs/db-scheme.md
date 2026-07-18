# 🗄️ Database Schema — NextCMS

> Dokumentasi lengkap database schema untuk NextCMS, mencakup definisi tabel, kolom, tipe data, relasi, index, join tables, SQL DDL, dan seed data.

| Item | Detail |
|---|---|
| **Database** | PostgreSQL |
| **Host** | `localhost:5432` |
| **User** | `postgres` |
| **Password** | `181818` |
| **Database Name** | `nextcms` |
| **ORM** | Prisma |
| **Connection URL** | `postgresql://postgres:181818@localhost:5432/nextcms` |
| **ID Strategy** | CUID (collision-resistant unique identifier) |

---

## Daftar Isi

1. [Entity Relationship Diagram (ERD)](#1-entity-relationship-diagram-erd)
2. [Enum Types](#2-enum-types)
3. [Tabel — Definisi Kolom](#3-tabel--definisi-kolom)
4. [Join Tables (Many-to-Many)](#4-join-tables-many-to-many)
5. [Relasi Antar Tabel](#5-relasi-antar-tabel)
6. [Indexing Strategy](#6-indexing-strategy)
7. [Prisma Schema](#7-prisma-schema)
8. [SQL DDL (Raw SQL)](#8-sql-ddl-raw-sql)
9. [Seed Data](#9-seed-data)
10. [Query Patterns](#10-query-patterns)

---

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users {
        varchar id PK "cuid()"
        varchar name "NOT NULL"
        varchar email UK "NOT NULL, UNIQUE"
        varchar password "NOT NULL, bcrypt hash"
        enum role "DEFAULT 'SUBSCRIBER'"
        varchar avatar "NULLABLE"
        text bio "NULLABLE"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
    }

    posts {
        varchar id PK "cuid()"
        varchar title "NOT NULL"
        varchar slug UK "NOT NULL, UNIQUE"
        text content "NULLABLE"
        text excerpt "NULLABLE"
        enum status "DEFAULT 'DRAFT'"
        varchar featured_image "NULLABLE"
        varchar meta_title "NULLABLE"
        text meta_description "NULLABLE"
        varchar og_image "NULLABLE"
        timestamp published_at "NULLABLE"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
        varchar author_id FK "NOT NULL"
    }

    pages {
        varchar id PK "cuid()"
        varchar title "NOT NULL"
        varchar slug UK "NOT NULL, UNIQUE"
        text content "NULLABLE"
        enum status "DEFAULT 'DRAFT'"
        varchar template "DEFAULT 'default'"
        int menu_order "DEFAULT 0"
        varchar meta_title "NULLABLE"
        text meta_description "NULLABLE"
        varchar og_image "NULLABLE"
        timestamp published_at "NULLABLE"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
        varchar author_id FK "NOT NULL"
        varchar parent_id FK "NULLABLE, self-ref"
    }

    categories {
        varchar id PK "cuid()"
        varchar name "NOT NULL"
        varchar slug UK "NOT NULL, UNIQUE"
        text description "NULLABLE"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
        varchar parent_id FK "NULLABLE, self-ref"
    }

    tags {
        varchar id PK "cuid()"
        varchar name "NOT NULL"
        varchar slug UK "NOT NULL, UNIQUE"
        text description "NULLABLE"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
    }

    media {
        varchar id PK "cuid()"
        varchar filename "NOT NULL"
        varchar original_name "NOT NULL"
        varchar mime_type "NOT NULL"
        int size "NOT NULL, bytes"
        varchar url "NOT NULL"
        varchar alt "NULLABLE"
        varchar caption "NULLABLE"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
        varchar uploaded_by_id FK "NOT NULL"
    }

    menus {
        varchar id PK "cuid()"
        varchar name "NOT NULL"
        varchar location "NULLABLE"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
    }

    menu_items {
        varchar id PK "cuid()"
        varchar label "NOT NULL"
        varchar url "NULLABLE"
        varchar target "DEFAULT '_self'"
        enum type "DEFAULT 'CUSTOM'"
        varchar reference_id "NULLABLE"
        int order "DEFAULT 0"
        timestamp created_at "DEFAULT now()"
        timestamp updated_at "AUTO"
        varchar menu_id FK "NOT NULL"
        varchar parent_id FK "NULLABLE, self-ref"
    }

    revisions {
        varchar id PK "cuid()"
        varchar entity_type "NOT NULL, 'POST' or 'PAGE'"
        varchar entity_id FK "NOT NULL"
        varchar title "NOT NULL"
        text content "NULLABLE"
        jsonb metadata "NULLABLE"
        timestamp created_at "DEFAULT now()"
        varchar author_id FK "NOT NULL"
    }

    site_settings {
        varchar id PK "cuid()"
        varchar key UK "NOT NULL, UNIQUE"
        text value "NOT NULL"
        timestamp updated_at "AUTO"
    }

    appearance {
        varchar id PK "cuid()"
        varchar key UK "NOT NULL, UNIQUE"
        jsonb value "NOT NULL"
        timestamp updated_at "AUTO"
    }

    _post_categories {
        varchar post_id FK "NOT NULL"
        varchar category_id FK "NOT NULL"
    }

    _post_tags {
        varchar post_id FK "NOT NULL"
        varchar tag_id FK "NOT NULL"
    }

    posts }o--|| users : "author_id → users.id"
    pages }o--|| users : "author_id → users.id"
    pages }o--o| pages : "parent_id → pages.id"
    categories }o--o| categories : "parent_id → categories.id"
    media }o--|| users : "uploaded_by_id → users.id"
    menus ||--o{ menu_items : "menu_id → menus.id"
    menu_items }o--o| menu_items : "parent_id → menu_items.id"
    revisions }o--|| users : "author_id → users.id"
    posts ||--o{ _post_categories : "post_id"
    categories ||--o{ _post_categories : "category_id"
    posts ||--o{ _post_tags : "post_id"
    tags ||--o{ _post_tags : "tag_id"
    posts ||--o{ revisions : "entity_id (type=POST)"
    pages ||--o{ revisions : "entity_id (type=PAGE)"
```

---

## 2. Enum Types

### 2.1 `Role`

Peran user dalam sistem. Menentukan hak akses dan permissions.

| Value | Deskripsi |
|---|---|
| `ADMIN` | Akses penuh ke semua fitur |
| `EDITOR` | Kelola semua konten (post, page, category, tag, media, menu) |
| `AUTHOR` | Buat & kelola post sendiri, upload media |
| `SUBSCRIBER` | Hanya akses dashboard & edit profil sendiri |

```sql
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'AUTHOR', 'SUBSCRIBER');
```

### 2.2 `PostStatus`

Status siklus hidup sebuah post.

| Value | Deskripsi |
|---|---|
| `DRAFT` | Draft — belum dipublish, hanya terlihat oleh author & editor |
| `PUBLISHED` | Terpublish — terlihat di halaman publik |
| `PENDING` | Menunggu review — diajukan oleh Author, perlu approval Editor/Admin |
| `TRASH` | Soft-delete — dipindahkan ke trash, bisa di-restore |

```sql
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PENDING', 'TRASH');
```

### 2.3 `PageStatus`

Status siklus hidup sebuah page (tanpa `PENDING` karena page hanya dikelola Editor+).

| Value | Deskripsi |
|---|---|
| `DRAFT` | Draft |
| `PUBLISHED` | Terpublish |
| `TRASH` | Soft-delete |

```sql
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'TRASH');
```

### 2.4 `MenuItemType`

Tipe item pada menu navigation.

| Value | Deskripsi |
|---|---|
| `CUSTOM` | Link kustom (URL manual) |
| `PAGE` | Referensi ke Page (resolve slug otomatis) |
| `POST` | Referensi ke Post (resolve slug otomatis) |
| `CATEGORY` | Referensi ke Category (resolve slug otomatis) |

```sql
CREATE TYPE "MenuItemType" AS ENUM ('CUSTOM', 'PAGE', 'POST', 'CATEGORY');
```

---

## 3. Tabel — Definisi Kolom

### 3.1 `users` — Data pengguna

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `name` | `VARCHAR(255)` | `String` | NO | — | — | Nama lengkap |
| 3 | `email` | `VARCHAR(255)` | `String` | NO | — | **UNIQUE** | Alamat email (login) |
| 4 | `password` | `VARCHAR(255)` | `String` | NO | — | — | Hash bcrypt (60 chars) |
| 5 | `role` | `"Role"` | `Role` | NO | `SUBSCRIBER` | ENUM | Peran user |
| 6 | `avatar` | `VARCHAR(500)` | `String?` | YES | `null` | — | URL avatar (dari media) |
| 7 | `bio` | `TEXT` | `String?` | YES | `null` | — | Bio/deskripsi user |
| 8 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal registrasi |
| 9 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |

**Relasi keluar:** `posts`, `pages`, `media`, `revisions` (semua 1-to-many)

---

### 3.2 `posts` — Artikel/post blog

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `title` | `VARCHAR(255)` | `String` | NO | — | — | Judul post |
| 3 | `slug` | `VARCHAR(255)` | `String` | NO | — | **UNIQUE** | URL slug (auto-gen dari title) |
| 4 | `content` | `TEXT` | `String?` | YES | `null` | — | Konten HTML dari Tiptap editor |
| 5 | `excerpt` | `TEXT` | `String?` | YES | `null` | — | Ringkasan pendek (max 500 chars) |
| 6 | `status` | `"PostStatus"` | `PostStatus` | NO | `DRAFT` | ENUM | Status post |
| 7 | `featured_image` | `VARCHAR(500)` | `String?` | YES | `null` | — | URL gambar utama |
| 8 | `meta_title` | `VARCHAR(60)` | `String?` | YES | `null` | — | SEO meta title (max 60 chars) |
| 9 | `meta_description` | `TEXT` | `String?` | YES | `null` | — | SEO meta description (max 160 chars) |
| 10 | `og_image` | `VARCHAR(500)` | `String?` | YES | `null` | — | Open Graph image URL |
| 11 | `published_at` | `TIMESTAMP(3)` | `DateTime?` | YES | `null` | — | Tanggal publish (schedulable) |
| 12 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal dibuat |
| 13 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |
| 14 | `author_id` | `VARCHAR(30)` | `String` | NO | — | **FK → users.id** | Penulis post |

**Relasi:** `author` (users), `categories` (M2M), `tags` (M2M), `revisions` (1-to-many)

---

### 3.3 `pages` — Halaman statis

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `title` | `VARCHAR(255)` | `String` | NO | — | — | Judul halaman |
| 3 | `slug` | `VARCHAR(255)` | `String` | NO | — | **UNIQUE** | URL slug |
| 4 | `content` | `TEXT` | `String?` | YES | `null` | — | Konten HTML |
| 5 | `status` | `"PageStatus"` | `PageStatus` | NO | `DRAFT` | ENUM | Status halaman |
| 6 | `template` | `VARCHAR(50)` | `String` | NO | `'default'` | — | Template layout (`default`, `full-width`, `sidebar`) |
| 7 | `menu_order` | `INTEGER` | `Int` | NO | `0` | — | Urutan di menu/daftar |
| 8 | `meta_title` | `VARCHAR(60)` | `String?` | YES | `null` | — | SEO meta title |
| 9 | `meta_description` | `TEXT` | `String?` | YES | `null` | — | SEO meta description |
| 10 | `og_image` | `VARCHAR(500)` | `String?` | YES | `null` | — | Open Graph image URL |
| 11 | `published_at` | `TIMESTAMP(3)` | `DateTime?` | YES | `null` | — | Tanggal publish |
| 12 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal dibuat |
| 13 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |
| 14 | `author_id` | `VARCHAR(30)` | `String` | NO | — | **FK → users.id** | Penulis halaman |
| 15 | `parent_id` | `VARCHAR(30)` | `String?` | YES | `null` | **FK → pages.id** | Parent page (self-ref hierarchy) |

**Relasi:** `author` (users), `parent`/`children` (self-ref), `revisions` (1-to-many)

---

### 3.4 `categories` — Kategori post (hierarchical)

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `name` | `VARCHAR(255)` | `String` | NO | — | — | Nama kategori |
| 3 | `slug` | `VARCHAR(255)` | `String` | NO | — | **UNIQUE** | URL slug |
| 4 | `description` | `TEXT` | `String?` | YES | `null` | — | Deskripsi kategori |
| 5 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal dibuat |
| 6 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |
| 7 | `parent_id` | `VARCHAR(30)` | `String?` | YES | `null` | **FK → categories.id** | Parent category (self-ref) |

**Relasi:** `parent`/`children` (self-ref), `posts` (M2M via `_post_categories`)

---

### 3.5 `tags` — Label/tag post

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `name` | `VARCHAR(255)` | `String` | NO | — | — | Nama tag |
| 3 | `slug` | `VARCHAR(255)` | `String` | NO | — | **UNIQUE** | URL slug |
| 4 | `description` | `TEXT` | `String?` | YES | `null` | — | Deskripsi tag |
| 5 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal dibuat |
| 6 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |

**Relasi:** `posts` (M2M via `_post_tags`)

---

### 3.6 `media` — File uploads (gambar, video, dokumen)

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `filename` | `VARCHAR(255)` | `String` | NO | — | — | Nama file tersimpan (sanitized) |
| 3 | `original_name` | `VARCHAR(255)` | `String` | NO | — | — | Nama file asli saat upload |
| 4 | `mime_type` | `VARCHAR(100)` | `String` | NO | — | — | MIME type (e.g., `image/jpeg`) |
| 5 | `size` | `INTEGER` | `Int` | NO | — | — | Ukuran file dalam bytes |
| 6 | `url` | `VARCHAR(500)` | `String` | NO | — | — | URL relatif ke file (`/uploads/2026/07/file.jpg`) |
| 7 | `alt` | `VARCHAR(255)` | `String?` | YES | `null` | — | Alt text untuk accessibility |
| 8 | `caption` | `VARCHAR(500)` | `String?` | YES | `null` | — | Caption/keterangan |
| 9 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal upload |
| 10 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |
| 11 | `uploaded_by_id` | `VARCHAR(30)` | `String` | NO | — | **FK → users.id** | User yang mengupload |

**Supported MIME Types:**

| Kategori | MIME Types |
|---|---|
| Image | `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml` |
| Video | `video/mp4`, `video/webm` |
| Document | `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |

**Max File Size:** 10 MB (10.485.760 bytes)

---

### 3.7 `menus` — Navigasi menu

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `name` | `VARCHAR(255)` | `String` | NO | — | — | Nama menu (e.g., "Primary Menu") |
| 3 | `location` | `VARCHAR(50)` | `String?` | YES | `null` | — | Lokasi tampil (`header`, `footer`, `sidebar`) |
| 4 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal dibuat |
| 5 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |

**Relasi:** `items` (1-to-many → `menu_items`)

---

### 3.8 `menu_items` — Item di dalam menu (hierarchical, sortable)

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `label` | `VARCHAR(255)` | `String` | NO | — | — | Teks yang ditampilkan |
| 3 | `url` | `VARCHAR(500)` | `String?` | YES | `null` | — | URL tujuan (untuk type CUSTOM) |
| 4 | `target` | `VARCHAR(10)` | `String` | NO | `'_self'` | — | Target link (`_self`, `_blank`) |
| 5 | `type` | `"MenuItemType"` | `MenuItemType` | NO | `CUSTOM` | ENUM | Tipe item |
| 6 | `reference_id` | `VARCHAR(30)` | `String?` | YES | `null` | — | ID referensi (post/page/category ID) |
| 7 | `order` | `INTEGER` | `Int` | NO | `0` | — | Urutan tampil (ascending) |
| 8 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Tanggal dibuat |
| 9 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |
| 10 | `menu_id` | `VARCHAR(30)` | `String` | NO | — | **FK → menus.id** (CASCADE) | Menu induk |
| 11 | `parent_id` | `VARCHAR(30)` | `String?` | YES | `null` | **FK → menu_items.id** | Parent item (sub-menu, self-ref) |

**On Delete:** Jika menu dihapus → semua menu_items terhapus (CASCADE)

---

### 3.9 `revisions` — Riwayat perubahan post & page

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `entity_type` | `VARCHAR(10)` | `String` | NO | — | — | Tipe entity: `"POST"` atau `"PAGE"` |
| 3 | `entity_id` | `VARCHAR(30)` | `String` | NO | — | **FK** | ID post atau page yang direvisi |
| 4 | `title` | `VARCHAR(255)` | `String` | NO | — | — | Snapshot judul saat revisi |
| 5 | `content` | `TEXT` | `String?` | YES | `null` | — | Snapshot konten saat revisi |
| 6 | `metadata` | `JSONB` | `Json?` | YES | `null` | — | Snapshot metadata (lihat struktur di bawah) |
| 7 | `created_at` | `TIMESTAMP(3)` | `DateTime` | NO | `now()` | — | Waktu revisi dibuat |
| 8 | `author_id` | `VARCHAR(30)` | `String` | NO | — | **FK → users.id** | User yang melakukan perubahan |

**Struktur `metadata` (JSONB):**

```json
{
  "status": "PUBLISHED",
  "excerpt": "Ringkasan post...",
  "featuredImage": "/uploads/2026/07/image.jpg",
  "metaTitle": "Judul SEO",
  "metaDescription": "Deskripsi SEO",
  "ogImage": "/uploads/2026/07/og.jpg",
  "categoryIds": ["clxxx1", "clxxx2"],
  "tagIds": ["clyyy1"],
  "template": "default",
  "parentId": null,
  "menuOrder": 0
}
```

**Batasan:** Maksimal 25 revisi per entity. Revisi tertua dihapus otomatis saat melebihi batas.

---

### 3.10 `site_settings` — Pengaturan umum situs (key-value)

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `key` | `VARCHAR(100)` | `String` | NO | — | **UNIQUE** | Kunci setting |
| 3 | `value` | `TEXT` | `String` | NO | — | — | Nilai setting (string) |
| 4 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |

**Daftar keys yang digunakan:**

| Key | Tipe Value | Deskripsi | Default |
|---|---|---|---|
| `site_title` | string | Nama situs | `"NextCMS"` |
| `site_tagline` | string | Tagline situs | `"Just another NextCMS site"` |
| `site_url` | string (URL) | URL utama situs | `"http://localhost:3000"` |
| `admin_email` | string (email) | Email admin | `"admin@nextcms.local"` |
| `language` | string (ISO 639-1) | Bahasa situs | `"id"` |
| `timezone` | string (IANA) | Zona waktu | `"Asia/Jakarta"` |
| `date_format` | string | Format tanggal | `"DD/MM/YYYY"` |
| `time_format` | string | Format waktu | `"HH:mm"` |
| `posts_per_page` | string (number) | Post per halaman | `"10"` |
| `registration_open` | string (bool) | Izinkan registrasi | `"true"` |
| `default_role` | string (Role) | Role default user baru | `"SUBSCRIBER"` |
| `permalink_structure` | string | Pola permalink | `"/blog/:slug"` |
| `category_base` | string | Base URL kategori | `"category"` |
| `tag_base` | string | Base URL tag | `"tag"` |
| `seo_title_template` | string | Template meta title | `"%title% - %sitename%"` |
| `seo_default_description` | string | Meta description default | `""` |
| `seo_og_image` | string (URL) | OG image default | `""` |
| `seo_robots_txt` | string | Konten robots.txt | `"User-agent: *\nAllow: /"` |
| `seo_sitemap_enabled` | string (bool) | Auto-generate sitemap | `"true"` |
| `seo_analytics_id` | string | Google Analytics ID | `""` |
| `social_facebook` | string (URL) | URL Facebook | `""` |
| `social_twitter` | string (URL) | URL Twitter/X | `""` |
| `social_instagram` | string (URL) | URL Instagram | `""` |

---

### 3.11 `appearance` — Pengaturan tampilan (key-value, JSON)

| # | Kolom | Tipe PostgreSQL | Prisma Type | Nullable | Default | Constraint | Deskripsi |
|---|---|---|---|---|---|---|---|
| 1 | `id` | `VARCHAR(30)` | `String` | NO | `cuid()` | **PK** | Primary key |
| 2 | `key` | `VARCHAR(100)` | `String` | NO | — | **UNIQUE** | Kunci setting |
| 3 | `value` | `JSONB` | `Json` | NO | — | — | Nilai setting (JSON) |
| 4 | `updated_at` | `TIMESTAMP(3)` | `DateTime` | NO | auto | — | Terakhir diupdate |

**Daftar keys yang digunakan:**

| Key | Tipe JSON Value | Deskripsi | Default |
|---|---|---|---|
| `logo` | `string \| null` | URL logo situs | `null` |
| `favicon` | `string \| null` | URL favicon | `null` |
| `primary_color` | `string` | Warna utama (hex) | `"#00704A"` |
| `secondary_color` | `string` | Warna sekunder (hex) | `"#1E3932"` |
| `font_family` | `string` | Font family | `"Inter"` |
| `header_style` | `string` | Layout header | `"left-aligned"` |
| `sidebar_position` | `string` | Posisi sidebar | `"right"` |
| `footer_text` | `string` | Teks footer | `"© 2026 NextCMS. All rights reserved."` |
| `custom_css` | `string` | CSS kustom | `""` |
| `custom_head` | `string` | Script di `<head>` | `""` |
| `custom_footer` | `string` | Script sebelum `</body>` | `""` |

---

## 4. Join Tables (Many-to-Many)

Prisma otomatis membuat implicit join tables untuk relasi many-to-many. Berikut adalah tabel yang dihasilkan:

### 4.1 `_PostCategories` — Post ↔ Category

| # | Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|---|
| 1 | `A` | `VARCHAR(30)` | **FK → posts.id** (CASCADE) | Post ID |
| 2 | `B` | `VARCHAR(30)` | **FK → categories.id** (CASCADE) | Category ID |

- **Unique:** `(A, B)` — satu post tidak bisa memiliki kategori yang sama dua kali
- **Index:** `B` — untuk query "semua post di kategori X"

### 4.2 `_PostTags` — Post ↔ Tag

| # | Kolom | Tipe | Constraint | Deskripsi |
|---|---|---|---|---|
| 1 | `A` | `VARCHAR(30)` | **FK → posts.id** (CASCADE) | Post ID |
| 2 | `B` | `VARCHAR(30)` | **FK → tags.id** (CASCADE) | Tag ID |

- **Unique:** `(A, B)`
- **Index:** `B`

---

## 5. Relasi Antar Tabel

### 5.1 Diagram Relasi

```mermaid
graph LR
    subgraph "Content"
        Posts["posts"]
        Pages["pages"]
        Categories["categories"]
        Tags["tags"]
    end

    subgraph "Join Tables"
        PC["_PostCategories"]
        PT["_PostTags"]
    end

    subgraph "System"
        Users["users"]
        Media["media"]
        Revisions["revisions"]
    end

    subgraph "Navigation"
        Menus["menus"]
        MenuItems["menu_items"]
    end

    subgraph "Configuration"
        Settings["site_settings"]
        Appearance["appearance"]
    end

    Users --"1:N"--> Posts
    Users --"1:N"--> Pages
    Users --"1:N"--> Media
    Users --"1:N"--> Revisions

    Posts --"M:N via"--> PC
    PC --"M:N via"--> Categories
    Posts --"M:N via"--> PT
    PT --"M:N via"--> Tags

    Posts --"1:N"--> Revisions
    Pages --"1:N"--> Revisions

    Pages --"self-ref"--> Pages
    Categories --"self-ref"--> Categories
    MenuItems --"self-ref"--> MenuItems

    Menus --"1:N (cascade)"--> MenuItems
```

### 5.2 Daftar Relasi

| # | Dari | Ke | Tipe | FK Column | On Delete | Deskripsi |
|---|---|---|---|---|---|---|
| R1 | `posts` | `users` | Many-to-One | `posts.author_id` | RESTRICT | Setiap post punya satu author |
| R2 | `pages` | `users` | Many-to-One | `pages.author_id` | RESTRICT | Setiap page punya satu author |
| R3 | `pages` | `pages` | Self-referential | `pages.parent_id` | SET NULL | Hierarchy parent-child |
| R4 | `categories` | `categories` | Self-referential | `categories.parent_id` | SET NULL | Hierarchy parent-child |
| R5 | `media` | `users` | Many-to-One | `media.uploaded_by_id` | RESTRICT | Setiap media di-upload oleh satu user |
| R6 | `menu_items` | `menus` | Many-to-One | `menu_items.menu_id` | **CASCADE** | Hapus menu → hapus semua items |
| R7 | `menu_items` | `menu_items` | Self-referential | `menu_items.parent_id` | SET NULL | Sub-menu hierarchy |
| R8 | `revisions` | `users` | Many-to-One | `revisions.author_id` | RESTRICT | Siapa yang membuat revisi |
| R9 | `revisions` | `posts` | Many-to-One | `revisions.entity_id` | **CASCADE** | Hapus post → hapus revisions |
| R10 | `revisions` | `pages` | Many-to-One | `revisions.entity_id` | **CASCADE** | Hapus page → hapus revisions |
| R11 | `posts` | `categories` | Many-to-Many | via `_PostCategories` | CASCADE | Post bisa punya banyak kategori |
| R12 | `posts` | `tags` | Many-to-Many | via `_PostTags` | CASCADE | Post bisa punya banyak tag |

---

## 6. Indexing Strategy

### 6.1 Daftar Index

| # | Tabel | Kolom | Tipe Index | Alasan |
|---|---|---|---|---|
| I1 | `users` | `email` | UNIQUE | Login lookup, cek duplikasi |
| I2 | `posts` | `slug` | UNIQUE + INDEX | URL resolution publik |
| I3 | `posts` | `status` | INDEX | Filter post by status di admin |
| I4 | `posts` | `author_id` | INDEX | Query "post milik user X" |
| I5 | `posts` | `published_at` | INDEX | Sort chronological di halaman publik |
| I6 | `pages` | `slug` | UNIQUE + INDEX | URL resolution publik |
| I7 | `pages` | `status` | INDEX | Filter page by status |
| I8 | `pages` | `parent_id` | INDEX | Query hierarchy children |
| I9 | `categories` | `slug` | UNIQUE + INDEX | URL resolution `/category/:slug` |
| I10 | `categories` | `parent_id` | INDEX | Query hierarchy children |
| I11 | `tags` | `slug` | UNIQUE + INDEX | URL resolution `/tag/:slug` |
| I12 | `media` | `mime_type` | INDEX | Filter media by type (images, videos) |
| I13 | `media` | `uploaded_by_id` | INDEX | Query "media milik user X" |
| I14 | `menu_items` | `menu_id` | INDEX | Query semua items dalam satu menu |
| I15 | `menu_items` | `parent_id` | INDEX | Query sub-menu items |
| I16 | `revisions` | `(entity_type, entity_id)` | COMPOSITE INDEX | Query revisi per entity |
| I17 | `revisions` | `author_id` | INDEX | Audit trail per user |
| I18 | `site_settings` | `key` | UNIQUE | Lookup by key |
| I19 | `appearance` | `key` | UNIQUE | Lookup by key |
| I20 | `_PostCategories` | `(A, B)` | UNIQUE + INDEX on B | Join table integrity + reverse lookup |
| I21 | `_PostTags` | `(A, B)` | UNIQUE + INDEX on B | Join table integrity + reverse lookup |

### 6.2 Performa Query yang Dioptimalkan

| Query Pattern | Index yang Digunakan | Estimasi Performance |
|---|---|---|
| Get post by slug | I2 (`posts.slug`) | O(1) — unique index scan |
| List published posts (newest first) | I3 + I5 (`status`, `published_at`) | Index-only scan, fast sort |
| Posts by author | I4 (`author_id`) | Index scan |
| Posts in category | I20 (`_PostCategories.B`) + I2 | Index join |
| Category hierarchy | I10 (`parent_id`) | Index scan, recursive CTE |
| Menu with items | I14 (`menu_id`) + I15 (`parent_id`) | Index scan |
| Revisions for post | I16 (`entity_type, entity_id`) | Composite index scan |
| Settings lookup | I18 (`key`) | O(1) — unique index scan |

---

## 7. Prisma Schema

File: `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ──────────────────────────────────────────────────

enum Role {
  ADMIN
  EDITOR
  AUTHOR
  SUBSCRIBER
}

enum PostStatus {
  DRAFT
  PUBLISHED
  PENDING
  TRASH
}

enum PageStatus {
  DRAFT
  PUBLISHED
  TRASH
}

enum MenuItemType {
  CUSTOM
  PAGE
  POST
  CATEGORY
}

// ─── MODELS ─────────────────────────────────────────────────

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified DateTime?
  password      String?
  role          Role      @default(SUBSCRIBER)
  avatar        String?
  bio           String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  posts         Post[]
  pages         Page[]
  media         Media[]
  revisions     Revision[]

  @@map("users")
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verification_tokens")
}

model Post {
  id              String     @id @default(cuid())
  title           String
  slug            String     @unique
  content         String?    @db.Text
  excerpt         String?    @db.Text
  status          PostStatus @default(DRAFT)
  featuredImage   String?
  metaTitle       String?
  metaDescription String?    @db.Text
  ogImage         String?
  publishedAt     DateTime?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  authorId   String
  author     User       @relation(fields: [authorId], references: [id])
  categories Category[] @relation("PostCategories")
  tags       Tag[]      @relation("PostTags")
  revisions  Revision[]

  @@index([slug])
  @@index([status])
  @@index([authorId])
  @@index([publishedAt])
  @@map("posts")
}

model Page {
  id              String     @id @default(cuid())
  title           String
  slug            String     @unique
  content         String?    @db.Text
  status          PageStatus @default(DRAFT)
  template        String     @default("default")
  menuOrder       Int        @default(0)
  metaTitle       String?
  metaDescription String?    @db.Text
  ogImage         String?
  publishedAt     DateTime?
  createdAt       DateTime   @default(now())
  updatedAt       DateTime   @updatedAt

  authorId  String
  author    User       @relation(fields: [authorId], references: [id])
  parentId  String?
  parent    Page?      @relation("PageHierarchy", fields: [parentId], references: [id])
  children  Page[]     @relation("PageHierarchy")
  revisions Revision[]

  @@index([slug])
  @@index([status])
  @@index([parentId])
  @@map("pages")
}

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  parentId String?
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  posts    Post[]     @relation("PostCategories")

  @@index([slug])
  @@index([parentId])
  @@map("categories")
}

model Tag {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  posts Post[] @relation("PostTags")

  @@index([slug])
  @@map("tags")
}

model Media {
  id           String   @id @default(cuid())
  filename     String
  originalName String
  mimeType     String
  size         Int
  url          String
  alt          String?
  caption      String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  uploadedById String
  uploadedBy   User @relation(fields: [uploadedById], references: [id])

  @@index([mimeType])
  @@index([uploadedById])
  @@map("media")
}

model Menu {
  id        String   @id @default(cuid())
  name      String
  location  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  items MenuItem[]

  @@map("menus")
}

model MenuItem {
  id          String       @id @default(cuid())
  label       String
  url         String?
  target      String       @default("_self")
  type        MenuItemType @default(CUSTOM)
  referenceId String?
  order       Int          @default(0)
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  menuId   String
  menu     Menu      @relation(fields: [menuId], references: [id], onDelete: Cascade)
  parentId String?
  parent   MenuItem? @relation("MenuItemHierarchy", fields: [parentId], references: [id])
  children MenuItem[] @relation("MenuItemHierarchy")

  @@index([menuId])
  @@index([parentId])
  @@map("menu_items")
}

model Revision {
  id         String   @id @default(cuid())
  entityType String
  entityId   String
  title      String
  content    String?  @db.Text
  metadata   Json?
  createdAt  DateTime @default(now())

  authorId String
  author   User @relation(fields: [authorId], references: [id])

  @@index([entityType, entityId])
  @@index([authorId])
  @@map("revisions")
}

model SiteSettings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   @db.Text
  updatedAt DateTime @updatedAt

  @@map("site_settings")
}

model Appearance {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  updatedAt DateTime @updatedAt

  @@map("appearance")
}
```

---

## 8. SQL DDL (Raw SQL)

Berikut SQL DDL untuk membuat semua tabel secara manual (tanpa Prisma migration):

```sql
-- ═══════════════════════════════════════════════════════
-- NextCMS Database Schema — PostgreSQL DDL
-- ═══════════════════════════════════════════════════════

-- Buat database
CREATE DATABASE nextcms;
\c nextcms;

-- ─── ENUM TYPES ─────────────────────────────────────

CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'AUTHOR', 'SUBSCRIBER');
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'PENDING', 'TRASH');
CREATE TYPE "PageStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'TRASH');
CREATE TYPE "MenuItemType" AS ENUM ('CUSTOM', 'PAGE', 'POST', 'CATEGORY');

-- ─── TABEL: users ───────────────────────────────────

CREATE TABLE "users" (
    "id"         VARCHAR(30)  PRIMARY KEY,
    "name"       VARCHAR(255) NOT NULL,
    "email"      VARCHAR(255) NOT NULL UNIQUE,
    "password"   VARCHAR(255) NOT NULL,
    "role"       "Role"       NOT NULL DEFAULT 'SUBSCRIBER',
    "avatar"     VARCHAR(500),
    "bio"        TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── TABEL: posts ───────────────────────────────────

CREATE TABLE "posts" (
    "id"               VARCHAR(30)   PRIMARY KEY,
    "title"            VARCHAR(255)  NOT NULL,
    "slug"             VARCHAR(255)  NOT NULL UNIQUE,
    "content"          TEXT,
    "excerpt"          TEXT,
    "status"           "PostStatus"  NOT NULL DEFAULT 'DRAFT',
    "featured_image"   VARCHAR(500),
    "meta_title"       VARCHAR(60),
    "meta_description" TEXT,
    "og_image"         VARCHAR(500),
    "published_at"     TIMESTAMP(3),
    "created_at"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id"        VARCHAR(30)   NOT NULL,

    CONSTRAINT "fk_posts_author" FOREIGN KEY ("author_id")
        REFERENCES "users"("id") ON DELETE RESTRICT
);

CREATE INDEX "idx_posts_slug" ON "posts"("slug");
CREATE INDEX "idx_posts_status" ON "posts"("status");
CREATE INDEX "idx_posts_author_id" ON "posts"("author_id");
CREATE INDEX "idx_posts_published_at" ON "posts"("published_at");

-- ─── TABEL: pages ───────────────────────────────────

CREATE TABLE "pages" (
    "id"               VARCHAR(30)   PRIMARY KEY,
    "title"            VARCHAR(255)  NOT NULL,
    "slug"             VARCHAR(255)  NOT NULL UNIQUE,
    "content"          TEXT,
    "status"           "PageStatus"  NOT NULL DEFAULT 'DRAFT',
    "template"         VARCHAR(50)   NOT NULL DEFAULT 'default',
    "menu_order"       INTEGER       NOT NULL DEFAULT 0,
    "meta_title"       VARCHAR(60),
    "meta_description" TEXT,
    "og_image"         VARCHAR(500),
    "published_at"     TIMESTAMP(3),
    "created_at"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"       TIMESTAMP(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id"        VARCHAR(30)   NOT NULL,
    "parent_id"        VARCHAR(30),

    CONSTRAINT "fk_pages_author" FOREIGN KEY ("author_id")
        REFERENCES "users"("id") ON DELETE RESTRICT,
    CONSTRAINT "fk_pages_parent" FOREIGN KEY ("parent_id")
        REFERENCES "pages"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_pages_slug" ON "pages"("slug");
CREATE INDEX "idx_pages_status" ON "pages"("status");
CREATE INDEX "idx_pages_parent_id" ON "pages"("parent_id");

-- ─── TABEL: categories ──────────────────────────────

CREATE TABLE "categories" (
    "id"          VARCHAR(30)  PRIMARY KEY,
    "name"        VARCHAR(255) NOT NULL,
    "slug"        VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_id"   VARCHAR(30),

    CONSTRAINT "fk_categories_parent" FOREIGN KEY ("parent_id")
        REFERENCES "categories"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_categories_slug" ON "categories"("slug");
CREATE INDEX "idx_categories_parent_id" ON "categories"("parent_id");

-- ─── TABEL: tags ────────────────────────────────────

CREATE TABLE "tags" (
    "id"          VARCHAR(30)  PRIMARY KEY,
    "name"        VARCHAR(255) NOT NULL,
    "slug"        VARCHAR(255) NOT NULL UNIQUE,
    "description" TEXT,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_tags_slug" ON "tags"("slug");

-- ─── TABEL: media ───────────────────────────────────

CREATE TABLE "media" (
    "id"             VARCHAR(30)  PRIMARY KEY,
    "filename"       VARCHAR(255) NOT NULL,
    "original_name"  VARCHAR(255) NOT NULL,
    "mime_type"      VARCHAR(100) NOT NULL,
    "size"           INTEGER      NOT NULL,
    "url"            VARCHAR(500) NOT NULL,
    "alt"            VARCHAR(255),
    "caption"        VARCHAR(500),
    "created_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by_id" VARCHAR(30)  NOT NULL,

    CONSTRAINT "fk_media_uploaded_by" FOREIGN KEY ("uploaded_by_id")
        REFERENCES "users"("id") ON DELETE RESTRICT
);

CREATE INDEX "idx_media_mime_type" ON "media"("mime_type");
CREATE INDEX "idx_media_uploaded_by_id" ON "media"("uploaded_by_id");

-- ─── TABEL: menus ───────────────────────────────────

CREATE TABLE "menus" (
    "id"         VARCHAR(30)  PRIMARY KEY,
    "name"       VARCHAR(255) NOT NULL,
    "location"   VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── TABEL: menu_items ──────────────────────────────

CREATE TABLE "menu_items" (
    "id"           VARCHAR(30)    PRIMARY KEY,
    "label"        VARCHAR(255)   NOT NULL,
    "url"          VARCHAR(500),
    "target"       VARCHAR(10)    NOT NULL DEFAULT '_self',
    "type"         "MenuItemType" NOT NULL DEFAULT 'CUSTOM',
    "reference_id" VARCHAR(30),
    "order"        INTEGER        NOT NULL DEFAULT 0,
    "created_at"   TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "menu_id"      VARCHAR(30)    NOT NULL,
    "parent_id"    VARCHAR(30),

    CONSTRAINT "fk_menu_items_menu" FOREIGN KEY ("menu_id")
        REFERENCES "menus"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_menu_items_parent" FOREIGN KEY ("parent_id")
        REFERENCES "menu_items"("id") ON DELETE SET NULL
);

CREATE INDEX "idx_menu_items_menu_id" ON "menu_items"("menu_id");
CREATE INDEX "idx_menu_items_parent_id" ON "menu_items"("parent_id");

-- ─── TABEL: revisions ───────────────────────────────

CREATE TABLE "revisions" (
    "id"          VARCHAR(30)  PRIMARY KEY,
    "entity_type" VARCHAR(10)  NOT NULL,
    "entity_id"   VARCHAR(30)  NOT NULL,
    "title"       VARCHAR(255) NOT NULL,
    "content"     TEXT,
    "metadata"    JSONB,
    "created_at"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "author_id"   VARCHAR(30)  NOT NULL,

    CONSTRAINT "fk_revisions_author" FOREIGN KEY ("author_id")
        REFERENCES "users"("id") ON DELETE RESTRICT
);

CREATE INDEX "idx_revisions_entity" ON "revisions"("entity_type", "entity_id");
CREATE INDEX "idx_revisions_author_id" ON "revisions"("author_id");

-- ─── TABEL: site_settings ───────────────────────────

CREATE TABLE "site_settings" (
    "id"         VARCHAR(30)  PRIMARY KEY,
    "key"        VARCHAR(100) NOT NULL UNIQUE,
    "value"      TEXT         NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── TABEL: appearance ──────────────────────────────

CREATE TABLE "appearance" (
    "id"         VARCHAR(30)  PRIMARY KEY,
    "key"        VARCHAR(100) NOT NULL UNIQUE,
    "value"      JSONB        NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ─── JOIN TABLES ────────────────────────────────────

CREATE TABLE "_PostCategories" (
    "A" VARCHAR(30) NOT NULL,
    "B" VARCHAR(30) NOT NULL,

    CONSTRAINT "fk_post_categories_post" FOREIGN KEY ("A")
        REFERENCES "posts"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_post_categories_category" FOREIGN KEY ("B")
        REFERENCES "categories"("id") ON DELETE CASCADE,

    UNIQUE("A", "B")
);

CREATE INDEX "idx_post_categories_b" ON "_PostCategories"("B");

CREATE TABLE "_PostTags" (
    "A" VARCHAR(30) NOT NULL,
    "B" VARCHAR(30) NOT NULL,

    CONSTRAINT "fk_post_tags_post" FOREIGN KEY ("A")
        REFERENCES "posts"("id") ON DELETE CASCADE,
    CONSTRAINT "fk_post_tags_tag" FOREIGN KEY ("B")
        REFERENCES "tags"("id") ON DELETE CASCADE,

    UNIQUE("A", "B")
);

CREATE INDEX "idx_post_tags_b" ON "_PostTags"("B");
```

---

## 9. Seed Data

### 9.1 Seed Script (`prisma/seed.ts`)

```typescript
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── 1. Admin User ───────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@nextcms.local" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@nextcms.local",
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // ─── 2. Default Category ─────────────────────────
  const uncategorized = await prisma.category.upsert({
    where: { slug: "uncategorized" },
    update: {},
    create: {
      name: "Uncategorized",
      slug: "uncategorized",
      description: "Default category for posts",
    },
  });
  console.log("✅ Default category created:", uncategorized.name);

  // ─── 3. Site Settings ────────────────────────────
  const settings = [
    { key: "site_title",              value: "NextCMS" },
    { key: "site_tagline",            value: "Just another NextCMS site" },
    { key: "site_url",                value: "http://localhost:3000" },
    { key: "admin_email",             value: "admin@nextcms.local" },
    { key: "language",                value: "id" },
    { key: "timezone",                value: "Asia/Jakarta" },
    { key: "date_format",             value: "DD/MM/YYYY" },
    { key: "time_format",             value: "HH:mm" },
    { key: "posts_per_page",          value: "10" },
    { key: "registration_open",       value: "true" },
    { key: "default_role",            value: "SUBSCRIBER" },
    { key: "permalink_structure",     value: "/blog/:slug" },
    { key: "category_base",           value: "category" },
    { key: "tag_base",                value: "tag" },
    { key: "seo_title_template",      value: "%title% - %sitename%" },
    { key: "seo_default_description", value: "" },
    { key: "seo_og_image",            value: "" },
    { key: "seo_robots_txt",          value: "User-agent: *\nAllow: /" },
    { key: "seo_sitemap_enabled",     value: "true" },
    { key: "seo_analytics_id",        value: "" },
    { key: "social_facebook",         value: "" },
    { key: "social_twitter",          value: "" },
    { key: "social_instagram",        value: "" },
  ];

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`✅ ${settings.length} site settings created`);

  // ─── 4. Appearance Settings ──────────────────────
  const appearances = [
    { key: "logo",             value: null },
    { key: "favicon",          value: null },
    { key: "primary_color",    value: "#00704A" },
    { key: "secondary_color",  value: "#1E3932" },
    { key: "font_family",      value: "Inter" },
    { key: "header_style",     value: "left-aligned" },
    { key: "sidebar_position", value: "right" },
    { key: "footer_text",      value: "© 2026 NextCMS. All rights reserved." },
    { key: "custom_css",       value: "" },
    { key: "custom_head",      value: "" },
    { key: "custom_footer",    value: "" },
  ];

  for (const appearance of appearances) {
    await prisma.appearance.upsert({
      where: { key: appearance.key },
      update: { value: appearance.value },
      create: appearance,
    });
  }
  console.log(`✅ ${appearances.length} appearance settings created`);

  // ─── 5. Default Menu ─────────────────────────────
  const primaryMenu = await prisma.menu.upsert({
    where: { id: "default-primary-menu" },
    update: {},
    create: {
      id: "default-primary-menu",
      name: "Primary Menu",
      location: "header",
      items: {
        create: [
          { label: "Home", url: "/", type: "CUSTOM", order: 0 },
          { label: "Blog", url: "/blog", type: "CUSTOM", order: 1 },
        ],
      },
    },
  });
  console.log("✅ Default menu created:", primaryMenu.name);

  // ─── 6. Sample Post (Hello World) ────────────────
  await prisma.post.upsert({
    where: { slug: "hello-world" },
    update: {},
    create: {
      title: "Hello World",
      slug: "hello-world",
      content: "<p>Welcome to NextCMS. This is your first post. Edit or delete it, then start writing!</p>",
      excerpt: "Welcome to NextCMS. This is your first post.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
      categories: {
        connect: [{ id: uncategorized.id }],
      },
    },
  });
  console.log("✅ Sample post created: Hello World");

  // ─── 7. Sample Page (About) ──────────────────────
  await prisma.page.upsert({
    where: { slug: "about" },
    update: {},
    create: {
      title: "About",
      slug: "about",
      content: "<p>This is a sample page. You can edit this to tell visitors about your site.</p>",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
    },
  });
  console.log("✅ Sample page created: About");

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### 9.2 Konfigurasi Seed di `package.json`

```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
}
```

### 9.3 Perintah Seed

```bash
# Jalankan migration + seed
npx prisma migrate dev --name init
npx prisma db seed
```

---

## 10. Query Patterns

Contoh query Prisma yang umum digunakan di aplikasi:

### 10.1 Post — List dengan Relasi

```typescript
// Daftar post published dengan pagination
const posts = await prisma.post.findMany({
  where: { status: "PUBLISHED" },
  include: {
    author: { select: { id: true, name: true, avatar: true } },
    categories: { select: { id: true, name: true, slug: true } },
    tags: { select: { id: true, name: true, slug: true } },
  },
  orderBy: { publishedAt: "desc" },
  skip: (page - 1) * limit,
  take: limit,
});
```

### 10.2 Post — Get by Slug (Public)

```typescript
const post = await prisma.post.findUnique({
  where: { slug: "hello-world", status: "PUBLISHED" },
  include: {
    author: { select: { id: true, name: true, avatar: true, bio: true } },
    categories: true,
    tags: true,
  },
});
```

### 10.3 Category — Hierarchical Tree

```typescript
// Semua kategori dengan parent-child structure
const categories = await prisma.category.findMany({
  where: { parentId: null },  // root categories
  include: {
    children: {
      include: {
        children: true,       // 2 level deep
        _count: { select: { posts: true } },
      },
      orderBy: { name: "asc" },
    },
    _count: { select: { posts: true } },
  },
  orderBy: { name: "asc" },
});
```

### 10.4 Menu — Nested Items

```typescript
const menu = await prisma.menu.findFirst({
  where: { location: "header" },
  include: {
    items: {
      where: { parentId: null },  // root items only
      include: {
        children: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    },
  },
});
```

### 10.5 Revision — Create on Post Update

```typescript
// Snapshot sebelum update
const currentPost = await prisma.post.findUnique({
  where: { id: postId },
  include: { categories: true, tags: true },
});

// Buat revisi
await prisma.revision.create({
  data: {
    entityType: "POST",
    entityId: postId,
    title: currentPost.title,
    content: currentPost.content,
    metadata: {
      status: currentPost.status,
      excerpt: currentPost.excerpt,
      featuredImage: currentPost.featuredImage,
      metaTitle: currentPost.metaTitle,
      metaDescription: currentPost.metaDescription,
      categoryIds: currentPost.categories.map(c => c.id),
      tagIds: currentPost.tags.map(t => t.id),
    },
    authorId: userId,
  },
});

// Cleanup: hapus revisi lama jika > 25
const count = await prisma.revision.count({
  where: { entityType: "POST", entityId: postId },
});
if (count > 25) {
  const oldest = await prisma.revision.findMany({
    where: { entityType: "POST", entityId: postId },
    orderBy: { createdAt: "asc" },
    take: count - 25,
    select: { id: true },
  });
  await prisma.revision.deleteMany({
    where: { id: { in: oldest.map(r => r.id) } },
  });
}
```

### 10.6 Dashboard — Aggregate Stats

```typescript
const [posts, pages, categories, tags, media, users] = await Promise.all([
  prisma.post.count({ where: { status: { not: "TRASH" } } }),
  prisma.page.count({ where: { status: { not: "TRASH" } } }),
  prisma.category.count(),
  prisma.tag.count(),
  prisma.media.count(),
  prisma.user.count(),
]);
```

### 10.7 Settings — Bulk Read

```typescript
// Baca semua settings sebagai key-value object
const rows = await prisma.siteSettings.findMany();
const settings = Object.fromEntries(rows.map(r => [r.key, r.value]));
// → { site_title: "NextCMS", site_tagline: "...", ... }
```

---

*Dokumen ini merupakan referensi lengkap database schema untuk NextCMS. Gunakan bersama [PRD.md](./PRD.md) dan [TDD.md](./TDD.md) sebagai panduan implementasi.*
