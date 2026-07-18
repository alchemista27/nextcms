import { getTags } from "@/actions/tag";
import TagManager from "./tag-manager";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tags - NextCMS Admin",
};

export default async function TagsPage() {
  const result = await getTags();
  const tags = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Tags</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage tags for your posts.
        </p>
      </div>

      <TagManager initialTags={tags || []} />
    </div>
  );
}
