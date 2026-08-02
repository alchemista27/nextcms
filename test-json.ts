import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
  await prisma.appearance.upsert({
    where: { key: 'active_theme' },
    update: { value: 'school-profile' },
    create: { key: 'active_theme', value: 'school-profile' }
  });
  await prisma.appearance.upsert({
    where: { key: 'theme_school_profile' },
    update: { value: { hero: { title: "Test Save" } } },
    create: { key: 'theme_school_profile', value: { hero: { title: "Test Save" } } }
  });
  console.log("Saved.");
  prisma.$disconnect();
}
run().catch(console.error);
