import { prisma } from "@/lib/prisma";
import { SettingsForm } from "../SettingsForm";

export default async function PermalinkSettingsPage() {
  const keys = ["post_permalink"];
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });

  const initialData = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value || "";
    return acc;
  }, {} as Record<string, string>);

  const fields = [
    { key: "post_permalink", label: "Post Permalink Structure", placeholder: "e.g. /:slug", description: "Default is /:slug" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Permalink Settings</h2>
      <SettingsForm initialData={initialData} fields={fields} />
    </div>
  );
}
