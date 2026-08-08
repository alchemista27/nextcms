import { requireRole } from "@/lib/auth-guard";
import { getTeamMembers } from "@/actions/team-member";
import TeamListClient from "./team-list-client";

export const metadata = {
  title: "Team Members - NextCMS",
};

export default async function TeamPage() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);
  const members = await getTeamMembers();

  return <TeamListClient initialData={members} />;
}
