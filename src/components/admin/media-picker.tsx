"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getMedia } from "@/actions/media";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImageIcon from "@mui/icons-material/Image";
import SearchIcon from "@mui/icons-material/Search";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFileOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface Media {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
}

interface MediaPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
}

export function MediaPicker({ open, onClose, onSelect }: MediaPickerProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  const [mediaItems, setMediaItems] = useState<Media[]>([]);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState<Media | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch media when library tab is active, or after upload
  const fetchMedia = useCallback(async (query = "") => {
    setIsLoading(true);
    try {
      const res = await getMedia(1, 60, query);
      if (res.success && res.data) {
        setMediaItems(res.data as Media[]);
      }
    } catch (e) {
      console.error("Failed to fetch media", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open && activeTab === "library") {
      fetchMedia(search);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeTab]);

  // Re-search when `search` state changes (debounced via form submit)
  useEffect(() => {
    if (activeTab === "library") {
      fetchMedia(search);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const doUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setIsUploading(true);
    setUploadProgress(`Uploading ${fileArray.length} file(s)...`);

    const formData = new FormData();
    for (const file of fileArray) {
      formData.append("files", file);
    }

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.data && data.data.length > 0) {
        setUploadProgress(`${data.data.length} file(s) uploaded successfully!`);
        // Switch to library tab and refresh
        await fetchMedia("");
        setSearch("");
        setSearchInput("");
        setActiveTab("library");
      } else {
        const errMsg = data.errors?.[0]?.error || "Upload failed";
        setUploadProgress(`Error: ${errMsg}`);
      }
    } catch (error) {
      setUploadProgress("An error occurred during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [fetchMedia]);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      doUpload(e.target.files);
    }
  };

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      doUpload(e.dataTransfer.files);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const handleConfirm = () => {
    if (selected) {
      onSelect(selected);
      onClose();
    }
  };

  // Reset state when closed
  useEffect(() => {
    if (!open) {
      setSelected(null);
      setUploadProgress("");
      setIsDragging(false);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden"
           style={{ height: "80vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Select Media</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 shrink-0 bg-white">
          <button
            onClick={() => { setActiveTab("library"); }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "library"
                ? "border-[#00704A] text-[#00704A]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Media Library
          </button>
          <button
            onClick={() => { setActiveTab("upload"); setUploadProgress(""); }}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "upload"
                ? "border-[#00704A] text-[#00704A]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            Upload Files
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">

          {/* ─── UPLOAD TAB ─── */}
          {activeTab === "upload" && (
            <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full max-w-lg rounded-2xl border-2 border-dashed p-12 flex flex-col items-center text-center transition-colors ${
                  isDragging
                    ? "border-[#00704A] bg-green-50"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                }`}
              >
                <CloudUploadIcon
                  className={`mb-4 transition-colors ${isDragging ? "text-[#00704A]" : "text-gray-400"}`}
                  style={{ fontSize: 56 }}
                />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {isDragging ? "Drop files here" : "Drag & drop files here"}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  Supports images, PDF, and video files up to 10MB
                </p>
                <input
                  type="file"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  accept="image/*,video/*,application/pdf"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-6 py-2.5 bg-[#00704A] hover:bg-[#1E3932] text-white font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? "Uploading…" : "Browse Files"}
                </button>

                {uploadProgress && (
                  <p className={`mt-4 text-sm font-medium ${
                    uploadProgress.startsWith("Error") ? "text-red-600" : "text-[#00704A]"
                  }`}>
                    {uploadProgress}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ─── LIBRARY TAB ─── */}
          {activeTab === "library" && (
            <>
              {/* Search bar */}
              <div className="px-4 py-3 border-b border-gray-100 shrink-0 flex items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative">
                    <SearchIcon
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                      fontSize="small"
                    />
                    <input
                      type="text"
                      placeholder="Search media…"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#00704A] w-64"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                  >
                    Search
                  </button>
                  {search && (
                    <button
                      type="button"
                      onClick={() => { setSearch(""); setSearchInput(""); }}
                      className="text-xs text-gray-500 hover:text-gray-700 underline"
                    >
                      Clear
                    </button>
                  )}
                </form>
                <span className="text-xs text-gray-400">{mediaItems.length} item(s)</span>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-2 border-[#00704A] border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Loading media…</span>
                    </div>
                  </div>
                ) : mediaItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                    <ImageIcon style={{ fontSize: 48 }} className="opacity-30" />
                    <p className="text-sm">
                      {search ? `No results for "${search}"` : "No media uploaded yet."}
                    </p>
                    <button
                      onClick={() => setActiveTab("upload")}
                      className="text-sm text-[#00704A] hover:underline font-medium"
                    >
                      Upload your first file →
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
                    {mediaItems.map((item) => {
                      const isSelected = selected?.id === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelected(isSelected ? null : item)}
                          className={`group relative aspect-square rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
                            isSelected
                              ? "border-[#00704A] ring-2 ring-[#00704A] ring-offset-1"
                              : "border-transparent hover:border-gray-300 bg-gray-100"
                          }`}
                          title={item.originalName}
                        >
                          {item.mimeType.startsWith("image/") ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.url}
                              alt={item.originalName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                              <InsertDriveFileIcon fontSize="large" className="opacity-50" />
                              <span className="text-[10px] mt-1 font-semibold uppercase">
                                {item.mimeType.split("/")[1] || "FILE"}
                              </span>
                            </div>
                          )}

                          {/* Selected checkmark */}
                          {isSelected && (
                            <div className="absolute top-1 right-1">
                              <CheckCircleIcon className="text-[#00704A] bg-white rounded-full" fontSize="small" />
                            </div>
                          )}

                          {/* Filename tooltip */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] px-1 py-1.5 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.originalName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer — only visible in library tab */}
        {activeTab === "library" && (
          <div className="shrink-0 px-6 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {selected ? (
                <span className="font-medium text-gray-700">Selected: {selected.originalName}</span>
              ) : (
                "Click an item to select it"
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={!selected}
                className="px-5 py-2 text-sm font-medium bg-[#00704A] hover:bg-[#1E3932] text-white rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Insert Media
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
