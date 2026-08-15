import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartschool.edu';

  // Static routes
  const routes = ['', '/about', '/team', '/gallery', '/testimony', '/blog', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic posts
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, updatedAt: true },
  });

  const postRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  // Dynamic team members
  const teamMembers = await prisma.teamMember.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const teamRoutes = teamMembers.map((member) => ({
    url: `${baseUrl}/team/${member.slug}`,
    lastModified: member.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...routes, ...postRoutes, ...teamRoutes];
}
