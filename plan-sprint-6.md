# Sprint 6 Implementation Plan: Settings, Menus, & Appearance

## Goal Description
The objective of Sprint 6 is to implement the core configuration modules for the Alfida CMS. This allows administrators to manage global site settings (like site name, contact info, SEO defaults), configure dynamic navigation menus (header/footer links), and manage theme appearance data (hero sections, about blocks, etc.).

## User Review Required
> [!IMPORTANT]
> - **Schema Synchronization**: We noticed that the database contains `menus`, `menu_items`, and `appearance` tables, but these were missing from the Prisma schema in the codebase. I will update `prisma/schema.prisma` to exactly match the database structures to avoid migration issues.
> - **Appearance vs ThemeSection**: The `db-schema.md` references a `ThemeSection` table, but the actual database contains an `appearance` table (with `id`, `key`, `value` JSONB). I will map Prisma to the `appearance` table as the source of truth for theme section configurations.

## Proposed Changes

### 1. Prisma Schema Updates
#### [MODIFY] `prisma/schema.prisma`
I will add the `MenuItemType` enum and the models for `Menu`, `MenuItem`, and `Appearance` to match the PostgreSQL database exactly.

```prisma
enum MenuItemType {
  CUSTOM
  PAGE
  POST
  CATEGORY

  @@schema("cms")
}

model Menu {
  id        String     @id
  name      String
  location  String?
  createdAt DateTime   @default(now()) @map("createdAt")
  updatedAt DateTime   @updatedAt @map("updatedAt")
  items     MenuItem[]

  @@map("menus")
  @@schema("cms")
}

model MenuItem {
  id          String       @id
  label       String
  url         String?
  target      String       @default("_self")
  type        MenuItemType @default(CUSTOM)
  referenceId String?
  order       Int          @default(0)
  createdAt   DateTime     @default(now()) @map("createdAt")
  updatedAt   DateTime     @updatedAt @map("updatedAt")
  menuId      String
  parentId    String?

  menu     Menu       @relation(fields: [menuId], references: [id], onDelete: Cascade)
  parent   MenuItem?  @relation("MenuHierarchy", fields: [parentId], references: [id], onDelete: SetNull)
  children MenuItem[] @relation("MenuHierarchy")

  @@index([menuId])
  @@index([parentId])
  @@map("menu_items")
  @@schema("cms")
}

model Appearance {
  id        String   @id
  key       String   @unique
  value     Json
  updatedAt DateTime @updatedAt @map("updatedAt")

  @@map("appearance")
  @@schema("cms")
}
```

---

### 2. Zod Validators
#### [NEW] `src/lib/validations/sprint6.ts`
I will create Zod schemas for the forms:
- `SettingsFormSchema` (General & SEO keys)
- `MenuFormSchema`
- `MenuItemFormSchema`
- `AppearanceFormSchema` (for the various theme sections like Hero, About, Vision)

---

### 3. Server Actions
#### [NEW] `src/app/admin/settings/actions.ts`
- `saveSettingsAction(data)`: Upsert records into `SiteSetting` based on the keys provided (e.g. `site_title`, `meta_desc`, etc.).

#### [NEW] `src/app/admin/menus/actions.ts`
- `saveMenuAction(data)`
- `deleteMenuAction(id)`
- `saveMenuItemAction(data)`
- `deleteMenuItemAction(id)`
- `reorderMenuItemsAction(items)`

#### [NEW] `src/app/admin/appearance/actions.ts`
- `saveAppearanceAction(key, jsonValue)`: Upsert JSON data into the `appearance` table.

---

### 4. Admin UI Pages
#### [NEW] `src/app/admin/settings/(layout|page).tsx`
- Layout with a sub-navigation for `General`, `SEO`, `Permalinks`.
- Forms that fetch current values from `SiteSetting` and submit them via `saveSettingsAction`.

#### [NEW] `src/app/admin/menus/(page|form).tsx`
- Split view: left side shows a list of Menus, right side shows a tree view of `MenuItems` for the selected menu.
- Forms to add/edit menu items (Custom Link, Page, Post, Category).

#### [NEW] `src/app/admin/appearance/(page).tsx`
- A hub for theme configuration. We will build forms for specific sections (like "Hero", "About", "Stats") that serialize their data into JSON and store it in the `appearance` table under specific keys (e.g., `theme:hero`).

---

### 5. Sidebar Update
#### [MODIFY] `src/components/admin/sidebar.tsx`
- Add navigation links for `Menus` and `Appearance`.

## Verification Plan

### Automated Tests
- Run `pnpm prisma generate` to ensure the schema compiles.
- Run `pnpm build` to check for TypeScript errors.

### Manual Verification
- Check the `/admin/settings/general` page and attempt to save the site title.
- Navigate to `/admin/menus` and create a "Main Navigation" menu with some custom links.
- Navigate to `/admin/appearance` and save configuration for the "Hero" section.
- Ensure all forms have proper validation feedback and loading states.
