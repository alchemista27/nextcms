"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { SlugInput } from "@/components/admin/slug-input";
import { useAutoSave } from "@/hooks/use-auto-save";
import { createPage, updatePage } from "@/actions/page";
import { PageInput } from "@/lib/validators/page";
import { generateSlug } from "@/lib/utils";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import PublishIcon from "@mui/icons-material/PublicOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PublicIcon from "@mui/icons-material/Public";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import { MediaPicker } from "@/components/admin/media-picker";

interface ParentPage {
  id: string;
  title: string;
  parentId: string | null;
  depth?: number;
}

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  status: string;
  template: string;
  menuOrder: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  parentId: string | null;
}

interface PageEditorClientProps {
  page: Page | null;
  authorId: string;
  allPages: ParentPage[];
}

// Build hierarchical pages
function buildHierarchy(items: ParentPage[], parentId: string | null = null, depth = 0, currentId: string | null = null): ParentPage[] {
  let result: ParentPage[] = [];
  for (const item of items) {
    if (item.id === currentId) continue; // Prevent self-nesting
    if (item.parentId === parentId) {
      result.push({ ...item, depth });
      result = result.concat(buildHierarchy(items, item.id, depth + 1, currentId));
    }
  }
  return result;
}

type SidebarSection = "publish" | "attributes" | "seo" | "featured";

export default function PageEditorClient({ page, authorId, allPages }: PageEditorClientProps) {
  const router = useRouter();
  const isEditing = !!page;

  const [title, setTitle] = useState(page?.title || "");
  const [slug, setSlug] = useState(page?.slug || "");
  const [content, setContent] = useState(page?.content || "");
  const [status, setStatus] = useState(page?.status || "DRAFT");
  const [template, setTemplate] = useState(page?.template || "default");
  const [menuOrder, setMenuOrder] = useState(page?.menuOrder || 0);
  const [parentId, setParentId] = useState(page?.parentId || "");
  const [metaTitle, setMetaTitle] = useState(page?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(page?.metaDescription || "");
  const [ogImage, setOgImage] = useState(page?.ogImage || "");

  const [openSections, setOpenSections] = useState<Record<SidebarSection, boolean>>({
    publish: true, attributes: true, featured: true, seo: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const hierarchicalPages = buildHierarchy(allPages, null, 0, page?.id || null);

  const buildPageInput = useCallback((overrideStatus?: string): PageInput => {
    return {
      title,
      slug,
      content,
      status: (overrideStatus || status) as any,
      template,
      menuOrder: Number(menuOrder),
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
      ogImage: ogImage || null,
      parentId: parentId || null,
    };
  }, [title, slug, content, status, template, menuOrder, metaTitle, metaDescription, ogImage, parentId]);

  const autoSaveFn = useCallback(async (data: PageInput) => {
    if (!isEditing || !title) return { success: true };
    return await updatePage(page!.id, data, authorId);
  }, [isEditing, page, authorId, title]);

  const { statusLabel, statusColor } = useAutoSave(
    buildPageInput(),
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

    const data = buildPageInput(overrideStatus);

    const result = isEditing
      ? await updatePage(page!.id, data, authorId)
      : await createPage(data, authorId);

    setIsSaving(false);

    if (!result.success) {
      setSaveError(result.error || "Failed to save");
    } else {
      if (!isEditing && result.data) {
        router.push(`/admin/pages/${(result.data as any).id}/edit`);
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
          <a href="/admin/pages" className="text-gray-400 hover:text-gray-600 text-sm">← Pages</a>
          <h1 className="text-lg font-semibold text-gray-900">
            {isEditing ? "Edit Page" : "New Page"}
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
              placeholder="Enter page title…"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent resize-none"
            />
            <SlugInput
              value={slug}
              onChange={setSlug}
              title={title}
              postId={page?.id}
            />
          </div>

          {/* Rich Text Editor */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your page…"
          />

          {/* SEO Area */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection("seo")}
            >
              SEO Configuration
              {openSections.seo ? <ExpandLessIcon fontSize="small" className="text-gray-400" /> : <ExpandMoreIcon fontSize="small" className="text-gray-400" />}
            </button>
            {openSections.seo && (
              <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder={title || "Page Title"}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{metaTitle.length}/60</div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A] resize-none"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{metaDescription.length}/160</div>
                </div>
                
                {/* Search Preview */}
                <div className="pt-2">
                  <label className="block text-xs font-medium text-gray-700 mb-2">Google Preview</label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate">
                      {metaTitle || title || "Page Title"} - NextCMS
                    </p>
                    <p className="text-[#006621] text-[14px]">nextcms.local › {slug}</p>
                    <p className="text-[#545454] text-[14px] leading-snug line-clamp-2">{metaDescription || "No description."}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
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
                  <option value="PUBLISHED">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Visibility</label>
                <div className="text-sm text-gray-700 flex items-center gap-1"><PublicIcon fontSize="small" className="text-gray-500" /> Public</div>
              </div>
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

          {/* Page Attributes */}
          <SidebarCard id="attributes" title="Page Attributes">
             <div className="space-y-3 pt-1">
               <div>
                 <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Parent Page</label>
                 <select
                   value={parentId}
                   onChange={(e) => setParentId(e.target.value)}
                   className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                 >
                   <option value="">(No Parent)</option>
                   {hierarchicalPages.map((p) => (
                     <option key={p.id} value={p.id}>
                       {"—".repeat(p.depth || 0)} {p.title}
                     </option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Template</label>
                 <select
                   value={template}
                   onChange={(e) => setTemplate(e.target.value)}
                   className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                 >
                   <option value="default">Default Template</option>
                   <option value="full-width">Full Width</option>
                   <option value="sidebar">With Sidebar</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Menu Order</label>
                 <input
                   type="number"
                   value={menuOrder}
                   onChange={(e) => setMenuOrder(Number(e.target.value))}
                   className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                 />
               </div>
             </div>
          </SidebarCard>

          {/* Featured Image */}
          <SidebarCard id="featured" title="Featured Image">
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer" onClick={() => setIsMediaPickerOpen(true)}>
              {ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={ogImage} alt="Featured" className="w-full h-auto rounded" />
              ) : (
                <>
                  <ImageIcon className="text-gray-400 mb-2" />
                  <span className="text-sm font-medium">Set Featured Image</span>
                </>
              )}
            </div>
            {ogImage && (
              <button 
                onClick={() => setOgImage("")}
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
        onSelect={(media) => setOgImage(media.url)}
      />
    </div>
  );
}
