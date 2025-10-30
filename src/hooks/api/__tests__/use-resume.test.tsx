import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/lib/api/client";
import { createMockResume } from "../test-helpers";
import { resumeQueryKey, useResume } from "../use-resume";

// Mock the API client
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useResume", () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
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
    // Explicitly clear mock call history
    vi.clearAllMocks();
  });

  it("fetches a resume by ID successfully", async () => {
    const mockResume = createMockResume({ id: "resume-123", title: "My Resume" });
    (apiClient.get as any).mockResolvedValueOnce(mockResume);

    const { result } = renderHook(() => useResume("resume-123"), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check final state
    expect(result.current.data).toEqual(mockResume);
    expect(result.current.isLoading).toBe(false);
    expect(apiClient.get).toHaveBeenCalledWith("/api/resumes/resume-123");
  });

  it("does not fetch when ID is empty string", async () => {
    const { result } = renderHook(() => useResume(""), {
      wrapper: createWrapper(),
    });

    // Should not be loading
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();

    // API should not be called
    expect(apiClient.get).not.toHaveBeenCalled();
  });

  it("handles error when fetching resume fails", async () => {
    const error = new Error("Resume not found");
    (apiClient.get as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useResume("resume-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });

  it("generates correct query key", () => {
    const id = "test-id";
    expect(resumeQueryKey(id)).toEqual(["resumes", id]);
  });

  it("refetches when ID changes", async () => {
    const mockResume1 = createMockResume({ id: "resume-1", title: "Resume 1" });
    const mockResume2 = createMockResume({ id: "resume-2", title: "Resume 2" });
    (apiClient.get as any).mockResolvedValueOnce(mockResume1).mockResolvedValueOnce(mockResume2);

    const { result, rerender } = renderHook(({ id }) => useResume(id), {
      wrapper: createWrapper(),
      initialProps: { id: "resume-1" },
    });

    // Wait for first query
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockResume1);

    // Change ID
    rerender({ id: "resume-2" });

    // Wait for second query
    await waitFor(() => expect(result.current.data).toEqual(mockResume2));

    expect(apiClient.get).toHaveBeenCalledTimes(2);
    expect(apiClient.get).toHaveBeenNthCalledWith(1, "/api/resumes/resume-1");
    expect(apiClient.get).toHaveBeenNthCalledWith(2, "/api/resumes/resume-2");
  });

  it("caches results correctly", async () => {
    const mockResume = createMockResume({ id: "resume-123" });
    (apiClient.get as any).mockResolvedValueOnce(mockResume);

    const wrapper = createWrapper();

    // First render
    const { result: result1 } = renderHook(() => useResume("resume-123"), { wrapper });
    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    // Second render should use cached data
    const { result: result2 } = renderHook(() => useResume("resume-123"), { wrapper });

    // Should have data immediately from cache
    expect(result2.current.data).toEqual(mockResume);

    // API should only be called once
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });
});
