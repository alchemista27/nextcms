import { getAppearanceSettings } from "@/actions/appearance";
import Link from "next/link";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";

const sections = [
  { name: "Hero Section", href: "hero", description: "Title, subtitle, background image, and CTA buttons" },
  { name: "About & Features", href: "about", description: "School description, features list, and principal quote" },
  { name: "Statistics", href: "stats", description: "Students enrolled, certified teachers, awards won, classrooms" },
  { name: "Teachers", href: "teachers", description: "Featured teacher profiles with photos and roles" },
  { name: "Vision & Mission", href: "vision", description: "School vision statement and mission list" },
  { name: "CTA Section", href: "cta", description: "Call-to-action enrollment section" },
  { name: "Contact Info", href: "contact", description: "Address, phone, email, and social links" },
];

export const metadata = { title: "School Profile Settings - NextCMS" };
export const dynamic = "force-dynamic";

export default async function SchoolProfileIndexPage() {
  const { data: appearance } = await getAppearanceSettings();
  const settings = appearance?.theme_school_profile as any;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#454545] flex items-center justify-center">
          <SchoolIcon className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#454545]">School Profile Theme</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all sections of your school profile homepage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={`/admin/theme/school-profile/${section.href}`}
            className="group block bg-white border border-gray-200 rounded-xl p-5 hover:border-[#0f7f6d] hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-gray-900 group-hover:text-[#0f7f6d] transition-colors">
                  {section.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{section.description}</p>
              </div>
              <span className="text-gray-300 group-hover:text-[#0f7f6d] transition-colors text-xl">›</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 bg-[#D4E9E2]/30 border border-[#0f7f6d]/20 rounded-xl">
        <p className="text-sm text-[#454545]">
          <strong>Note:</strong> Changes are saved per-section. Visit the{" "}
          <Link href="/" target="_blank" className="text-[#0f7f6d] underline">public homepage</Link>{" "}
          to preview your changes live.
        </p>
      </div>
    </div>
  );
}
