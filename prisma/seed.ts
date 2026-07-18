import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import prisma from '../src/lib/prisma'

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@nextcms.local' },
  })

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@nextcms.local',
        password: bcrypt.hashSync('admin123', 12),
        role: 'ADMIN',
      },
    })
    console.log('✅ Admin user created')
  }

  // Seed settings
  const settings = [
    { key: 'site_title', value: 'NextCMS' },
    { key: 'site_tagline', value: 'Just another NextCMS site' },
    { key: 'site_url', value: 'http://localhost:3000' },
    { key: 'admin_email', value: 'admin@nextcms.local' },
    { key: 'language', value: 'id' },
    { key: 'timezone', value: 'Asia/Jakarta' },
    { key: 'date_format', value: 'DD/MM/YYYY' },
    { key: 'time_format', value: 'HH:mm' },
    { key: 'posts_per_page', value: '10' },
    { key: 'registration_open', value: 'true' },
    { key: 'default_role', value: 'SUBSCRIBER' },
    { key: 'permalink_structure', value: '/blog/:slug' },
    { key: 'category_base', value: 'category' },
    { key: 'tag_base', value: 'tag' },
  ]

  for (const setting of settings) {
    await prisma.siteSettings.upsert({
      where: { key: setting.key },
      update: {},
      create: { key: setting.key, value: setting.value },
    })
  }
  console.log('✅ Settings seeded')

  // Seed appearance
  const appearance = [
    { key: 'logo', value: Prisma.JsonNull },
    { key: 'favicon', value: Prisma.JsonNull },
    { key: 'primary_color', value: '#00704A' },
    { key: 'secondary_color', value: '#1E3932' },
    { key: 'font_family', value: 'Inter' },
    { key: 'header_style', value: 'left-aligned' },
    { key: 'sidebar_position', value: 'right' },
    { key: 'footer_text', value: '© 2026 Copyright Jauharian.Dev' },
    { key: 'custom_css', value: '' },
    { key: 'custom_head', value: '' },
    { key: 'custom_footer', value: '' },
  ]

  for (const item of appearance) {
    await prisma.appearance.upsert({
      where: { key: item.key },
      update: {},
      create: { key: item.key, value: item.value },
    })
  }
  console.log('✅ Appearance seeded')

  // Default category
  await prisma.category.upsert({
    where: { slug: 'uncategorized' },
    update: {},
    create: {
      name: 'Uncategorized',
      slug: 'uncategorized',
    },
  })
  console.log('✅ Default category seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
