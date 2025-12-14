import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Resume, UpdateResumeDto } from "@/lib/api/types";
import { useUpdateResume } from "./api";
import { resumeQueryKey } from "./api/use-resume";

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
  isFadingOut: boolean;
}

/**
 * Hook for auto-saving resume changes with debouncing and live preview
 *
 * Features:
 * - Immediate optimistic cache updates for live preview
 * - Debounced API calls to prevent excessive requests
 * - Rollback on error
 * - Deduplication to prevent infinite loops
 */
export function useAutoSave({
  resumeId,
  debounceMs = 1000,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const queryClient = useQueryClient();
  const { mutate, isPending, error: mutationError } = useUpdateResume();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingDataRef = useRef<UpdateResumeDto | null>(null);
  const previousDataRef = useRef<Resume | undefined>(undefined);
  const lastSavedDataRef = useRef<string>("");

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (fadeTimeoutRef.current) {
        clearTimeout(fadeTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Update error state when mutation error changes
  useEffect(() => {
    if (mutationError) {
      setError(mutationError as Error);
    }
  }, [mutationError]);

  const save = useCallback(
    (data: UpdateResumeDto) => {
      if (!enabled) return;

      // Serialize the data to compare with last saved
      const serializedData = JSON.stringify(data);

      // Skip if data hasn't changed (prevents infinite loops)
      if (serializedData === lastSavedDataRef.current) {
        return;
      }

      // Store the latest data
      pendingDataRef.current = data;
      lastSavedDataRef.current = serializedData;

      // Capture previous data for potential rollback (only on first save in batch)
      if (!previousDataRef.current) {
        previousDataRef.current = queryClient.getQueryData<Resume>(resumeQueryKey(resumeId));
      }

      // Immediately update the cache for live preview
      queryClient.setQueryData<Resume>(resumeQueryKey(resumeId), (old) => {
        if (!old) return undefined;
        return {
          ...old,
          ...data,
          content: data.content ? { ...old.content, ...data.content } : old.content,
        };
      });

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for debounced save
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
                setIsFadingOut(false);
                setError(null);
                pendingDataRef.current = null;
                previousDataRef.current = undefined;

                // Clear any existing timeouts
                if (fadeTimeoutRef.current) {
                  clearTimeout(fadeTimeoutRef.current);
                }
                if (hideTimeoutRef.current) {
                  clearTimeout(hideTimeoutRef.current);
                }

                // Start fade out after 2.5 seconds
                fadeTimeoutRef.current = setTimeout(() => {
                  setIsFadingOut(true);
                  // Hide completely after fade animation (500ms)
                  hideTimeoutRef.current = setTimeout(() => {
                    setLastSaved(null);
                    setIsFadingOut(false);
                  }, 500);
                }, 2500);
              },
              onError: (err: Error) => {
                setError(err);
                // Rollback to previous data on error
                if (previousDataRef.current) {
                  queryClient.setQueryData(resumeQueryKey(resumeId), previousDataRef.current);
                  // Reset lastSavedData so user can retry
                  lastSavedDataRef.current = "";
                }
                previousDataRef.current = undefined;
              },
            },
          );
        }
      }, debounceMs);
    },
    [enabled, resumeId, queryClient, mutate, debounceMs],
  );

  return {
    save,
    isSaving: isPending,
    error,
    lastSaved,
    isFadingOut,
  };
}

/**
 * Format the last saved time for display
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
