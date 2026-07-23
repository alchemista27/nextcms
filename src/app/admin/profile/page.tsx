import UserFormClient from "../users/user-form-client";
import { Metadata } from "next";
import { requireAuth } from "@/lib/auth-guard";
import { getUserById } from "@/actions/user";

export const metadata: Metadata = {
  title: "Your Profile - NextCMS Admin",
};

export default async function ProfilePage() {
  const session = await requireAuth();
  
  const res = await getUserById(session.user.id);
  
  if (!res.success || !res.data) {
    return <div>Error loading profile</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Your Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>

      <UserFormClient initialData={res.data} isOwnProfile={true} />
    </div>
  );
}
