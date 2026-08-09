import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateUserRole } from "./actions";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAuth(["ADMIN"]);

  const resolvedParams = await params;
  const targetId = resolvedParams.id;

  const targetUser = await prisma.cmsUser.findUnique({
    where: { id: targetId },
    include: { sharedUser: true },
  });

  if (!targetUser) {
    notFound();
  }

  const updateRoleWithId = updateUserRole.bind(null, targetId);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Edit User Role</h1>
        <Link href="/admin/users" className="text-text-secondary hover:text-text-primary">
          ← Back to Users
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
        <div className="mb-6 pb-6 border-b border-border">
          <h2 className="text-lg font-semibold text-text-primary mb-2">User Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Name</p>
              <p className="font-medium">{targetUser.sharedUser?.fullName || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Email</p>
              <p className="font-medium">{targetUser.sharedUser?.email}</p>
            </div>
          </div>
        </div>

        <form action={updateRoleWithId}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-2">
              Role
            </label>
            <select
              name="role"
              defaultValue={targetUser.role}
              className="w-full p-3 border border-border rounded-lg bg-bg focus:ring-1 focus:ring-primary outline-none"
            >
              <option value="ADMIN">Admin</option>
              <option value="CONTRIBUTOR">Contributor</option>
              <option value="SUBSCRIBER">Subscriber</option>
            </select>
            <p className="text-xs text-text-secondary mt-2">
              Admin dapat mengelola konten dan pengguna. Contributor hanya dapat mengelola konten sendiri. Subscriber hanya bisa membaca.
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              href="/admin/users"
              className="px-4 py-2 border border-border text-text-primary rounded-lg hover:bg-bg transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
