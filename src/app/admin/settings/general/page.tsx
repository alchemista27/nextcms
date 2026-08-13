import { prisma } from "@/lib/prisma";
import { SettingsForm } from "../SettingsForm";

export default async function GeneralSettingsPage() {
  const keys = ["site_title", "site_description", "contact_email", "contact_phone", "contact_address"];
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });

  const initialData = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value || "";
    return acc;
  }, {} as Record<string, string>);

  const fields = [
    { key: "site_title", label: "Site Title", placeholder: "e.g. Yayasan Alfida Bengkulu" },
    { key: "site_description", label: "Site Description", type: "textarea" as const, placeholder: "Brief description about the school/foundation" },
    { key: "contact_email", label: "Contact Email", type: "email" as const, placeholder: "e.g. info@alfida.sch.id" },
    { key: "contact_phone", label: "Contact Phone", type: "tel" as const, placeholder: "e.g. +6273612345" },
    { key: "contact_address", label: "Contact Address", type: "textarea" as const, placeholder: "Full physical address" },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-4">General Settings</h2>
      <SettingsForm initialData={initialData} fields={fields} />
    </div>
  );
}
