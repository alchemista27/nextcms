"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createUser, updateUser } from "@/actions/user";
import MediaPicker from "@/components/admin/media-picker";

interface UserFormClientProps {
  initialData?: any;
  isOwnProfile?: boolean;
}

export default function UserFormClient({ initialData, isOwnProfile = false }: UserFormClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: "", // Always empty initially for security
    role: initialData?.role || "SUBSCRIBER",
    bio: initialData?.bio || "",
    avatar: initialData?.avatar || "",
  });

  const [showMediaPicker, setShowMediaPicker] = useState(false);

  const isEdit = !!initialData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaSelect = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
    setShowMediaPicker(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      let res;
      if (isEdit) {
        res = await updateUser(initialData.id, formData);
      } else {
        res = await createUser(formData);
      }

      if (res.success) {
        if (isOwnProfile) {
          router.push("/admin/profile");
        } else {
          router.push("/admin/users");
        }
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar Section */}
          <div className="w-full sm:w-1/3 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 border border-gray-300 mb-4 flex items-center justify-center relative group">
              {formData.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-400">
                  {formData.name.charAt(0).toUpperCase() || "?"}
                </span>
              )}
              <div 
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                onClick={() => setShowMediaPicker(true)}
              >
                <span className="text-white text-xs font-medium">Change Avatar</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowMediaPicker(true)}
              className="text-[#00704A] text-sm hover:underline font-medium"
            >
              Set Profile Picture
            </button>
            {formData.avatar && (
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, avatar: "" }))}
                className="text-red-600 text-xs hover:underline mt-2"
              >
                Remove
              </button>
            )}
          </div>

          {/* Form Fields Section */}
          <div className="w-full sm:w-2/3 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00704A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00704A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password {isEdit ? "(Leave blank to keep current)" : "*"}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!isEdit}
                minLength={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00704A]"
              />
            </div>

            {!isOwnProfile && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                >
                  <option value="SUBSCRIBER">Subscriber</option>
                  <option value="AUTHOR">Author</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Biographical Info</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                placeholder="Share a little biographical information to fill out your profile."
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-[#00704A] hover:bg-[#1E3932] text-white font-medium rounded-md text-sm disabled:opacity-50"
          >
            {isPending ? "Saving..." : isEdit ? "Update User" : "Add New User"}
          </button>
        </div>
      </form>

      {showMediaPicker && (
        <MediaPicker
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
    </div>
  );
}
