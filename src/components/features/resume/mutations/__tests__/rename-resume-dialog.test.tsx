import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useUpdateResume } from "@/hooks/api"
import { useToast } from "@/hooks/use-toast"
import { RenameResumeDialog } from "../rename-resume-dialog"

// Mock dependencies
vi.mock("@/hooks/api", () => ({
  useUpdateResume: vi.fn(),
}))

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(),
}))

describe("RenameResumeDialog", () => {
  let queryClient: QueryClient
  const mockMutate = vi.fn()
  const mockToast = vi.fn()

  const defaultProps = {
    resumeId: "resume-123",
    currentTitle: "My Resume",
  }

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    })

    return ({ children }: any) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  }

  beforeEach(() => {
    // Explicitly reset mocks before each test
    mockMutate.mockReset()
    mockToast.mockReset()

    ;(useUpdateResume as any).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
      error: null,
    } as any)
    ;(useToast as any).mockReturnValue({
      toast: mockToast,
    } as any)
  })

  it("renders with default trigger button", () => {
    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    const button = screen.getByRole("button", { name: /rename/i })
    expect(button).toBeInTheDocument()
  })

  it("renders with custom trigger", () => {
    render(
      <RenameResumeDialog {...defaultProps} trigger={<button type="button">Edit Title</button>} />,
      { wrapper: createWrapper() },
    )

    const button = screen.getByRole("button", { name: /edit title/i })
    expect(button).toBeInTheDocument()
  })

  it("opens dialog when trigger is clicked", async () => {
    const user = userEvent.setup()
    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    expect(screen.getByRole("dialog")).toBeInTheDocument()
    expect(screen.getByText("Rename Resume")).toBeInTheDocument()
    expect(screen.getByLabelText("Resume Title")).toBeInTheDocument()
  })

  it("pre-fills input with current title", async () => {
    const user = userEvent.setup()
    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    expect(input).toHaveValue("My Resume")
  })

  it("shows error toast when title is empty", async () => {
    const user = userEvent.setup()
    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    await user.clear(input)
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    expect(mockToast).toHaveBeenCalledWith({
      title: "Error",
      description: "Please enter a resume title",
      variant: "destructive",
    })
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it("closes dialog without mutation if title unchanged", async () => {
    const user = userEvent.setup()
    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })

    expect(mockMutate).not.toHaveBeenCalled()
    expect(mockToast).not.toHaveBeenCalled()
  })

  it("updates resume with new title", async () => {
    const user = userEvent.setup()
    const mockOnSuccess = vi.fn()

    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess()
    })

    render(<RenameResumeDialog {...defaultProps} onSuccess={mockOnSuccess} />, {
      wrapper: createWrapper(),
    })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    await user.clear(input)
    await user.type(input, "Updated Resume Title")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "resume-123",
          data: { title: "Updated Resume Title" },
        },
        expect.any(Object),
      )
    })

    expect(mockToast).toHaveBeenCalledWith({
      title: "Success",
      description: "Resume title updated successfully",
    })
    expect(mockOnSuccess).toHaveBeenCalled()
  })

  it("trims whitespace from title", async () => {
    const user = userEvent.setup()

    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess()
    })

    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    await user.clear(input)
    await user.type(input, "  Trimmed Title  ")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith(
        expect.objectContaining({
          data: { title: "Trimmed Title" },
        }),
        expect.any(Object),
      )
    })
  })

  it("shows error toast on mutation error", async () => {
    const user = userEvent.setup()
    const error = new Error("Update failed")

    mockMutate.mockImplementation((data, { onError }) => {
      onError(error)
    })

    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    await user.clear(input)
    await user.type(input, "New Title")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Update failed",
        variant: "destructive",
      })
    })
  })

  it("disables save button while pending", async () => {
    const user = userEvent.setup()
    ;(useUpdateResume as any).mockReturnValue({
      mutate: mockMutate,
      isPending: true,
      error: null,
    } as any)

    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const saveButton = screen.getByRole("button", { name: "Saving changes..." })
    expect(saveButton).toBeDisabled()
  })

  it("closes dialog after successful rename", async () => {
    const user = userEvent.setup()

    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess()
    })

    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    await user.clear(input)
    await user.type(input, "New Title")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  it("closes dialog when cancel is clicked", async () => {
    const user = userEvent.setup()
    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))
    expect(screen.getByRole("dialog")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Cancel" }))

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
  })

  it("handles missing error message gracefully", async () => {
    const user = userEvent.setup()
    const error = new Error()
    error.message = ""

    mockMutate.mockImplementation((data, { onError }) => {
      onError(error)
    })

    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    await user.clear(input)
    await user.type(input, "New Title")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to update resume title",
        variant: "destructive",
      })
    })
  })

  it("does not call onSuccess if not provided", async () => {
    const user = userEvent.setup()

    mockMutate.mockImplementation((data, { onSuccess }) => {
      onSuccess()
    })

    render(<RenameResumeDialog {...defaultProps} />, { wrapper: createWrapper() })

    await user.click(screen.getByRole("button", { name: /rename/i }))

    const input = screen.getByLabelText("Resume Title")
    await user.clear(input)
    await user.type(input, "New Title")
    await user.click(screen.getByRole("button", { name: "Save changes" }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Resume title updated successfully",
      })
    })

    // Should not throw error
  })
})
