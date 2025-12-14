import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { PersonalInfoForm } from "../personal-info-form";

// Mock the useAutoSave hook
const mockSave = vi.fn();
const mockUseAutoSave = vi.fn(() => ({
  save: mockSave,
  isSaving: false,
  isFadingOut: false,
  error: null as Error | null,
  lastSaved: null as Date | null,
}));
vi.mock("@/hooks/use-auto-save", () => ({
  useAutoSave: () => mockUseAutoSave(),
  formatLastSaved: vi.fn((_date: Date) => "Saved just now"),
}));

describe("PersonalInfoForm", () => {
  const defaultProps = {
    resumeId: "resume-123",
  };

  beforeEach(() => {
    // Clear mocks between tests to ensure isolation
    mockSave.mockClear();
    mockUseAutoSave.mockClear();
    mockUseAutoSave.mockReturnValue({
      save: mockSave,
      isSaving: false,
      isFadingOut: false,
      error: null as Error | null,
      lastSaved: null as Date | null,
    });
  });

  describe("Rendering", () => {
    it("renders the form with name label", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText("Name")).toBeInTheDocument();
    });

    it("renders all form fields", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      // Name fields (first and last name inputs)
      expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
      // Other fields
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Phone")).toBeInTheDocument();
      expect(screen.getByText("Location")).toBeInTheDocument();
      expect(screen.getByText("Professional Summary")).toBeInTheDocument();
    });

    it("shows field descriptions", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText(/city and state\/country/i)).toBeInTheDocument();
      expect(screen.getByText(/a brief professional summary/i)).toBeInTheDocument();
    });

    it("shows placeholder text for form fields", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      // First and last name placeholders
      expect(screen.getByPlaceholderText("John")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Doe")).toBeInTheDocument();
      // Email placeholder
      expect(screen.getByPlaceholderText(/john@example\.com/i)).toBeInTheDocument();
      // Location placeholder
      expect(screen.getByPlaceholderText(/san francisco, ca/i)).toBeInTheDocument();
      // Summary placeholder
      expect(
        screen.getByPlaceholderText(/brief overview of your professional background/i),
      ).toBeInTheDocument();
    });
  });
  describe("Form Interaction - Name Fields", () => {
    it("allows typing in first name field", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const firstNameInput = screen.getByPlaceholderText("John");
      await user.type(firstNameInput, "Jane");
      expect(firstNameInput).toHaveValue("Jane");
    });

    it("allows typing in last name field", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const lastNameInput = screen.getByPlaceholderText("Doe");
      await user.type(lastNameInput, "Smith");
      expect(lastNameInput).toHaveValue("Smith");
    });

    it("triggers auto-save when name is entered", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const firstNameInput = screen.getByPlaceholderText("John");
      await user.type(firstNameInput, "John");

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                firstName: "John",
              }),
            }),
          }),
        );
      });
    });
  });
  describe("Form Interaction - Email Field", () => {
    it("allows typing in email field", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const emailInput = screen.getByPlaceholderText(/john@example\.com/i);
      await user.type(emailInput, "john@example.com");
      expect(emailInput).toHaveValue("john@example.com");
    });

    it("has email input type", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      const emailInput = screen.getByPlaceholderText(/john@example\.com/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("triggers auto-save when email is entered", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const emailInput = screen.getByPlaceholderText(/john@example\.com/i);
      await user.type(emailInput, "test@example.com");

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                email: "test@example.com",
              }),
            }),
          }),
        );
      });
    });
  });
  describe("Form Interaction - Phone Field", () => {
    it("renders phone input component", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      // PhoneInput component has type="tel" on the inner input
      const telInput = document.querySelector('input[type="tel"]');
      expect(telInput).toBeInTheDocument();
    });

    it("has tel input type in phone component", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      const phoneInput = document.querySelector('input[type="tel"]');
      expect(phoneInput).toBeInTheDocument();
      expect(phoneInput).toHaveAttribute("type", "tel");
    });
  });
  describe("Form Interaction - Location Field", () => {
    it("allows typing in location field", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const locationInput = screen.getByPlaceholderText(/san francisco, ca/i);
      await user.type(locationInput, "San Francisco, CA");
      expect(locationInput).toHaveValue("San Francisco, CA");
    });

    it("shows location description", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText(/city and state\/country/i)).toBeInTheDocument();
    });

    it("triggers auto-save when location is entered", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      // First add name to trigger save (needs name or email)
      await user.type(screen.getByPlaceholderText("John"), "John");
      const locationInput = screen.getByPlaceholderText(/san francisco, ca/i);
      await user.type(locationInput, "New York, NY");

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                location: "New York, NY",
              }),
            }),
          }),
        );
      });
    });
  });
  describe("Form Interaction - Summary Field", () => {
    it("allows typing in summary field", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const summaryInput = screen.getByPlaceholderText(/brief overview/i);
      await user.type(summaryInput, "Experienced software engineer");
      expect(summaryInput).toHaveValue("Experienced software engineer");
    });

    it("renders as textarea", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      const summaryInput = screen.getByPlaceholderText(/brief overview/i);
      expect(summaryInput.tagName).toBe("TEXTAREA");
    });

    it("shows summary description", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText(/a brief professional summary/i)).toBeInTheDocument();
    });

    it("triggers auto-save when summary is entered", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      // First add name to trigger save (needs name or email)
      await user.type(screen.getByPlaceholderText("John"), "John");
      const summaryInput = screen.getByPlaceholderText(/brief overview/i);
      await user.type(summaryInput, "Software engineer with 5 years of experience");

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                summary: "Software engineer with 5 years of experience",
              }),
            }),
          }),
        );
      });
    });
  });
  describe("Auto-Save Functionality", () => {
    it("auto-saves when form fields are filled", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      await user.type(screen.getByPlaceholderText("John"), "John");
      await user.type(screen.getByPlaceholderText("Doe"), "Doe");
      await user.type(screen.getByPlaceholderText(/john@example/i), "john@test.com");
      await user.type(screen.getByPlaceholderText(/san francisco/i), "NYC");
      await user.type(screen.getByPlaceholderText(/brief overview/i), "Summary text");
      // Should have called save
      expect(mockSave).toHaveBeenCalled();
    });

    it("calls save with all current form values", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      // Fill all fields
      await user.type(screen.getByPlaceholderText("John"), "Jane");
      await user.type(screen.getByPlaceholderText("Doe"), "Smith");
      await user.type(screen.getByPlaceholderText(/john@example/i), "jane@example.com");
      await user.type(screen.getByPlaceholderText(/san francisco/i), "Boston, MA");

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                firstName: "Jane",
                lastName: "Smith",
                email: "jane@example.com",
                location: "Boston, MA",
              }),
            }),
          }),
        );
      });
    });

    it("handles empty summary in auto-save", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      await user.type(screen.getByPlaceholderText("John"), "Test");

      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                summary: "",
              }),
            }),
          }),
        );
      });
    });
  });
  describe("Auto-Save Status Display", () => {
    it("shows saving indicator when isSaving is true", () => {
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: true,
        isFadingOut: false,
        error: null,
        lastSaved: null,
      });
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText("Saving...")).toBeInTheDocument();
    });

    it("shows saved status with timestamp when saved", () => {
      const lastSaved = new Date();
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: false,
        isFadingOut: false,
        error: null as Error | null,
        lastSaved: lastSaved as Date | null,
      });
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText("Saved just now")).toBeInTheDocument();
    });

    it("shows error status when save fails", () => {
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: false,
        isFadingOut: false,
        error: new Error("Save failed") as Error | null,
        lastSaved: null as Date | null,
      });
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText("Failed to save")).toBeInTheDocument();
    });

    it("does not show status when no activity", () => {
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: false,
        isFadingOut: false,
        error: null,
        lastSaved: null,
      });
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument();
      expect(screen.queryByText(/saved/i)).not.toBeInTheDocument();
      expect(screen.queryByText("Failed to save")).not.toBeInTheDocument();
    });
  });
  describe("Default Values", () => {
    it("populates form with default values", () => {
      const defaultValues = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "+1234567890",
        location: "San Francisco, CA",
        summary: "Experienced developer",
      };
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />);
      expect(screen.getByPlaceholderText("John")).toHaveValue("John");
      expect(screen.getByPlaceholderText("Doe")).toHaveValue("Doe");
      expect(screen.getByPlaceholderText(/john@example/i)).toHaveValue("john@example.com");
      expect(screen.getByPlaceholderText(/san francisco/i)).toHaveValue("San Francisco, CA");
      expect(screen.getByPlaceholderText(/brief overview/i)).toHaveValue("Experienced developer");
    });

    it("handles partial default values", () => {
      const defaultValues = {
        firstName: "Jane",
        email: "jane@example.com",
      };
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />);
      expect(screen.getByPlaceholderText("John")).toHaveValue("Jane");
      expect(screen.getByPlaceholderText(/john@example/i)).toHaveValue("jane@example.com");
      expect(screen.getByPlaceholderText("Doe")).toHaveValue("");
      expect(screen.getByPlaceholderText(/san francisco/i)).toHaveValue("");
      expect(screen.getByPlaceholderText(/brief overview/i)).toHaveValue("");
    });

    it("handles empty default values", () => {
      const defaultValues = {};
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />);
      expect(screen.getByPlaceholderText("John")).toHaveValue("");
      expect(screen.getByPlaceholderText("Doe")).toHaveValue("");
      expect(screen.getByPlaceholderText(/john@example/i)).toHaveValue("");
      expect(screen.getByPlaceholderText(/san francisco/i)).toHaveValue("");
      expect(screen.getByPlaceholderText(/brief overview/i)).toHaveValue("");
    });

    it("allows editing default values", async () => {
      const user = userEvent.setup();
      const defaultValues = {
        firstName: "Original",
      };
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />);
      const firstNameInput = screen.getByPlaceholderText("John");
      expect(firstNameInput).toHaveValue("Original");
      await user.clear(firstNameInput);
      await user.type(firstNameInput, "Updated");
      expect(firstNameInput).toHaveValue("Updated");
    });
  });
  describe("Disabled State", () => {
    it("disables all fields when enabled is false", () => {
      render(<PersonalInfoForm {...defaultProps} enabled={false} />);
      expect(screen.getByPlaceholderText("John")).toBeDisabled();
      expect(screen.getByPlaceholderText("Doe")).toBeDisabled();
      expect(screen.getByPlaceholderText(/john@example/i)).toBeDisabled();
      expect(screen.getByPlaceholderText(/san francisco/i)).toBeDisabled();
      expect(screen.getByPlaceholderText(/brief overview/i)).toBeDisabled();
    });

    it("enables all fields by default", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByPlaceholderText("John")).not.toBeDisabled();
      expect(screen.getByPlaceholderText("Doe")).not.toBeDisabled();
      expect(screen.getByPlaceholderText(/john@example/i)).not.toBeDisabled();
      expect(screen.getByPlaceholderText(/san francisco/i)).not.toBeDisabled();
      expect(screen.getByPlaceholderText(/brief overview/i)).not.toBeDisabled();
    });

    it("enables all fields when enabled is true", () => {
      render(<PersonalInfoForm {...defaultProps} enabled={true} />);
      expect(screen.getByPlaceholderText("John")).not.toBeDisabled();
      expect(screen.getByPlaceholderText("Doe")).not.toBeDisabled();
      expect(screen.getByPlaceholderText(/john@example/i)).not.toBeDisabled();
      expect(screen.getByPlaceholderText(/san francisco/i)).not.toBeDisabled();
      expect(screen.getByPlaceholderText(/brief overview/i)).not.toBeDisabled();
    });

    it("does not trigger auto-save when disabled", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} enabled={false} />);
      const firstNameInput = screen.getByPlaceholderText("John");
      // Try to type (won't work because disabled)
      await user.click(firstNameInput);
      await user.keyboard("Test");
      expect(mockSave).not.toHaveBeenCalled();
    });
  });
  describe("Field Types", () => {
    it("summary field is a textarea with correct rows", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      const summaryInput = screen.getByPlaceholderText(/brief overview/i);
      expect(summaryInput.tagName).toBe("TEXTAREA");
      expect(summaryInput).toHaveAttribute("rows", "3");
    });

    it("email field has email input type", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      const emailInput = screen.getByPlaceholderText(/john@example/i);
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("phone input exists with tel type", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      const phoneInput = document.querySelector('input[type="tel"]');
      expect(phoneInput).toBeInTheDocument();
    });
  });
  describe("Grid Layout", () => {
    it("renders name fields in a grid", () => {
      const { container } = render(<PersonalInfoForm {...defaultProps} />);
      // Check that the grid container exists for name fields
      const gridContainer = container.querySelector(".grid.grid-cols-2");
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe("Form Labels", () => {
    it("shows all correct labels", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Phone")).toBeInTheDocument();
      expect(screen.getByText("Location")).toBeInTheDocument();
      expect(screen.getByText("Professional Summary")).toBeInTheDocument();
    });

    it("shows name field descriptions", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      // In firstLast order, should show First name and Last name descriptions
      expect(screen.getByText("First name")).toBeInTheDocument();
      expect(screen.getByText("Last name")).toBeInTheDocument();
    });
  });
  describe("Edge Cases", () => {
    it("accepts very long summary text", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const longText = "A".repeat(400);
      const summaryInput = screen.getByPlaceholderText(/brief overview/i);
      // Use paste for very long text to avoid timeout
      await user.click(summaryInput);
      await user.paste(longText);
      expect(summaryInput).toHaveValue(longText);
    });

    it("handles special characters in name", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const firstNameInput = screen.getByPlaceholderText("John");
      // Use paste for special characters to avoid encoding issues
      await user.click(firstNameInput);
      await user.paste("José");
      expect(firstNameInput).toHaveValue("José");
    });

    it("handles international locations", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const locationInput = screen.getByPlaceholderText(/san francisco/i);
      await user.type(locationInput, "Tokyo");
      expect(locationInput).toHaveValue("Tokyo");
    });

    it("handles clearing field values", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const firstNameInput = screen.getByPlaceholderText("John");
      await user.type(firstNameInput, "TestName");
      expect(firstNameInput).toHaveValue("TestName");
      await user.clear(firstNameInput);
      expect(firstNameInput).toHaveValue("");
    });
  });

  describe("Name Order Toggle", () => {
    it("shows name order toggle button", () => {
      render(<PersonalInfoForm {...defaultProps} />);
      // Should show "First Last" by default
      expect(screen.getByRole("button", { name: /first last/i })).toBeInTheDocument();
    });

    it("toggles name order when clicked", async () => {
      const user = userEvent.setup();
      render(<PersonalInfoForm {...defaultProps} />);
      const toggleButton = screen.getByRole("button", { name: /first last/i });
      await user.click(toggleButton);
      // After clicking, should show "Last First"
      expect(screen.getByRole("button", { name: /last first/i })).toBeInTheDocument();
    });
  });
});
