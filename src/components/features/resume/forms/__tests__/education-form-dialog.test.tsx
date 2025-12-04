import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { EducationFormDialog } from "../education-form-dialog";

describe("EducationFormDialog", () => {
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
      render(<EducationFormDialog {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Add Education")).toBeInTheDocument();
      expect(
        screen.getByText("Add your education details."),
      ).toBeInTheDocument();
    });
    it("renders with custom title and description", () => {
      render(
        <EducationFormDialog
          {...defaultProps}
          title="Edit Education"
          description="Update your education information."
        />,
      );
      expect(screen.getByText("Edit Education")).toBeInTheDocument();
      expect(
        screen.getByText("Update your education information."),
      ).toBeInTheDocument();
    });
    it("does not render when closed", () => {
      render(<EducationFormDialog {...defaultProps} open={false} />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    it("renders all form fields", () => {
      render(<EducationFormDialog {...defaultProps} />);
      expect(screen.getByLabelText(/institution/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^degree$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/field of study/i)).toBeInTheDocument();
      // Date fields use MonthPicker which is a button-based component
      expect(screen.getByText(/start date/i)).toBeInTheDocument();
      expect(screen.getByText(/end date/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/i currently study here/i),
      ).toBeInTheDocument();
      expect(screen.getByLabelText(/gpa/i)).toBeInTheDocument();
    });
    it("renders honors section button", () => {
      render(<EducationFormDialog {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /add honor\/award/i }),
      ).toBeInTheDocument();
    });
    it("renders action buttons", () => {
      render(<EducationFormDialog {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^save$/i }),
      ).toBeInTheDocument();
    });
  });
  describe("Form Interaction", () => {
    it("allows filling in institution name", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const institutionInput = screen.getByLabelText(/institution/i);
      await user.type(institutionInput, "MIT");
      expect(institutionInput).toHaveValue("MIT");
    });
    it("allows filling in degree", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const degreeInput = screen.getByLabelText(/^degree$/i);
      await user.type(degreeInput, "Bachelor of Science");
      expect(degreeInput).toHaveValue("Bachelor of Science");
    });
    it("allows filling in field of study", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const fieldInput = screen.getByLabelText(/field of study/i);
      await user.type(fieldInput, "Computer Science");
      expect(fieldInput).toHaveValue("Computer Science");
    });
    it("allows filling in start date via month picker", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      // MonthPicker uses buttons, not inputs. Find the "Pick a month" button for start date
      const startDateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      await user.click(startDateButtons[0]);
      // Click on a month in the popup
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /sep/i }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: /sep/i }));
      // Submit the form and verify the date was captured
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            startDate: expect.stringMatching(/\d{4}-09/), // e.g., "2025-09"
          }),
        );
      });
    });
    it("allows filling in end date via month picker", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      // MonthPicker uses buttons, not inputs. Find the "Pick a month" button for end date
      const endDateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      await user.click(endDateButtons[1]);
      // Click on a month
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /may/i }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: /may/i }));
    });
    it("allows filling in GPA", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const gpaInput = screen.getByLabelText(/gpa/i);
      await user.type(gpaInput, "3.8");
      expect(gpaInput).toHaveValue("3.8");
    });
  });
  describe("Current Study Checkbox", () => {
    it("disables end date when current is checked", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const currentCheckbox = screen.getByLabelText(/i currently study here/i);
      // End date picker button
      const endDateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      const endDateButton = endDateButtons[1];
      expect(endDateButton).not.toBeDisabled();
      await user.click(currentCheckbox);
      await waitFor(() => {
        expect(endDateButton).toBeDisabled();
      });
    });
    it("clears end date when current is checked", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const endDateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      const endDateButton = endDateButtons[1];
      const currentCheckbox = screen.getByLabelText(/i currently study here/i);
      // First, select an end date
      await user.click(endDateButton);
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /may/i }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: /may/i }));
      // Then check current - end date should reset
      await user.click(currentCheckbox);
      await waitFor(() => {
        // The button text should be back to placeholder
        expect(endDateButton).toHaveTextContent(/pick a month/i);
      });
    });
    it("enables end date when current is unchecked", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const currentCheckbox = screen.getByLabelText(/i currently study here/i);
      const endDateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      const endDateButton = endDateButtons[1];
      await user.click(currentCheckbox);
      await waitFor(() => expect(endDateButton).toBeDisabled());
      await user.click(currentCheckbox);
      await waitFor(() => expect(endDateButton).not.toBeDisabled());
    });
    it("updates description text when current is checked", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const currentCheckbox = screen.getByLabelText(/i currently study here/i);
      // Both start and end date have "Format: YYYY-MM" initially
      const formatTexts = screen.getAllByText(/format: yyyy-mm/i);
      expect(formatTexts).toHaveLength(2);
      await user.click(currentCheckbox);
      await waitFor(() => {
        expect(screen.getByText(/currently studying/i)).toBeInTheDocument();
      });
    });
  });
  describe("Honors Management", () => {
    it("does not show honors inputs by default", () => {
      render(<EducationFormDialog {...defaultProps} />);
      expect(
        screen.queryByPlaceholderText(/dean's list/i),
      ).not.toBeInTheDocument();
    });
    it("shows honors section after adding an honor", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const addButton = screen.getByRole("button", {
        name: /add honor\/award/i,
      });
      await user.click(addButton);
      await waitFor(() => {
        expect(screen.getByText("Honors & Awards")).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/dean's list/i)).toBeInTheDocument();
      });
    });
    it("allows adding multiple honors", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      const addButton = screen.getByRole("button", {
        name: /add honor\/award/i,
      });
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      await waitFor(() => {
        const honorInputs = screen.getAllByPlaceholderText(/dean's list/i);
        expect(honorInputs).toHaveLength(3);
      });
    });
    it("allows typing in honor inputs", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      const honorInput = await screen.findByPlaceholderText(/dean's list/i);
      await user.type(honorInput, "Dean's List");
      expect(honorInput).toHaveValue("Dean's List");
    });
    it("allows removing honors", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      // Add two honors
      const addButton = screen.getByRole("button", {
        name: /add honor\/award/i,
      });
      await user.click(addButton);
      await user.click(addButton);
      await waitFor(() => {
        expect(screen.getAllByPlaceholderText(/dean's list/i)).toHaveLength(2);
      });
      // Remove one
      const removeButtons = screen.getAllByRole("button", { name: "" });
      const removeButton = removeButtons.find(
        (btn) => btn.querySelector("svg") && !btn.textContent,
      );
      if (removeButton) {
        await user.click(removeButton);
      }
      await waitFor(() => {
        const honorInputs = screen.getAllByPlaceholderText(/dean's list/i);
        expect(honorInputs).toHaveLength(1);
      });
    });
    it("can remove all honors", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/dean's list/i)).toBeInTheDocument();
      });
      const removeButtons = screen.getAllByRole("button", { name: "" });
      const removeButton = removeButtons.find(
        (btn) => btn.querySelector("svg") && !btn.textContent,
      );
      if (removeButton) {
        await user.click(removeButton);
      }
      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText(/dean's list/i),
        ).not.toBeInTheDocument();
      });
    });
    it("renders with default honors", async () => {
      render(
        <EducationFormDialog
          {...defaultProps}
          defaultValues={{
            honors: ["Honor 1", "Honor 2"],
          }}
        />,
      );
      const honorInputs = screen.getAllByPlaceholderText(/dean's list/i);
      expect(honorInputs).toHaveLength(2);
      expect(honorInputs[0]).toHaveValue("Honor 1");
      expect(honorInputs[1]).toHaveValue("Honor 2");
    });
  });
  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      // Use default values for dates since MonthPicker is button-based
      render(
        <EducationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ startDate: "2016-09", endDate: "2020-05" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "MIT");
      await user.type(
        screen.getByLabelText(/^degree$/i),
        "Bachelor of Science",
      );
      await user.type(
        screen.getByLabelText(/field of study/i),
        "Computer Science",
      );
      await user.type(screen.getByLabelText(/gpa/i), "3.8");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            institution: "MIT",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2016-09",
            endDate: "2020-05",
            gpa: "3.8",
            current: false,
          }),
        );
      });
    });
    it("submits form with current study", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <EducationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ startDate: "2023-09" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "Stanford");
      await user.type(screen.getByLabelText(/^degree$/i), "Master of Science");
      await user.type(screen.getByLabelText(/field of study/i), "AI");
      await user.click(screen.getByLabelText(/i currently study here/i));
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            institution: "Stanford",
            degree: "Master of Science",
            field: "AI",
            startDate: "2023-09",
            endDate: "",
            current: true,
          }),
        );
      });
    });
    it("submits form with honors", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <EducationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ startDate: "2020-09" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "Harvard");
      await user.type(screen.getByLabelText(/^degree$/i), "PhD");
      await user.type(screen.getByLabelText(/field of study/i), "Physics");
      // Add honors
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      const honorInput = await screen.findByPlaceholderText(/dean's list/i);
      await user.type(honorInput, "Summa Cum Laude");
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      const honorInputs = screen.getAllByPlaceholderText(/dean's list/i);
      await user.type(honorInputs[1], "Dean's List");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            honors: ["Summa Cum Laude", "Dean's List"],
          }),
        );
      });
    });
    it("filters out empty honors on submit", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <EducationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ startDate: "2020-01" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "Test U");
      await user.type(screen.getByLabelText(/^degree$/i), "BS");
      await user.type(screen.getByLabelText(/field of study/i), "Math");
      // Add multiple honors but leave some empty
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      const honorInput = await screen.findByPlaceholderText(/dean's list/i);
      await user.type(honorInput, "First honor");
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      const honorInputs = screen.getAllByPlaceholderText(/dean's list/i);
      await user.type(honorInputs[2], "Third honor");
      // Leave second one empty
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            honors: ["First honor", "Third honor"],
          }),
        );
      });
    });
    it("submits form without optional GPA", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <EducationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ startDate: "2018-09", endDate: "2022-05" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "Test U");
      await user.type(screen.getByLabelText(/^degree$/i), "BA");
      await user.type(screen.getByLabelText(/field of study/i), "English");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            institution: "Test U",
            degree: "BA",
            field: "English",
            gpa: "",
          }),
        );
      });
    });
    it("closes dialog after successful submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <EducationFormDialog
          {...defaultProps}
          onOpenChange={onOpenChange}
          defaultValues={{ startDate: "2020-01" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "Test");
      await user.type(screen.getByLabelText(/^degree$/i), "Degree");
      await user.type(screen.getByLabelText(/field of study/i), "Field");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
    it("resets form after submission", async () => {
      const user = userEvent.setup();
      render(
        <EducationFormDialog
          {...defaultProps}
          defaultValues={{ startDate: "2020-01" }}
        />,
      );
      const institutionInput = screen.getByLabelText(/institution/i);
      await user.type(institutionInput, "Test Institution");
      await user.type(screen.getByLabelText(/^degree$/i), "Test Degree");
      await user.type(screen.getByLabelText(/field of study/i), "Test Field");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(institutionInput).toHaveValue("");
      });
    });
    it("resets honors after submission", async () => {
      const user = userEvent.setup();
      render(
        <EducationFormDialog
          {...defaultProps}
          defaultValues={{ startDate: "2020-01" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "Test");
      await user.type(screen.getByLabelText(/^degree$/i), "Degree");
      await user.type(screen.getByLabelText(/field of study/i), "Field");
      // Add an honor
      await user.click(
        screen.getByRole("button", { name: /add honor\/award/i }),
      );
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/dean's list/i)).toBeInTheDocument();
      });
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(
          screen.queryByPlaceholderText(/dean's list/i),
        ).not.toBeInTheDocument();
      });
    });
  });
  describe("Cancel Button", () => {
    it("closes dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <EducationFormDialog {...defaultProps} onOpenChange={onOpenChange} />,
      );
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("does not submit form when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/institution/i), "Test");
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
  describe("Form Validation", () => {
    it("all fields are optional and form can submit with minimal data", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      // Just click submit without filling anything
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        // Form should submit with empty values since all fields are optional
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            institution: "",
            degree: "",
            field: "",
            startDate: "",
            endDate: "",
            current: false,
            gpa: "",
          }),
        );
      });
    });
    it("validates GPA max length", async () => {
      const user = userEvent.setup();
      render(<EducationFormDialog {...defaultProps} />);
      // GPA has a max of 10 characters
      await user.type(
        screen.getByLabelText(/gpa/i),
        "12345678901", // 11 chars, over limit
      );
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      // Should show error message
      await waitFor(() => {
        expect(
          screen.getByText(/gpa must be less than 10 characters/i),
        ).toBeInTheDocument();
      });
    });
  });
  describe("GPA Field", () => {
    it("accepts valid GPA format", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <EducationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ startDate: "2020-01" }}
        />,
      );
      await user.type(screen.getByLabelText(/institution/i), "Test U");
      await user.type(screen.getByLabelText(/^degree$/i), "BS");
      await user.type(screen.getByLabelText(/field of study/i), "CS");
      await user.type(screen.getByLabelText(/gpa/i), "3.8/4.0");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            gpa: "3.8/4.0",
          }),
        );
      });
    });
    it("shows GPA description text", () => {
      render(<EducationFormDialog {...defaultProps} />);
      expect(
        screen.getByText(/e\.g\., 3\.8 or 3\.8\/4\.0/i),
      ).toBeInTheDocument();
    });
  });
});
