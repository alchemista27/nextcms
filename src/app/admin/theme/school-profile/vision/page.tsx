import { getSchoolProfileSettings } from "@/actions/school-profile";
import VisionMissionForm from "@/components/admin/theme/school-profile/vision-form";
export const metadata = { title: "Vision & Mission - School Profile" };
export const dynamic = "force-dynamic";
export default async function VisionSectionPage() {
  const { data } = await getSchoolProfileSettings();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3932]">Vision & Mission</h1>
        <p className="text-gray-500 text-sm mt-1">School vision statement and list of mission items.</p>
      </div>
      <VisionMissionForm initialData={data?.visionMission || {}} />
    </div>
  );
}
