import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../lib/api/client";
import type { CreateResumeDto, Resume } from "../../lib/api/types";
import { resumesQueryKey } from "./use-resumes";
import { useAuthStore, selectIsGuest } from "../../stores/auth-store";
import { set, get } from "idb-keyval";

/**
 * Create resume mutation
 * Returns a React Query mutation hook for creating a new resume
 * In guest mode, saves to IndexedDB instead of API
 */
export function useCreateResume() {
  const queryClient = useQueryClient();
  const isGuest = useAuthStore(selectIsGuest);

  return useMutation({
    mutationFn: async (data: CreateResumeDto) => {
      // In guest mode, save to IndexedDB
      if (isGuest) {
        try {
          const newResume: Resume = {
            id: crypto.randomUUID(),
            title: data.title || "Untitled Resume",
            content: (data.content || {}) as Resume["content"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // Save individual resume
          await set(`resume-${newResume.id}`, newResume);

          // Add to resumes list
          const resumes = (await get("resumier-documents")) as
            | Resume[]
            | undefined;
          if (Array.isArray(resumes)) {
            await set("resumier-documents", [...resumes, newResume]);
          } else {
            await set("resumier-documents", [newResume]);
          }

          return newResume;
        } catch (error) {
          console.error("Failed to create resume in local storage:", error);
          throw error;
        }
      }

      // For authenticated users, use API
      return apiClient.post<Resume>("/api/resumes", data);
    },

    onSuccess: (newResume) => {
      // Invalidate resumes list to trigger refetch
      queryClient.invalidateQueries({ queryKey: resumesQueryKey });

      // Optimistically add to cache
      queryClient.setQueryData<Resume[]>(resumesQueryKey, (old) => {
        if (!old) return [newResume];
        return [...old, newResume];
      });

      // Set the new resume in cache for detail view
      queryClient.setQueryData(["resumes", newResume.id], newResume);
    },
  });
}
