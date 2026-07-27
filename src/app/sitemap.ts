import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';
import { getSettings } from '@/actions/settings';
import { generatePostUrl, PermalinkStructure } from '@/lib/permalink';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({ 
    where: { status: "PUBLISHED" },
    select: { id: true, slug: true, publishedAt: true, updatedAt: true }
  });
  const pages = await prisma.page.findMany({ 
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true }
  });
  
  const settingsRes = await getSettings(["site_url", "permalink_structure", "permalink_custom_pattern"]);
  const settings = settingsRes.data || {};
  
  const siteUrl = settings.site_url || "http://localhost:3000";
  const structure = (settings.permalink_structure as PermalinkStructure) || "post_name";
  const customPattern = settings.permalink_custom_pattern || "";

  return [
    { url: siteUrl, lastModified: new Date() },
    ...posts.map(p => ({ 
      url: `${siteUrl}${generatePostUrl(p, structure, customPattern)}`, 
      lastModified: p.updatedAt 
    })),
    ...pages.map(p => ({ 
      url: `${siteUrl}/${p.slug}`, 
      lastModified: p.updatedAt 
    })),
  ];
}
