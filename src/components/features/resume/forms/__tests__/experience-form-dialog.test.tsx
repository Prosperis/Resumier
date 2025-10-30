import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { ExperienceFormDialog } from "../experience-form-dialog";

describe("ExperienceFormDialog", () => {
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

  afterEach(() => {
    cleanup();
  });
  describe("Rendering", () => {
    it("renders the dialog when open", () => {
      render(<ExperienceFormDialog {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Add Experience")).toBeInTheDocument();
      expect(
        screen.getByText("Add your work experience details."),
      ).toBeInTheDocument();
    });
    it("renders with custom title and description", () => {
      render(
        <ExperienceFormDialog
          {...defaultProps}
          title="Edit Experience"
          description="Update your work experience."
        />,
      );
      expect(screen.getByText("Edit Experience")).toBeInTheDocument();
      expect(
        screen.getByText("Update your work experience."),
      ).toBeInTheDocument();
    });
    it("does not render when closed", () => {
      render(<ExperienceFormDialog {...defaultProps} open={false} />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    it("renders all form fields", () => {
      render(<ExperienceFormDialog {...defaultProps} />);
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/position/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/i currently work here/i),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    });
    it("renders highlights section", () => {
      render(<ExperienceFormDialog {...defaultProps} />);
      expect(screen.getByText("Key Highlights")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Add bullet points for your achievements and responsibilities",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /add highlight/i }),
      ).toBeInTheDocument();
    });
    it("renders action buttons", () => {
      render(<ExperienceFormDialog {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save/i })).toBeInTheDocument();
    });
  });
  describe("Form Interaction", () => {
    it("allows filling in company name", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const companyInput = screen.getByLabelText(/company/i);
      await user.type(companyInput, "Acme Inc.");
      expect(companyInput).toHaveValue("Acme Inc.");
    });
    it("allows filling in position", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const positionInput = screen.getByLabelText(/position/i);
      await user.type(positionInput, "Software Engineer");
      expect(positionInput).toHaveValue("Software Engineer");
    });
    it("allows filling in start date", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const startDateInput = screen.getByLabelText(/start date/i);
      await user.type(startDateInput, "2020-01");
      expect(startDateInput).toHaveValue("2020-01");
    });
    it("allows filling in end date", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const endDateInput = screen.getByLabelText(/end date/i);
      await user.type(endDateInput, "2023-12");
      expect(endDateInput).toHaveValue("2023-12");
    });
    it("allows filling in description", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const descriptionInput = screen.getByLabelText(/description/i);
      await user.type(descriptionInput, "Built amazing products");
      expect(descriptionInput).toHaveValue("Built amazing products");
    });
  });
  describe("Current Work Checkbox", () => {
    it("disables end date when current is checked", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const currentCheckbox = screen.getByLabelText(/i currently work here/i);
      const endDateInput = screen.getByLabelText(/end date/i);
      expect(endDateInput).not.toBeDisabled();
      await user.click(currentCheckbox);
      await waitFor(() => {
        expect(endDateInput).toBeDisabled();
      });
    });
    it("clears end date when current is checked", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const endDateInput = screen.getByLabelText(/end date/i);
      const currentCheckbox = screen.getByLabelText(/i currently work here/i);
      // First, fill in end date
      await user.type(endDateInput, "2023-12");
      expect(endDateInput).toHaveValue("2023-12");
      // Then check current
      await user.click(currentCheckbox);
      await waitFor(() => {
        expect(endDateInput).toHaveValue("");
      });
    });
    it("enables end date when current is unchecked", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const currentCheckbox = screen.getByLabelText(/i currently work here/i);
      const endDateInput = screen.getByLabelText(/end date/i);
      await user.click(currentCheckbox);
      await waitFor(() => expect(endDateInput).toBeDisabled());
      await user.click(currentCheckbox);
      await waitFor(() => expect(endDateInput).not.toBeDisabled());
    });
    it("updates description text when current is checked", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const currentCheckbox = screen.getByLabelText(/i currently work here/i);
      // Both start and end date have "Format: YYYY-MM" initially
      const formatTexts = screen.getAllByText(/format: yyyy-mm/i);
      expect(formatTexts).toHaveLength(2);
      await user.click(currentCheckbox);
      await waitFor(() => {
        expect(screen.getByText(/currently working/i)).toBeInTheDocument();
      });
    });
  });
  describe("Highlights Management", () => {
    it("renders one empty highlight input by default", () => {
      render(<ExperienceFormDialog {...defaultProps} />);
      const highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
      expect(highlightInputs).toHaveLength(1);
    });
    it("allows adding highlights", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const addButton = screen.getByRole("button", { name: /add highlight/i });
      await user.click(addButton);
      await user.click(addButton);
      const highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
      expect(highlightInputs).toHaveLength(3);
    });
    it("allows typing in highlight inputs", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const highlightInput = screen.getByPlaceholderText(/led a team/i);
      await user.type(highlightInput, "Led a team of 5 engineers");
      expect(highlightInput).toHaveValue("Led a team of 5 engineers");
    });
    it("allows removing highlights", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      // Add two highlights
      const addButton = screen.getByRole("button", { name: /add highlight/i });
      await user.click(addButton);
      let highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
      expect(highlightInputs).toHaveLength(2);
      // Remove one
      const removeButtons = screen.getAllByRole("button", { name: "" });
      const removeButton = removeButtons.find((btn) =>
        btn.querySelector("svg"),
      );
      if (removeButton) {
        await user.click(removeButton);
      }
      await waitFor(() => {
        highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
        expect(highlightInputs).toHaveLength(1);
      });
    });
    it("disables remove button when only one highlight exists", () => {
      render(<ExperienceFormDialog {...defaultProps} />);
      const removeButtons = screen.getAllByRole("button", { name: "" });
      const removeButton = removeButtons.find(
        (btn) => btn.querySelector("svg") && !btn.textContent?.includes("Add"),
      );
      expect(removeButton).toBeDisabled();
    });
    it("renders with default highlights", () => {
      render(
        <ExperienceFormDialog
          {...defaultProps}
          defaultValues={{
            highlights: ["Highlight 1", "Highlight 2"],
          }}
        />,
      );
      const highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
      expect(highlightInputs).toHaveLength(2);
      expect(highlightInputs[0]).toHaveValue("Highlight 1");
      expect(highlightInputs[1]).toHaveValue("Highlight 2");
    });
  });
  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ExperienceFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/company/i), "Acme Inc.");
      await user.type(screen.getByLabelText(/position/i), "Software Engineer");
      await user.type(screen.getByLabelText(/start date/i), "2020-01");
      await user.type(screen.getByLabelText(/end date/i), "2023-12");
      await user.type(screen.getByLabelText(/description/i), "Built products");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            company: "Acme Inc.",
            position: "Software Engineer",
            startDate: "2020-01",
            endDate: "2023-12",
            description: "Built products",
            current: false,
          }),
        );
      });
    });
    it("submits form with current position", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ExperienceFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/company/i), "Current Corp");
      await user.type(screen.getByLabelText(/position/i), "Senior Engineer");
      await user.type(screen.getByLabelText(/start date/i), "2023-01");
      await user.click(screen.getByLabelText(/i currently work here/i));
      await user.type(screen.getByLabelText(/description/i), "Current role");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            company: "Current Corp",
            position: "Senior Engineer",
            startDate: "2023-01",
            endDate: "",
            current: true,
            description: "Current role",
          }),
        );
      });
    });
    it("submits form with highlights", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ExperienceFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/company/i), "Tech Co");
      await user.type(screen.getByLabelText(/position/i), "Developer");
      await user.type(screen.getByLabelText(/start date/i), "2020-01");
      await user.type(screen.getByLabelText(/end date/i), "2021-12");
      // Add highlights
      const highlightInput = screen.getByPlaceholderText(/led a team/i);
      await user.type(highlightInput, "Led team of 5");
      await user.click(screen.getByRole("button", { name: /add highlight/i }));

      // Wait for new highlight input to be rendered
      await waitFor(() => {
        const highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
        expect(highlightInputs).toHaveLength(2);
      });

      const highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
      await user.type(highlightInputs[1], "Shipped 3 products");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            highlights: ["Led team of 5", "Shipped 3 products"],
          }),
        );
      });
    });
    it("filters out empty highlights on submit", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ExperienceFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/company/i), "Test Co");
      await user.type(screen.getByLabelText(/position/i), "Tester");
      await user.type(screen.getByLabelText(/start date/i), "2020-01");
      // Add multiple highlights but leave some empty
      const highlightInput = screen.getByPlaceholderText(/led a team/i);
      await user.type(highlightInput, "First highlight");
      await user.click(screen.getByRole("button", { name: /add highlight/i }));
      await user.click(screen.getByRole("button", { name: /add highlight/i }));
      const highlightInputs = screen.getAllByPlaceholderText(/led a team/i);
      await user.type(highlightInputs[2], "Third highlight");
      // Leave second one empty
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            highlights: ["First highlight", "Third highlight"],
          }),
        );
      });
    });
    it("closes dialog after successful submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <ExperienceFormDialog {...defaultProps} onOpenChange={onOpenChange} />,
      );
      await user.type(screen.getByLabelText(/company/i), "Test");
      await user.type(screen.getByLabelText(/position/i), "Role");
      await user.type(screen.getByLabelText(/start date/i), "2020-01");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
    it("resets form after submission", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      const companyInput = screen.getByLabelText(/company/i);
      await user.type(companyInput, "Test Company");
      await user.type(screen.getByLabelText(/position/i), "Test Role");
      await user.type(screen.getByLabelText(/start date/i), "2020-01");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(companyInput).toHaveValue("");
      });
    });
  });
  describe("Cancel Button", () => {
    it("closes dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <ExperienceFormDialog {...defaultProps} onOpenChange={onOpenChange} />,
      );
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("does not submit form when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<ExperienceFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/company/i), "Test");
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
  describe("Default Values", () => {
    it("populates form with default values", () => {
      const defaultValues = {
        company: "Default Corp",
        position: "Default Position",
        startDate: "2020-01",
        endDate: "2023-12",
        current: false,
        description: "Default description",
        highlights: ["Highlight 1", "Highlight 2"],
      };
      render(
        <ExperienceFormDialog
          {...defaultProps}
          defaultValues={defaultValues}
        />,
      );
      expect(screen.getByLabelText(/company/i)).toHaveValue("Default Corp");
      expect(screen.getByLabelText(/position/i)).toHaveValue(
        "Default Position",
      );
      expect(screen.getByLabelText(/start date/i)).toHaveValue("2020-01");
      expect(screen.getByLabelText(/end date/i)).toHaveValue("2023-12");
      expect(screen.getByLabelText(/description/i)).toHaveValue(
        "Default description",
      );
    });
    it("handles partial default values", () => {
      const defaultValues = {
        company: "Partial Corp",
        position: "Partial Position",
      };
      render(
        <ExperienceFormDialog
          {...defaultProps}
          defaultValues={defaultValues}
        />,
      );
      expect(screen.getByLabelText(/company/i)).toHaveValue("Partial Corp");
      expect(screen.getByLabelText(/position/i)).toHaveValue(
        "Partial Position",
      );
      expect(screen.getByLabelText(/start date/i)).toHaveValue("");
      expect(screen.getByLabelText(/end date/i)).toHaveValue("");
    });
  });
  describe("Form Validation", () => {
    it("requires company field", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      // Fill in other required fields but leave company empty
      await user.type(screen.getByLabelText(/position/i), "Developer");
      await user.type(screen.getByLabelText(/start date/i), "2020-01");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        // Form should not submit without company
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
      });
    });
    it("requires position field", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      // Fill in other required fields but leave position empty
      await user.type(screen.getByLabelText(/company/i), "Test Corp");
      await user.type(screen.getByLabelText(/start date/i), "2020-01");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        // Form should not submit without position
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
      });
    });
    it("requires start date field", async () => {
      const user = userEvent.setup();
      render(<ExperienceFormDialog {...defaultProps} />);
      // Fill in other required fields but leave start date empty
      await user.type(screen.getByLabelText(/company/i), "Test Corp");
      await user.type(screen.getByLabelText(/position/i), "Developer");
      const submitButton = screen.getByRole("button", { name: /save/i });
      await user.click(submitButton);
      await waitFor(() => {
        // Form should not submit without start date
        expect(defaultProps.onSubmit).not.toHaveBeenCalled();
      });
    });
  });
});
