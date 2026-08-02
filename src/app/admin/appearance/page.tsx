import { getAppearanceSettings } from "@/actions/appearance";
import AppearanceForm from "@/components/admin/appearance-form";

export const metadata = {
  title: "Appearance Settings - NextCMS",
};

export default async function AppearancePage() {
  const { data, error } = await getAppearanceSettings();

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1E3932] mb-2">Appearance Settings</h1>
        <p className="text-gray-500">Configure your active theme and customize its settings.</p>
      </div>

      <AppearanceForm initialData={data || {}} />
    </div>
  );
}
