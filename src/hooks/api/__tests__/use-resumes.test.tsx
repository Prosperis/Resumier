import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import { apiClient } from "@/lib/api/client";
import { createMockResume } from "../test-helpers";
import { resumesQueryKey, useResumes } from "../use-resumes";

// Mock the API client
vi.mock("@/lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("useResumes", () => {
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

  it("fetches resumes successfully", async () => {
    const mockResumes = [
      createMockResume({ id: "1", title: "Resume 1" }),
      createMockResume({ id: "2", title: "Resume 2" }),
    ];
    (apiClient.get as any).mockResolvedValueOnce(mockResumes);

    const { result } = renderHook(() => useResumes(), {
      wrapper: createWrapper(),
    });

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();

    // Wait for query to resolve
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Check final state
    expect(result.current.data).toEqual(mockResumes);
    expect(result.current.isLoading).toBe(false);
    expect(apiClient.get).toHaveBeenCalledWith("/api/resumes");
  });

  it("handles empty resume list", async () => {
    (apiClient.get as any).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useResumes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });

  it("handles error when fetching resumes fails", async () => {
    const error = new Error("Failed to fetch resumes");
    (apiClient.get as any).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useResumes(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
    expect(result.current.data).toBeUndefined();
  });

  it("uses correct query key", () => {
    expect(resumesQueryKey).toEqual(["resumes"]);
  });

  it("caches results correctly", async () => {
    const mockResumes = [createMockResume()];
    (apiClient.get as any).mockResolvedValueOnce(mockResumes);

    const wrapper = createWrapper();

    // First render
    const { result: result1 } = renderHook(() => useResumes(), { wrapper });
    await waitFor(() => expect(result1.current.isSuccess).toBe(true));

    // Second render should use cached data
    const { result: result2 } = renderHook(() => useResumes(), { wrapper });

    // Should have data immediately from cache
    expect(result2.current.data).toEqual(mockResumes);

    // API should only be called once
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });
});
