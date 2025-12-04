import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { apiClient } from "@/lib/api/client";
import { createMockResume, createMockResumeContent } from "../test-helpers";
import { useDuplicateResume } from "../use-duplicate-resume";
import { resumesQueryKey } from "../use-resumes";

// Mock the API client
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useDuplicateResume", () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    });

    return ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    // Clear the query client before each test
    if (queryClient) {
      queryClient.clear();
    }
    // Mock reset handled by vitest config (clearMocks: true)
  });

  it("duplicates a resume successfully", async () => {
    const originalResume = createMockResume({
      id: "original-id",
      title: "My Resume",
      content: createMockResumeContent(),
    });

    const duplicatedResume = createMockResume({
      id: "new-id",
      title: "My Resume (Copy)",
      content: originalResume.content,
    });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(duplicatedResume);
    expect(apiClient.post).toHaveBeenCalledWith("/api/resumes", {
      title: "My Resume (Copy)",
      content: originalResume.content,
    });
  });

  it("appends (Copy) suffix to title", async () => {
    const originalResume = createMockResume({
      id: "original",
      title: "Software Engineer Resume",
    });

    const duplicatedResume = createMockResume({
      id: "duplicate",
      title: "Software Engineer Resume (Copy)",
    });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const callArgs = (apiClient.post as any).mock.lastCall;
    expect(callArgs[1]).toEqual({
      title: "Software Engineer Resume (Copy)",
      content: originalResume.content,
    });
  });

  it("preserves resume content", async () => {
    const customContent = createMockResumeContent();
    customContent.personalInfo.name = "Jane Doe";

    const originalResume = createMockResume({
      id: "original",
      title: "My Resume",
      content: customContent,
    });

    const duplicatedResume = createMockResume({
      id: "duplicate",
      title: "My Resume (Copy)",
      content: customContent,
    });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const callArgs = (apiClient.post as any).mock.lastCall;
    expect(callArgs[1]).toEqual({
      title: "My Resume (Copy)",
      content: customContent,
    });
  });

  it("invalidates resumes query after successful duplication", async () => {
    const originalResume = createMockResume({ id: "original" });
    const duplicatedResume = createMockResume({ id: "duplicate" });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const wrapper = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDuplicateResume(), { wrapper });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumesQueryKey });
  });

  it("updates the cache with duplicated resume", async () => {
    const existingResumes = [
      createMockResume({ id: "1", title: "Resume 1" }),
      createMockResume({ id: "2", title: "Resume 2" }),
    ];

    const originalResume = createMockResume({
      id: "2",
      title: "Resume 2",
    });

    const duplicatedResume = createMockResume({
      id: "3",
      title: "Resume 2 (Copy)",
    });

    queryClient.setQueryData(resumesQueryKey, existingResumes);
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cachedResumes = queryClient.getQueryData(resumesQueryKey);
    expect(cachedResumes).toContainEqual(duplicatedResume);
  });

  it("adds duplicated resume to empty cache", async () => {
    const originalResume = createMockResume({ id: "original" });
    const duplicatedResume = createMockResume({
      id: "duplicate",
      title: `${originalResume.title} (Copy)`,
    });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cachedResumes = queryClient.getQueryData(resumesQueryKey);
    expect(cachedResumes).toEqual([duplicatedResume]);
  });

  it("sets individual resume in cache for detail view", async () => {
    const originalResume = createMockResume({ id: "original" });
    const duplicatedResume = createMockResume({
      id: "duplicate-id",
      title: "Resume (Copy)",
    });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cachedResume = queryClient.getQueryData([
      "resumes",
      duplicatedResume.id,
    ]);
    expect(cachedResume).toEqual(duplicatedResume);
  });

  it("handles duplication error", async () => {
    const originalResume = createMockResume({ id: "original" });
    const error = new Error("Failed to duplicate resume");
    (apiClient.post as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });

  it("handles resume with already (Copy) in title", async () => {
    const originalResume = createMockResume({
      id: "original",
      title: "My Resume (Copy)",
    });

    const duplicatedResume = createMockResume({
      id: "duplicate",
      title: "My Resume (Copy) (Copy)",
    });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(originalResume);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const callArgs = (apiClient.post as any).mock.lastCall;
    expect(callArgs[1]).toMatchObject({
      title: "My Resume (Copy) (Copy)",
    });
  });

  it("can use mutateAsync for promise-based handling", async () => {
    const originalResume = createMockResume({ id: "original" });
    const duplicatedResume = createMockResume({ id: "duplicate" });
    (apiClient.post as any).mockResolvedValueOnce(duplicatedResume);

    const { result } = renderHook(() => useDuplicateResume(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync(originalResume);

    await expect(promise).resolves.toEqual(duplicatedResume);
  });
});
