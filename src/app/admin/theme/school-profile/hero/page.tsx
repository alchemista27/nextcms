import { getSchoolProfileSettings } from "@/actions/school-profile";
import HeroSectionForm from "@/components/admin/theme/school-profile/hero-form";

export const metadata = { title: "Hero Section - School Profile" };
export const dynamic = "force-dynamic";

export default async function HeroSectionPage() {
  const { data } = await getSchoolProfileSettings();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3932]">Hero Section</h1>
        <p className="text-gray-500 text-sm mt-1">Edit the main hero banner displayed at the top of your homepage.</p>
      </div>
      <HeroSectionForm initialData={data?.hero || {}} />
    </div>
  );
}
