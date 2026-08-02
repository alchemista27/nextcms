import { getSchoolProfileSettings } from "@/actions/school-profile";
import CTASectionForm from "@/components/admin/theme/school-profile/cta-form";
export const metadata = { title: "CTA Section - School Profile" };
export const dynamic = "force-dynamic";
export default async function CTASectionPage() {
  const { data } = await getSchoolProfileSettings();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3932]">CTA Section</h1>
        <p className="text-gray-500 text-sm mt-1">Call-to-action enrollment section at the bottom of the page.</p>
      </div>
      <CTASectionForm initialData={data?.cta || {}} />
    </div>
  );
}
