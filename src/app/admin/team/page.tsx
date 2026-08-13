import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import { deleteTeamMemberAction } from "./actions";

export default async function TeamPage() {
  await requireAuth(["ADMIN"]);

  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Team Members</h1>
          <p className="text-text-secondary text-sm mt-1">{members.length} members total</p>
        </div>
        <Link
          href="/admin/team/new"
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition text-sm font-medium flex items-center gap-2"
        >
          <span className="material-icons-outlined text-[18px]">add</span>
          Add Member
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg/50">
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border w-16">Photo</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Name</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border">Position</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-center">Order</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-center">Status</th>
                <th className="px-5 py-3 text-sm font-medium text-text-secondary border-b border-border text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-bg/50 group">
                  <td className="px-5 py-3 border-b border-border">
                    <div className="w-10 h-10 rounded-full bg-bg border border-border overflow-hidden flex items-center justify-center">
                      {member.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-icons-outlined text-text-secondary text-xl">person</span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-b border-border">
                    <div className="font-medium text-text-primary">{member.name}</div>
                    <div className="text-xs text-text-secondary font-mono">{member.slug}</div>
                  </td>
                  <td className="px-5 py-3 border-b border-border text-sm text-text-secondary">{member.position}</td>
                  <td className="px-5 py-3 border-b border-border text-center text-sm text-text-secondary">{member.order}</td>
                  <td className="px-5 py-3 border-b border-border text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${member.isActive ? "bg-[#D1FAE5] text-[#065F46]" : "bg-bg text-text-secondary"}`}>
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3 border-b border-border text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/team/${member.id}/edit`}
                        className="px-3 py-1.5 text-xs border border-border rounded-md hover:bg-bg text-text-primary transition"
                      >
                        Edit
                      </Link>
                      <form action={deleteTeamMemberAction.bind(null, member.id)}>
                        <button
                          type="submit"
                          className="px-3 py-1.5 text-xs border border-danger/30 rounded-md hover:bg-danger/5 text-danger transition"
                          onClick={(e) => { if (!confirm(`Delete ${member.name}?`)) e.preventDefault(); }}
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {members.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-text-secondary">
                    <span className="material-icons-outlined text-4xl mb-2 block opacity-40">badge</span>
                    No team members yet.{" "}
                    <Link href="/admin/team/new" className="text-primary hover:underline">Add one</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
