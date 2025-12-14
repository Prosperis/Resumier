import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { apiClient } from "@/lib/api/client";
import type { CreateResumeDto } from "@/lib/api/types";
import { createMockResume, createMockResumeContent } from "../test-helpers";
import { useCreateResume } from "../use-create-resume";
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

describe("useCreateResume", () => {
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
    // Mock reset handled by vitest config (clearMocks: true)
  });

  it("creates a resume successfully", async () => {
    const newResumeDto: CreateResumeDto = {
      title: "My New Resume",
      content: createMockResumeContent(),
    };

    const createdResume = createMockResume({
      id: "new-resume-id",
      title: newResumeDto.title,
    });
    (apiClient.post as any).mockResolvedValueOnce(createdResume);

    const { result } = renderHook(() => useCreateResume(), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);

    // Trigger mutation
    result.current.mutate(newResumeDto);

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check final state
    expect(result.current.data).toEqual(createdResume);
    expect(apiClient.post).toHaveBeenCalledWith("/api/resumes", newResumeDto);
  });

  it("invalidates resumes query after successful creation", async () => {
    const newResumeDto: CreateResumeDto = {
      title: "Test Resume",
      content: createMockResumeContent(),
    };

    const createdResume = createMockResume({ id: "new-id" });
    (apiClient.post as any).mockResolvedValueOnce(createdResume);

    const wrapper = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateResume(), { wrapper });

    result.current.mutate(newResumeDto);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumesQueryKey });
  });

  it("updates the cache with new resume after creation", async () => {
    const existingResumes = [
      createMockResume({ id: "1", title: "Resume 1" }),
      createMockResume({ id: "2", title: "Resume 2" }),
    ];

    const newResumeDto: CreateResumeDto = {
      title: "Resume 3",
      content: createMockResumeContent(),
    };

    const createdResume = createMockResume({
      id: "3",
      title: newResumeDto.title,
    });

    // Set existing cache data
    queryClient.setQueryData(resumesQueryKey, existingResumes);
    (apiClient.post as any).mockResolvedValueOnce(createdResume);

    const { result } = renderHook(() => useCreateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newResumeDto);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that cache includes new resume
    const cachedResumes = queryClient.getQueryData(resumesQueryKey);
    expect(cachedResumes).toContainEqual(createdResume);
  });

  it("adds new resume to empty cache", async () => {
    const newResumeDto: CreateResumeDto = {
      title: "First Resume",
      content: createMockResumeContent(),
    };

    const createdResume = createMockResume({
      id: "first",
      title: newResumeDto.title,
    });
    (apiClient.post as any).mockResolvedValueOnce(createdResume);

    const { result } = renderHook(() => useCreateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newResumeDto);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that cache was created with new resume
    const cachedResumes = queryClient.getQueryData(resumesQueryKey);
    expect(cachedResumes).toEqual([createdResume]);
  });

  it("sets individual resume in cache for detail view", async () => {
    const newResumeDto: CreateResumeDto = {
      title: "Detail Resume",
      content: createMockResumeContent(),
    };

    const createdResume = createMockResume({
      id: "detail-id",
      title: newResumeDto.title,
    });
    (apiClient.post as any).mockResolvedValueOnce(createdResume);

    const { result } = renderHook(() => useCreateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newResumeDto);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check that individual resume is in cache
    const cachedResume = queryClient.getQueryData(["resumes", createdResume.id]);
    expect(cachedResume).toEqual(createdResume);
  });

  it("handles creation error", async () => {
    const newResumeDto: CreateResumeDto = {
      title: "Failed Resume",
      content: createMockResumeContent(),
    };

    const error = new Error("Failed to create resume");
    (apiClient.post as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCreateResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newResumeDto);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });

  it("can use mutateAsync for promise-based handling", async () => {
    const newResumeDto: CreateResumeDto = {
      title: "Async Resume",
      content: createMockResumeContent(),
    };

    const createdResume = createMockResume({ id: "async-id" });
    (apiClient.post as any).mockResolvedValueOnce(createdResume);

    const { result } = renderHook(() => useCreateResume(), {
      wrapper: createWrapper(),
    });

    const promise = result.current.mutateAsync(newResumeDto);

    await expect(promise).resolves.toEqual(createdResume);
  });
});
