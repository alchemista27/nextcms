import { ReactNode } from "react";
import Image from "next/image";
import { getAppearanceSettings } from "@/actions/appearance";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { data: appearance } = await getAppearanceSettings();
  
  // Set up CSS variables based on appearance settings
  const primaryColor = appearance?.primary_color || "#00704A";
  const secondaryColor = appearance?.secondary_color || "#1E3932";
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
        {/* Main Content */}
        <main className="flex-grow">
          {children}
        </main>

        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
