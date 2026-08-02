import { getSchoolProfileSettings } from "@/actions/school-profile";
import AboutSectionForm from "@/components/admin/theme/school-profile/about-form";
export const metadata = { title: "About Section - School Profile" };
export const dynamic = "force-dynamic";
export default async function AboutSectionPage() {
  const { data } = await getSchoolProfileSettings();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3932]">About & Features</h1>
        <p className="text-gray-500 text-sm mt-1">School description, features list, and principal quote card.</p>
      </div>
      <AboutSectionForm initialData={data?.about || {}} />
    </div>
  );
}
