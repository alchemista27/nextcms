import { requireRole } from "@/lib/auth-guard";
import { getTeamMemberById } from "@/actions/team-member";
import TeamFormClient from "../../team-form-client";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Team Member - NextCMS",
};

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  
  const member = await getTeamMemberById(params.id);
  if (!member) notFound();

  return <TeamFormClient initialData={member} isEdit={true} />;
}
