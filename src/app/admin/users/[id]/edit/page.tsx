import UserFormClient from "../../user-form-client";
import { Metadata } from "next";
import { getUserById } from "@/actions/user";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit User - NextCMS Admin",
};

interface EditUserPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params;
  const res = await getUserById(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Edit User</h1>
      </div>

      <UserFormClient initialData={res.data} />
    </div>
  );
}
