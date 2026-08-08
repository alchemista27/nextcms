import { ReactNode } from "react";
import Image from "next/image";
import { getAppearanceSettings } from "@/actions/appearance";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import PublicHeader from "@/components/themes/school-profile/layout/public-header";
import PublicFooter from "@/components/themes/school-profile/layout/public-footer";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { data: appearance } = await getAppearanceSettings();
  
  // Set up CSS variables based on appearance settings
  const primaryColor = appearance?.primary_color || "#0f7f6d";
  const secondaryColor = appearance?.secondary_color || "#454545";
  const footerText = appearance?.footer_text || "© 2026 NextCMS. All rights reserved.";

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary-color: ${primaryColor};
              --secondary-color: ${secondaryColor};
            }
          `
        }} />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <PublicHeader />
        
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        <PublicFooter />

        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
