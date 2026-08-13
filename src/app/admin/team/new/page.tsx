import { requireAuth } from "@/lib/auth";
import { TeamForm } from "../TeamForm";

export default async function NewTeamMemberPage() {
  await requireAuth(["ADMIN"]);
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Add Team Member</h1>
      </div>
      <TeamForm />
    </div>
  );
}
