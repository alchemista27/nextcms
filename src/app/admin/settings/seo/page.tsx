import { prisma } from "@/lib/prisma";
import { SettingsForm } from "../SettingsForm";

export default async function SEOSettingsPage() {
  const keys = ["meta_title", "meta_description", "og_image"];
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });

  const initialData = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value || "";
    return acc;
  }, {} as Record<string, string>);

  const fields = [
    { key: "meta_title", label: "Default Meta Title", placeholder: "e.g. Yayasan Alfida" },
    { key: "meta_description", label: "Default Meta Description", type: "textarea" as const, placeholder: "Default description for search engines" },
    { key: "og_image", label: "Default Open Graph Image URL", type: "image" as const, description: "Used when sharing links on social media if the page doesn't have a specific image." },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-4">SEO Settings</h2>
      <SettingsForm initialData={initialData} fields={fields} />
    </div>
  );
}
