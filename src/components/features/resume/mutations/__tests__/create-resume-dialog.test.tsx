import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCreateResume } from "@/hooks/api";
import { useToast } from "@/hooks/use-toast";
import { CreateResumeDialog } from "../create-resume-dialog";

// Mock dependencies
vi.mock("@/hooks/api", () => ({
  useCreateResume: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(() => vi.fn()),
}));

describe("CreateResumeDialog", () => {
  let queryClient: QueryClient;
  const mockMutate = vi.fn();
  const mockToast = vi.fn();

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
    vi.mocked(useCreateResume).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any);
    vi.mocked(useToast).mockReturnValue({
      toast: mockToast,
    } as any);
  });

  it("renders with default trigger button", () => {
    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    const button = screen.getByRole("button", { name: /new resume/i });
    expect(button).toBeInTheDocument();
  });

  it("renders with custom trigger", () => {
    render(<CreateResumeDialog trigger={<button type="button">Custom Trigger</button>} />, {
      wrapper: createWrapper(),
    });

    const button = screen.getByRole("button", { name: /custom trigger/i });
    expect(button).toBeInTheDocument();
  });

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    const button = screen.getByRole("button", { name: /new resume/i });
    await user.click(button);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Create New Resume")).toBeInTheDocument();
    expect(screen.getByLabelText("Resume Title")).toBeInTheDocument();
  });

  it("shows error toast when title is empty", async () => {
    const user = userEvent.setup();
    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /new resume/i }));
    await user.click(screen.getByRole("button", { name: "Create resume" }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Please enter a resume title",
        variant: "destructive",
      });
    });
    expect(mockMutate).not.toHaveBeenCalled();
  });

  it("creates resume with valid title", async () => {
    const user = userEvent.setup();
    const mockOnSuccess = vi.fn();

    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess({ id: "new-resume-id", ...data });
    });

    render(<CreateResumeDialog onSuccess={mockOnSuccess} />, {
      wrapper: createWrapper(),
    });

    await user.click(screen.getByRole("button", { name: /new resume/i }));
    await user.type(screen.getByLabelText("Resume Title"), "My New Resume");
    await user.click(screen.getByRole("button", { name: "Create resume" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "My New Resume",
          content: expect.objectContaining({
            personalInfo: expect.any(Object),
            experience: [],
            education: [],
            skills: expect.any(Object),
            certifications: [],
            links: [],
          }),
        }),
        expect.any(Object)
      );
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: "Success",
      description: "Resume created successfully",
    });
    expect(mockOnSuccess).toHaveBeenCalledWith("new-resume-id");
  });

  it("trims whitespace from title", async () => {
    const user = userEvent.setup();

    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess({ id: "new-id", ...data });
    });

    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /new resume/i }));
    await user.type(screen.getByLabelText("Resume Title"), "  Trimmed Title  ");
    await user.click(screen.getByRole("button", { name: "Create resume" }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Trimmed Title",
        }),
        expect.any(Object)
      );
    });
  });

  it("shows error toast on mutation error", async () => {
    const user = userEvent.setup();
    const error = new Error("API Error");

    mockMutate.mockImplementation((data, { onError }) => {
      onError(error);
    });

    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /new resume/i }));
    await user.type(screen.getByLabelText("Resume Title"), "Test Resume");
    await user.click(screen.getByRole("button", { name: "Create resume" }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "API Error",
        variant: "destructive",
      });
    });
  });

  it("disables submit button while pending", async () => {
    const user = userEvent.setup();

    vi.mocked(useCreateResume).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    } as any);

    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /new resume/i }));

    const submitButton = screen.getByRole("button", { name: "Creating resume..." });
    expect(submitButton).toBeDisabled();
  });

  it("resets form after successful creation", async () => {
    const user = userEvent.setup();

    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess({ id: "new-id", ...data });
    });

    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /new resume/i }));
    const input = screen.getByLabelText("Resume Title");
    await user.type(input, "Test Resume");
    await user.click(screen.getByRole("button", { name: "Create resume" }));

    // Dialog should close
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    // Open again to check if form was reset
    await user.click(screen.getByRole("button", { name: /new resume/i }));
    expect(screen.getByLabelText("Resume Title")).toHaveValue("");
  });

  it("closes dialog when cancel is clicked", async () => {
    const user = userEvent.setup();
    render(<CreateResumeDialog />, { wrapper: createWrapper() });

    await user.click(screen.getByRole("button", { name: /new resume/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
