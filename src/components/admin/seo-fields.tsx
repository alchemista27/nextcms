import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ImageIcon from "@mui/icons-material/ImageOutlined";
import { MediaPicker } from "@/components/admin/media-picker";

interface SeoFieldsProps {
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
  slug: string;
  postTitle: string;
  excerpt?: string;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onOgImageChange: (v: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function SeoFields({
  metaTitle,
  metaDescription,
  ogImage,
  slug,
  postTitle,
  excerpt,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onOgImageChange,
  isOpen,
  onToggle,
}: SeoFieldsProps) {
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        SEO Configuration
        {isOpen ? (
          <ExpandLessIcon fontSize="small" className="text-gray-400" />
        ) : (
          <ExpandMoreIcon fontSize="small" className="text-gray-400" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              placeholder={postTitle || "Post title"}
              value={metaTitle}
              onChange={(e) => onMetaTitleChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A]"
            />
            <p className="text-xs text-gray-400 mt-1">
              {metaTitle.length}/60 chars
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe this for search engines…"
              value={metaDescription}
              onChange={(e) => onMetaDescriptionChange(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A] resize-none"
            />
            <p
              className={`text-xs mt-1 ${
                metaDescription.length > 160
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {metaDescription.length}/160 chars
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Open Graph Image
            </label>
            <div
              className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors cursor-pointer"
              onClick={() => setIsMediaPickerOpen(true)}
            >
              {ogImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={ogImage}
                  alt="OG preview"
                  className="w-full h-auto max-h-48 object-contain rounded"
                />
              ) : (
                <>
                  <ImageIcon className="text-gray-400 mb-2" />
                  <span className="text-sm font-medium">Set OG Image</span>
                </>
              )}
            </div>
            {ogImage && (
              <button
                onClick={() => onOgImageChange("")}
                className="text-xs text-red-600 hover:underline mt-1"
              >
                Remove image
              </button>
            )}
          </div>

          {/* Google preview */}
          {(postTitle || metaDescription) && (
            <div className="border border-gray-200 rounded p-4 bg-gray-50 mt-2">
              <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">
                Google Search Preview
              </p>
              <div className="space-y-1">
                <p className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-snug line-clamp-1">
                  {metaTitle || postTitle}
                </p>
                <p className="text-[#006621] text-[14px]">
                  nextcms.local › {slug || "..."}
                </p>
                <p className="text-[#545454] text-[14px] leading-snug line-clamp-2">
                  {metaDescription || excerpt || "No description."}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <MediaPicker
        open={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        onSelect={(media) => onOgImageChange(media.url)}
      />
    </div>
  );
}
