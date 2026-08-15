import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { AppearanceForm } from "./AppearanceForm";

export default async function AppearancePage() {
  await requireAuth(["ADMIN"]);

  // Fetch theme sections for "school-profile"
  const keys = [
    "theme:hero",
    "theme:about",
    "theme:features",
    "theme:vision",
    "theme:stats",
    "theme:cta",
    "theme:chairman",
  ];

  const appearanceData = await prisma.appearance.findMany({
    where: { key: { in: keys } },
  });

  const configMap = appearanceData.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, any>);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Appearance / Theme</h1>
        <p className="text-text-secondary text-sm mt-1">Configure sections for the public school profile theme.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <AppearanceForm
          sectionKey="theme:hero"
          title="Hero Section"
          initialData={configMap["theme:hero"] || {}}
          fields={[
            { key: "heading", label: "Heading", type: "text" },
            { key: "subheading", label: "Subheading", type: "textarea" },
            { key: "ctaText", label: "CTA Button Text", type: "text" },
            { key: "ctaLink", label: "CTA Button Link", type: "text" },
            { key: "backgroundImage", label: "Background Image", type: "image" },
          ]}
        />
        
        <AppearanceForm
          sectionKey="theme:chairman"
          title="Sambutan Ketua Yayasan"
          initialData={configMap["theme:chairman"] || {}}
          fields={[
            { key: "heading", label: "Heading", type: "text" },
            { key: "message", label: "Message / Sambutan", type: "textarea" },
            { key: "name", label: "Chairman Name", type: "text" },
            { key: "imageUrl", label: "Photo / Image", type: "image" },
          ]}
        />
        
        <AppearanceForm
          sectionKey="theme:about"
          title="About Section"
          initialData={configMap["theme:about"] || {}}
          fields={[
            { key: "heading", label: "Heading", type: "text" },
            { key: "content", label: "Content", type: "textarea" },
            { key: "imageUrl", label: "Image", type: "image" },
          ]}
        />

        <AppearanceForm
          sectionKey="theme:stats"
          title="Statistics Section"
          initialData={configMap["theme:stats"] || { items: [] }}
          fields={[
            { key: "items", label: "Statistics Items", type: "dynamic-list" },
          ]}
        />
        <AppearanceForm
          sectionKey="theme:features"
          title="Features Section (Info Boxes)"
          initialData={configMap["theme:features"] || { items: [] }}
          fields={[
            { key: "items", label: "Feature Items", type: "dynamic-list" },
          ]}
        />

        <AppearanceForm
          sectionKey="theme:cta"
          title="Call to Action (CTA) Section"
          initialData={configMap["theme:cta"] || {}}
          fields={[
            { key: "heading", label: "Heading", type: "text" },
            { key: "button1_text", label: "Primary Button Text", type: "text" },
            { key: "button1_link", label: "Primary Button Link", type: "text" },
            { key: "button2_text", label: "Secondary Button Text", type: "text" },
            { key: "button2_link", label: "Secondary Button Link", type: "text" },
          ]}
        />


        <AppearanceForm
          sectionKey="theme:vision"
          title="Vision & Mission (About Page)"
          initialData={configMap["theme:vision"] || {}}
          fields={[
            { key: "vision", label: "Vision Statement", type: "textarea" },
            { key: "mission", label: "Mission Statement", type: "textarea" },
          ]}
        />
      </div>
    </div>
  );
}
