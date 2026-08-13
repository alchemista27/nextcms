import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await prisma.siteSetting.findMany({
    where: { key: { startsWith: "general_" } },
  });
  
  const settingsMap = siteSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value || "";
    return acc;
  }, {} as Record<string, string>);

  return {
    title: {
      default: settingsMap["general_siteTitle"] || "NextCMS",
      template: `%s | ${settingsMap["general_siteTitle"] || "NextCMS"}`,
    },
    description: settingsMap["general_siteDescription"] || "A CMS for schools and education",
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch Menus
  const headerMenu = await prisma.menu.findFirst({
    where: { location: "header" },
    include: {
      items: {
        include: {
          children: true,
        },
      },
    },
  });

  const footerMenu = await prisma.menu.findFirst({
    where: { location: "footer" },
    include: {
      items: true,
    },
  });

  // Fetch Site Settings
  const siteSettings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "general_siteTitle",
          "general_siteDescription",
          "contact_phone",
          "contact_email",
          "contact_address",
          "contact_facebook",
          "contact_instagram",
          "contact_youtube",
        ],
      },
    },
  });

  const settings = siteSettings.reduce((acc, curr) => {
    acc[curr.key] = curr.value || "";
    return acc;
  }, {} as Record<string, string>);

  // Header Menu Items array properly structured
  // In Prisma, we included children, but let's make sure it's shaped correctly for the prop
  const headerMenuItems = headerMenu?.items || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F8] font-sans selection:bg-[#0f7f6d] selection:text-white">
      <PublicHeader
        siteName={settings["general_siteTitle"]}
        phone={settings["contact_phone"]}
        email={settings["contact_email"]}
        address={settings["contact_address"]}
        facebook={settings["contact_facebook"]}
        instagram={settings["contact_instagram"]}
        youtube={settings["contact_youtube"]}
        menuItems={headerMenuItems}
      />
      
      <main className="flex-grow">
        {children}
      </main>

      <PublicFooter
        siteName={settings["general_siteTitle"]}
        siteDescription={settings["general_siteDescription"]}
        phone={settings["contact_phone"]}
        email={settings["contact_email"]}
        address={settings["contact_address"]}
        facebook={settings["contact_facebook"]}
        instagram={settings["contact_instagram"]}
        youtube={settings["contact_youtube"]}
        footerMenus={footerMenu?.items || []}
      />
    </div>
  );
}
