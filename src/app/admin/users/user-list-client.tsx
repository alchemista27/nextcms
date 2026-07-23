"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { bulkActionUsers } from "@/actions/user";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import SearchIcon from "@mui/icons-material/Search";
import { useSession } from "next-auth/react";

interface UserListClientProps {
  initialData: any[];
  total: number;
  totalPages: number;
  currentSearch: string;
  currentPage: number;
  currentRole: string;
}

export default function UserListClient({
  initialData,
  total,
  totalPages,
  currentSearch,
  currentPage,
  currentRole,
}: UserListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState("");
  const [bulkRole, setBulkRole] = useState("");

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || undefined, page: "1" });
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Don't select the current user
      const selectable = initialData.filter(u => u.id !== session?.user?.id).map((u) => u.id);
      setSelectedIds(selectable);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = () => {
    if (!bulkAction || selectedIds.length === 0) return;
    
    if (bulkAction === "delete") {
      if (!confirm(`Are you sure you want to delete ${selectedIds.length} users?`)) return;
    }
    
    startTransition(async () => {
      await bulkActionUsers(selectedIds, bulkAction, bulkRole);
      setSelectedIds([]);
      setBulkAction("");
      setBulkRole("");
    });
  };

  const roles = [
    { value: "ALL", label: "All" },
    { value: "ADMIN", label: "Administrator" },
    { value: "EDITOR", label: "Editor" },
    { value: "AUTHOR", label: "Author" },
    { value: "SUBSCRIBER", label: "Subscriber" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN": return "bg-red-100 text-red-800";
      case "EDITOR": return "bg-blue-100 text-blue-800";
      case "AUTHOR": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 text-sm">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => updateParams({ role: r.value === "ALL" ? undefined : r.value, page: "1" })}
              className={`transition-colors ${currentRole === r.value ? "text-[#00704A] font-semibold" : "text-gray-500 hover:text-gray-900"}`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="border border-gray-300 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00704A]"
              >
                <option value="">Bulk Actions</option>
                <option value="changeRole">Change Role to...</option>
                <option value="delete">Delete</option>
              </select>
              
              {bulkAction === "changeRole" && (
                <select
                  value={bulkRole}
                  onChange={(e) => setBulkRole(e.target.value)}
                  className="border border-gray-300 rounded-md text-sm px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                >
                  <option value="">— Select Role —</option>
                  <option value="ADMIN">Administrator</option>
                  <option value="EDITOR">Editor</option>
                  <option value="AUTHOR">Author</option>
                  <option value="SUBSCRIBER">Subscriber</option>
                </select>
              )}
              
              <button
                onClick={handleBulkAction}
                disabled={isPending || !bulkAction || (bulkAction === 'changeRole' && !bulkRole)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          )}

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A] w-64"
              />
            </div>
            <button type="submit" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="w-12 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === initialData.filter(u => u.id !== session?.user?.id).length && initialData.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#00704A] focus:ring-[#00704A]"
                  />
                </th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3 text-center">Posts</th>
                <th className="px-4 py-3">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {initialData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                initialData.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 group">
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(user.id)}
                        onChange={() => handleSelectOne(user.id)}
                        disabled={user.id === session?.user?.id}
                        className="rounded border-gray-300 text-[#00704A] focus:ring-[#00704A] disabled:opacity-50"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00704A] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden">
                          {user.avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <Link href={`/admin/users/${user.id}/edit`} className="font-semibold text-[#00704A] hover:underline">
                            {user.name} {user.id === session?.user?.id && <span className="text-gray-400 font-normal ml-1">(You)</span>}
                          </Link>
                          <div className="flex gap-2 text-xs text-gray-500 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/users/${user.id}/edit`} className="text-[#00704A] hover:underline">Edit</Link>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-600">
                      {user._count?.posts || 0}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-500">
              Showing {Math.min((currentPage - 1) * 10 + 1, total)}–{Math.min(currentPage * 10, total)} of {total}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => updateParams({ page: String(p) })}
                  className={`px-3 py-1 text-sm rounded ${
                    p === currentPage ? "bg-[#00704A] text-white" : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                disabled={currentPage >= totalPages}
                className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
