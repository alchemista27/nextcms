import { requireAuth } from "@/lib/auth";
import { MenuForm } from "../MenuForm";

export default async function NewMenuPage() {
  await requireAuth(["ADMIN"]);
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Add Menu</h1>
      <MenuForm />
    </div>
  );
}
