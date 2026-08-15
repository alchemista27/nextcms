# Deployment Guide

This document outlines the steps to deploy the Alfida CMS to production.

## 1. Prerequisites
- A GitHub repository containing this codebase.
- A **Vercel** account (or any Next.js compatible hosting).
- A **Supabase** account for PostgreSQL and Auth.
- A **Cloudinary** account for media storage.

## 2. Supabase Setup
1. Create a new project in Supabase.
2. Under **SQL Editor**, run the contents of `prisma/schema.prisma` using `npx prisma db push` (or generate a migration and run it).
   - Alternatively, you can run `npx prisma migrate deploy` in your CI/CD pipeline.
3. Under **Authentication > Providers**, ensure Email/Password is enabled.
4. Obtain your credentials from **Project Settings > API**:
   - `Project URL`
   - `anon public key`
   - `service_role secret` (KEEP THIS SAFE)
5. Under **Database**, obtain your Connection String (URI). Make sure to use the Transaction Pooler (port 6543).

## 3. Cloudinary Setup
1. Create a free Cloudinary account.
2. In the Dashboard, find your **Cloud Name**, **API Key**, and **API Secret**.
3. Create an upload preset if necessary, or just use the Node SDK as currently configured.

## 4. Vercel Deployment
1. Log into Vercel and click **Add New > Project**.
2. Import your GitHub repository.
3. In the **Environment Variables** section, add the following exactly as they appear:

```env
DATABASE_URL="postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"
DIRECT_URL="postgres://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"

NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

NEXT_PUBLIC_SITE_URL="https://your-production-domain.com"
```

4. The **Build Command** should automatically be detected as `next build`.
   - Ensure the `package.json` contains `"build": "prisma generate && next build"` so the Prisma client is generated before compiling Next.js.
5. Click **Deploy**.

## 5. Post-Deployment (First Admin)
Since the CMS restricts registration, you must create the first admin user manually via the Supabase Dashboard, or by seeding the database.
1. Go to Supabase Dashboard > Authentication > Users.
2. Click **Add User > Create New User**. Enter an email and password.
3. Go to the **Table Editor** > `User` table (if you sync auth users to public users) and ensure the `role` is set to `ADMIN`.
4. Log into the Vercel URL with these credentials.
