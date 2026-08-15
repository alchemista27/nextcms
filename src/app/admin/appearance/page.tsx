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
            { key: "backgroundImage", label: "Background Image URL", type: "text" },
          ]}
        />
        
        <AppearanceForm
          sectionKey="theme:about"
          title="About Section"
          initialData={configMap["theme:about"] || {}}
          fields={[
            { key: "heading", label: "Heading", type: "text" },
            { key: "content", label: "Content", type: "textarea" },
            { key: "imageUrl", label: "Image URL", type: "text" },
          ]}
        />

        <AppearanceForm
          sectionKey="theme:stats"
          title="Statistics Section"
          initialData={configMap["theme:stats"] || {}}
          fields={[
            { key: "stat1_label", label: "Stat 1 Label", type: "text" },
            { key: "stat1_value", label: "Stat 1 Value", type: "text" },
            { key: "stat2_label", label: "Stat 2 Label", type: "text" },
            { key: "stat2_value", label: "Stat 2 Value", type: "text" },
            { key: "stat3_label", label: "Stat 3 Label", type: "text" },
            { key: "stat3_value", label: "Stat 3 Value", type: "text" },
          ]}
        />
        <AppearanceForm
          sectionKey="theme:features"
          title="Features Section (Info Boxes)"
          initialData={configMap["theme:features"] || {}}
          fields={[
            { key: "box1_title", label: "Box 1 Title", type: "text" },
            { key: "box1_desc", label: "Box 1 Description", type: "textarea" },
            { key: "box2_title", label: "Box 2 Title", type: "text" },
            { key: "box2_desc", label: "Box 2 Description", type: "textarea" },
            { key: "box3_title", label: "Box 3 Title", type: "text" },
            { key: "box3_desc", label: "Box 3 Description", type: "textarea" },
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
