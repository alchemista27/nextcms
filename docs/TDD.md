# 🏗️ Tech Design Document (TDD)

## **NextCMS — Content Management System**

> Dokumen teknis yang menjabarkan arsitektur, stack teknologi, routing, strategi autentikasi, serta estimasi pengerjaan per modul untuk pengembangan NextCMS.

| Dokumen | Detail |
|---|---|
| **Referensi** | [PRD.md](./PRD.md) |
| **Versi** | 1.0 |
| **Tanggal** | 11 Juli 2026 |
| **Status** | Draft |

---

## Daftar Isi

1. [Tech Stack & Dependencies](#1-tech-stack--dependencies)
2. [Arsitektur Aplikasi](#2-arsitektur-aplikasi)
3. [Arsitektur Folder](#3-arsitektur-folder)
4. [Database Design](#4-database-design)
5. [Auth Strategy](#5-auth-strategy)
6. [Routes — Pages (App Router)](#6-routes--pages-app-router)
7. [Routes — API & Server Actions](#7-routes--api--server-actions)
8. [Shared Components & Patterns](#8-shared-components--patterns)
9. [Estimasi Pengerjaan Per Modul](#9-estimasi-pengerjaan-per-modul)
10. [Risiko & Mitigasi](#10-risiko--mitigasi)

---

## 1. Tech Stack & Dependencies

### 1.1 Core Dependencies

| Package | Versi | Tujuan |
|---|---|---|
| `next` | ^14.2 | Framework fullstack (App Router) |
| `react` / `react-dom` | ^18.3 | UI library |
| `typescript` | ^5.5 | Type safety |

### 1.2 Database & ORM

| Package | Versi | Tujuan |
|---|---|---|
| `prisma` | ^5.x | ORM + migration tool |
| `@prisma/client` | ^5.x | Database client (auto-generated) |

**Koneksi Database:**

```
postgresql://postgres:181818@localhost:5432/nextcms
```

### 1.3 Authentication

| Package | Versi | Tujuan |
|---|---|---|
| `next-auth` | ^4.24 | Auth framework (credentials provider) |
| `bcryptjs` | ^2.4 | Password hashing |
| `@types/bcryptjs` | ^2.4 | TypeScript types untuk bcryptjs |

### 1.4 UI & Styling

| Package | Versi | Tujuan |
|---|---|---|
| `tailwindcss` | ^3.4 | Utility-first CSS |
| `shadcn/ui` | latest (CLI) | Component library (install via `npx shadcn-ui@latest init`) |
| `@radix-ui/*` | (via shadcn) | Headless UI primitives |
| `class-variance-authority` | ^0.7 | Variant-based component styling |
| `clsx` | ^2.1 | Conditional classnames |
| `tailwind-merge` | ^2.3 | Merge Tailwind classes |
| `@mui/icons-material` | ^6.x | Icon library — semua icon wajib menggunakan MUI Icons, bukan emoji |
| `@mui/material` | ^6.x | Peer dependency untuk MUI Icons |
| `@emotion/react` | ^11.x | Peer dependency untuk MUI |
| `@emotion/styled` | ^11.x | Peer dependency untuk MUI |
| `designdotmd` | CLI | Design system (`npx designdotmd add starbucks`) |

### 1.5 Rich Text Editor

| Package | Versi | Tujuan |
|---|---|---|
| `@tiptap/react` | ^2.4 | React integration Tiptap |
| `@tiptap/starter-kit` | ^2.4 | Preset ekstensi dasar (bold, italic, heading, dll) |
| `@tiptap/extension-image` | ^2.4 | Insert gambar |
| `@tiptap/extension-link` | ^2.4 | Insert/edit link |
| `@tiptap/extension-table` | ^2.4 | Tabel di editor |
| `@tiptap/extension-text-align` | ^2.4 | Alignment teks |
| `@tiptap/extension-underline` | ^2.4 | Underline formatting |
| `@tiptap/extension-color` | ^2.4 | Warna teks |
| `@tiptap/extension-text-style` | ^2.4 | Styling teks |
| `@tiptap/extension-code-block-lowlight` | ^2.4 | Code block + syntax highlighting |
| `@tiptap/extension-placeholder` | ^2.4 | Placeholder text |
| `@tiptap/extension-youtube` | ^2.4 | Embed YouTube |
| `lowlight` | ^3.1 | Syntax highlighting engine |

### 1.6 Utility & State

| Package | Versi | Tujuan |
|---|---|---|
| `zod` | ^3.23 | Schema validation (form + server) |
| `@tanstack/react-query` | ^5.x | Client-side data fetching & caching |
| `@tanstack/react-table` | ^8.x | Headless table (sorting, filtering, pagination) |
| `recharts` | ^2.12 | Dashboard charts/grafik |
| `date-fns` | ^3.6 | Date formatting & manipulation |
| `slugify` | ^1.6 | Auto-generate slug dari title |
| `dompurify` | ^3.1 | Sanitize HTML output dari editor |
| `@dnd-kit/core` | ^6.1 | Drag & drop (menu reorder) |
| `@dnd-kit/sortable` | ^8.0 | Sortable list (menu items) |
| `diff` | ^5.2 | Text diff untuk revision comparison |
| `sonner` | ^1.5 | Toast notifications (shadcn compatible) |
| `sharp` | ^0.33 | Image processing (thumbnail generation) |

### 1.7 Dev Dependencies

| Package | Tujuan |
|---|---|
| `eslint` + `eslint-config-next` | Linting |
| `prettier` + `prettier-plugin-tailwindcss` | Code formatting |
| `ts-node` | Menjalankan seed script TypeScript |
| `@types/node` | Node.js types |

---

## 2. Arsitektur Aplikasi

### 2.1 Diagram Arsitektur Berlapis

```mermaid
graph TB
    subgraph Presentation["🖥️ Presentation Layer"]
        RSC["React Server Components<br/>(Pages, Layouts)"]
        RCC["React Client Components<br/>(Forms, Editor, Interactive UI)"]
    end

    subgraph Logic["⚙️ Business Logic Layer"]
        SA["Server Actions<br/>(src/actions/*.ts)"]
        API["API Routes<br/>(src/app/api/*)"]
        MW["Middleware<br/>(src/middleware.ts)"]
    end

    subgraph Data["💾 Data Access Layer"]
        Prisma["Prisma Client<br/>(src/lib/prisma.ts)"]
        FS["File System<br/>(public/uploads/)"]
    end

    subgraph Infra["🗄️ Infrastructure"]
        PG["PostgreSQL"]
        Disk["Local Disk"]
    end

    RSC --> SA
    RCC --> SA
    RCC --> API
    MW --> NextAuth["NextAuth Session"]
    SA --> Prisma
    SA --> FS
    API --> Prisma
    API --> FS
    Prisma --> PG
    FS --> Disk
```

### 2.2 Pola Komunikasi Data

```mermaid
sequenceDiagram
    participant B as Browser
    participant RSC as Server Component
    participant SA as Server Action
    participant P as Prisma
    participant DB as PostgreSQL

    Note over B,DB: Read Flow (Server Component)
    B->>RSC: HTTP Request
    RSC->>P: Query data
    P->>DB: SQL
    DB-->>P: Result
    P-->>RSC: Data
    RSC-->>B: HTML (streaming)

    Note over B,DB: Write Flow (Server Action)
    B->>SA: Form submission / action call
    SA->>SA: Validate (Zod)
    SA->>P: Mutate data
    P->>DB: SQL
    DB-->>P: Result
    SA-->>B: revalidatePath() + response
```

### 2.3 Keputusan Desain Kunci

| Keputusan | Pilihan | Alasan |
|---|---|---|
| **Data fetching (read)** | React Server Components (direct Prisma calls) | Menghindari waterfall, data langsung di server, zero client bundle |
| **Data mutation (write)** | Server Actions (`"use server"`) | Colocated dengan form, progressive enhancement, type-safe |
| **File upload** | API Route (`POST /api/upload`) | Server Actions tidak mendukung streaming upload dengan progress |
| **Auth check (pages)** | `middleware.ts` | Intercept di edge sebelum render, redirect cepat |
| **Auth check (actions)** | `getServerSession()` di awal setiap action | Validasi server-side per-request |
| **Client state** | React Query | Cache invalidation otomatis setelah mutation, optimistic updates |
| **Editor output** | HTML string | Tiptap output HTML, disimpan as-is di database, di-sanitize saat render |

---

## 3. Arsitektur Folder

```
nextcms/
│
├── docs/                                   # Dokumentasi proyek
│   ├── PRD.md
│   └── TDD.md
│
├── prisma/
│   ├── schema.prisma                       # [DB] Schema definisi semua model
│   ├── seed.ts                             # [DB] Seed admin user + default settings
│   └── migrations/                         # [DB] Auto-generated migration files
│
├── public/
│   ├── uploads/                            # [MEDIA] File uploads (organized by year/month)
│   │   └── 2026/
│   │       └── 07/
│   └── favicon.ico
│
├── src/
│   ├── app/                                # ═══ NEXT.JS APP ROUTER ═══
│   │   │
│   │   ├── layout.tsx                      # [ROOT] Root layout (html, body, providers)
│   │   ├── globals.css                     # [ROOT] Global CSS + Tailwind directives
│   │   ├── not-found.tsx                   # [ROOT] Custom 404 page
│   │   │
│   │   ├── (auth)/                         # [GROUP] Auth pages — no admin layout
│   │   │   ├── layout.tsx                  #   Centered layout (no sidebar)
│   │   │   ├── login/
│   │   │   │   └── page.tsx                #   GET /login
│   │   │   └── register/
│   │   │       └── page.tsx                #   GET /register
│   │   │
│   │   ├── (public)/                       # [GROUP] Public-facing pages
│   │   │   ├── layout.tsx                  #   Public layout (header + footer + menu)
│   │   │   ├── page.tsx                    #   GET / (Homepage)
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx                #   GET /blog (Post listing)
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx            #   GET /blog/:slug (Single post)
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx            #   GET /category/:slug
│   │   │   ├── tag/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx            #   GET /tag/:slug
│   │   │   └── [slug]/
│   │   │       └── page.tsx                #   GET /:slug (Static page)
│   │   │
│   │   ├── admin/                          # [GROUP] Admin panel — protected
│   │   │   ├── layout.tsx                  #   Admin layout (sidebar + header + auth guard)
│   │   │   ├── page.tsx                    #   GET /admin (Dashboard)
│   │   │   │
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx                #   GET /admin/posts
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx            #   GET /admin/posts/new
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx        #   GET /admin/posts/:id/edit
│   │   │   │
│   │   │   ├── pages/
│   │   │   │   ├── page.tsx                #   GET /admin/pages
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx            #   GET /admin/pages/new
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx        #   GET /admin/pages/:id/edit
│   │   │   │
│   │   │   ├── categories/
│   │   │   │   └── page.tsx                #   GET /admin/categories
│   │   │   │
│   │   │   ├── tags/
│   │   │   │   └── page.tsx                #   GET /admin/tags
│   │   │   │
│   │   │   ├── media/
│   │   │   │   └── page.tsx                #   GET /admin/media
│   │   │   │
│   │   │   ├── menus/
│   │   │   │   └── page.tsx                #   GET /admin/menus
│   │   │   │
│   │   │   ├── users/
│   │   │   │   ├── page.tsx                #   GET /admin/users
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx            #   GET /admin/users/new
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx        #   GET /admin/users/:id/edit
│   │   │   │
│   │   │   ├── appearance/
│   │   │   │   └── page.tsx                #   GET /admin/appearance
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   ├── general/
│   │   │   │   │   └── page.tsx            #   GET /admin/settings/general
│   │   │   │   ├── seo/
│   │   │   │   │   └── page.tsx            #   GET /admin/settings/seo
│   │   │   │   └── permalinks/
│   │   │   │       └── page.tsx            #   GET /admin/settings/permalinks
│   │   │   │
│   │   │   └── revisions/
│   │   │       └── [entityType]/
│   │   │           └── [entityId]/
│   │   │               └── page.tsx        #   GET /admin/revisions/:type/:id
│   │   │
│   │   └── api/                            # ═══ API ROUTES ═══
│   │       ├── auth/
│   │       │   └── [...nextauth]/
│   │       │       └── route.ts            #   NextAuth catch-all handler
│   │       ├── upload/
│   │       │   └── route.ts                #   POST /api/upload
│   │       └── register/
│   │           └── route.ts                #   POST /api/register
│   │
│   ├── actions/                            # ═══ SERVER ACTIONS ═══
│   │   ├── post.ts                         #   CRUD post + bulk actions
│   │   ├── page.ts                         #   CRUD page
│   │   ├── category.ts                     #   CRUD category
│   │   ├── tag.ts                          #   CRUD tag
│   │   ├── media.ts                        #   CRUD media metadata
│   │   ├── menu.ts                         #   CRUD menu + menu items
│   │   ├── user.ts                         #   CRUD user + change password
│   │   ├── appearance.ts                   #   Get/update appearance settings
│   │   ├── settings.ts                     #   Get/update site settings
│   │   ├── revision.ts                     #   Get revisions + restore
│   │   └── dashboard.ts                    #   Dashboard aggregate queries
│   │
│   ├── components/                         # ═══ REACT COMPONENTS ═══
│   │   ├── ui/                             #   [shadcn/UI] Auto-generated primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── ... (27+ komponen)
│   │   │   └── sonner.tsx
│   │   │
│   │   ├── admin/                          #   [ADMIN] Admin-specific components
│   │   │   ├── sidebar.tsx                 #     Collapsible sidebar navigation
│   │   │   ├── header.tsx                  #     Top bar (breadcrumb, search, user menu)
│   │   │   ├── data-table.tsx              #     Generic data table (TanStack Table)
│   │   │   ├── media-picker.tsx            #     Reusable media picker dialog
│   │   │   ├── seo-fields.tsx              #     Reusable SEO input fields
│   │   │   ├── slug-input.tsx              #     Auto-slug input component
│   │   │   └── dashboard/
│   │   │       ├── stats-cards.tsx
│   │   │       ├── recent-posts.tsx
│   │   │       ├── quick-draft.tsx
│   │   │       ├── activity-log.tsx
│   │   │       └── content-chart.tsx
│   │   │
│   │   ├── editor/                         #   [EDITOR] Rich Text Editor
│   │   │   ├── rich-text-editor.tsx        #     Main editor wrapper (Tiptap)
│   │   │   ├── toolbar.tsx                 #     Floating/fixed toolbar
│   │   │   ├── bubble-menu.tsx             #     Selection bubble menu
│   │   │   └── extensions/                 #     Custom Tiptap extensions
│   │   │       └── image-upload.ts         #       Image upload via media picker
│   │   │
│   │   ├── auth/                           #   [AUTH] Auth form components
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   │
│   │   ├── public/                         #   [PUBLIC] Public-facing components
│   │   │   ├── site-header.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── post-card.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── sidebar-widgets.tsx
│   │   │
│   │   └── providers/                      #   [PROVIDERS] Context providers
│   │       ├── session-provider.tsx         #     NextAuth SessionProvider wrapper
│   │       ├── query-provider.tsx           #     React Query provider
│   │       └── theme-provider.tsx           #     Theme/appearance provider
│   │
│   ├── lib/                                # ═══ SHARED LIBRARIES ═══
│   │   ├── prisma.ts                       #   Prisma client singleton (prevent HMR leaks)
│   │   ├── auth.ts                         #   NextAuth configuration (authOptions)
│   │   ├── auth-guard.ts                   #   Helper: getSession + role check
│   │   ├── utils.ts                        #   cn(), formatDate(), generateSlug()
│   │   ├── upload.ts                       #   File upload helpers (save, delete, validate)
│   │   ├── constants.ts                    #   App-wide constants (roles, statuses, limits)
│   │   └── validators/                     #   Zod schemas per domain
│   │       ├── post.ts
│   │       ├── page.ts
│   │       ├── category.ts
│   │       ├── tag.ts
│   │       ├── user.ts
│   │       ├── media.ts
│   │       ├── menu.ts
│   │       └── settings.ts
│   │
│   ├── hooks/                              # ═══ CUSTOM HOOKS ═══
│   │   ├── use-debounce.ts                 #   Debounce input (search, auto-save)
│   │   ├── use-media-picker.ts             #   Media picker state management
│   │   └── use-auto-save.ts                #   Auto-save draft (60s interval)
│   │
│   ├── types/                              # ═══ TYPESCRIPT TYPES ═══
│   │   └── index.ts                        #   Shared types, enums, interfaces
│   │
│   └── middleware.ts                       # ═══ MIDDLEWARE ═══
│                                           #   Route protection + auth redirect
│
├── .env                                    # Environment variables
├── .env.example                            # Template env
├── next.config.js                          # Next.js configuration
├── tailwind.config.ts                      # Tailwind + designdotmd theme
├── components.json                         # shadcn/ui configuration
├── tsconfig.json                           # TypeScript config
├── postcss.config.js                       # PostCSS (Tailwind)
├── package.json
└── README.md
```

### 3.1 Prinsip Organisasi Folder

| Prinsip | Penjelasan |
|---|---|
| **Colocation** | File page + komponen terkait dekat secara hierarki |
| **Feature-based grouping** | `actions/`, `components/`, `lib/validators/` dikelompokkan per domain |
| **Separation of concerns** | UI (`components/`), logic (`actions/`), data (`lib/`), types (`types/`) terpisah |
| **Reusability** | Komponen `ui/` dan `admin/` dirancang reusable lintas halaman |
| **Convention over configuration** | Ikuti konvensi Next.js App Router (layout.tsx, page.tsx, route.ts) |

---

## 4. Database Design

### 4.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── ENUMS ────────────────────────────────────────

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

// ─── MODELS ───────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(SUBSCRIBER)
  avatar    String?
  bio       String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  pages     Page[]
  media     Media[]
  revisions Revision[]

  @@map("users")
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
  entityType String                        // "POST" | "PAGE"
  entityId   String
  title      String
  content    String?  @db.Text
  metadata   Json?                         // { status, categories, tags, template, ... }
  createdAt  DateTime @default(now())

  authorId String
  author   User @relation(fields: [authorId], references: [id])
  post     Post? @relation(fields: [entityId], references: [id], onDelete: Cascade)
  page     Page? @relation(fields: [entityId], references: [id], onDelete: Cascade)

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

### 4.2 Indexing Strategy

| Tabel | Index | Alasan |
|---|---|---|
| `posts` | `slug`, `status`, `authorId`, `publishedAt` | Query publik by slug, filter by status, author lookup, chronological sort |
| `pages` | `slug`, `status`, `parentId` | Slug lookup, hierarchy query |
| `categories` | `slug`, `parentId` | Slug lookup, hierarchy query |
| `tags` | `slug` | Slug lookup |
| `media` | `mimeType`, `uploadedById` | Filter by type, user's uploads |
| `menu_items` | `menuId`, `parentId` | Menu lookup, hierarchy |
| `revisions` | `(entityType, entityId)`, `authorId` | Revision per entity, author audit |

### 4.3 Seed Data

```typescript
// prisma/seed.ts — Data yang di-seed saat setup awal

const seedData = {
  admin: {
    name: "Admin",
    email: "admin@nextcms.local",
    password: bcrypt.hashSync("admin123", 12),
    role: "ADMIN"
  },
  settings: [
    { key: "site_title",        value: "NextCMS" },
    { key: "site_tagline",      value: "Just another NextCMS site" },
    { key: "site_url",          value: "http://localhost:3000" },
    { key: "admin_email",       value: "admin@nextcms.local" },
    { key: "language",          value: "id" },
    { key: "timezone",          value: "Asia/Jakarta" },
    { key: "date_format",       value: "DD/MM/YYYY" },
    { key: "time_format",       value: "HH:mm" },
    { key: "posts_per_page",    value: "10" },
    { key: "registration_open", value: "true" },
    { key: "default_role",      value: "SUBSCRIBER" },
    { key: "permalink_structure", value: "/blog/:slug" },
    { key: "category_base",     value: "category" },
    { key: "tag_base",          value: "tag" },
  ],
  appearance: [
    { key: "logo",            value: null },
    { key: "favicon",         value: null },
    { key: "primary_color",   value: "#00704A" },
    { key: "secondary_color", value: "#1E3932" },
    { key: "font_family",     value: "Inter" },
    { key: "header_style",    value: "left-aligned" },
    { key: "sidebar_position",value: "right" },
    { key: "footer_text",     value: "© 2026 NextCMS. All rights reserved." },
    { key: "custom_css",      value: "" },
    { key: "custom_head",     value: "" },
    { key: "custom_footer",   value: "" },
  ],
  defaultCategory: {
    name: "Uncategorized",
    slug: "uncategorized"
  }
};
```

---

## 5. Auth Strategy

### 5.1 Arsitektur Auth

```mermaid
graph LR
    subgraph Browser
        LoginForm["Login Form"]
        Session["Session Cookie"]
    end

    subgraph NextJS["Next.js Server"]
        MW["middleware.ts"]
        NextAuth["NextAuth Handler<br/>/api/auth/[...nextauth]"]
        SA["Server Actions"]
        AuthGuard["auth-guard.ts"]
    end

    subgraph DB["Database"]
        Users["users table"]
    end

    LoginForm -->|"POST credentials"| NextAuth
    NextAuth -->|"bcrypt.compare()"| Users
    NextAuth -->|"Set JWT cookie"| Session
    Session -->|"Setiap request"| MW
    MW -->|"Validate JWT"| MW
    MW -->|"Redirect jika unauthorized"| LoginForm
    SA -->|"getServerSession()"| AuthGuard
    AuthGuard -->|"Check role"| SA
```

### 5.2 NextAuth Configuration

```typescript
// src/lib/auth.ts

import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,  // 30 hari
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.avatar = token.avatar as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
};
```

### 5.3 Middleware (Route Protection)

```typescript
// src/middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes — minimal SUBSCRIBER role required
    if (path.startsWith("/admin")) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // User management — ADMIN only
    if (path.startsWith("/admin/users") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    // Settings & Appearance — ADMIN only
    if (
      (path.startsWith("/admin/settings") || path.startsWith("/admin/appearance")) &&
      token?.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Public routes — always allowed
        if (!req.nextUrl.pathname.startsWith("/admin")) return true;
        // Admin routes — require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*"],
};
```

### 5.4 Server Action Auth Guard

```typescript
// src/lib/auth-guard.ts

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { Role } from "@prisma/client";

export async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session.user;
}

export async function requireRole(...roles: Role[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role as Role)) {
    throw new Error("Forbidden: insufficient role");
  }
  return user;
}

// Penggunaan di server action:
// const user = await requireRole("ADMIN", "EDITOR");
```

### 5.5 Alur Auth Lengkap

| Alur | Langkah |
|---|---|
| **Login** | 1. User submit email + password → 2. NextAuth `authorize()` → 3. bcrypt.compare() → 4. Return user object → 5. JWT cookie di-set → 6. Redirect ke `/admin` |
| **Register** | 1. User submit form → 2. `POST /api/register` → 3. Validasi Zod → 4. Cek email duplikat → 5. bcrypt.hash() → 6. Insert ke DB → 7. Redirect ke `/login` |
| **Protected Page** | 1. Request masuk → 2. `middleware.ts` cek JWT → 3. Jika invalid → redirect `/login` → 4. Jika valid → lanjut render |
| **Server Action** | 1. Action dipanggil → 2. `requireAuth()` / `requireRole()` → 3. Jika gagal → throw Error → 4. Jika sukses → lanjut eksekusi |
| **Logout** | 1. User klik Logout → 2. `signOut()` dari next-auth/react → 3. Cookie dihapus → 4. Redirect ke `/login` |

---

## 6. Routes — Pages (App Router)

### 6.1 Halaman Publik

| Route | File | Method | Auth | Deskripsi |
|---|---|---|---|---|
| `/` | `(public)/page.tsx` | GET | ❌ | Homepage — latest posts, hero section |
| `/blog` | `(public)/blog/page.tsx` | GET | ❌ | Blog listing dengan pagination |
| `/blog/:slug` | `(public)/blog/[slug]/page.tsx` | GET | ❌ | Single post detail |
| `/category/:slug` | `(public)/category/[slug]/page.tsx` | GET | ❌ | Posts filtered by category |
| `/tag/:slug` | `(public)/tag/[slug]/page.tsx` | GET | ❌ | Posts filtered by tag |
| `/:slug` | `(public)/[slug]/page.tsx` | GET | ❌ | Static page (catch-all terakhir) |

### 6.2 Halaman Auth

| Route | File | Method | Auth | Deskripsi |
|---|---|---|---|---|
| `/login` | `(auth)/login/page.tsx` | GET | ❌ | Halaman login |
| `/register` | `(auth)/register/page.tsx` | GET | ❌ | Halaman registrasi |

### 6.3 Halaman Admin

| Route | File | Auth | Min. Role | Deskripsi |
|---|---|---|---|---|
| `/admin` | `admin/page.tsx` | ✅ | SUBSCRIBER | Dashboard |
| `/admin/posts` | `admin/posts/page.tsx` | ✅ | AUTHOR | Daftar semua post |
| `/admin/posts/new` | `admin/posts/new/page.tsx` | ✅ | AUTHOR | Buat post baru |
| `/admin/posts/:id/edit` | `admin/posts/[id]/edit/page.tsx` | ✅ | AUTHOR | Edit post |
| `/admin/pages` | `admin/pages/page.tsx` | ✅ | EDITOR | Daftar semua page |
| `/admin/pages/new` | `admin/pages/new/page.tsx` | ✅ | EDITOR | Buat page baru |
| `/admin/pages/:id/edit` | `admin/pages/[id]/edit/page.tsx` | ✅ | EDITOR | Edit page |
| `/admin/categories` | `admin/categories/page.tsx` | ✅ | EDITOR | Kelola kategori |
| `/admin/tags` | `admin/tags/page.tsx` | ✅ | EDITOR | Kelola tags |
| `/admin/media` | `admin/media/page.tsx` | ✅ | AUTHOR | Media library |
| `/admin/menus` | `admin/menus/page.tsx` | ✅ | EDITOR | Kelola menu |
| `/admin/users` | `admin/users/page.tsx` | ✅ | ADMIN | Daftar users |
| `/admin/users/new` | `admin/users/new/page.tsx` | ✅ | ADMIN | Buat user baru |
| `/admin/users/:id/edit` | `admin/users/[id]/edit/page.tsx` | ✅ | ADMIN* | Edit user profile |
| `/admin/appearance` | `admin/appearance/page.tsx` | ✅ | ADMIN | Pengaturan tampilan |
| `/admin/settings/general` | `admin/settings/general/page.tsx` | ✅ | ADMIN | Pengaturan umum situs |
| `/admin/settings/seo` | `admin/settings/seo/page.tsx` | ✅ | ADMIN | Pengaturan SEO global |
| `/admin/settings/permalinks` | `admin/settings/permalinks/page.tsx` | ✅ | ADMIN | Pengaturan permalink |
| `/admin/revisions/:type/:id` | `admin/revisions/[entityType]/[entityId]/page.tsx` | ✅ | EDITOR | Revision history viewer |

> *\* User dapat edit profile sendiri di route ini, admin bisa edit semua user.*

---

## 7. Routes — API & Server Actions

### 7.1 API Routes (HTTP Endpoints)

Hanya digunakan untuk operasi yang memerlukan streaming atau multipart/form-data.

| Method | Endpoint | Auth | Deskripsi | Request Body | Response |
|---|---|---|---|---|---|
| `POST` | `/api/auth/[...nextauth]` | ❌ | NextAuth handler | (managed by NextAuth) | Session/JWT |
| `GET` | `/api/auth/[...nextauth]` | ❌ | NextAuth handler | — | Session info |
| `POST` | `/api/register` | ❌ | User registration | `{ name, email, password }` | `{ user }` / `{ error }` |
| `POST` | `/api/upload` | ✅ AUTHOR+ | Upload file(s) | `FormData (files[])` | `{ files: [{ id, url, filename }] }` |
| `DELETE` | `/api/upload/:id` | ✅ EDITOR+ | Hapus file | — | `{ success: true }` |

### 7.2 Server Actions

Semua mutasi data dilakukan via Server Actions (`"use server"`). Setiap action melakukan validasi Zod dan auth check.

#### 7.2.1 Post Actions (`src/actions/post.ts`)

| Action | Parameter | Auth | Return | Side Effects |
|---|---|---|---|---|
| `getPosts` | `{ status?, search?, page, limit, sortBy, sortOrder }` | AUTHOR+ | `{ posts, total, pages }` | — |
| `getPostById` | `id: string` | AUTHOR+ | `Post` with relations | — |
| `getPostBySlug` | `slug: string` | ❌ (public) | `Post` (published only) | — |
| `createPost` | `CreatePostInput` | AUTHOR+ | `Post` | Create initial revision |
| `updatePost` | `id, UpdatePostInput` | AUTHOR+ | `Post` | Create revision snapshot |
| `deletePost` | `id: string` | EDITOR+ | `Post` | Set status = TRASH |
| `permanentDeletePost` | `id: string` | ADMIN | `void` | Hard delete + revisions |
| `bulkActionPosts` | `{ ids[], action }` | EDITOR+ | `{ count }` | Batch update |

```typescript
// Contoh Zod schema untuk CreatePostInput
const CreatePostInput = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).optional(), // auto-generated jika kosong
  content: z.string().optional(),
  excerpt: z.string().max(500).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "PENDING"]).default("DRAFT"),
  featuredImage: z.string().url().optional(),
  categoryIds: z.array(z.string()).optional(),
  tagIds: z.array(z.string()).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().url().optional(),
  publishedAt: z.string().datetime().optional(),
});
```

#### 7.2.2 Page Actions (`src/actions/page.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getPages` | `{ status?, search?, page, limit }` | EDITOR+ | `{ pages, total }` |
| `getPageById` | `id: string` | EDITOR+ | `Page` with parent/children |
| `getPageBySlug` | `slug: string` | ❌ (public) | `Page` (published only) |
| `createPage` | `CreatePageInput` | EDITOR+ | `Page` |
| `updatePage` | `id, UpdatePageInput` | EDITOR+ | `Page` |
| `deletePage` | `id: string` | EDITOR+ | `Page` |

#### 7.2.3 Category Actions (`src/actions/category.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getCategories` | `{ search? }` | ❌ (public) | `Category[]` (hierarchical) |
| `createCategory` | `{ name, slug?, parentId?, description? }` | EDITOR+ | `Category` |
| `updateCategory` | `id, UpdateCategoryInput` | EDITOR+ | `Category` |
| `deleteCategory` | `id: string` | EDITOR+ | `void` |

#### 7.2.4 Tag Actions (`src/actions/tag.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getTags` | `{ search? }` | ❌ (public) | `Tag[]` |
| `createTag` | `{ name, slug?, description? }` | EDITOR+ | `Tag` |
| `updateTag` | `id, UpdateTagInput` | EDITOR+ | `Tag` |
| `deleteTag` | `id: string` | EDITOR+ | `void` |

#### 7.2.5 Media Actions (`src/actions/media.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getMedia` | `{ type?, search?, page, limit }` | AUTHOR+ | `{ media, total }` |
| `getMediaById` | `id: string` | AUTHOR+ | `Media` |
| `updateMedia` | `id, { alt?, caption? }` | EDITOR+ | `Media` |
| `deleteMedia` | `id: string` | EDITOR+ | `void` |

> *Upload dilakukan via API Route, bukan Server Action.*

#### 7.2.6 Menu Actions (`src/actions/menu.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getMenus` | — | ❌ (public) | `Menu[]` with items |
| `getMenuByLocation` | `location: string` | ❌ (public) | `Menu` with items (nested) |
| `createMenu` | `{ name, location?, items[] }` | EDITOR+ | `Menu` |
| `updateMenu` | `id, { name?, location?, items[] }` | EDITOR+ | `Menu` |
| `deleteMenu` | `id: string` | EDITOR+ | `void` |

#### 7.2.7 User Actions (`src/actions/user.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getUsers` | `{ role?, search?, page, limit }` | ADMIN | `{ users, total }` |
| `getUserById` | `id: string` | ADMIN* | `User` (tanpa password) |
| `createUser` | `CreateUserInput` | ADMIN | `User` |
| `updateUser` | `id, UpdateUserInput` | ADMIN* | `User` |
| `deleteUser` | `id: string` | ADMIN | `void` |
| `changePassword` | `id, { oldPassword, newPassword }` | ALL* | `void` |

> *\* User bisa akses profil sendiri.*

#### 7.2.8 Settings Actions (`src/actions/settings.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getSettings` | — | ❌ (public read) | `Record<string, string>` |
| `getSetting` | `key: string` | ❌ | `string` |
| `updateSettings` | `Record<string, string>` | ADMIN | `void` |

#### 7.2.9 Appearance Actions (`src/actions/appearance.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getAppearance` | — | ❌ (public read) | `Record<string, any>` |
| `updateAppearance` | `Record<string, any>` | ADMIN | `void` |

#### 7.2.10 Revision Actions (`src/actions/revision.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getRevisions` | `entityType, entityId` | EDITOR+ | `Revision[]` |
| `getRevisionById` | `id: string` | EDITOR+ | `Revision` |
| `restoreRevision` | `id: string` | EDITOR+ | `Post \| Page` |
| `createRevision` | `(internal — called by post/page update)` | — | `Revision` |

#### 7.2.11 Dashboard Actions (`src/actions/dashboard.ts`)

| Action | Parameter | Auth | Return |
|---|---|---|---|
| `getDashboardStats` | — | SUBSCRIBER+ | `{ posts, pages, categories, tags, media, users }` |
| `getRecentPosts` | `limit?: number` | SUBSCRIBER+ | `Post[]` |
| `getDraftPosts` | `limit?: number` | AUTHOR+ | `Post[]` |
| `getContentChart` | `months?: number` | SUBSCRIBER+ | `{ month, count }[]` |

---

## 8. Shared Components & Patterns

### 8.1 Reusable Component Contracts

#### DataTable (`components/admin/data-table.tsx`)

Komponen tabel generik berbasis TanStack Table.

```typescript
interface DataTableProps<T> {
  columns: ColumnDef<T>[];          // Definisi kolom
  data: T[];                        // Data rows
  totalItems: number;               // Total untuk pagination
  pageSize?: number;                // Default: 10
  searchPlaceholder?: string;       // Placeholder search input
  filterOptions?: FilterConfig[];   // Filter dropdowns
  bulkActions?: BulkAction[];       // Aksi bulk (publish, trash, delete)
  onSearch?: (query: string) => void;
  onPageChange?: (page: number) => void;
  onSort?: (column: string, order: "asc" | "desc") => void;
  onBulkAction?: (action: string, ids: string[]) => void;
}
```

#### MediaPicker (`components/admin/media-picker.tsx`)

Dialog pemilih media yang reusable.

```typescript
interface MediaPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (media: Media | Media[]) => void;
  multiple?: boolean;              // Default: false
  acceptTypes?: string[];          // e.g., ["image/*"]
}
```

#### RichTextEditor (`components/editor/rich-text-editor.tsx`)

Wrapper Tiptap editor.

```typescript
interface RichTextEditorProps {
  content: string;                 // HTML string
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;              // Default: true
  onImageInsert?: () => void;      // Trigger media picker
}
```

#### SEOFields (`components/admin/seo-fields.tsx`)

Reusable SEO input section.

```typescript
interface SEOFieldsProps {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  onChange: (field: string, value: string) => void;
  previewUrl?: string;             // Untuk Google preview snippet
}
```

### 8.2 Pola Error Handling

```typescript
// Semua server actions mengikuti pola return ini:

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

// Contoh implementasi:
async function createPost(input: CreatePostInput): Promise<ActionResult<Post>> {
  try {
    const user = await requireRole("ADMIN", "EDITOR", "AUTHOR");
    const validated = CreatePostSchema.safeParse(input);

    if (!validated.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: validated.error.flatten().fieldErrors,
      };
    }

    const post = await prisma.post.create({ data: { ... } });
    revalidatePath("/admin/posts");
    return { success: true, data: post };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### 8.3 Pola Auto-Save

```typescript
// hooks/use-auto-save.ts
// Interval: 60 detik
// Hanya aktif jika status === "DRAFT"
// Memanggil updatePost/updatePage server action
// Menampilkan toast "Draft saved" saat berhasil
// Debounce 2 detik setelah perubahan terakhir sebelum trigger
```

### 8.4 Pola Revision Creation

```mermaid
sequenceDiagram
    participant Editor as Post Editor
    participant SA as updatePost()
    participant DB as Database

    Editor->>SA: Submit update
    SA->>DB: Fetch current post state
    DB-->>SA: Current post data
    SA->>DB: INSERT into revisions (snapshot current state)
    SA->>DB: UPDATE post with new data
    DB-->>SA: Updated post
    SA->>SA: Check revision count > 25
    SA->>DB: DELETE oldest revisions if over limit
    SA-->>Editor: Return updated post
```

---

## 9. Estimasi Pengerjaan Per Modul

### 9.1 Ringkasan Estimasi

| # | Modul | Estimasi | Effort | Prioritas |
|---|---|---|---|---|
| M1 | Project Setup & Foundation | 4 jam | 🟢 Low | P0 — Critical |
| M2 | Auth (Login, Register, Middleware) | 6 jam | 🟡 Medium | P0 — Critical |
| M3 | Admin Layout (Sidebar, Header) | 5 jam | 🟡 Medium | P0 — Critical |
| M4 | Rich Text Editor (Tiptap) | 8 jam | 🔴 High | P0 — Critical |
| M5 | Post Management (CRUD) | 10 jam | 🔴 High | P0 — Critical |
| M6 | Page Management (CRUD) | 6 jam | 🟡 Medium | P1 — High |
| M7 | Category Management | 4 jam | 🟢 Low | P1 — High |
| M8 | Tag Management | 3 jam | 🟢 Low | P1 — High |
| M9 | Media Management | 10 jam | 🔴 High | P1 — High |
| M10 | Menu Management | 8 jam | 🔴 High | P2 — Medium |
| M11 | User Management | 6 jam | 🟡 Medium | P2 — Medium |
| M12 | Dashboard | 6 jam | 🟡 Medium | P2 — Medium |
| M13 | Appearance Settings | 5 jam | 🟡 Medium | P2 — Medium |
| M14 | General Settings | 3 jam | 🟢 Low | P2 — Medium |
| M15 | SEO Settings | 4 jam | 🟢 Low | P2 — Medium |
| M16 | Permalink Settings | 3 jam | 🟢 Low | P3 — Low |
| M17 | Revision History | 8 jam | 🔴 High | P3 — Low |
| M18 | Public Frontend | 10 jam | 🔴 High | P3 — Low |
| M19 | Polish & QA | 6 jam | 🟡 Medium | P3 — Low |
| | **TOTAL** | **~115 jam** | | |

### 9.2 Detail Per Modul

---

#### M1: Project Setup & Foundation — ⏱️ 4 jam

| Task | Detail | Waktu |
|---|---|---|
| Init Next.js | `npx create-next-app@latest` dengan TypeScript, App Router, Tailwind | 15 min |
| Setup shadcn/UI | `npx shadcn-ui@latest init` + install komponen dasar | 30 min |
| Design System | `npx designdotmd add starbucks` + konfigurasi theme | 30 min |
| Prisma Setup | Install, init schema, configure PostgreSQL connection | 30 min |
| Schema Models | Definisi semua model, relasi, enum, index | 60 min |
| Migration | `prisma migrate dev` + verifikasi tabel | 15 min |
| Seed Script | Buat seed.ts (admin user, default settings, uncategorized category) | 30 min |
| Environment | `.env`, `.env.example`, constants.ts | 15 min |
| Prisma Client | Singleton pattern di `src/lib/prisma.ts` | 15 min |

**Deliverables:** Proyek berjalan, database terkoneksi, seed berhasil.

---

#### M2: Auth (Login, Register, Middleware) — ⏱️ 6 jam

| Task | Detail | Waktu |
|---|---|---|
| NextAuth Config | `src/lib/auth.ts` — credentials provider, JWT callbacks | 60 min |
| Auth Guard | `src/lib/auth-guard.ts` — requireAuth, requireRole helpers | 30 min |
| Middleware | `src/middleware.ts` — route protection, role-based redirect | 45 min |
| Login Page | UI form + validation + error states + design (Starbucks theme) | 60 min |
| Register Page | UI form + password strength + duplicate check | 60 min |
| Register API | `POST /api/register` endpoint | 30 min |
| Session Provider | Client-side SessionProvider wrapper | 15 min |
| Type Extensions | Extend NextAuth types (id, role, avatar di session) | 15 min |
| Testing | Login/logout flow, redirect, protected routes | 30 min |

**Deliverables:** User bisa login/register, protected routes bekerja.

**Dependencies:** M1

---

#### M3: Admin Layout (Sidebar, Header) — ⏱️ 5 jam

| Task | Detail | Waktu |
|---|---|---|
| Admin Layout | `admin/layout.tsx` — server component wrapper | 30 min |
| Sidebar | Collapsible sidebar, menu items, icons, active state | 90 min |
| Header | Breadcrumb, search trigger, user dropdown, "Visit Site" link | 60 min |
| Mobile Responsive | Sheet sidebar untuk mobile, responsive breakpoints | 45 min |
| Theme Provider | Dark/light mode toggle (optional, Starbucks preset) | 30 min |
| Loading States | Skeleton loaders untuk content area | 15 min |

**Deliverables:** Admin shell yang fully functional, navigasi bekerja.

**Dependencies:** M1, M2

---

#### M4: Rich Text Editor (Tiptap) — ⏱️ 8 jam

| Task | Detail | Waktu |
|---|---|---|
| Tiptap Setup | Install semua extensions, configure editor instance | 60 min |
| Toolbar | Fixed toolbar — formatting buttons, dropdowns | 90 min |
| Bubble Menu | Selection-based floating menu (bold, italic, link) | 45 min |
| Image Extension | Custom extension — trigger media picker, insert image | 60 min |
| Table Extension | Insert/edit table, add/remove rows/columns | 30 min |
| Code Block | Syntax highlighting dengan lowlight | 30 min |
| YouTube Embed | Embed YouTube video via URL | 15 min |
| Styling | Editor content styling (typography, spacing, responsive) | 45 min |
| Output Sanitize | DOMPurify config untuk safe HTML render | 15 min |
| Testing | All formatting features, edge cases | 30 min |

**Deliverables:** Rich text editor component, siap digunakan di Post/Page editor.

**Dependencies:** M1

---

#### M5: Post Management (CRUD) — ⏱️ 10 jam

| Task | Detail | Waktu |
|---|---|---|
| Zod Validators | CreatePostInput, UpdatePostInput schemas | 30 min |
| Server Actions | getPosts, getPostById, createPost, updatePost, deletePost, bulkAction | 120 min |
| Post List Page | Data table, filters (status), search, pagination, bulk actions | 120 min |
| Post Editor Page | Title, slug, editor, sidebar (publish box, categories, tags, featured image, SEO, excerpt) | 150 min |
| Auto-save | useAutoSave hook — 60s interval for drafts | 30 min |
| Slug Generation | Auto-generate dari title, editable, uniqueness check | 20 min |
| Status Workflow | Draft → Pending → Published, Trash soft-delete | 20 min |
| revalidation | revalidatePath pada setiap mutation | 10 min |

**Deliverables:** Full post CRUD dengan editor, filters, bulk actions.

**Dependencies:** M1, M2, M3, M4, M7, M8

---

#### M6: Page Management (CRUD) — ⏱️ 6 jam

| Task | Detail | Waktu |
|---|---|---|
| Server Actions | CRUD pages (mirip post, tanpa categories/tags) | 60 min |
| Page List | Data table dengan hierarchical indent | 60 min |
| Page Editor | Editor + sidebar (parent page, template, menu order, SEO) | 90 min |
| Template Support | Template selection (default, full-width, sidebar) | 30 min |
| Quick Edit | Inline edit di list (title, slug, status) | 30 min |
| Hierarchy | Parent-child relationship, dropdown nested | 30 min |
| Revalidation | revalidatePath | 10 min |

**Deliverables:** Full page CRUD dengan hierarchy dan template support.

**Dependencies:** M1, M2, M3, M4

---

#### M7: Category Management — ⏱️ 4 jam

| Task | Detail | Waktu |
|---|---|---|
| Server Actions | CRUD categories (with hierarchy) | 45 min |
| Category Page | 2-column layout: form (left) + table (right) | 90 min |
| Hierarchy | Parent category dropdown, indented display | 30 min |
| Post Count | Aggregate count per category | 15 min |
| Inline Edit | Edit nama, slug, description langsung di tabel | 30 min |
| Validation | Unique slug, prevent self-referential parent | 15 min |

**Deliverables:** Full category management.

**Dependencies:** M1, M2, M3

---

#### M8: Tag Management — ⏱️ 3 jam

| Task | Detail | Waktu |
|---|---|---|
| Server Actions | CRUD tags | 30 min |
| Tag Page | 2-column layout (mirip category, tanpa hierarchy) | 60 min |
| Tag Input Component | Autocomplete tag input untuk post editor | 45 min |
| Post Count | Aggregate count per tag | 15 min |
| Inline Edit | Edit nama, slug, description | 20 min |

**Deliverables:** Full tag management + tag input component.

**Dependencies:** M1, M2, M3

---

#### M9: Media Management — ⏱️ 10 jam

| Task | Detail | Waktu |
|---|---|---|
| Upload API Route | `POST /api/upload` — multipart handling, file save, DB record | 90 min |
| File Storage | Organize by year/month, unique filename, thumbnail generation (sharp) | 60 min |
| Media Library Page | Grid view + list view toggle | 90 min |
| Drag & Drop Upload | DnD upload area + progress indicator | 60 min |
| Media Detail | Modal/drawer — preview, metadata fields (alt, caption), file info | 60 min |
| Media Picker Component | Reusable dialog — upload tab + library tab + search | 90 min |
| Delete | Delete file from disk + DB record | 20 min |
| Validation | MIME type whitelist, max size (10MB), sanitize filename | 30 min |

**Deliverables:** Media library, upload system, reusable media picker.

**Dependencies:** M1, M2, M3

---

#### M10: Menu Management — ⏱️ 8 jam

| Task | Detail | Waktu |
|---|---|---|
| Server Actions | CRUD menus + menu items (nested) | 60 min |
| Menu Page UI | Select/create menu, assign location | 30 min |
| Item Sources Panel | Add items from Pages, Posts, Categories, Custom Links | 60 min |
| Drag & Drop Tree | @dnd-kit sortable + nestable tree structure | 120 min |
| Item Edit | Inline edit label, URL, target, CSS class | 30 min |
| Menu Item Types | Resolve reference (page → slug, post → slug, category → slug) | 30 min |
| Save & Serialize | Flatten tree → ordered items with parentId + order | 30 min |
| Preview | Visual preview of menu structure | 30 min |

**Deliverables:** Full menu builder dengan drag & drop.

**Dependencies:** M1, M2, M3, M5, M6, M7

---

#### M11: User Management — ⏱️ 6 jam

| Task | Detail | Waktu |
|---|---|---|
| Server Actions | CRUD users, change password, role change | 60 min |
| User List Page | Data table, filter by role, search, bulk actions | 60 min |
| User Edit Page | Profile form (name, email, role, bio), avatar upload, password change | 90 min |
| Create User Page | Admin buat user baru dengan role assignment | 30 min |
| Own Profile | Non-admin user bisa edit profil sendiri | 30 min |
| Role Guards | Middleware + server action checks per role | 30 min |
| Avatar Integration | Avatar upload via media system | 30 min |

**Deliverables:** Full user management dengan RBAC.

**Dependencies:** M1, M2, M3, M9

---

#### M12: Dashboard — ⏱️ 6 jam

| Task | Detail | Waktu |
|---|---|---|
| Dashboard Actions | Aggregate queries (counts, recent, chart data) | 60 min |
| Stats Cards | "At a Glance" — post/page/category/tag/media/user counts with icons | 45 min |
| Recent Posts | 5 terbaru dengan status badge | 30 min |
| Quick Draft | Mini form (title + content) → create draft post | 30 min |
| Content Chart | Recharts bar chart — posts per month | 60 min |
| Draft Posts | List draft posts milik user | 20 min |
| Activity Log | Recent activity (post created/updated/deleted) | 45 min |
| Layout & Polish | Grid responsive, loading skeletons | 30 min |

**Deliverables:** Dashboard dengan 6+ widgets.

**Dependencies:** M1, M2, M3, M5

---

#### M13: Appearance Settings — ⏱️ 5 jam

| Task | Detail | Waktu |
|---|---|---|
| Server Actions | Get/update appearance settings (JSON values) | 30 min |
| Settings Form | Logo, favicon (media picker), colors (color picker), font, header style | 90 min |
| Custom CSS/Script | Textarea/code-editor fields | 30 min |
| Color Picker | Komponen color picker (via Popover + input hex) | 45 min |
| Live Preview | Preview changes before save (optional) | 30 min |
| Apply Theme | Load appearance settings di public layout (CSS variables) | 45 min |

**Deliverables:** Full appearance customization.

**Dependencies:** M1, M2, M3, M9

---

#### M14: General Settings — ⏱️ 3 jam

| Task | Detail | Waktu |
|---|---|---|
| Settings Form | Site title, tagline, URL, admin email, language, timezone, date/time format | 60 min |
| Content Settings | Posts per page, registration open, default role | 30 min |
| Server Actions | Load/save ke SiteSettings table (key-value) | 30 min |
| Validation | Zod schema, validate URL format, email format | 20 min |
| Apply Settings | Load settings di public pages (title, meta, etc.) | 20 min |

**Deliverables:** General settings page, fully functional.

**Dependencies:** M1, M2, M3

---

#### M15: SEO Settings — ⏱️ 4 jam

| Task | Detail | Waktu |
|---|---|---|
| Global SEO Page | Meta title template, default description, OG image, robots.txt | 60 min |
| Social Profiles | Facebook, Twitter, Instagram URL inputs | 15 min |
| Analytics | Google Analytics ID input, inject script | 15 min |
| Sitemap | Auto-generate `sitemap.xml` dari published posts/pages | 60 min |
| SEO Fields Component | Reusable SEOFields — meta title, description, OG image, preview snippet | 45 min |
| Head Rendering | Dynamic `<head>` di public pages (meta, og, twitter cards) | 45 min |

**Deliverables:** SEO global + per-content, sitemap generation.

**Dependencies:** M1, M2, M3, M5, M6

---

#### M16: Permalink Settings — ⏱️ 3 jam

| Task | Detail | Waktu |
|---|---|---|
| Settings Page | Radio options untuk permalink structure | 45 min |
| Custom Pattern | Input field untuk custom permalink pattern | 20 min |
| Base Settings | Category base, tag base inputs | 15 min |
| URL Resolution | Generate permalink from pattern + post data | 45 min |
| Routing Integration | Dynamic route handling berdasarkan permalink setting | 30 min |
| Migration | Update existing post URLs jika pattern berubah | 15 min |

**Deliverables:** Configurable permalink structures.

**Dependencies:** M1, M2, M3, M14

---

#### M17: Revision History — ⏱️ 8 jam

| Task | Detail | Waktu |
|---|---|---|
| Revision Creation | Auto-create revision on post/page update | 45 min |
| Revision List | Timeline UI — date, author, summary per revision | 60 min |
| Diff Engine | Side-by-side diff comparison (title + content) using `diff` library | 120 min |
| Diff UI | Highlighted diffs — green (added), red (removed) | 60 min |
| Restore | "Restore this revision" → overwrite current entity, create new revision | 45 min |
| Cleanup | Auto-delete oldest revisions when count > 25 | 20 min |
| Editor Integration | "Revision History" link di post/page editor sidebar | 15 min |
| Metadata Diff | Show changes in categories, tags, status, template (JSON diff) | 30 min |

**Deliverables:** Full revision system — view, compare, restore.

**Dependencies:** M1, M2, M3, M5, M6

---

#### M18: Public Frontend — ⏱️ 10 jam

| Task | Detail | Waktu |
|---|---|---|
| Public Layout | Header (dynamic menu), footer (site info), responsive | 60 min |
| Homepage | Hero section, latest posts grid, sidebar widgets | 60 min |
| Blog Listing | Post cards, pagination, filters | 60 min |
| Single Post | Full post render, author info, categories, tags, related posts | 60 min |
| Static Page | Page render with template support | 30 min |
| Category Archive | Post list filtered by category, category description | 30 min |
| Tag Archive | Post list filtered by tag | 20 min |
| SEO Rendering | Dynamic meta tags, OG tags, structured data | 45 min |
| Dynamic Menu | Resolve menu items, render nested navigation | 30 min |
| Appearance Apply | Load theme settings (colors, fonts, custom CSS) | 30 min |
| Responsive | Mobile-first responsive design | 60 min |
| 404 Page | Custom not-found page | 15 min |

**Deliverables:** Fully functional public-facing website.

**Dependencies:** M1, M5, M6, M7, M8, M10, M13, M14, M15, M16

---

#### M19: Polish & QA — ⏱️ 6 jam

| Task | Detail | Waktu |
|---|---|---|
| Error Handling | Global error boundaries, action error states, form errors | 45 min |
| Loading States | Skeleton loaders, suspense boundaries, loading.tsx files | 45 min |
| Toast Notifications | Success/error toasts di semua mutasi (sonner) | 30 min |
| Responsive Audit | Test semua halaman di mobile/tablet/desktop | 60 min |
| Accessibility | Keyboard navigation, focus management, ARIA labels | 45 min |
| Performance | Image optimization, lazy loading, bundle analysis | 30 min |
| Edge Cases | Empty states, long text, special characters, concurrent edits | 45 min |

**Deliverables:** Production-ready polish.

**Dependencies:** M1–M18

---

### 9.3 Gantt Chart Timeline

```mermaid
gantt
    title NextCMS — Timeline Pengerjaan
    dateFormat  YYYY-MM-DD
    axisFormat  %d %b

    section P0 — Foundation
    M1 Project Setup         :m1, 2026-07-12, 1d
    M2 Auth System           :m2, after m1, 1d
    M3 Admin Layout          :m3, after m1, 1d
    M4 Rich Text Editor      :m4, after m1, 1d

    section P1 — Core Content
    M7 Categories            :m7, after m3, 1d
    M8 Tags                  :m8, after m3, 1d
    M5 Post Management       :m5, after m4, 2d
    M6 Page Management       :m6, after m5, 1d
    M9 Media Management      :m9, after m3, 2d

    section P2 — Features
    M10 Menu Management      :m10, after m6, 1d
    M11 User Management      :m11, after m9, 1d
    M12 Dashboard            :m12, after m5, 1d
    M13 Appearance           :m13, after m9, 1d
    M14 General Settings     :m14, after m3, 1d
    M15 SEO Settings         :m15, after m5, 1d

    section P3 — Advanced
    M16 Permalinks           :m16, after m14, 1d
    M17 Revision History     :m17, after m5, 1d
    M18 Public Frontend      :m18, after m10, 2d
    M19 Polish & QA          :m19, after m18, 1d
```

### 9.4 Ringkasan Timeline

| Fase | Modul | Durasi | Target Selesai |
|---|---|---|---|
| **P0 — Foundation** | M1, M2, M3, M4 | Hari 1-2 | Hari ke-2 |
| **P1 — Core Content** | M5, M6, M7, M8, M9 | Hari 3-6 | Hari ke-6 |
| **P2 — Features** | M10, M11, M12, M13, M14, M15 | Hari 7-10 | Hari ke-10 |
| **P3 — Advanced** | M16, M17, M18, M19 | Hari 11-14 | Hari ke-14 |
| | **TOTAL** | | **~14 hari kerja** |

---

## 10. Risiko & Mitigasi

| # | Risiko | Impact | Probabilitas | Mitigasi |
|---|---|---|---|---|
| R1 | Tiptap extensions konflik atau breaking | 🔴 High | Medium | Pin versi, test setiap extension secara independen sebelum integrasi |
| R2 | Drag & drop menu builder kompleksitas tinggi | 🟡 Medium | High | Mulai dengan @dnd-kit contoh dasar, tambah nesting bertahap |
| R3 | Performance degradasi dengan banyak revisions | 🟡 Medium | Medium | Limit 25 revisi per entity, lazy-load diff computation |
| R4 | File upload timeout untuk file besar | 🟡 Medium | Low | Set max 10MB, gunakan streaming upload, progress feedback |
| R5 | Prisma client hot-reload leak (dev) | 🟢 Low | High | Singleton pattern di `src/lib/prisma.ts` |
| R6 | SEO sitemap performance dengan banyak post | 🟢 Low | Medium | Cache sitemap, regenerate saat content berubah (ISR) |
| R7 | NextAuth session expiry saat editing | 🟡 Medium | Medium | Set session maxAge 30 hari, auto-refresh token di background |
| R8 | Permalink structure change merusak existing URLs | 🔴 High | Low | Redirect map dari old → new permalink, warning dialog |
| R9 | Concurrent editing conflict (2 user edit post sama) | 🟡 Medium | Low | Optimistic locking via `updatedAt` check, warning jika conflict |

---

*Dokumen ini merupakan panduan teknis untuk implementasi NextCMS. Setiap modul harus diimplementasikan sesuai spesifikasi dan estimasi di atas, dengan PRD.md sebagai referensi fungsional utama.*
