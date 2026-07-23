import UserFormClient from "../user-form-client";
import { Metadata } from "next";
import { requireRole } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Add New User - NextCMS Admin",
};

export default async function NewUserPage() {
  await requireRole(["ADMIN"]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Add New User</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new user and add them to this site.</p>
      </div>

      <UserFormClient />
    </div>
  );
}
