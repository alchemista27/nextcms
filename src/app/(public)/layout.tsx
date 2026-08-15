import { prisma } from "@/lib/prisma";
import PublicHeader from "@/components/public/PublicHeader";
import PublicFooter from "@/components/public/PublicFooter";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  // Fetch Site Settings
  const siteSettings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          "general_siteTitle",
          "general_siteDescription",
          "general_favicon",
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

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F8F8] font-sans selection:bg-[#0f7f6d] selection:text-white">
      <PublicHeader
        siteName={settings["general_siteTitle"]}
        favicon={settings["general_favicon"]}
        phone={settings["contact_phone"]}
        email={settings["contact_email"]}
        address={settings["contact_address"]}
        facebook={settings["contact_facebook"]}
        instagram={settings["contact_instagram"]}
        youtube={settings["contact_youtube"]}
      />
      
      <main className="flex-grow">
        {children}
      </main>

      <PublicFooter
        siteName={settings["general_siteTitle"]}
        siteDescription={settings["general_siteDescription"]}
        favicon={settings["general_favicon"]}
        phone={settings["contact_phone"]}
        email={settings["contact_email"]}
        address={settings["contact_address"]}
        facebook={settings["contact_facebook"]}
        instagram={settings["contact_instagram"]}
        youtube={settings["contact_youtube"]}
      />
    </div>
  );
}
