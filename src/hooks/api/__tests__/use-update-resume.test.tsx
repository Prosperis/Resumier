import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { vi } from "vitest";
import { apiClient } from "../../../lib/api/client";
import type { UpdateResumeDto } from "../../../lib/api/types";
import { createMockResume } from "../test-helpers";
import { useUpdateResume } from "../use-update-resume";

// Mock the API client
vi.mock("../../../lib/api/client", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

describe("useUpdateResume", () => {
  let queryClient: QueryClient;

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
    vi.useRealTimers();
  });

  it("updates a resume successfully", async () => {
    const resumeId = "resume-123";
    const updateData: UpdateResumeDto = {
      title: "Updated Title",
    };

    const updatedResume = createMockResume({
      id: resumeId,
      title: "Updated Title",
    });
    vi.mocked(apiClient.put).mockResolvedValueOnce(updatedResume);

    const { result } = renderHook(() => useUpdateResume(), { wrapper });

    // Trigger mutation
    result.current.mutate({ id: resumeId, data: updateData });

    // Wait for mutation to complete
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(updatedResume);
    expect(apiClient.put).toHaveBeenCalledWith(
      `/api/resumes/${resumeId}`,
      updateData,
    );
  });

  it("handles error when update fails", async () => {
    const resumeId = "resume-123";
    const updateData: UpdateResumeDto = {
      title: "Failed Update",
    };

    const error = new Error("Update failed");
    vi.mocked(apiClient.put).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useUpdateResume(), { wrapper });

    result.current.mutate({ id: resumeId, data: updateData });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // Check error is captured
    expect(result.current.error).toBe(error);
  });

  it("returns updated data on success", async () => {
    const resumeId = "resume-123";

    const updateData: UpdateResumeDto = { title: "Updated" };

    const updatedResume = createMockResume({
      id: resumeId,
      title: "Updated",
      updatedAt: new Date().toISOString(),
    });

    vi.mocked(apiClient.put).mockResolvedValueOnce(updatedResume);

    const { result } = renderHook(() => useUpdateResume(), { wrapper });

    result.current.mutate({ id: resumeId, data: updateData });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(updatedResume);
  });

  it("handles optimistic update when resume not in cache", async () => {
    const resumeId = "resume-new";
    const updateData: UpdateResumeDto = { title: "Updated" };
    const updatedResume = createMockResume({ id: resumeId, title: "Updated" });
    // Don't set any initial data in cache
    vi.mocked(apiClient.put).mockResolvedValueOnce(updatedResume);

    const { result } = renderHook(() => useUpdateResume(), { wrapper });

    result.current.mutate({ id: resumeId, data: updateData });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(updatedResume);
  });

  it("handles error rollback without previous resume context", async () => {
    const resumeId = "resume-123";
    const updateData: UpdateResumeDto = { title: "Failed" };
    const error = new Error("Update failed");
    // Don't set any initial data
    vi.mocked(apiClient.put).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useUpdateResume(), { wrapper });

    result.current.mutate({ id: resumeId, data: updateData });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBe(error);
  });
});
