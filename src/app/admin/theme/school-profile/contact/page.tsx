import { getSchoolProfileSettings } from "@/actions/school-profile";
import ContactInfoForm from "@/components/admin/theme/school-profile/contact-form";
export const metadata = { title: "Contact Info - School Profile" };
export const dynamic = "force-dynamic";
export default async function ContactSectionPage() {
  const { data } = await getSchoolProfileSettings();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1E3932]">Contact Information</h1>
        <p className="text-gray-500 text-sm mt-1">Address, phone, email, social links, and footer text.</p>
      </div>
      <ContactInfoForm initialData={data?.contact || {}} />
    </div>
  );
}
