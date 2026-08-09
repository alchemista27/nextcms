import { requireAuth } from "@/lib/auth";
import { PostForm } from "../PostForm";

export default async function NewPostPage() {
  await requireAuth();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Add New Post</h1>
      </div>
      <PostForm />
    </div>
  );
}
