import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const siteSettings = await prisma.siteSetting.findMany({
    where: { key: { in: ["general_siteTitle", "general_siteDescription", "general_favicon"] } },
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
    ...(settingsMap["general_favicon"] && {
      icons: {
        icon: settingsMap["general_favicon"],
      },
    }),
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
