import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { TeamForm } from "../../TeamForm";
import { notFound } from "next/navigation";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuth(["ADMIN"]);
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Edit Team Member</h1>
        <p className="text-text-secondary text-sm mt-1">{member.name}</p>
      </div>
      <TeamForm initialData={member} />
    </div>
  );
}
