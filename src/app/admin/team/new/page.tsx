import { requireRole } from "@/lib/auth-guard";
import TeamFormClient from "../team-form-client";

export const metadata = {
  title: "Add New Team Member - NextCMS",
};

export default async function NewTeamMemberPage() {
  await requireRole(["ADMIN", "CONTRIBUTOR"]);

  return <TeamFormClient />;
}
