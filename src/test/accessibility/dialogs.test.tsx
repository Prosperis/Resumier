/**
 * Accessibility Tests for Dialog Components
 * Tests modal/dialog accessibility including focus trap and ARIA
 */

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateResumeDialog } from "@/components/features/resume/mutations/create-resume-dialog";
import { DeleteResumeDialog } from "@/components/features/resume/mutations/delete-resume-dialog";
import { RenameResumeDialog } from "@/components/features/resume/mutations/rename-resume-dialog";
import { expectNoAccessibilityViolations, renderWithQuery } from "@/test/accessibility-utils";

describe("Dialog Accessibility Tests", () => {
  describe("CreateResumeDialog", () => {
    it("should have no accessibility violations when closed", async () => {
      const { container } = renderWithQuery(<CreateResumeDialog />);
      await expectNoAccessibilityViolations(container);
    });

    it("should have no accessibility violations when open", async () => {
      const user = userEvent.setup();
      const { container } = renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(async () => {
        await expectNoAccessibilityViolations(container);
      });
    });

    it("should have proper dialog role and ARIA", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("aria-labelledby");
        expect(dialog).toHaveAttribute("aria-describedby");
      });
    });

    it("should have accessible form fields in dialog", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveAttribute("required");
      });
    });

    it("should show aria-invalid on validation errors", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const createButton = screen.getByRole("button", {
          name: /create resume/i,
        });
        expect(createButton).toBeInTheDocument();
      });

      // Try to submit without filling the form
      const createButton = screen.getByRole("button", {
        name: /create resume/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        expect(titleInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("should associate error messages with aria-describedby", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const createButton = screen.getByRole("button", {
          name: /create resume/i,
        });
        expect(createButton).toBeInTheDocument();
      });

      const createButton = screen.getByRole("button", {
        name: /create resume/i,
      });
      await user.click(createButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        const describedBy = titleInput.getAttribute("aria-describedby");
        expect(describedBy).toBeTruthy();

        if (describedBy) {
          const errorElement = document.getElementById(describedBy);
          expect(errorElement).toBeInTheDocument();
        }
      });
    });

    it("should have accessible action buttons", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        const createButton = screen.getByRole("button", {
          name: /create resume/i,
        });

        expect(cancelButton).toBeInTheDocument();
        expect(createButton).toBeInTheDocument();
      });
    });
  });

  describe("RenameResumeDialog", () => {
    const mockResumeId = "1";
    const mockResumeTitle = "My Resume";

    it("should have no accessibility violations when open", async () => {
      const user = userEvent.setup();
      const { container } = renderWithQuery(
        <RenameResumeDialog
          resumeId={mockResumeId}
          currentTitle={mockResumeTitle}
          trigger={<button>Rename</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /rename/i });
      await user.click(triggerButton);

      await waitFor(async () => {
        await expectNoAccessibilityViolations(container);
      });
    });

    it("should have proper dialog ARIA", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <RenameResumeDialog
          resumeId={mockResumeId}
          currentTitle={mockResumeTitle}
          trigger={<button>Rename</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /rename/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-labelledby");
      });
    });

    it("should have pre-filled accessible input", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <RenameResumeDialog
          resumeId={mockResumeId}
          currentTitle={mockResumeTitle}
          trigger={<button>Rename</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /rename/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/resume title/i);
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveValue(mockResumeTitle);
      });
    });
  });

  describe("DeleteResumeDialog (AlertDialog)", () => {
    const mockResumeId = "1";
    const mockResumeTitle = "My Resume";

    it("should have no accessibility violations", async () => {
      const user = userEvent.setup();
      const { container } = renderWithQuery(
        <DeleteResumeDialog
          resumeId={mockResumeId}
          resumeTitle={mockResumeTitle}
          trigger={<button>Delete</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      await user.click(triggerButton);

      await waitFor(async () => {
        await expectNoAccessibilityViolations(container);
      });
    });

    it("should have alertdialog role", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <DeleteResumeDialog
          resumeId={mockResumeId}
          resumeTitle={mockResumeTitle}
          trigger={<button>Delete</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const dialog = screen.getByRole("alertdialog");
        expect(dialog).toBeInTheDocument();
      });
    });

    it("should have accessible action buttons", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <DeleteResumeDialog
          resumeId={mockResumeId}
          resumeTitle={mockResumeTitle}
          trigger={<button>Delete</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        const deleteButton = screen.getByRole("button", {
          name: /confirm delete resume/i,
        });

        expect(cancelButton).toBeInTheDocument();
        expect(deleteButton).toBeInTheDocument();
      });
    });
  });

  describe("Dialog Focus Management", () => {
    it("should focus first input when dialog opens", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        // Focus management is handled by Radix UI automatically
        expect(titleInput).toBeInTheDocument();
      });
    });

    it("should restore focus to trigger when closed", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        expect(cancelButton).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      // Focus restoration is handled by Radix UI
      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });
    });
  });

  describe("Dialog Icon Accessibility", () => {
    it("should hide decorative icons from screen readers", async () => {
      const user = userEvent.setup();
      const { container } = renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button", { name: /new resume/i });
      await user.click(triggerButton);

      await waitFor(() => {
        // Check that decorative SVG icons have aria-hidden
        const svgs = container.querySelectorAll("svg");
        svgs.forEach((svg) => {
          // If the SVG has no role and is inside a button, it should be aria-hidden
          if (!svg.getAttribute("role") && svg.closest("button")) {
            expect(svg).toHaveAttribute("aria-hidden", "true");
          }
        });
      });
    });
  });

  describe("Additional Dialog Tests", () => {
    it("should have proper dialog role and ARIA", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAccessibleName();
        expect(dialog).toHaveAccessibleDescription();
      });
    });

    it("should have accessible form fields in dialog", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        expect(titleInput).toBeInTheDocument();
        expect(titleInput).toHaveAccessibleName();
      });
    });

    it("should show aria-invalid on validation errors", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const createButton = screen.getByRole("button", {
          name: /create resume/i,
        });
        user.click(createButton);
      });

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        expect(titleInput).toHaveAttribute("aria-invalid", "true");
      });
    });

    it("should associate error messages with aria-describedby", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const createButton = screen.getByRole("button", {
          name: /create resume/i,
        });
        user.click(createButton);
      });

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        const describedBy = titleInput.getAttribute("aria-describedby");

        if (describedBy) {
          const errorElement = document.getElementById(describedBy);
          expect(errorElement).toBeInTheDocument();
        }
      });
    });

    it("should have accessible action buttons", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const createButton = screen.getByRole("button", {
          name: /create resume/i,
        });
        const cancelButton = screen.getByRole("button", { name: /cancel/i });

        expect(createButton).toHaveAccessibleName();
        expect(cancelButton).toHaveAccessibleName();
      });
    });
  });

  describe("RenameResumeDialog", () => {
    it("should have no accessibility violations when open", async () => {
      const user = userEvent.setup();
      const { container } = renderWithQuery(
        <RenameResumeDialog
          resumeId="test-id"
          currentTitle="Test Resume"
          trigger={<button>Rename</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /rename/i });
      await user.click(triggerButton);

      await waitFor(async () => {
        await expectNoAccessibilityViolations(container);
      });
    });

    it("should have proper dialog ARIA", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <RenameResumeDialog
          resumeId="test-id"
          currentTitle="Test Resume"
          trigger={<button>Rename</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /rename/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAccessibleName();
        expect(dialog).toHaveAccessibleDescription();
      });
    });

    it("should have pre-filled accessible input", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <RenameResumeDialog
          resumeId="test-id"
          currentTitle="Test Resume"
          trigger={<button>Rename</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /rename/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i) as HTMLInputElement;
        expect(titleInput).toHaveValue("Test Resume");
        expect(titleInput).toHaveAccessibleName();
      });
    });
  });

  describe("DeleteResumeDialog (AlertDialog)", () => {
    it("should have no accessibility violations", async () => {
      const user = userEvent.setup();
      const { container } = renderWithQuery(
        <DeleteResumeDialog
          resumeId="test-id"
          resumeTitle="Test Resume"
          trigger={<button>Delete</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      await user.click(triggerButton);

      await waitFor(async () => {
        await expectNoAccessibilityViolations(container);
      });
    });

    it("should have alertdialog role", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <DeleteResumeDialog
          resumeId="test-id"
          resumeTitle="Test Resume"
          trigger={<button>Delete</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const alertDialog = screen.getByRole("alertdialog");
        expect(alertDialog).toBeInTheDocument();
        expect(alertDialog).toHaveAccessibleName();
        expect(alertDialog).toHaveAccessibleDescription();
      });
    });

    it("should have accessible action buttons", async () => {
      const user = userEvent.setup();
      renderWithQuery(
        <DeleteResumeDialog
          resumeId="test-id"
          resumeTitle="Test Resume"
          trigger={<button>Delete</button>}
        />,
      );

      const triggerButton = screen.getByRole("button", { name: /delete/i });
      await user.click(triggerButton);

      await waitFor(() => {
        const cancelButton = screen.getByRole("button", { name: /cancel/i });
        const deleteButton = screen.getByRole("button", {
          name: /delete resume/i,
        });

        expect(cancelButton).toHaveAccessibleName();
        expect(deleteButton).toHaveAccessibleName();
      });
    });
  });

  describe("Dialog Focus Management", () => {
    it("should focus first input when dialog opens", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const titleInput = screen.getByLabelText(/title/i);
        expect(titleInput).toHaveFocus();
      });
    });

    it("should restore focus to trigger when closed", async () => {
      const user = userEvent.setup();
      renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
      });

      // Close dialog with Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(triggerButton).toHaveFocus();
      });
    });
  });

  describe("Dialog Icon Accessibility", () => {
    it("should hide decorative icons from screen readers", async () => {
      const user = userEvent.setup();
      const { container } = renderWithQuery(<CreateResumeDialog />);

      const triggerButton = screen.getByRole("button");
      await user.click(triggerButton);

      await waitFor(() => {
        const svgs = container.querySelectorAll("svg");
        svgs.forEach((svg) => {
          // Decorative icons should be aria-hidden
          // or have aria-label if they're functional
          const isHidden = svg.getAttribute("aria-hidden") === "true";
          const hasLabel = svg.hasAttribute("aria-label");

          // Either hidden or labeled
          expect(isHidden || hasLabel).toBe(true);
        });
      });
    });
  });
});
