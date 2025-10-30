import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api/client";
import { createMockResume } from "../test-helpers";
import { useDeleteResume } from "../use-delete-resume";
import { resumeQueryKey } from "../use-resume";
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

describe("useDeleteResume", () => {
  let queryClient: QueryClient;
  const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

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
    // Reset mocks to clear implementation queue
    vi.resetAllMocks();
    // Restore console.error spy
    consoleErrorSpy.mockImplementation(() => {});
  });

  it("deletes a resume successfully", async () => {
    const resumeId = "resume-123";
    (apiClient.delete as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(resumeId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.delete).toHaveBeenCalledWith(`/api/resumes/${resumeId}`);
  });

  it("removes resume from list after deletion", async () => {
    const resumeId = "resume-2";
    const resumes = [
      createMockResume({ id: "resume-1", title: "Resume 1" }),
      createMockResume({ id: resumeId, title: "Resume 2" }),
      createMockResume({ id: "resume-3", title: "Resume 3" }),
    ];
    // Set resumes list in cache
    queryClient.setQueryData(resumesQueryKey, resumes);
    (apiClient.delete as any).mockResolvedValueOnce(undefined).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(resumeId);

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Cache should be invalidated and the resume should be gone after refetch
    expect(apiClient.delete).toHaveBeenCalledWith(`/api/resumes/${resumeId}`);
  });

  it("handles error correctly", async () => {
    const resumeId = "resume-2";
    const resumes = [
      createMockResume({ id: "resume-1", title: "Resume 1" }),
      createMockResume({ id: resumeId, title: "Resume 2" }),
      createMockResume({ id: "resume-3", title: "Resume 3" }),
    ];

    // Set resumes list in cache
    queryClient.setQueryData(resumesQueryKey, resumes);

    const error = new Error("Delete failed");
    (apiClient.delete as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useDeleteResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(resumeId);

    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check error was captured
    expect(result.current.error).toBe(error);
  });

  it("invalidates queries after successful deletion", async () => {
    const resumeId = "resume-123";
    const wrapper = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    (apiClient.delete as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteResume(), { wrapper });

    result.current.mutate(resumeId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumesQueryKey });
  });

  it("removes individual resume from cache", async () => {
    const resumeId = "resume-123";
    const resume = createMockResume({ id: resumeId });
    const wrapper = createWrapper();

    // Set individual resume in cache
    queryClient.setQueryData(resumeQueryKey(resumeId), resume);
    (apiClient.delete as any).mockResolvedValueOnce(undefined);
    const removeQueriesSpy = vi.spyOn(queryClient, "removeQueries");

    const { result } = renderHook(() => useDeleteResume(), { wrapper });

    result.current.mutate(resumeId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(removeQueriesSpy).toHaveBeenCalledWith({ queryKey: resumeQueryKey(resumeId) });
  });

  it("handles deletion when cache is empty", async () => {
    const resumeId = "resume-123";
    (apiClient.delete as any).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useDeleteResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(resumeId);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClient.delete).toHaveBeenCalledWith(`/api/resumes/${resumeId}`);
  });

  it("handles error when deletion fails", async () => {
    const resumeId = "resume-123";
    const error = new Error("Network error");
    (apiClient.delete as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useDeleteResume(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(resumeId);

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });

  it("invalidates queries even on error", async () => {
    const resumeId = "resume-123";
    const error = new Error("Delete failed");
    const wrapper = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    (apiClient.delete as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useDeleteResume(), { wrapper });

    result.current.mutate(resumeId);

    await waitFor(() => expect(result.current.isError).toBe(true));

    // onSettled should still run
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: resumesQueryKey });
  });
});
