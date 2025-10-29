import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import { CertificationFormDialog } from "../certification-form-dialog"

describe("CertificationFormDialog", () => {
  let defaultProps: {
    open: boolean
    onOpenChange: ReturnType<typeof vi.fn>
    onSubmit: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    defaultProps = {
      open: true,
      onOpenChange: vi.fn(),
      onSubmit: vi.fn(),
    }
  })
  describe("Rendering", () => {
    it("renders the dialog when open", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      expect(screen.getByRole("dialog")).toBeInTheDocument()
      expect(screen.getByText("Add Certification")).toBeInTheDocument()
      expect(screen.getByText("Add your certification details.")).toBeInTheDocument()
    })
    it("renders with custom title and description", () => {
      render(
        <CertificationFormDialog
          {...defaultProps}
          title="Edit Certification"
          description="Update your certification information."
        />,
      )
      expect(screen.getByText("Edit Certification")).toBeInTheDocument()
      expect(screen.getByText("Update your certification information.")).toBeInTheDocument()
    })
    it("does not render when closed", () => {
      render(<CertificationFormDialog {...defaultProps} open={false} />)
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })
    it("renders all form fields", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      expect(screen.getByLabelText(/certification name/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/issuing organization/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^issue date$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/expiry date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/credential id/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/credential url/i)).toBeInTheDocument()
    })
    it("renders action buttons", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument()
    })
    it("shows field descriptions", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      expect(screen.getByText(/format: yyyy-mm/i)).toBeInTheDocument()
      expect(screen.getByText(/leave blank if no expiry/i)).toBeInTheDocument()
      expect(screen.getByText(/certificate or credential number/i)).toBeInTheDocument()
      expect(screen.getByText(/link to verify the certification/i)).toBeInTheDocument()
    })
  })
  describe("Form Interaction", () => {
    it("allows filling in certification name", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      const nameInput = screen.getByLabelText(/certification name/i)
      await user.type(nameInput, "AWS Certified Solutions Architect")
      expect(nameInput).toHaveValue("AWS Certified Solutions Architect")
    })
    it("allows filling in issuing organization", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      const issuerInput = screen.getByLabelText(/issuing organization/i)
      await user.type(issuerInput, "Amazon Web Services")
      expect(issuerInput).toHaveValue("Amazon Web Services")
    })
    it("allows filling in issue date", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      const dateInput = screen.getByLabelText(/^issue date$/i)
      await user.type(dateInput, "2023-06")
      expect(dateInput).toHaveValue("2023-06")
    })
    it("allows filling in expiry date", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      const expiryInput = screen.getByLabelText(/expiry date/i)
      await user.type(expiryInput, "2026-06")
      expect(expiryInput).toHaveValue("2026-06")
    })
    it("allows filling in credential ID", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      const credentialInput = screen.getByLabelText(/credential id/i)
      await user.type(credentialInput, "ABC123XYZ")
      expect(credentialInput).toHaveValue("ABC123XYZ")
    })
    it("allows filling in credential URL", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      const urlInput = screen.getByLabelText(/credential url/i)
      await user.type(urlInput, "https://www.credly.com/badges/example")
      expect(urlInput).toHaveValue("https://www.credly.com/badges/example")
    })
  })
  describe("Form Submission", () => {
    it("submits form with all required fields", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "AWS Solutions Architect")
      await user.type(screen.getByLabelText(/issuing organization/i), "AWS")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-06")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "AWS Solutions Architect",
            issuer: "AWS",
            date: "2023-06",
          }),
        )
      })
    })
    it("submits form with all fields including optional ones", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "AWS Solutions Architect")
      await user.type(screen.getByLabelText(/issuing organization/i), "AWS")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-06")
      await user.type(screen.getByLabelText(/expiry date/i), "2026-06")
      await user.type(screen.getByLabelText(/credential id/i), "ABC123")
      await user.type(screen.getByLabelText(/credential url/i), "https://example.com/cert")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: "AWS Solutions Architect",
          issuer: "AWS",
          date: "2023-06",
          expiryDate: "2026-06",
          credentialId: "ABC123",
          url: "https://example.com/cert",
        })
      })
    })
    it("submits form without optional expiry date", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "PMP")
      await user.type(screen.getByLabelText(/issuing organization/i), "PMI")
      await user.type(screen.getByLabelText(/^issue date$/i), "2022-01")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "PMP",
            issuer: "PMI",
            date: "2022-01",
            expiryDate: "",
          }),
        )
      })
    })
    it("submits form without optional credential ID", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "CISSP")
      await user.type(screen.getByLabelText(/issuing organization/i), "ISC2")
      await user.type(screen.getByLabelText(/^issue date$/i), "2021-03")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "CISSP",
            issuer: "ISC2",
            date: "2021-03",
            credentialId: "",
          }),
        )
      })
    })
    it("submits form without optional URL", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "CKA")
      await user.type(screen.getByLabelText(/issuing organization/i), "CNCF")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-09")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "CKA",
            issuer: "CNCF",
            date: "2023-09",
            url: "",
          }),
        )
      })
    })
    it("closes dialog after successful submission", async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onOpenChange={onOpenChange} />)
      await user.type(screen.getByLabelText(/certification name/i), "Test Cert")
      await user.type(screen.getByLabelText(/issuing organization/i), "Test Org")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-01")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })
    it("resets form after submission", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      const nameInput = screen.getByLabelText(/certification name/i)
      await user.type(nameInput, "Test Certification")
      await user.type(screen.getByLabelText(/issuing organization/i), "Test Org")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-01")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(nameInput).toHaveValue("")
      })
    })
  })
  describe("Cancel Button", () => {
    it("closes dialog when cancel is clicked", async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onOpenChange={onOpenChange} />)
      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      await user.click(cancelButton)
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
    it("does not submit form when cancel is clicked", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "Test")
      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      await user.click(cancelButton)
      expect(onSubmit).not.toHaveBeenCalled()
    })
  })
  describe("Default Values", () => {
    it("populates form with default values", () => {
      const defaultValues = {
        name: "Default Cert",
        issuer: "Default Org",
        date: "2022-06",
        expiryDate: "2025-06",
        credentialId: "DEF456",
        url: "https://default.com/cert",
      }
      render(<CertificationFormDialog {...defaultProps} defaultValues={defaultValues} />)
      expect(screen.getByLabelText(/certification name/i)).toHaveValue("Default Cert")
      expect(screen.getByLabelText(/issuing organization/i)).toHaveValue("Default Org")
      expect(screen.getByLabelText(/^issue date$/i)).toHaveValue("2022-06")
      expect(screen.getByLabelText(/expiry date/i)).toHaveValue("2025-06")
      expect(screen.getByLabelText(/credential id/i)).toHaveValue("DEF456")
      expect(screen.getByLabelText(/credential url/i)).toHaveValue("https://default.com/cert")
    })
    it("handles partial default values", () => {
      const defaultValues = {
        name: "Partial Cert",
        issuer: "Partial Org",
        date: "2021-01",
      }
      render(<CertificationFormDialog {...defaultProps} defaultValues={defaultValues} />)
      expect(screen.getByLabelText(/certification name/i)).toHaveValue("Partial Cert")
      expect(screen.getByLabelText(/issuing organization/i)).toHaveValue("Partial Org")
      expect(screen.getByLabelText(/^issue date$/i)).toHaveValue("2021-01")
      expect(screen.getByLabelText(/expiry date/i)).toHaveValue("")
      expect(screen.getByLabelText(/credential id/i)).toHaveValue("")
      expect(screen.getByLabelText(/credential url/i)).toHaveValue("")
    })
  })
  describe("Form Validation", () => {
    it("requires certification name", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      // Fill in other required fields but leave name empty
      await user.type(screen.getByLabelText(/issuing organization/i), "Test Org")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-01")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        // Form should not submit without name
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })
    })
    it("requires issuing organization", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      // Fill in other required fields but leave issuer empty
      await user.type(screen.getByLabelText(/certification name/i), "Test Cert")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-01")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        // Form should not submit without issuer
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })
    })
    it("requires issue date", async () => {
      const user = userEvent.setup()
      render(<CertificationFormDialog {...defaultProps} />)
      // Fill in other required fields but leave date empty
      await user.type(screen.getByLabelText(/certification name/i), "Test Cert")
      await user.type(screen.getByLabelText(/issuing organization/i), "Test Org")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        // Form should not submit without date
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })
    })
  })
  describe("URL Field", () => {
    it("accepts valid URL format", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "Test")
      await user.type(screen.getByLabelText(/issuing organization/i), "Org")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-01")
      await user.type(
        screen.getByLabelText(/credential url/i),
        "https://www.credly.com/badges/12345",
      )
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "https://www.credly.com/badges/12345",
          }),
        )
      })
    })
    it("has url input type", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      const urlInput = screen.getByLabelText(/credential url/i)
      expect(urlInput).toHaveAttribute("type", "url")
    })
  })
  describe("Date Fields", () => {
    it("has month input type for issue date", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      const dateInput = screen.getByLabelText(/^issue date$/i)
      expect(dateInput).toHaveAttribute("type", "month")
    })
    it("has month input type for expiry date", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      const expiryInput = screen.getByLabelText(/expiry date/i)
      expect(expiryInput).toHaveAttribute("type", "month")
    })
    it("allows expiry date to be after issue date", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />)
      await user.type(screen.getByLabelText(/certification name/i), "Cert")
      await user.type(screen.getByLabelText(/issuing organization/i), "Org")
      await user.type(screen.getByLabelText(/^issue date$/i), "2023-01")
      await user.type(screen.getByLabelText(/expiry date/i), "2026-01")
      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            date: "2023-01",
            expiryDate: "2026-01",
          }),
        )
      })
    })
  })
  describe("Placeholder Text", () => {
    it("shows helpful placeholder for certification name", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      const nameInput = screen.getByPlaceholderText(/aws certified solutions architect/i)
      expect(nameInput).toBeInTheDocument()
    })
    it("shows helpful placeholder for issuing organization", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      const issuerInput = screen.getByPlaceholderText(/amazon web services/i)
      expect(issuerInput).toBeInTheDocument()
    })
    it("shows helpful placeholder for credential ID", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      const credentialInput = screen.getByPlaceholderText(/abc123xyz/i)
      expect(credentialInput).toBeInTheDocument()
    })
    it("shows helpful placeholder for URL", () => {
      render(<CertificationFormDialog {...defaultProps} />)
      const urlInput = screen.getByPlaceholderText(/https:\/\/www\.credly\.com\/badges\//i)
      expect(urlInput).toBeInTheDocument()
    })
  })
})
