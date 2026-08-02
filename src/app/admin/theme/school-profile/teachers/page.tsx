import { getSchoolProfileSettings } from "@/actions/school-profile";
import TeachersForm from "@/components/admin/theme/school-profile/teachers-form";
export const metadata = { title: "Teachers - School Profile" };
export const dynamic = "force-dynamic";
export default async function TeachersSectionPage() {
  const { data } = await getSchoolProfileSettings();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3932]">Teachers Section</h1>
        <p className="text-gray-500 text-sm mt-1">Featured teacher profiles shown on the homepage.</p>
      </div>
      <TeachersForm initialData={data?.teachers || []} />
    </div>
  );
}
