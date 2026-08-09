import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const user = await requireAuth(["ADMIN"]);

  const users = await prisma.cmsUser.findMany({
    include: {
      sharedUser: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg border-b border-border">
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Email</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider">Joined</th>
              <th className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-bg/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold mr-3 uppercase">
                      {u.sharedUser?.fullName?.charAt(0) || u.sharedUser?.email?.charAt(0)}
                    </div>
                    <div className="font-medium text-text-primary">
                      {u.sharedUser?.fullName || "No Name"}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-text-secondary">
                  {u.sharedUser?.email}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    u.role === "ADMIN" ? "bg-red-100 text-red-700" :
                    u.role === "CONTRIBUTOR" ? "bg-blue-100 text-blue-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {u.role.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-text-secondary text-sm">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  {user.role === "ADMIN" ? (
                    <Link
                      href={`/admin/users/${u.id}/edit`}
                      className="text-primary hover:text-primary-dark font-medium text-sm"
                    >
                      Edit Role
                    </Link>
                  ) : (
                    <span className="text-gray-400 text-sm italic">Not allowed</span>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-text-secondary">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
