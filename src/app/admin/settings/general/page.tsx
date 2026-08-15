import { prisma } from "@/lib/prisma";
import { SettingsForm } from "../SettingsForm";

export default async function GeneralSettingsPage() {
  const keys = [
    "general_siteTitle", 
    "general_siteDescription",
    "general_favicon",
    "contact_email", 
    "contact_phone", 
    "contact_address",
    "contact_facebook",
    "contact_instagram",
    "contact_youtube"
  ];
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });

  const initialData = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value || "";
    return acc;
  }, {} as Record<string, string>);

  const fields = [
    { key: "general_siteTitle", label: "Site Title", placeholder: "e.g. Yayasan Alfida Bengkulu" },
    { key: "general_siteDescription", label: "Site Description", type: "textarea" as const, placeholder: "Brief description about the school/foundation" },
    { key: "general_favicon", label: "Favicon URL", type: "url" as const, placeholder: "e.g. https://example.com/favicon.ico" },
    { key: "contact_email", label: "Contact Email", type: "email" as const, placeholder: "e.g. info@alfida.sch.id" },
    { key: "contact_phone", label: "Contact Phone", type: "tel" as const, placeholder: "e.g. +6273612345" },
    { key: "contact_address", label: "Contact Address", type: "textarea" as const, placeholder: "Full physical address" },
    { key: "contact_facebook", label: "Facebook Link", type: "text" as const, placeholder: "e.g. https://facebook.com/..." },
    { key: "contact_instagram", label: "Instagram Link", type: "text" as const, placeholder: "e.g. https://instagram.com/..." },
    { key: "contact_youtube", label: "YouTube Link", type: "text" as const, placeholder: "e.g. https://youtube.com/..." },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-4">General Settings</h2>
      <SettingsForm initialData={initialData} fields={fields} />
    </div>
  );
}
