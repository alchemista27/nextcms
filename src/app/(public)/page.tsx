import HeroSection from "@/components/themes/school-profile/home/hero";
import InfoBoxesSection from "@/components/themes/school-profile/home/info-boxes";
import AboutSection from "@/components/themes/school-profile/home/about-section";
import StatsSection from "@/components/themes/school-profile/home/stats-section";
import TeachersSection from "@/components/themes/school-profile/home/teachers-section";
import GallerySection from "@/components/themes/school-profile/home/gallery-section";
import TestimonialSection from "@/components/themes/school-profile/home/testimonial-section";
import NewsSection from "@/components/themes/school-profile/home/news-section";
import CtaSection from "@/components/themes/school-profile/home/cta-section";

import prisma from "@/lib/prisma";

export default async function PublicHomePage() {
  // Fetch data for the home page in parallel
  const [teachers, gallery, testimonials, news] = await Promise.all([
    prisma.teamMember.findMany({ orderBy: { order: "asc" }, take: 4 }),
    prisma.galleryImage.findMany({ orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 3 }),
    prisma.post.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: {
        author: {
          include: {
            sharedUser: true,
          }
        },
        categories: true,
      },
    }),
  ]);

  // Format news author data to match the component's expectation
  const formattedNews = news.map((post: any) => ({
    ...post,
    author: {
      user_metadata: {
        full_name: post.author?.sharedUser?.full_name || "Admin"
      }
    }
  }));

  return (
    <>
      <HeroSection />
      <InfoBoxesSection />
      <AboutSection />
      <StatsSection />
      <TeachersSection teachers={teachers} />
      <GallerySection images={gallery} />
      <TestimonialSection testimonials={testimonials} />
      <NewsSection posts={formattedNews} />
      <CtaSection />
    </>
  );
}
