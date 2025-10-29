import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { PersonalInfoForm } from "../personal-info-form"

// Mock the useAutoSave hook
const mockSave = vi.fn()
const mockUseAutoSave = vi.fn(() => ({
  save: mockSave,
  isSaving: false,
  error: null as Error | null,
  lastSaved: null as Date | null,
}))
vi.mock("@/hooks/use-auto-save", () => ({
  useAutoSave: () => mockUseAutoSave(),
  formatLastSaved: vi.fn((_date: Date) => "Saved just now"),
}))
describe("PersonalInfoForm", () => {
  const defaultProps = {
    resumeId: "resume-123",
  }
  beforeEach(() => {
    // Clear mocks between tests to ensure isolation
    mockSave.mockClear()
    mockUseAutoSave.mockClear()
    mockUseAutoSave.mockReturnValue({
      save: mockSave,
      isSaving: false,
      error: null as Error | null,
      lastSaved: null as Date | null,
    })
  })
  describe("Rendering", () => {
    it("renders the form card", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByText("Personal Information")).toBeInTheDocument()
      expect(
        screen.getByText(/your basic contact information and professional summary/i),
      ).toBeInTheDocument()
    })
    it("renders all form fields", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^email \*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^location \*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/professional summary/i)).toBeInTheDocument()
    })
    it("shows required field indicators", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByLabelText(/full name \*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/phone \*/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/location \*/i)).toBeInTheDocument()
    })
    it("shows field descriptions", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByText(/city and state\/country/i)).toBeInTheDocument()
      expect(
        screen.getByText(/a brief professional summary \(optional, max 500 characters\)/i),
      ).toBeInTheDocument()
    })
    it("shows placeholder text for all fields", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/john@example\.com/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument()
      expect(screen.getByPlaceholderText(/san francisco, ca/i)).toBeInTheDocument()
      expect(
        screen.getByPlaceholderText(/brief overview of your professional background/i),
      ).toBeInTheDocument()
    })
  })
  describe("Form Interaction - Name Field", () => {
    it("allows typing in name field", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/full name/i)
      await user.type(nameInput, "John Doe")
      expect(nameInput).toHaveValue("John Doe")
    })
    it("triggers auto-save on blur with valid name", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/full name/i)
      await user.type(nameInput, "John Doe")
      await user.tab() // Blur the field
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                name: "John Doe",
              }),
            }),
          }),
        )
      })
    })
  })
  describe("Form Interaction - Email Field", () => {
    it("allows typing in email field", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const emailInput = screen.getByLabelText(/^email/i)
      await user.type(emailInput, "john@example.com")
      expect(emailInput).toHaveValue("john@example.com")
    })
    it("has email input type", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      const emailInput = screen.getByLabelText(/^email/i)
      expect(emailInput).toHaveAttribute("type", "email")
    })
    it("triggers auto-save on blur with valid email", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const emailInput = screen.getByLabelText(/^email/i)
      await user.type(emailInput, "test@example.com")
      await user.tab()
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                email: "test@example.com",
              }),
            }),
          }),
        )
      })
    })
  })
  describe("Form Interaction - Phone Field", () => {
    it("allows typing in phone field", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const phoneInput = screen.getByLabelText(/phone/i)
      await user.type(phoneInput, "+1 (555) 123-4567")
      expect(phoneInput).toHaveValue("+1 (555) 123-4567")
    })
    it("has tel input type", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      const phoneInput = screen.getByLabelText(/phone/i)
      expect(phoneInput).toHaveAttribute("type", "tel")
    })
    it("triggers auto-save on blur with valid phone", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const phoneInput = screen.getByLabelText(/phone/i)
      await user.type(phoneInput, "+1234567890")
      await user.tab()
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                phone: "+1234567890",
              }),
            }),
          }),
        )
      })
    })
  })
  describe("Form Interaction - Location Field", () => {
    it("allows typing in location field", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const locationInput = screen.getByLabelText(/^location/i)
      await user.type(locationInput, "San Francisco, CA")
      expect(locationInput).toHaveValue("San Francisco, CA")
    })
    it("shows location description", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByText(/city and state\/country/i)).toBeInTheDocument()
    })
    it("triggers auto-save on blur with valid location", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const locationInput = screen.getByLabelText(/^location/i)
      await user.type(locationInput, "New York, NY")
      await user.tab()
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                location: "New York, NY",
              }),
            }),
          }),
        )
      })
    })
  })
  describe("Form Interaction - Summary Field", () => {
    it("allows typing in summary field", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const summaryInput = screen.getByLabelText(/professional summary/i)
      await user.type(summaryInput, "Experienced software engineer")
      expect(summaryInput).toHaveValue("Experienced software engineer")
    })
    it("renders as textarea", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      const summaryInput = screen.getByLabelText(/professional summary/i)
      expect(summaryInput.tagName).toBe("TEXTAREA")
    })
    it("shows summary description", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(
        screen.getByText(/a brief professional summary \(optional, max 500 characters\)/i),
      ).toBeInTheDocument()
    })
    it("triggers auto-save on blur with summary", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const summaryInput = screen.getByLabelText(/professional summary/i)
      await user.type(summaryInput, "Software engineer with 5 years of experience")
      await user.tab()
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                summary: "Software engineer with 5 years of experience",
              }),
            }),
          }),
        )
      })
    })
  })
  describe("Auto-Save Functionality", () => {
    it("auto-saves all fields together", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      await user.type(screen.getByLabelText(/full name/i), "John Doe")
      await user.tab()
      await user.type(screen.getByLabelText(/^email/i), "john@test.com")
      await user.tab()
      await user.type(screen.getByLabelText(/phone/i), "+1234567890")
      await user.tab()
      await user.type(screen.getByLabelText(/^location/i), "NYC")
      await user.tab()
      await user.type(screen.getByLabelText(/professional summary/i), "Summary text")
      await user.tab()
      // Should have called save multiple times
      expect(mockSave).toHaveBeenCalled()
    })
    it("calls save with all current form values on each blur", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      // Fill all fields
      await user.type(screen.getByLabelText(/full name/i), "Jane Smith")
      await user.type(screen.getByLabelText(/^email/i), "jane@example.com")
      await user.type(screen.getByLabelText(/phone/i), "+9876543210")
      await user.type(screen.getByLabelText(/^location/i), "Boston, MA")
      // Blur the last field
      await user.tab()
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: {
              personalInfo: {
                name: "Jane Smith",
                email: "jane@example.com",
                phone: "+9876543210",
                location: "Boston, MA",
                summary: "",
              },
            },
          }),
        )
      })
    })
    it("handles empty summary in auto-save", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      await user.type(screen.getByLabelText(/full name/i), "Test User")
      await user.tab()
      await waitFor(() => {
        expect(mockSave).toHaveBeenCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              personalInfo: expect.objectContaining({
                summary: "",
              }),
            }),
          }),
        )
      })
    })
  })
  describe("Auto-Save Status Display", () => {
    it("shows saving indicator when isSaving is true", () => {
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: true,
        error: null,
        lastSaved: null,
      })
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByText("Saving...")).toBeInTheDocument()
    })
    it("shows saved status with timestamp when saved", () => {
      const lastSaved = new Date()
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: false,
        error: null as Error | null,
        lastSaved: lastSaved as Date | null,
      })
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByText("Saved just now")).toBeInTheDocument()
    })
    it("shows error status when save fails", () => {
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: false,
        error: new Error("Save failed") as Error | null,
        lastSaved: null as Date | null,
      })
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByText("Failed to save")).toBeInTheDocument()
    })
    it("does not show status when no activity", () => {
      mockUseAutoSave.mockReturnValue({
        save: mockSave,
        isSaving: false,
        error: null,
        lastSaved: null,
      })
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.queryByText("Saving...")).not.toBeInTheDocument()
      expect(screen.queryByText(/saved/i)).not.toBeInTheDocument()
      expect(screen.queryByText("Failed to save")).not.toBeInTheDocument()
    })
  })
  describe("Default Values", () => {
    it("populates form with default values", () => {
      const defaultValues = {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        location: "San Francisco, CA",
        summary: "Experienced developer",
      }
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />)
      expect(screen.getByLabelText(/full name/i)).toHaveValue("John Doe")
      expect(screen.getByLabelText(/^email/i)).toHaveValue("john@example.com")
      expect(screen.getByLabelText(/phone/i)).toHaveValue("+1234567890")
      expect(screen.getByLabelText(/^location/i)).toHaveValue("San Francisco, CA")
      expect(screen.getByLabelText(/professional summary/i)).toHaveValue("Experienced developer")
    })
    it("handles partial default values", () => {
      const defaultValues = {
        name: "Jane Smith",
        email: "jane@example.com",
      }
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />)
      expect(screen.getByLabelText(/full name/i)).toHaveValue("Jane Smith")
      expect(screen.getByLabelText(/^email/i)).toHaveValue("jane@example.com")
      expect(screen.getByLabelText(/phone/i)).toHaveValue("")
      expect(screen.getByLabelText(/^location/i)).toHaveValue("")
      expect(screen.getByLabelText(/professional summary/i)).toHaveValue("")
    })
    it("handles empty default values", () => {
      const defaultValues = {}
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />)
      expect(screen.getByLabelText(/full name/i)).toHaveValue("")
      expect(screen.getByLabelText(/^email/i)).toHaveValue("")
      expect(screen.getByLabelText(/phone/i)).toHaveValue("")
      expect(screen.getByLabelText(/^location/i)).toHaveValue("")
      expect(screen.getByLabelText(/professional summary/i)).toHaveValue("")
    })
    it("allows editing default values", async () => {
      const user = userEvent.setup()
      const defaultValues = {
        name: "Original Name",
      }
      render(<PersonalInfoForm {...defaultProps} defaultValues={defaultValues} />)
      const nameInput = screen.getByLabelText(/full name/i)
      expect(nameInput).toHaveValue("Original Name")
      await user.clear(nameInput)
      await user.type(nameInput, "Updated Name")
      expect(nameInput).toHaveValue("Updated Name")
    })
  })
  describe("Disabled State", () => {
    it("disables all fields when enabled is false", () => {
      render(<PersonalInfoForm {...defaultProps} enabled={false} />)
      expect(screen.getByLabelText(/full name/i)).toBeDisabled()
      expect(screen.getByLabelText(/^email/i)).toBeDisabled()
      expect(screen.getByLabelText(/phone/i)).toBeDisabled()
      expect(screen.getByLabelText(/^location/i)).toBeDisabled()
      expect(screen.getByLabelText(/professional summary/i)).toBeDisabled()
    })
    it("enables all fields by default", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByLabelText(/full name/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/^email/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/phone/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/^location/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/professional summary/i)).not.toBeDisabled()
    })
    it("enables all fields when enabled is true", () => {
      render(<PersonalInfoForm {...defaultProps} enabled={true} />)
      expect(screen.getByLabelText(/full name/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/^email/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/phone/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/^location/i)).not.toBeDisabled()
      expect(screen.getByLabelText(/professional summary/i)).not.toBeDisabled()
    })
    it("does not trigger auto-save when disabled", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} enabled={false} />)
      const nameInput = screen.getByLabelText(/full name/i)
      // Try to type (won't work because disabled)
      await user.click(nameInput)
      await user.keyboard("Test")
      expect(mockSave).not.toHaveBeenCalled()
    })
  })
  describe("Field Types", () => {
    it("summary field is a textarea with correct rows", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      const summaryInput = screen.getByLabelText(/professional summary/i)
      expect(summaryInput.tagName).toBe("TEXTAREA")
      expect(summaryInput).toHaveAttribute("rows", "4")
    })
    it("email field has email input type", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      const emailInput = screen.getByLabelText(/^email/i)
      expect(emailInput).toHaveAttribute("type", "email")
    })
    it("phone field has tel input type", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      const phoneInput = screen.getByLabelText(/phone/i)
      expect(phoneInput).toHaveAttribute("type", "tel")
    })
  })
  describe("Grid Layout", () => {
    it("renders fields in a responsive grid", () => {
      const { container } = render(<PersonalInfoForm {...defaultProps} />)
      // Check that the grid container exists
      const gridContainer = container.querySelector(".grid")
      expect(gridContainer).toBeInTheDocument()
    })
  })
  describe("Form Labels", () => {
    it("shows all correct labels", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      expect(screen.getByText("Full Name *")).toBeInTheDocument()
      expect(screen.getByText("Email *")).toBeInTheDocument()
      expect(screen.getByText("Phone *")).toBeInTheDocument()
      expect(screen.getByText("Location *")).toBeInTheDocument()
      expect(screen.getByText("Professional Summary")).toBeInTheDocument()
    })
    it("marks required fields with asterisks", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      // Check that required fields have asterisks in their labels
      expect(screen.getByText(/full name \*/i)).toBeInTheDocument()
      expect(screen.getByText(/email \*/i)).toBeInTheDocument()
      expect(screen.getByText(/phone \*/i)).toBeInTheDocument()
      expect(screen.getByText(/location \*/i)).toBeInTheDocument()
    })
    it("does not mark optional fields with asterisks", () => {
      render(<PersonalInfoForm {...defaultProps} />)
      const summaryLabel = screen.getByText("Professional Summary")
      expect(summaryLabel.textContent).not.toContain("*")
    })
  })
  describe("Edge Cases", () => {
    it("accepts very long summary text", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const longText = "A".repeat(600)
      const summaryInput = screen.getByLabelText(/professional summary/i)
      // Use paste for very long text to avoid timeout
      await user.click(summaryInput)
      await user.paste(longText)
      expect(summaryInput).toHaveValue(longText)
    })
    it("handles special characters in name", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/full name/i)
      // Use paste for special characters to avoid encoding issues
      await user.click(nameInput)
      await user.paste("José García-Martínez")
      expect(nameInput).toHaveValue("José García-Martínez")
    })
    it("handles international phone formats", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const phoneInput = screen.getByLabelText(/phone/i)
      // Use paste for special characters like + to avoid issues
      await user.click(phoneInput)
      await user.paste("+44 20 7123 4567")
      expect(phoneInput).toHaveValue("+44 20 7123 4567")
    })
    it("handles international locations", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const locationInput = screen.getByLabelText(/^location/i)
      await user.type(locationInput, "Tokyo")
      expect(locationInput).toHaveValue("Tokyo")
    })
    it("handles clearing field values", async () => {
      const user = userEvent.setup()
      render(<PersonalInfoForm {...defaultProps} />)
      const nameInput = screen.getByLabelText(/full name/i)
      await user.type(nameInput, "TestName")
      expect(nameInput).toHaveValue("TestName")
      await user.clear(nameInput)
      expect(nameInput).toHaveValue("")
    })
  })
})
