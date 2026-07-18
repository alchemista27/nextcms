"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { generateSlug } from "@/lib/utils";
import EditIcon from "@mui/icons-material/EditOutlined";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

interface SlugInputProps {
  value: string;
  onChange: (slug: string) => void;
  title?: string;
  postId?: string;
}

export function SlugInput({ value, onChange, title, postId }: SlugInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [hasAutoFilled, setHasAutoFilled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title only on first fill
  useEffect(() => {
    if (title && !hasAutoFilled && !value) {
      const newSlug = generateSlug(title);
      onChange(newSlug);
      setEditValue(newSlug);
      setHasAutoFilled(true);
    }
  }, [title, hasAutoFilled, value, onChange]);

  // Keep editValue in sync when value changes externally (e.g., first auto-fill)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const checkSlug = useCallback(async (slug: string) => {
    if (!slug) return;
    setIsChecking(true);
    try {
      const params = new URLSearchParams({ slug, ...(postId ? { excludeId: postId } : {}) });
      const res = await fetch(`/api/posts/check-slug?${params}`);
      const data = await res.json();
      setIsAvailable(data.available);
    } catch {
      setIsAvailable(null);
    } finally {
      setIsChecking(false);
    }
  }, [postId]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value);
    setIsAvailable(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleConfirm = () => {
    const cleaned = generateSlug(editValue);
    onChange(cleaned);
    setEditValue(cleaned);
    setIsEditing(false);
    checkSlug(cleaned);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
    setIsAvailable(null);
  };

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
      <span className="text-gray-400">Permalink:</span>
      <span className="text-gray-400">…/posts/</span>

      {isEditing ? (
        <div className="flex items-center gap-1.5">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              setIsAvailable(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
              if (e.key === "Escape") handleCancel();
            }}
            className="border border-[#00704A] rounded px-2 py-0.5 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#00704A] min-w-[200px]"
          />
          <button onClick={handleConfirm} className="text-[#00704A] hover:text-[#1E3932] p-0.5">
            <CheckIcon fontSize="small" />
          </button>
          <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 p-0.5">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-gray-700 underline decoration-dotted">{value || "—"}</span>
          <button
            onClick={handleStartEdit}
            className="text-[#00704A] hover:text-[#1E3932] transition-colors"
            title="Edit permalink"
          >
            <EditIcon fontSize="small" />
          </button>
          {isChecking && <span className="text-gray-400 text-xs">Checking…</span>}
          {!isChecking && isAvailable === true && (
            <span className="text-green-600 text-xs font-medium">✓ Available</span>
          )}
          {!isChecking && isAvailable === false && (
            <span className="text-red-500 text-xs font-medium">✗ Already taken</span>
          )}
        </div>
      )}
    </div>
  );
}
