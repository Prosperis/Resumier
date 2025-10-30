import { useEffect, useRef, useState } from "react";
import type { UpdateResumeDto } from "@/lib/api/types";
import { useUpdateResume } from "./api";

interface UseAutoSaveOptions {
  resumeId: string;
  debounceMs?: number;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  save: (data: UpdateResumeDto) => void;
  isSaving: boolean;
  error: Error | null;
  lastSaved: Date | null;
}

/**
 * Hook for auto-saving resume changes with debouncing
 *
 * @example
 * ```tsx
 * const { save, isSaving, error, lastSaved } = useAutoSave({
 *   resumeId: "123",
 *   debounceMs: 1000
 * })
 *
 * // In form onChange
 * const handleChange = (data) => {
 *   save(data)
 * }
 * ```
 */
export function useAutoSave({
  resumeId,
  debounceMs = 1000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const { mutate, isPending, error: mutationError } = useUpdateResume();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<UpdateResumeDto | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Update error state when mutation error changes
  useEffect(() => {
    if (mutationError) {
      setError(mutationError as Error);
    }
  }, [mutationError]);

  const save = (data: UpdateResumeDto) => {
    if (!enabled) return;

    // Store the latest data
    pendingDataRef.current = data;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (pendingDataRef.current) {
        mutate(
          {
            id: resumeId,
            data: pendingDataRef.current,
          },
          {
            onSuccess: () => {
              setLastSaved(new Date());
              setError(null);
              pendingDataRef.current = null;
            },
            onError: (err: Error) => {
              setError(err);
            },
          },
        );
      }
    }, debounceMs);
  };

  return {
    save,
    isSaving: isPending,
    error,
    lastSaved,
  };
}

/**
 * Format the last saved time for display
 *
 * @example
 * ```tsx
 * const { lastSaved } = useAutoSave(...)
 * const savedText = formatLastSaved(lastSaved)
 * // "Saved just now" or "Saved 2 minutes ago"
 * ```
 */
export function formatLastSaved(lastSaved: Date | null): string {
  if (!lastSaved) return "";

  const now = new Date();
  const diffMs = now.getTime() - lastSaved.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffSeconds < 10) {
    return "Saved just now";
  }
  if (diffSeconds < 60) {
    return `Saved ${diffSeconds} seconds ago`;
  }
  if (diffMinutes === 1) {
    return "Saved 1 minute ago";
  }
  if (diffMinutes < 60) {
    return `Saved ${diffMinutes} minutes ago`;
  }

  return `Saved at ${lastSaved.toLocaleTimeString()}`;
}
