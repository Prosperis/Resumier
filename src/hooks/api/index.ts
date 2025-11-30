/**
 * API Hooks
 * React Query hooks for API operations
 */

// Resume mutation hooks
export { useCreateResume } from "./use-create-resume";
export { useDeleteResume } from "./use-delete-resume";
export { useDuplicateResume } from "./use-duplicate-resume";
export { resumeQueryKey, useResume } from "./use-resume";
// Resume query hooks
export { resumesQueryKey, useResumes } from "./use-resumes";
export { useUpdateResume } from "./use-update-resume";

// Profile query hooks
export { profilesQueryKey, useProfiles } from "./use-profiles";
export { profileQueryKey, useProfile } from "./use-profile";

// Profile mutation hooks
export { useCreateProfile } from "./use-create-profile";
export { useUpdateProfile } from "./use-update-profile";
export { useDeleteProfile } from "./use-delete-profile";
