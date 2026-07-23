import { getUsers } from "@/actions/user";
import UserListClient from "./user-list-client";
import { Metadata } from "next";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import { requireRole } from "@/lib/auth-guard";

export const metadata: Metadata = {
  title: "Users - NextCMS Admin",
};

interface UsersPageProps {
  searchParams: Promise<{ search?: string; page?: string; role?: string }>;
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
  // Ensure only admins can access this page
  await requireRole(["ADMIN"]);

  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");
  const role = params.role || "ALL";

  const result = await getUsers(page, 10, search, role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#00704A] hover:bg-[#1E3932] text-white text-sm font-medium rounded-md transition-colors"
        >
          <AddIcon fontSize="small" />
          Add New User
        </Link>
      </div>

      <UserListClient
        initialData={result.success ? result.data || [] : []}
        total={result.success ? result.total || 0 : 0}
        totalPages={result.success ? result.totalPages || 1 : 1}
        currentSearch={search}
        currentPage={page}
        currentRole={role}
      />
    </div>
  );
}
