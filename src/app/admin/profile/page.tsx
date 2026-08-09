import { requireAuth } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-text-primary mb-6">My Profile</h1>

      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="h-32 bg-gradient-to-r from-primary to-accent"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between items-end -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-surface bg-primary flex items-center justify-center text-4xl font-bold text-white uppercase shadow-md">
              {(user.name || user.email).charAt(0)}
            </div>
            <span className="bg-primary/10 text-primary font-medium px-4 py-1.5 rounded-full text-sm">
              {user.role.replace("_", " ")}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-text-primary">
                {user.name || "User"}
              </h2>
              <p className="text-text-secondary">{user.email}</p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-text-secondary mb-1">User ID</label>
                  <div className="font-mono text-sm bg-bg p-3 rounded-lg border border-border break-all">
                    {user.id}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm flex items-start gap-3 mt-4">
              <span className="material-icons-outlined">info</span>
              <p>
                This profile information is managed centrally. To change your name, email, or password,
                please use the main authentication system settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
