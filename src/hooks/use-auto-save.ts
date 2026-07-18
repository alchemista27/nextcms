"use client";

import { useEffect, useRef, useCallback, useState } from "react";

type AutoSaveStatus = "idle" | "unsaved" | "saving" | "saved" | "error";

interface UseAutoSaveOptions {
  delay?: number; // debounce delay in ms, default 3000
  enabled?: boolean;
}

export function useAutoSave<T>(
  data: T,
  saveFn: (data: T) => Promise<{ success: boolean; error?: string }>,
  options: UseAutoSaveOptions = {}
) {
  const { delay = 3000, enabled = true } = options;
  const [status, setStatus] = useState<AutoSaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const lastSavedData = useRef<T>(data);

  const save = useCallback(async (dataToSave: T) => {
    setStatus("saving");
    try {
      const result = await saveFn(dataToSave);
      if (result.success) {
        lastSavedData.current = dataToSave;
        setStatus("saved");
        // Reset to idle after 3 seconds
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }, [saveFn]);

  useEffect(() => {
    // Skip on first render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!enabled) return;

    // Data has changed, mark as unsaved
    setStatus("unsaved");

    // Clear existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set new debounced save
    timerRef.current = setTimeout(() => {
      save(data);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [data, delay, enabled, save]);

  const statusLabel: Record<AutoSaveStatus, string> = {
    idle: "",
    unsaved: "Unsaved changes",
    saving: "Saving…",
    saved: "All changes saved",
    error: "Failed to save",
  };

  const statusColor: Record<AutoSaveStatus, string> = {
    idle: "text-gray-400",
    unsaved: "text-amber-500",
    saving: "text-blue-500",
    saved: "text-green-600",
    error: "text-red-500",
  };

  return {
    status,
    statusLabel: statusLabel[status],
    statusColor: statusColor[status],
    saveNow: () => save(data),
  };
}
