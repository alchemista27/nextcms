"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { SlugInput } from "@/components/admin/slug-input";
import { TagInput } from "@/components/admin/tag-input";
import { useAutoSave } from "@/hooks/use-auto-save";
import { createPost, updatePost } from "@/actions/post";
import { PostInput } from "@/lib/validators/post";
import { generateSlug } from "@/lib/utils";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import PublishIcon from "@mui/icons-material/PublicOutlined";
import HistoryIcon from "@mui/icons-material/History";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PublicIcon from "@mui/icons-material/Public";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import { MediaPicker } from "@/components/admin/media-picker";
import { SeoFields } from "@/components/admin/seo-fields";
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  depth?: number;
  children?: Category[];
}

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  status: string;
  featuredImage: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  categories: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
}

interface PostEditorClientProps {
  post: Post | null;
  authorId: string;
  allCategories: Category[];
  allTags: Tag[];
  revisionCount?: number;
}

// Build hierarchical categories
function buildHierarchy(items: Category[], parentId: string | null = null, depth = 0): Category[] {
  let result: Category[] = [];
  for (const item of items) {
    if (item.parentId === parentId) {
      result.push({ ...item, depth });
      result = result.concat(buildHierarchy(items, item.id, depth + 1));
    }
  }
  return result;
}

type SidebarSection = "publish" | "categories" | "tags" | "featured" | "excerpt" | "seo";

export default function PostEditorClient({ post, authorId, allCategories, allTags, revisionCount = 0 }: PostEditorClientProps) {
  const router = useRouter();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [status, setStatus] = useState(post?.status || "DRAFT");
  const [featuredImage, setFeaturedImage] = useState(post?.featuredImage || "");
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || "");
  const [ogImage, setOgImage] = useState(post?.ogImage || "");
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    post?.categories.map((c) => c.id) || []
  );
  const [selectedTags, setSelectedTags] = useState<{ id?: string; name: string }[]>(
    post?.tags.map((t) => ({ id: t.id, name: t.name })) || []
  );

  const [openSections, setOpenSections] = useState<Record<SidebarSection, boolean>>({
    publish: true, categories: true, tags: true, featured: true, excerpt: true, seo: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const hierarchicalCategories = buildHierarchy(allCategories);

  const buildPostInput = useCallback((overrideStatus?: string): PostInput => {
    const existingTagIds = selectedTags.filter((t) => t.id).map((t) => t.id!);
    const newTagNames = selectedTags.filter((t) => !t.id).map((t) => t.name);
    return {
      title,
      slug,
      content,
      excerpt,
      status: (overrideStatus || status) as any,
      featuredImage: featuredImage || null,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      ogImage: ogImage || null,
      categoryIds: selectedCategoryIds,
      tagIds: existingTagIds,
      newTagNames,
    };
  }, [title, slug, content, excerpt, status, featuredImage, metaTitle, metaDescription, ogImage, selectedCategoryIds, selectedTags]);

  const autoSaveFn = useCallback(async (data: PostInput) => {
    if (!isEditing || !title) return { success: true };
    return await updatePost(post!.id, data, authorId);
  }, [isEditing, post, authorId, title]);

  const { statusLabel, statusColor } = useAutoSave(
    buildPostInput(),
    autoSaveFn,
    { enabled: isEditing && !!title }
  );

  const handleSave = async (overrideStatus?: string) => {
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    setIsSaving(true);
    setSaveError("");

    const data = buildPostInput(overrideStatus);

    const result = isEditing
      ? await updatePost(post!.id, data, authorId)
      : await createPost(data, authorId);

    setIsSaving(false);

    if (!result.success) {
      setSaveError(result.error || "Failed to save");
    } else {
      if (!isEditing && result.data) {
        router.push(`/admin/posts/${(result.data as any).id}/edit`);
      } else {
        router.refresh();
      }
    }
  };

  const toggleSection = (section: SidebarSection) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const SidebarCard = ({ id, title: cardTitle, children }: { id: SidebarSection; title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        onClick={() => toggleSection(id)}
      >
        {cardTitle}
        {openSections[id] ? <ExpandLessIcon fontSize="small" className="text-gray-400" /> : <ExpandMoreIcon fontSize="small" className="text-gray-400" />}
      </button>
      {openSections[id] && <div className="px-4 pb-4 pt-1 border-t border-gray-100">{children}</div>}
    </div>
  );

  return (
    <div className="space-y-0">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <a href="/admin/posts" className="text-gray-400 hover:text-gray-600 text-sm">← Posts</a>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
          {isEditing && statusLabel && (
            <span className={`text-xs ${statusColor}`}>{statusLabel}</span>
          )}
        </div>
        {saveError && <span className="text-sm text-red-500">{saveError}</span>}
      </div>

      {/* Main Layout */}
      <div className="flex gap-6 items-start">
        {/* Main Content */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* Title */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3">
            <input
              type="text"
              placeholder="Enter post title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent resize-none"
            />
            <SlugInput
              value={slug}
              onChange={setSlug}
              title={title}
              postId={post?.id}
            />
          </div>

          {/* Rich Text Editor */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your post…"
          />

          {/* Excerpt Area */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("excerpt")}
            >
              Excerpt
              {openSections.excerpt ? <ExpandLessIcon fontSize="small" className="text-gray-400" /> : <ExpandMoreIcon fontSize="small" className="text-gray-400" />}
            </button>
            {openSections.excerpt && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-100">
                <textarea
                  rows={3}
                  placeholder="Write a short description…"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A] resize-none"
                />
                <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from content.</p>
              </div>
            )}
          </div>

          {/* SEO Area */}
          <SeoFields
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            ogImage={ogImage}
            slug={`blog/${slug}`}
            postTitle={title}
            excerpt={excerpt}
            onMetaTitleChange={setMetaTitle}
            onMetaDescriptionChange={setMetaDescription}
            onOgImageChange={setOgImage}
            isOpen={openSections.seo}
            onToggle={() => toggleSection("seo")}
          />
        </div>

        {/* Sidebar */}
        <div className="w-72 flex-shrink-0 space-y-3 sticky top-20">
          {/* Publish Box */}
          <SidebarCard id="publish" title="Publish">
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Visibility</label>
                <div className="text-sm text-gray-700 flex items-center gap-1"><PublicIcon fontSize="small" className="text-gray-500"/> Public</div>
              </div>
              {isEditing && revisionCount > 0 && (
                <div>
                  <a href={`/admin/revisions/post/${post.id}`} className="text-xs text-[#00704A] hover:underline flex items-center gap-1 mt-1">
                    <HistoryIcon fontSize="small" /> {revisionCount} Revisions
                  </a>
                </div>
              )}
              <hr className="border-gray-100" />
              <div className="flex gap-2">
                <button
                  onClick={() => handleSave("DRAFT")}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <SaveIcon fontSize="small" />
                  {isSaving ? "Saving…" : "Save Draft"}
                </button>
                <button
                  onClick={() => handleSave("PUBLISHED")}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#00704A] hover:bg-[#1E3932] text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <PublishIcon fontSize="small" />
                  {status === "PUBLISHED" ? "Update" : "Publish"}
                </button>
              </div>
            </div>
          </SidebarCard>

          {/* Categories */}
          <SidebarCard id="categories" title="Categories">
            <div className="space-y-1.5 max-h-48 overflow-y-auto pt-1">
              {hierarchicalCategories.length === 0 ? (
                <p className="text-xs text-gray-400">No categories yet.</p>
              ) : (
                hierarchicalCategories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-1 py-0.5 rounded">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(cat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds((prev) => [...prev, cat.id]);
                        } else {
                          setSelectedCategoryIds((prev) => prev.filter((id) => id !== cat.id));
                        }
                      }}
                      className="rounded border-gray-300 text-[#00704A] focus:ring-[#00704A]"
                    />
                    <span className="text-sm text-gray-700">
                      {"— ".repeat(cat.depth || 0)}{cat.name}
                    </span>
                  </label>
                ))
              )}
            </div>
            <a href="/admin/categories" target="_blank" className="text-xs text-[#00704A] hover:underline mt-2 block">
              + Add New Category
            </a>
          </SidebarCard>

          {/* Tags */}
          <SidebarCard id="tags" title="Tags">
            <div className="pt-1">
              <TagInput
                value={selectedTags}
                onChange={setSelectedTags}
                availableTags={allTags}
                placeholder="Add tags…"
              />
              <p className="text-xs text-gray-400 mt-1.5">Separate tags with commas or press Enter.</p>
            </div>
          </SidebarCard>

          {/* Featured Image */}
          <SidebarCard id="featured" title="Featured Image">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => setIsMediaPickerOpen(true)}>
              {featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featuredImage} alt="Featured" className="w-full h-auto rounded" />
              ) : (
                <>
                  <ImageIcon className="text-gray-400 mb-2" />
                  <span className="text-sm font-medium">Set Featured Image</span>
                </>
              )}
            </div>
            {featuredImage && (
              <button 
                onClick={() => setFeaturedImage("")}
                className="w-full mt-2 text-sm text-red-600 hover:underline"
              >
                Remove image
              </button>
            )}
          </SidebarCard>
        </div>
      </div>
      <MediaPicker
        open={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => setFeaturedImage(media.url)}
      />
    </div>
  );
}
