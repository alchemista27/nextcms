"use client";

import { useState, useTransition, useCallback, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { deleteMedia, updateMedia } from "@/actions/media";
import { formatDate } from "@/lib/utils";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import SearchIcon from "@mui/icons-material/Search";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";

interface Media {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  alt: string | null;
  caption: string | null;
  createdAt: Date;
  uploadedBy: { id: string; name: string };
}

interface MediaListClientProps {
  initialMedia: Media[];
  total: number;
  totalPages: number;
  currentSearch: string;
  currentPage: number;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export default function MediaListClient({
  initialMedia,
  total,
  totalPages,
  currentSearch,
  currentPage,
}: MediaListClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v) params.set(k, v);
        else params.delete(k);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: search || undefined, page: "1" });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        router.refresh();
      } else {
        alert(data.errors?.[0]?.error || "Upload failed");
      }
    } catch (error) {
      alert("An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this file? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteMedia(id);
      setSelectedMedia(null);
      router.refresh();
    });
  };

  const handleUpdate = async (id: string, updates: { alt?: string; caption?: string }) => {
    startTransition(async () => {
      await updateMedia(id, updates);
      if (selectedMedia) {
        setSelectedMedia({ ...selectedMedia, ...updates });
      }
      router.refresh();
    });
  };

  return (
    <div className="space-y-4">
      {/* Toolbar & Upload */}
      <div className="flex items-start justify-between gap-4 flex-wrap bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <input
            type="file"
            multiple
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*,video/*,application/pdf"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00704A] hover:bg-[#1E3932] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
          >
            <CloudUploadIcon fontSize="small" />
            {isUploading ? "Uploading..." : "Upload New Media"}
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" fontSize="small" />
            <input
              type="text"
              placeholder="Search media..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#00704A] focus:border-[#00704A] w-56"
            />
          </div>
          <button type="submit" className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors">
            Search
          </button>
        </form>
      </div>

      <div className="flex gap-4">
        {/* Grid */}
        <div className={`flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${selectedMedia ? 'hidden md:block' : ''}`}>
          <div className="p-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {initialMedia.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`group relative aspect-square border rounded overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#00704A] focus:ring-offset-2 ${
                  selectedMedia?.id === item.id ? "border-[#00704A] ring-2 ring-[#00704A] ring-offset-2" : "border-gray-200 bg-gray-50"
                }`}
              >
                {item.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.originalName}
                    className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-500 uppercase">{item.mimeType.split("/")[1] || "FILE"}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.originalName}
                </div>
              </button>
            ))}
          </div>

          {initialMedia.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No media files found.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50/50">
              <span className="text-sm text-gray-500">
                Showing {Math.min((currentPage - 1) * 30 + 1, total)}–{Math.min(currentPage * 30, total)} of {total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => updateParams({ page: String(currentPage - 1) })}
                  disabled={currentPage <= 1}
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParams({ page: String(p) })}
                    className={`px-2.5 py-1 text-sm rounded ${
                      p === currentPage ? "bg-[#00704A] text-white" : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => updateParams({ page: String(currentPage + 1) })}
                  disabled={currentPage >= totalPages}
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Detail */}
        {selectedMedia && (
          <div className="w-full md:w-80 flex-shrink-0 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col max-h-[calc(100vh-12rem)] sticky top-24">
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
              <h3 className="font-semibold text-gray-900 text-sm">Attachment Details</h3>
              <button onClick={() => setSelectedMedia(null)} className="text-gray-400 hover:text-gray-600">
                <CloseIcon fontSize="small" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto flex-1 space-y-4">
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center overflow-hidden">
                {selectedMedia.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedMedia.url} alt={selectedMedia.originalName} className="max-w-full max-h-full object-contain" />
                ) : (
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <div className="text-sm space-y-1 text-gray-600">
                <p className="font-medium text-gray-900 truncate" title={selectedMedia.originalName}>{selectedMedia.originalName}</p>
                <p>{formatDate(selectedMedia.createdAt)}</p>
                <p>{formatBytes(selectedMedia.size)}</p>
                <p>Uploaded by: {selectedMedia.uploadedBy.name}</p>
              </div>
              <div className="pt-2 space-y-3 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">URL</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={selectedMedia.url}
                      className="flex-1 bg-gray-50 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(selectedMedia.url);
                        alert("URL copied!");
                      }}
                      className="p-1 border border-gray-300 rounded hover:bg-gray-50 text-gray-600"
                      title="Copy URL"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Alt Text</label>
                  <input
                    type="text"
                    value={selectedMedia.alt || ""}
                    onChange={(e) => handleUpdate(selectedMedia.id, { alt: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#00704A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Caption</label>
                  <textarea
                    rows={2}
                    value={selectedMedia.caption || ""}
                    onChange={(e) => handleUpdate(selectedMedia.id, { caption: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-[#00704A] resize-none"
                  />
                </div>
              </div>
            </div>
            <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => handleDelete(selectedMedia.id)}
                disabled={isPending}
                className="text-red-600 hover:text-red-700 hover:underline text-sm font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <DeleteOutlineIcon fontSize="small" /> Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
