# 📋 Product Requirements Document (PRD)

## **NextCMS — Content Management System**

> CMS modern berbasis Next.js dengan fungsionalitas lengkap seperti WordPress, dilengkapi Rich Text Editor, manajemen media, dan dashboard admin yang profesional.

---

## 1. Ringkasan Produk

| Item | Detail |
| --- | --- |
| **Nama Produk** | NextCMS |
| **Tipe** | Content Management System (CMS) |
| **Framework** | Next.js (App Router) |
| **Database** | PostgreSQL |
| **UI Library** | shadcn/UI |
| **Design System** | Starbucks (via `npx designdotmd add starbucks`) |
| **Auth** | NextAuth.js (session-based) |
| **Editor** | Rich Text Editor (Tiptap) |
| **Target** | Admin/Editor yang memerlukan CMS self-hosted modern |

---

## 2. Tech Stack

| Layer | Teknologi |
| --- | --- |
| **Frontend** | Next.js 14+ (App Router), React 18+, TypeScript |
| **UI Components** | shadcn/UI |
| **Design Guideline** | Starbucks Design System (`npx designdotmd add starbucks`) |
| **Styling** | Tailwind CSS (required by shadcn/UI) |
| **Rich Text Editor** | Tiptap (headless, extensible) |
| **Backend/API** | Next.js API Routes / Server Actions |
| **Database** | PostgreSQL (user: `postgres`, password: `181818`) |
| **ORM** | Prisma |
| **Authentication** | NextAuth.js (session-based) |
| **File Upload** | Local storage (folder `public/uploads`) |
| **Validasi** | Zod |
| **Icon Library** | Material UI Icons (`@mui/icons-material`) — semua icon di aplikasi menggunakan MUI Icons, bukan emoji |
| **State Management** | React Server Components + React Query (untuk client-side) |

---

## 3. Arsitektur Sistem

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        Browser["Browser"]
    end

    subgraph NextJS["⚡ Next.js App"]
        subgraph Pages["Pages (App Router)"]
            PublicPages["Public Pages<br/>(Homepage, Posts, Pages)"]
            AdminDashboard["Admin Dashboard"]
            LoginPage["Login / Register"]
        end

        subgraph API["API Layer"]
            ServerActions["Server Actions"]
            APIRoutes["API Routes"]
            NextAuthAPI["NextAuth API"]
        end

        subgraph Services["Service Layer"]
            PageService["Page Service"]
            PostService["Post Service"]
            CategoryService["Category Service"]
            TagService["Tag Service"]
            MediaService["Media Service"]
            UserService["User Service"]
            MenuService["Menu Service"]
            AppearanceService["Appearance Service"]
            SettingsService["Settings Service"]
            SEOService["SEO Service"]
            RevisionService["Revision Service"]
        end
    end

    subgraph Data["💾 Data Layer"]
        Prisma["Prisma ORM"]
        PostgreSQL["PostgreSQL Database"]
        FileStorage["Local File Storage<br/>(public/uploads)"]
    end

    Browser --> Pages
    Pages --> API
    API --> Services
    Services --> Prisma
    Prisma --> PostgreSQL
    MediaService --> FileStorage
```

---

## 4. Database Schema (ERD)

```mermaid
erDiagram
    User {
        string id PK
        string name
        string email UK
        string password
        enum role "ADMIN, EDITOR, AUTHOR, SUBSCRIBER"
        string avatar
        string bio
        datetime createdAt
        datetime updatedAt
    }

    Post {
        string id PK
        string title
        string slug UK
        text content
        text excerpt
        enum status "DRAFT, PUBLISHED, PENDING, TRASH"
        string featuredImage
        string authorId FK
        string metaTitle
        string metaDescription
        string ogImage
        string permalink
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    Page {
        string id PK
        string title
        string slug UK
        text content
        enum status "DRAFT, PUBLISHED, TRASH"
        string template
        int menuOrder
        string parentId FK
        string authorId FK
        string metaTitle
        string metaDescription
        string ogImage
        string permalink
        datetime publishedAt
        datetime createdAt
        datetime updatedAt
    }

    Category {
        string id PK
        string name
        string slug UK
        string description
        string parentId FK
        datetime createdAt
        datetime updatedAt
    }

    Tag {
        string id PK
        string name
        string slug UK
        string description
        datetime createdAt
        datetime updatedAt
    }

    Media {
        string id PK
        string filename
        string originalName
        string mimeType
        int size
        string url
        string alt
        string caption
        string uploadedById FK
        datetime createdAt
        datetime updatedAt
    }

    Menu {
        string id PK
        string name
        string location
        datetime createdAt
        datetime updatedAt
    }

    MenuItem {
        string id PK
        string menuId FK
        string label
        string url
        string target
        enum type "CUSTOM, PAGE, POST, CATEGORY"
        string referenceId
        string parentId FK
        int order
        datetime createdAt
        datetime updatedAt
    }

    Revision {
        string id PK
        string entityType "POST, PAGE"
        string entityId FK
        string title
        text content
        json metadata
        string authorId FK
        datetime createdAt
    }

    SiteSettings {
        string id PK
        string key UK
        text value
        datetime updatedAt
    }

    Appearance {
        string id PK
        string key UK
        json value
        datetime updatedAt
    }

    Post ||--o{ Category : "many-to-many"
    Post ||--o{ Tag : "many-to-many"
    Post }o--|| User : "author"
    Page }o--|| User : "author"
    Page }o--o| Page : "parent"
    Category }o--o| Category : "parent"
    Media }o--|| User : "uploadedBy"
    Menu ||--o{ MenuItem : "has"
    MenuItem }o--o| MenuItem : "parent"
    Post ||--o{ Revision : "has"
    Page ||--o{ Revision : "has"
    Revision }o--|| User : "author"
```

---

## 5. Struktur Folder Proyek

```
nextcms/
├── docs/
│   └── PRD.md
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts                     # Seed admin user & default settings
│   └── migrations/
├── public/
│   └── uploads/                    # Media uploads
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Halaman Login
│   │   │   └── register/
│   │   │       └── page.tsx        # Halaman Register
│   │   ├── (public)/
│   │   │   ├── page.tsx            # Homepage publik
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx        # Halaman/Page publik
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx        # Daftar post
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Detail post
│   │   │   └── category/
│   │   │       └── [slug]/
│   │   │           └── page.tsx    # Post per kategori
│   │   ├── admin/
│   │   │   ├── layout.tsx          # Admin layout (sidebar + header)
│   │   │   ├── page.tsx            # Dashboard
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx        # Daftar posts
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # Buat post baru
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit post
│   │   │   ├── pages/
│   │   │   │   ├── page.tsx        # Daftar pages
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx    # Buat page baru
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit page
│   │   │   ├── categories/
│   │   │   │   └── page.tsx        # Kelola kategori
│   │   │   ├── tags/
│   │   │   │   └── page.tsx        # Kelola tags
│   │   │   ├── media/
│   │   │   │   └── page.tsx        # Media library
│   │   │   ├── menus/
│   │   │   │   └── page.tsx        # Kelola menu
│   │   │   ├── users/
│   │   │   │   ├── page.tsx        # Daftar users
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx # Edit user profile
│   │   │   ├── appearance/
│   │   │   │   └── page.tsx        # Pengaturan tampilan
│   │   │   ├── settings/
│   │   │   │   ├── general/
│   │   │   │   │   └── page.tsx    # Pengaturan umum situs
│   │   │   │   ├── seo/
│   │   │   │   │   └── page.tsx    # Pengaturan SEO global
│   │   │   │   └── permalinks/
│   │   │   │       └── page.tsx    # Pengaturan permalink
│   │   │   └── revisions/
│   │   │       └── [entityType]/
│   │   │           └── [entityId]/
│   │   │               └── page.tsx # History revisi
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts    # NextAuth handler
│   │   │   └── upload/
│   │   │       └── route.ts        # Media upload endpoint
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                     # shadcn/UI components
│   │   ├── admin/
│   │   │   ├── sidebar.tsx         # Admin sidebar navigation
│   │   │   ├── header.tsx          # Admin header
│   │   │   ├── dashboard/
│   │   │   │   ├── stats-cards.tsx
│   │   │   │   ├── recent-posts.tsx
│   │   │   │   ├── quick-draft.tsx
│   │   │   │   └── activity-log.tsx
│   │   │   ├── data-table.tsx      # Reusable data table
│   │   │   └── media-picker.tsx    # Media picker modal
│   │   ├── editor/
│   │   │   ├── rich-text-editor.tsx # Tiptap editor utama
│   │   │   ├── toolbar.tsx         # Editor toolbar
│   │   │   └── extensions/         # Custom Tiptap extensions
│   │   ├── auth/
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   └── public/
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       └── post-card.tsx
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── auth.ts                 # NextAuth config
│   │   ├── utils.ts                # Utility functions
│   │   ├── validators/             # Zod schemas
│   │   │   ├── post.ts
│   │   │   ├── page.ts
│   │   │   ├── category.ts
│   │   │   ├── tag.ts
│   │   │   ├── user.ts
│   │   │   └── settings.ts
│   │   └── constants.ts            # App constants
│   ├── actions/                    # Server Actions
│   │   ├── post.ts
│   │   ├── page.ts
│   │   ├── category.ts
│   │   ├── tag.ts
│   │   ├── media.ts
│   │   ├── menu.ts
│   │   ├── user.ts
│   │   ├── appearance.ts
│   │   ├── settings.ts
│   │   └── revision.ts
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-media-picker.ts
│   │   └── use-debounce.ts
│   └── types/                      # TypeScript types
│       └── index.ts
├── .env                            # Environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 6. Fitur Detail

### 6.1 🔐 Autentikasi (Login & Register)

**Teknologi:** NextAuth.js (session-based)

#### Halaman Login
- Form fields: Email, Password
- Tombol "Remember me"
- Link ke halaman Register
- Validasi form real-time dengan Zod
- Error handling (kredensial salah, akun tidak ditemukan)
- Tombol Login via SSO (Google, GitHub)
- Design profesional dengan branding Starbucks design system
- Redirect ke dashboard setelah login berhasil

#### Halaman Register
- Form fields: Nama, Email, Password, Konfirmasi Password
- Tombol Register via SSO (Google, GitHub)
- Validasi password strength
- Cek duplikasi email
- Default role: `SUBSCRIBER`
- Design konsisten dengan halaman Login

#### Konfigurasi NextAuth
- Provider: Credentials (email + password), Google, GitHub (SSO)
- Session strategy: JWT-based session
- Callbacks: session, jwt (include user role)
- Sinkronisasi akun SSO dengan database (tabel Accounts & Sessions)
- Protected routes via middleware

#### Default Admin User (Seed)
| Field | Value |
|---|---|
| Name | Admin |
| Email | admin@nextcms.local |
| Password | `admin123` (hashed via bcrypt) |
| Role | ADMIN |

---

### 6.2 📊 Dashboard

Dashboard utama menampilkan ringkasan informasi situs, mirip dengan dashboard WordPress.

#### Widget/Cards yang ditampilkan:

| Widget | Deskripsi |
|---|---|
| **At a Glance** | Jumlah total Posts, Pages, Categories, Tags, Media, Users |
| **Quick Draft** | Form cepat untuk membuat draft post baru |
| **Recent Posts** | 5 post terbaru dengan status dan tanggal |
| **Recent Activity** | Log aktivitas terbaru (post dibuat, diupdate, dihapus) |
| **Content Stats** | Grafik statistik post per bulan (bar chart) |
| **Draft Posts** | Daftar draft yang belum dipublish |

#### Layout Dashboard:
- Grid 2-3 kolom responsive
- Cards menggunakan komponen shadcn/UI `Card`
- Statistik angka dengan icon dan warna berbeda
- Grafik menggunakan Recharts

---

### 6.3 📝 Kelola Post

Manajemen post/artikel seperti WordPress.

#### Daftar Post (`/admin/posts`)
- Tabel data dengan kolom: Title, Author, Categories, Tags, Status, Date
- Filter: All, Published, Draft, Pending, Trash
- Bulk actions: Publish, Move to Trash, Delete Permanently
- Search post by title
- Pagination
- Sortable columns

#### Buat/Edit Post (`/admin/posts/new`, `/admin/posts/[id]/edit`)

**Panel Utama (Kiri - 70%):**
- Input Title (large font)
- Permalink/slug editor (auto-generate dari title, editable)
- Rich Text Editor (Tiptap) dengan fitur:
  - Heading (H1-H6)
  - Bold, Italic, Underline, Strikethrough
  - Ordered & Unordered Lists
  - Blockquote
  - Code block (syntax highlighting)
  - Image insert (dari Media Library)
  - Link insert/edit
  - Table
  - Horizontal Rule
  - Undo/Redo
  - Text alignment
  - Text color
  - Embed (YouTube, dll)

**Sidebar Kanan (30%):**
- **Publish Box**: Status (Draft/Published/Pending), Visibility, Publish date, tombol Save Draft / Publish
- **Categories**: Checklist categories (hierarchical) + "Add New Category"
- **Tags**: Tag input dengan autocomplete + "Add New Tag"
- **Featured Image**: Upload/pilih dari Media Library
- **SEO Settings**: Meta Title, Meta Description, OG Image
- **Excerpt**: Textarea untuk custom excerpt
- **Revision History**: Link ke halaman revisi

#### Auto-save:
- Auto-save draft setiap 60 detik saat editing
- Simpan revisi setiap kali post di-update

---

### 6.4 📄 Kelola Halaman (Pages)

Manajemen halaman statis mirip WordPress.

#### Daftar Pages (`/admin/pages`)
- Tabel: Title, Author, Status, Date
- Hierarchical display (parent-child indentation)
- Filter: All, Published, Draft, Trash
- Quick Edit (inline edit title, slug, status)
- Bulk actions

#### Buat/Edit Page (`/admin/pages/new`, `/admin/pages/[id]/edit`)
- Sama seperti post editor, dengan tambahan:
  - **Page Attributes (sidebar)**:
    - Parent page dropdown (hierarchical)
    - Template dropdown (Default, Full Width, Sidebar)
    - Menu Order (number input)
  - Tidak ada Categories & Tags
  - SEO Settings sama seperti Post

---

### 6.5 📂 Kelola Kategori

#### Halaman Kategori (`/admin/categories`)

**Layout 2 kolom:**

**Kolom Kiri - Form Tambah Kategori:**
- Name
- Slug (auto-generate, editable)
- Parent Category (dropdown hierarchical)
- Description (textarea)

**Kolom Kanan - Tabel Kategori:**
- Kolom: Name (hierarchical indent), Description, Slug, Count (jumlah post)
- Inline edit
- Delete (dengan konfirmasi)
- Search

---

### 6.6 🏷️ Kelola Tags

#### Halaman Tags (`/admin/tags`)

**Layout 2 kolom (mirip Kategori):**

**Kolom Kiri - Form Tambah Tag:**
- Name
- Slug (auto-generate, editable)
- Description (textarea)

**Kolom Kanan - Tabel Tags:**
- Kolom: Name, Description, Slug, Count
- Inline edit, Delete, Search

---

### 6.7 🖼️ Kelola Media (Media Library)

#### Halaman Media (`/admin/media`)

**2 mode tampilan:**
1. **Grid View**: Thumbnail grid (default)
2. **List View**: Tabel detail

**Fitur Upload:**
- Drag & drop area
- Multi-file upload
- Progress indicator
- Supported types: Images (jpg, png, gif, webp, svg), Video (mp4, webm), Documents (pdf, doc, docx)
- Max file size: 10MB (configurable)
- Auto-generate thumbnail untuk images

**Detail Media (Modal/Sidebar):**
- Preview image/file
- Fields: Title, Alt Text, Caption, Description
- File info: Filename, Type, Size, Dimensions, Upload date, Uploaded by
- URL copy button
- Delete button

**Media Picker (reusable component):**
- Digunakan di Post/Page editor untuk insert gambar
- Modal dialog dengan tab: Upload New / Media Library
- Search & filter media
- Select single/multiple

---

### 6.8 👥 Kelola User

#### Daftar Users (`/admin/users`)
- Tabel: Avatar, Name, Email, Role, Posts count, Date registered
- Filter by role
- Search by name/email
- Bulk actions: Change Role, Delete

#### Edit User (`/admin/users/[id]/edit`)
- Name, Email
- Role dropdown (Admin, Editor, Author, Subscriber)
- Password change (optional)
- Avatar upload
- Bio (textarea)
- Profile disimpan

#### Role & Permissions:

| Permission | Admin | Editor | Author | Subscriber |
|---|:---:|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Create/Edit own posts | ✅ | ✅ | ✅ | ❌ |
| Publish own posts | ✅ | ✅ | ❌ | ❌ |
| Edit/Delete all posts | ✅ | ✅ | ❌ | ❌ |
| Manage pages | ✅ | ✅ | ❌ | ❌ |
| Manage categories/tags | ✅ | ✅ | ❌ | ❌ |
| Upload media | ✅ | ✅ | ✅ | ❌ |
| Manage all media | ✅ | ✅ | ❌ | ❌ |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| Manage menus | ✅ | ✅ | ❌ | ❌ |
| Manage appearance | ✅ | ❌ | ❌ | ❌ |
| Manage settings | ✅ | ❌ | ❌ | ❌ |
| Edit own profile | ✅ | ✅ | ✅ | ✅ |

---

### 6.9 🎨 Kelola Tampilan (Appearance)

#### Halaman Appearance (`/admin/appearance`)

**Pengaturan yang tersedia:**

| Setting | Deskripsi | Tipe Input |
|---|---|---|
| Site Logo | Logo situs | Media picker |
| Favicon | Favicon situs | Media picker |
| Primary Color | Warna utama tema | Color picker |
| Secondary Color | Warna sekunder | Color picker |
| Font Family | Font heading & body | Dropdown |
| Header Style | Layout header publik | Radio (Centered, Left-aligned, Minimal) |
| Footer Text | Teks copyright footer | Textarea |
| Footer Widgets | Widget di footer | Toggle + config |
| Sidebar Position | Posisi sidebar halaman publik | Radio (Left, Right, None) |
| Custom CSS | CSS kustom tambahan | Code editor (textarea) |
| Custom Header Script | Script tambahan di `<head>` | Textarea |
| Custom Footer Script | Script tambahan sebelum `</body>` | Textarea |

---

### 6.10 📋 Kelola Menu

#### Halaman Menu (`/admin/menus`)

**Fitur:**
- Buat multiple menu (Primary, Footer, Sidebar, dll)
- Assign menu ke lokasi: Header, Footer, Sidebar
- Drag & drop reorder menu items
- Nested/hierarchical menu items (sub-menu)
- Tipe menu item:
  - Custom Link (URL + Label)
  - Page (pilih dari daftar pages)
  - Post (pilih dari daftar posts)
  - Category (pilih dari daftar categories)
- Edit label & atribut setiap item (target: _blank, CSS class)
- Delete menu item
- Preview menu structure

**UI:**
- Panel kiri: Sumber item (Pages, Posts, Categories, Custom Links)
- Panel kanan: Struktur menu (drag & drop tree)
- Dropdown pilih menu / buat baru
- Dropdown assign lokasi menu

---

### 6.11 🔗 Pengaturan Permalink

#### Halaman Permalink (`/admin/settings/permalinks`)

**Struktur permalink yang tersedia:**

| Nama | Pola | Contoh |
|---|---|---|
| Plain | `/?p=123` | `/?p=123` |
| Post Name | `/blog/:slug` | `/blog/hello-world` |
| Day and Name | `/blog/:year/:month/:day/:slug` | `/blog/2026/07/11/hello-world` |
| Month and Name | `/blog/:year/:month/:slug` | `/blog/2026/07/hello-world` |
| Custom | User-defined pattern | `/artikel/:slug` |

**Pengaturan tambahan:**
- Category base (default: `category`)
- Tag base (default: `tag`)
- Page base (default: kosong, langsung `/:slug`)

---

### 6.12 🔍 Pengaturan SEO

#### SEO Global (`/admin/settings/seo`)

| Setting | Deskripsi |
|---|---|
| Default Meta Title Template | Template untuk `<title>` (e.g., `%title% - %sitename%`) |
| Default Meta Description | Deskripsi default situs |
| OG Image Default | Gambar default untuk Open Graph |
| Robots.txt Content | Konten file robots.txt |
| Generate Sitemap | Toggle auto-generate sitemap.xml |
| Google Analytics ID | Tracking ID Google Analytics |
| Social Profiles | URL profil sosial media (Facebook, Twitter, Instagram) |

#### SEO Per Post/Page (di editor sidebar):
- Meta Title (override)
- Meta Description (override)
- OG Image (override)
- Preview snippet (seperti Google search result)
- Canonical URL (optional)

---

### 6.13 ⚙️ Pengaturan Umum Situs

#### General Settings (`/admin/settings/general`)

| Setting | Deskripsi | Default |
|---|---|---|
| Site Title | Nama situs | "NextCMS" |
| Tagline | Deskripsi singkat situs | "Just another NextCMS site" |
| Site URL | URL utama situs | `http://localhost:3000` |
| Admin Email | Email admin utama | `admin@nextcms.local` |
| Language | Bahasa situs | Indonesian |
| Timezone | Zona waktu | Asia/Jakarta |
| Date Format | Format tanggal | DD/MM/YYYY |
| Time Format | Format waktu | HH:mm |
| Posts Per Page | Jumlah post per halaman | 10 |
| Registration Open | Izinkan registrasi publik | true |
| Default User Role | Role default user baru | Subscriber |

---

### 6.14 📜 Revision History

Setiap post dan page menyimpan history perubahan.

#### Fitur Revision:
- Otomatis menyimpan revisi setiap kali post/page di-update (save/publish)
- Informasi per revisi:
  - Tanggal & waktu
  - Author yang melakukan perubahan
  - Snapshot title & content
  - Metadata (status, categories, tags, dll)
- **Revision Viewer** (`/admin/revisions/[entityType]/[entityId]`):
  - Timeline/list semua revisi
  - Side-by-side diff comparison (current vs selected revision)
  - Highlight perubahan (added = hijau, removed = merah)
  - Tombol "Restore this revision" untuk rollback
- Link ke revision history dari editor sidebar
- Batasan: menyimpan maksimal 25 revisi per entity (konfigurable)

---

## 7. Admin Layout & Navigasi

### Sidebar Navigation:

```
┌──────────────────────────────────────────────────────┐
│  <Hub /> NextCMS                                     │
│  ──────────────────────────────────────────────────  │
│  <Dashboard /> Dashboard                             │
│  <Article /> Posts                                   │
│     ├── All Posts                                    │
│     └── Add New                                      │
│  <Description /> Pages                               │
│     ├── All Pages                                    │
│     └── Add New                                      │
│  <Folder /> Categories                               │
│  <LocalOffer /> Tags                                 │
│  <PermMedia /> Media                                 │
│  <Menu /> Menus                                      │
│  <Group /> Users                                     │
│     ├── All Users                                    │
│     └── Add New                                      │
│  <Palette /> Appearance                              │
│  <Settings /> Settings                               │
│     ├── General                                      │
│     ├── SEO                                          │
│     └── Permalinks                                   │
│  ──────────────────────────────────────────────────  │
│  <AccountCircle /> Admin User                        │
│     ├── Profile                                      │
│     └── Logout                                       │
└──────────────────────────────────────────────────────┘
```

> **Catatan:** Semua icon di atas menggunakan komponen dari `@mui/icons-material`. Contoh import: `import { Dashboard, Article, Settings } from '@mui/icons-material';`

### Admin Header:
- Breadcrumb navigation
- Quick search (global search posts/pages/users)
- Notification bell (jika ada)
- User avatar dropdown (Profile, Logout)
- Link "Visit Site" (buka halaman publik)

---

## 8. Halaman Publik (Frontend)

### 8.1 Homepage
- Header dengan navigasi (dari Menu management)
- Hero section / Latest posts grid
- Sidebar (categories, recent posts, tags cloud)
- Footer dengan info situs

### 8.2 Blog Listing (`/blog`)
- Post cards grid/list
- Pagination
- Sidebar

### 8.3 Single Post (`/blog/:slug`)
- Title, Featured Image, Content
- Author info, Date, Categories, Tags
- Related posts
- Meta tags (SEO)

### 8.4 Single Page (`/:slug`)
- Title, Content
- Mengikuti template yang dipilih (Full Width / With Sidebar)

### 8.5 Category Archive (`/category/:slug`)
- Post list filtered by category
- Category description

### 8.6 Tag Archive (`/tag/:slug`)
- Post list filtered by tag

---

## 9. Environment Variables

```env
# Database
DATABASE_URL="postgresql://postgres:181818@localhost:5432/nextcms"

# NextAuth
NEXTAUTH_SECRET="generate-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Upload
UPLOAD_DIR="public/uploads"
MAX_FILE_SIZE="10485760"

# App
NEXT_PUBLIC_APP_NAME="NextCMS"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 10. Rencana Implementasi (Phases)

### Phase 1: Foundation (Hari 1-2)
- [ ] Inisialisasi proyek Next.js
- [ ] Setup shadcn/UI + Starbucks design system
- [ ] Setup Prisma + PostgreSQL schema
- [ ] Setup NextAuth.js (credentials provider)
- [ ] Seed database (admin user, default settings)
- [ ] Halaman Login & Register
- [ ] Admin layout (sidebar, header)
- [ ] Route protection middleware

### Phase 2: Core Content (Hari 3-5)
- [ ] Rich Text Editor (Tiptap) component
- [ ] CRUD Posts (list, create, edit, delete)
- [ ] CRUD Pages (list, create, edit, delete)
- [ ] CRUD Categories (with hierarchy)
- [ ] CRUD Tags
- [ ] Auto-generate slug
- [ ] Status management (Draft, Published, Trash)

### Phase 3: Media & Relations (Hari 6-7)
- [ ] Media upload (drag & drop, multi-file)
- [ ] Media library (grid & list view)
- [ ] Media picker component (reusable)
- [ ] Featured image untuk posts/pages
- [ ] Post-Category relationship
- [ ] Post-Tag relationship

### Phase 4: Advanced Features (Hari 8-10)
- [ ] Menu management (CRUD, drag & drop ordering)
- [ ] User management (CRUD, roles)
- [ ] Role-based access control
- [ ] Revision history (save, view, diff, restore)
- [ ] SEO settings (global + per post/page)
- [ ] Permalink settings

### Phase 5: Appearance & Settings (Hari 11-12)
- [ ] General site settings
- [ ] Appearance settings (logo, colors, fonts)
- [ ] Custom CSS/scripts
- [ ] Dashboard widgets & statistics

### Phase 6: Public Frontend (Hari 13-14)
- [ ] Homepage
- [ ] Blog listing & single post
- [ ] Static pages
- [ ] Category & tag archives
- [ ] Dynamic menus
- [ ] SEO meta tags rendering
- [ ] Responsive design

### Phase 7: Polish & Testing (Hari 15-16)
- [ ] Error handling & loading states
- [ ] Toast notifications
- [ ] Responsive design audit
- [ ] Performance optimization
- [ ] Bug fixes & edge cases

---

## 11. Komponen UI (shadcn/UI) yang Digunakan

| Komponen | Penggunaan |
|---|---|
| `Button` | Semua tombol aksi |
| `Input` | Form fields |
| `Textarea` | Deskripsi, excerpt, bio |
| `Select` | Dropdown (role, status, parent) |
| `Checkbox` | Bulk actions, categories |
| `Dialog` | Konfirmasi delete, media picker |
| `Sheet` | Mobile sidebar |
| `Card` | Dashboard widgets, stats |
| `Table` | Data tables (posts, pages, users) |
| `Tabs` | Settings pages, media view modes |
| `Badge` | Status labels (Published, Draft) |
| `Avatar` | User avatars |
| `Breadcrumb` | Navigation breadcrumbs |
| `DropdownMenu` | User menu, actions menu |
| `Toast` | Notifications |
| `Separator` | Dividers |
| `Skeleton` | Loading states |
| `Command` | Quick search (Cmd+K) |
| `Calendar` | Date picker (publish date) |
| `Switch` | Toggle settings |
| `Label` | Form labels |
| `AlertDialog` | Konfirmasi aksi destructive |
| `Popover` | Color picker, date picker |
| `Tooltip` | Informasi bantuan |
| `ScrollArea` | Scrollable containers |
| `Collapsible` | Sidebar sub-menu |
| `Progress` | Upload progress |

### Icon Library — Material UI Icons (`@mui/icons-material`)

Semua icon di aplikasi **wajib** menggunakan Material UI Icons. Tidak diperkenankan menggunakan emoji atau icon library lain.

| Icon | Komponen MUI | Penggunaan |
|---|---|---|
| Dashboard | `<Dashboard />` | Sidebar — Dashboard |
| Posts | `<Article />` | Sidebar — Posts |
| Pages | `<Description />` | Sidebar — Pages |
| Categories | `<Folder />` | Sidebar — Categories |
| Tags | `<LocalOffer />` | Sidebar — Tags |
| Media | `<PermMedia />` | Sidebar — Media |
| Menus | `<Menu />` | Sidebar — Menus |
| Users | `<Group />` | Sidebar — Users |
| Appearance | `<Palette />` | Sidebar — Appearance |
| Settings | `<Settings />` | Sidebar — Settings |
| Profile | `<AccountCircle />` | User menu |
| Logout | `<Logout />` | User menu |
| Add/Create | `<Add />` | Tombol tambah baru |
| Edit | `<Edit />` | Tombol edit |
| Delete | `<Delete />` | Tombol hapus |
| Search | `<Search />` | Search bar |
| Visibility | `<Visibility />` | Post visibility |
| Draft | `<Drafts />` | Status draft |
| Published | `<CheckCircle />` | Status published |
| Pending | `<HourglassEmpty />` | Status pending |
| Trash | `<DeleteForever />` | Status trash |
| Upload | `<CloudUpload />` | Upload media |
| Image | `<Image />` | Featured image |
| Link | `<Link />` | Permalink |
| SEO | `<TravelExplore />` | SEO settings |
| Notifications | `<Notifications />` | Header notification bell |
| Open in New | `<OpenInNew />` | "Visit Site" link |
| Expand | `<ExpandMore />` | Sidebar sub-menu toggle |
| Collapse | `<ExpandLess />` | Sidebar sub-menu toggle |
| History | `<History />` | Revision history |
| Restore | `<RestorePage />` | Restore revision |
| Save | `<Save />` | Save button |
| Calendar | `<CalendarMonth />` | Publish date picker |
| Sort | `<SwapVert />` | Table column sort |
| Filter | `<FilterList />` | Table filter |
| Grid View | `<GridView />` | Media grid view |
| List View | `<ViewList />` | Media list view |
| Close | `<Close />` | Dialog/modal close |
| Home | `<Home />` | Breadcrumb home |

---

## 12. API Endpoints / Server Actions

### Posts
| Action | Fungsi |
|---|---|
| `getPosts(filters)` | Ambil daftar post (dengan filter, pagination) |
| `getPostById(id)` | Ambil detail post |
| `getPostBySlug(slug)` | Ambil post berdasarkan slug (publik) |
| `createPost(data)` | Buat post baru |
| `updatePost(id, data)` | Update post + simpan revisi |
| `deletePost(id)` | Soft delete (ke trash) |
| `permanentDeletePost(id)` | Hard delete |
| `bulkActionPosts(ids, action)` | Aksi massal |

### Pages
| Action | Fungsi |
|---|---|
| `getPages(filters)` | Ambil daftar page |
| `getPageById(id)` | Detail page |
| `getPageBySlug(slug)` | Page berdasarkan slug |
| `createPage(data)` | Buat page baru |
| `updatePage(id, data)` | Update page + revisi |
| `deletePage(id)` | Soft delete |

### Categories
| Action | Fungsi |
|---|---|
| `getCategories()` | Semua kategori (hierarchical) |
| `createCategory(data)` | Buat kategori |
| `updateCategory(id, data)` | Update kategori |
| `deleteCategory(id)` | Hapus kategori |

### Tags
| Action | Fungsi |
|---|---|
| `getTags()` | Semua tags |
| `createTag(data)` | Buat tag |
| `updateTag(id, data)` | Update tag |
| `deleteTag(id)` | Hapus tag |

### Media
| Action | Fungsi |
|---|---|
| `getMedia(filters)` | Daftar media |
| `uploadMedia(file)` | Upload file (API Route) |
| `updateMedia(id, data)` | Update metadata |
| `deleteMedia(id)` | Hapus file & record |

### Users
| Action | Fungsi |
|---|---|
| `getUsers(filters)` | Daftar users |
| `getUserById(id)` | Detail user |
| `createUser(data)` | Buat user |
| `updateUser(id, data)` | Update user |
| `deleteUser(id)` | Hapus user |
| `changePassword(id, data)` | Ganti password |

### Menus
| Action | Fungsi |
|---|---|
| `getMenus()` | Semua menu |
| `getMenuByLocation(loc)` | Menu berdasarkan lokasi |
| `createMenu(data)` | Buat menu |
| `updateMenu(id, data)` | Update menu + items |
| `deleteMenu(id)` | Hapus menu |

### Settings
| Action | Fungsi |
|---|---|
| `getSettings()` | Semua settings |
| `getSetting(key)` | Setting spesifik |
| `updateSettings(data)` | Update settings |

### Appearance
| Action | Fungsi |
|---|---|
| `getAppearance()` | Semua appearance settings |
| `updateAppearance(data)` | Update appearance |

### Revisions
| Action | Fungsi |
|---|---|
| `getRevisions(entityType, entityId)` | Daftar revisi |
| `getRevisionById(id)` | Detail revisi |
| `restoreRevision(id)` | Restore ke revisi |

---

## 13. Keamanan

| Aspek | Implementasi |
|---|---|
| **Authentication** | NextAuth.js session-based, JWT tokens |
| **Authorization** | Role-based middleware, per-route protection |
| **Password** | bcrypt hashing (salt rounds: 12) |
| **CSRF** | Built-in NextAuth CSRF protection |
| **Input Validation** | Zod schema validation pada semua input |
| **File Upload** | Whitelist MIME types, max size limit, sanitize filename |
| **SQL Injection** | Prevented by Prisma ORM parameterized queries |
| **XSS** | React auto-escaping, sanitize Rich Text output (DOMPurify) |
| **Rate Limiting** | Login attempts limit (5 per minute per IP) |

---

## 14. Non-Functional Requirements

| Requirement | Target |
|---|---|
| **Performance** | Dashboard load < 2 detik, Editor responsive tanpa lag |
| **Responsive** | Admin dashboard mobile-friendly (minimum 768px) |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Accessibility** | WCAG 2.1 Level AA compliance (keyboard nav, screen reader) |
| **Scalability** | Support hingga 10.000 posts, 1.000 pages, 100 users |
| **Data Integrity** | Semua delete menggunakan soft-delete dengan trash |
| **Backup** | Revision history sebagai backup konten |

---

## 15. Catatan Penting

- Database PostgreSQL harus sudah terinstall dan berjalan di `localhost:5432`
- User PostgreSQL: `postgres`, Password: `181818`
- Jalankan `npx designdotmd add starbucks` setelah inisialisasi proyek untuk menerapkan design system
- Admin default: email `admin@nextcms.local`, password `admin123`
- Semua password disimpan dalam bentuk hash (bcrypt)
- File upload disimpan di `public/uploads/` dengan struktur folder per bulan (`/uploads/2026/07/`)

---

*Dokumen ini adalah panduan lengkap untuk pengembangan NextCMS. Setiap fitur harus diimplementasikan sesuai spesifikasi di atas.*
