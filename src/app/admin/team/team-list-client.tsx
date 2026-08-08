"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteTeamMember } from "@/actions/team-member";
import { toast } from "sonner";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function TeamListClient({ initialData }: { initialData: any[] }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.position.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this team member?")) return;
    const res = await deleteTeamMember(id);
    if (res.success) {
      toast.success("Team member deleted");
      setData((prev) => prev.filter((item) => item.id !== id));
    } else {
      toast.error(res.error || "Failed to delete");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#454545]">Team & Staff</h1>
        <Link
          href="/admin/team/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#0f7f6d] text-white rounded hover:bg-[#0f7f6d]/90 transition-colors"
        >
          <AddIcon className="w-5 h-5" />
          Add Member
        </Link>
      </div>

      <div className="bg-white border border-[#E3E8E7] rounded-lg shadow-sm">
        <div className="p-4 border-b border-[#E3E8E7] flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#E3E8E7] rounded w-full sm:w-64 focus:outline-none focus:ring-1 focus:ring-[#0f7f6d] focus:border-[#0f7f6d]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F7F8F8] text-[#454545] border-b border-[#E3E8E7]">
              <tr>
                <th className="px-4 py-3 w-16">Photo</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3 w-24">Order</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3E8E7]">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No team members found.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 group">
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-[#0f7f6d] text-white flex items-center justify-center overflow-hidden shrink-0">
                        {item.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold">{item.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#454545]">{item.name}</td>
                    <td className="px-4 py-3 text-gray-600">{item.position}</td>
                    <td className="px-4 py-3 text-gray-600 text-center">{item.order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/team/${item.id}/edit`}
                          className="p-1.5 text-gray-500 hover:text-[#0f7f6d] hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <EditIcon className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <DeleteIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
