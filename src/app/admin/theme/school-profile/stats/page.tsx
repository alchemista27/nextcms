import { getSchoolProfileSettings } from "@/actions/school-profile";
import StatsSectionForm from "@/components/admin/theme/school-profile/stats-form";
export const metadata = { title: "Statistics - School Profile" };
export const dynamic = "force-dynamic";
export default async function StatsSectionPage() {
  const { data } = await getSchoolProfileSettings();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#454545]">Statistics Section</h1>
        <p className="text-gray-500 text-sm mt-1">Numbers displayed in the parallax statistics banner.</p>
      </div>
      <StatsSectionForm initialData={data?.stats || {}} />
    </div>
  );
}
