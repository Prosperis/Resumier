import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useDeleteResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import { DeleteResumeDialog } from "../delete-resume-dialog";

// Mock dependencies
vi.mock("@/hooks/api", () => ({
  useDeleteResume: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

describe("DeleteResumeDialog", () => {
  let queryClient: QueryClient;
  const mockMutate = vi.fn();
  const mockToast = vi.fn();

  const defaultProps = {
    resumeId: "resume-123",
    resumeTitle: "My Resume",
  };

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    return ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    (useDeleteResume as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as any);
    (useToast as any).mockReturnValue({
      toast: mockToast,
    } as any);
  });

  it("renders with default trigger button", () => {
    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByRole("button", { name: /delete/i });
    expect(button).toBeInTheDocument();
  });

  it("renders with custom trigger", () => {
    render(
      <DeleteResumeDialog
        {...defaultProps}
        trigger={<button type="button">Custom Delete</button>}
      />,
      { wrapper: createWrapper() },
    );

    const button = screen.getByRole("button", { name: /custom delete/i });
    expect(button).toBeInTheDocument();
  });

  it("opens alert dialog when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
    expect(screen.getByText(/My Resume/)).toBeInTheDocument();
  });

  it("displays resume title in confirmation message", async () => {
    const user = userEvent.setup();
    render(<DeleteResumeDialog resumeId="test-id" resumeTitle="Software Engineer Resume" />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));

    expect(screen.getByText(/Software Engineer Resume/)).toBeInTheDocument();
  });

  it("deletes resume when continue is clicked", async () => {
    const user = userEvent.setup();
    const mockOnSuccess = vi.fn();

    mockMutate.mockImplementation((_id, { onSuccess }) => {
      onSuccess();
    });

    render(<DeleteResumeDialog {...defaultProps} onSuccess={mockOnSuccess} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm delete resume/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("resume-123", expect.any(Object));
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Success",
      description: "Resume deleted successfully",
    });
    expect(mockOnSuccess).toHaveBeenCalled();
  });

  it("shows error toast on deletion failure", async () => {
    const user = userEvent.setup();
    const error = new Error("Deletion failed");

    mockMutate.mockImplementation((_id, { onError }) => {
      onError(error);
    });

    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm delete resume/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Deletion failed",
        variant: "destructive",
      });
    });
  });

  it("disables buttons while pending", async () => {
    (useDeleteResume as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
    } as any);

    const user = userEvent.setup();

    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));

    const cancelButton = screen.getByRole("button", { name: "Cancel" });
    const continueButton = screen.getByRole("button", {
      name: /deleting resume/i,
    });

    expect(cancelButton).toBeDisabled();
    expect(continueButton).toBeDisabled();
  });

  it("closes dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("closes dialog after successful deletion", async () => {
    const user = userEvent.setup();

    mockMutate.mockImplementation((_id, { onSuccess }) => {
      onSuccess();
    });

    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm delete resume/i }));

    await waitFor(() => {
      expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    });
  });

  it("handles missing error message gracefully", async () => {
    const user = userEvent.setup();
    const error = new Error();
    error.message = "";

    mockMutate.mockImplementation((_id, { onError }) => {
      onError(error);
    });

    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm delete resume/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to delete resume",
        variant: "destructive",
      });
    });
  });

  it("does not call onSuccess if not provided", async () => {
    const user = userEvent.setup();

    mockMutate.mockImplementation((_id, { onSuccess }) => {
      onSuccess();
    });

    render(<DeleteResumeDialog {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm delete resume/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Resume deleted successfully",
      });
    });

    // Should not throw error
  });
});
