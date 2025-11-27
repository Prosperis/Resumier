import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { LinkFormDialog } from "../link-form-dialog";

describe("LinkFormDialog", () => {
  let defaultProps: {
    open: boolean;
    onOpenChange: ReturnType<typeof vi.fn>;
    onSubmit: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    defaultProps = {
      open: true,
      onOpenChange: vi.fn(),
      onSubmit: vi.fn(),
    };
  });
  describe("Rendering", () => {
    it("renders the dialog when open", () => {
      render(<LinkFormDialog {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Add Link")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Add a link to your portfolio, social media, or other profiles.",
        ),
      ).toBeInTheDocument();
    });
    it("renders with custom title and description", () => {
      render(
        <LinkFormDialog
          {...defaultProps}
          title="Edit Link"
          description="Update your link information."
        />,
      );
      expect(screen.getByText("Edit Link")).toBeInTheDocument();
      expect(
        screen.getByText("Update your link information."),
      ).toBeInTheDocument();
    });
    it("does not render when closed", () => {
      render(<LinkFormDialog {...defaultProps} open={false} />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    it("renders all form fields", () => {
      render(<LinkFormDialog {...defaultProps} />);
      expect(screen.getByText(/link type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^label$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^url$/i)).toBeInTheDocument();
    });
    it("renders action buttons", () => {
      render(<LinkFormDialog {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^save$/i }),
      ).toBeInTheDocument();
    });
    it("shows field descriptions", () => {
      render(<LinkFormDialog {...defaultProps} />);
      expect(
        screen.getByText(/choose the type of link you're adding/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/display name for this link/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/full url including https:\/\//i),
      ).toBeInTheDocument();
    });
  });

  describe("Link Type Select", () => {
    it("renders link type select trigger", () => {
      render(<LinkFormDialog {...defaultProps} />);
      // Radix UI Select uses a trigger button
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    it("defaults to 'website' type", () => {
      render(<LinkFormDialog {...defaultProps} />);
      // The default value should show Website in the trigger
      expect(screen.getByText("Website")).toBeInTheDocument();
    });

    it("shows description for link type", () => {
      render(<LinkFormDialog {...defaultProps} />);
      expect(
        screen.getByText(/choose the type of link you're adding/i),
      ).toBeInTheDocument();
    });
  });

  describe("Form Interaction", () => {
    it("allows filling in label field", async () => {
      const user = userEvent.setup();
      render(<LinkFormDialog {...defaultProps} />);
      const labelInput = screen.getByLabelText(/^label$/i);
      await user.type(labelInput, "My Portfolio");
      expect(labelInput).toHaveValue("My Portfolio");
    });
    it("allows filling in URL field", async () => {
      const user = userEvent.setup();
      render(<LinkFormDialog {...defaultProps} />);
      const urlInput = screen.getByLabelText(/^url$/i);
      await user.type(urlInput, "https://example.com");
      expect(urlInput).toHaveValue("https://example.com");
    });
  });

  describe("Form Submission", () => {
    it("submits form with default website type", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<LinkFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/^label$/i), "My Website");
      await user.type(screen.getByLabelText(/^url$/i), "https://mysite.com");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          type: "website",
          label: "My Website",
          url: "https://mysite.com",
        });
      });
    });

    it("closes dialog after successful submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<LinkFormDialog {...defaultProps} onOpenChange={onOpenChange} />);
      await user.type(screen.getByLabelText(/^label$/i), "Test");
      await user.type(screen.getByLabelText(/^url$/i), "https://test.com");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it("resets form after submission", async () => {
      const user = userEvent.setup();
      render(<LinkFormDialog {...defaultProps} />);
      const labelInput = screen.getByLabelText(/^label$/i);
      const urlInput = screen.getByLabelText(/^url$/i);
      await user.type(labelInput, "Test Link");
      await user.type(urlInput, "https://test.com");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(labelInput).toHaveValue("");
        expect(urlInput).toHaveValue("");
      });
    });
  });

  describe("Cancel Button", () => {
    it("closes dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<LinkFormDialog {...defaultProps} onOpenChange={onOpenChange} />);
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("does not submit form when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<LinkFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/^label$/i), "Test");
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("Default Values", () => {
    it("populates form with default values", () => {
      const defaultValues = {
        type: "github" as const,
        label: "Default GitHub",
        url: "https://github.com/default",
      };
      render(
        <LinkFormDialog {...defaultProps} defaultValues={defaultValues} />,
      );
      expect(screen.getByText("GitHub")).toBeInTheDocument();
      expect(screen.getByLabelText(/^label$/i)).toHaveValue("Default GitHub");
      expect(screen.getByLabelText(/^url$/i)).toHaveValue(
        "https://github.com/default",
      );
    });

    it("handles partial default values", () => {
      const defaultValues = {
        label: "Partial Link",
      };
      render(
        <LinkFormDialog {...defaultProps} defaultValues={defaultValues} />,
      );
      expect(screen.getByLabelText(/^label$/i)).toHaveValue("Partial Link");
      expect(screen.getByLabelText(/^url$/i)).toHaveValue("");
    });

    it("populates with website type default", () => {
      const defaultValues = {
        type: "website" as const,
        label: "My Portfolio",
        url: "https://portfolio.com",
      };
      render(
        <LinkFormDialog {...defaultProps} defaultValues={defaultValues} />,
      );
      expect(screen.getByText("Website")).toBeInTheDocument();
      expect(screen.getByLabelText(/^label$/i)).toHaveValue("My Portfolio");
      expect(screen.getByLabelText(/^url$/i)).toHaveValue(
        "https://portfolio.com",
      );
    });

    it("populates with linkedin type default", () => {
      const defaultValues = {
        type: "linkedin" as const,
        label: "LinkedIn Profile",
        url: "https://linkedin.com/in/user",
      };
      render(
        <LinkFormDialog {...defaultProps} defaultValues={defaultValues} />,
      );
      expect(screen.getByText("LinkedIn")).toBeInTheDocument();
      expect(screen.getByLabelText(/^label$/i)).toHaveValue("LinkedIn Profile");
      expect(screen.getByLabelText(/^url$/i)).toHaveValue(
        "https://linkedin.com/in/user",
      );
    });
  });

  describe("URL Field", () => {
    it("has url input type", () => {
      render(<LinkFormDialog {...defaultProps} />);
      const urlInput = screen.getByLabelText(/^url$/i);
      expect(urlInput).toHaveAttribute("type", "url");
    });

    it("accepts valid URL format", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<LinkFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/^label$/i), "Valid URL");
      await user.type(
        screen.getByLabelText(/^url$/i),
        "https://valid-url.com/path?query=1",
      );
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "https://valid-url.com/path?query=1",
          }),
        );
      });
    });

    it("shows URL description", () => {
      render(<LinkFormDialog {...defaultProps} />);
      expect(
        screen.getByText(/full url including https:\/\//i),
      ).toBeInTheDocument();
    });
  });

  describe("Placeholder Text", () => {
    it("shows helpful placeholder for label", () => {
      render(<LinkFormDialog {...defaultProps} />);
      const labelInput = screen.getByPlaceholderText(/my portfolio/i);
      expect(labelInput).toBeInTheDocument();
    });
    it("shows helpful placeholder for URL", () => {
      render(<LinkFormDialog {...defaultProps} />);
      const urlInput = screen.getByPlaceholderText(/https:\/\/example\.com/i);
      expect(urlInput).toBeInTheDocument();
    });
  });
});
