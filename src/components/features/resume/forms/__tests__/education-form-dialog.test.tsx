import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { EducationFormDialog } from "../education-form-dialog"

describe("EducationFormDialog", () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onSubmit: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("Rendering", () => {
    it("renders the dialog when open", () => {
      render(<EducationFormDialog {...defaultProps} />)

      expect(screen.getByRole("dialog")).toBeInTheDocument()
      expect(screen.getByText("Add Education")).toBeInTheDocument()
      expect(screen.getByText("Add your education details.")).toBeInTheDocument()
    })

    it("renders with custom title and description", () => {
      render(
        <EducationFormDialog
          {...defaultProps}
          title="Edit Education"
          description="Update your education information."
        />,
      )

      expect(screen.getByText("Edit Education")).toBeInTheDocument()
      expect(screen.getByText("Update your education information.")).toBeInTheDocument()
    })

    it("does not render when closed", () => {
      render(<EducationFormDialog {...defaultProps} open={false} />)

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    })

    it("renders all form fields", () => {
      render(<EducationFormDialog {...defaultProps} />)

      expect(screen.getByLabelText(/institution/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/^degree$/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/field of study/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/start date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/end date/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/i currently study here/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/gpa/i)).toBeInTheDocument()
    })

    it("renders honors section button", () => {
      render(<EducationFormDialog {...defaultProps} />)

      expect(screen.getByRole("button", { name: /add honor\/award/i })).toBeInTheDocument()
    })

    it("renders action buttons", () => {
      render(<EducationFormDialog {...defaultProps} />)

      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole("button", { name: /^save$/i })).toBeInTheDocument()
    })
  })

  describe("Form Interaction", () => {
    it("allows filling in institution name", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const institutionInput = screen.getByLabelText(/institution/i)
      await user.type(institutionInput, "MIT")

      expect(institutionInput).toHaveValue("MIT")
    })

    it("allows filling in degree", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const degreeInput = screen.getByLabelText(/^degree$/i)
      await user.type(degreeInput, "Bachelor of Science")

      expect(degreeInput).toHaveValue("Bachelor of Science")
    })

    it("allows filling in field of study", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const fieldInput = screen.getByLabelText(/field of study/i)
      await user.type(fieldInput, "Computer Science")

      expect(fieldInput).toHaveValue("Computer Science")
    })

    it("allows filling in start date", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const startDateInput = screen.getByLabelText(/start date/i)
      await user.type(startDateInput, "2016-09")

      expect(startDateInput).toHaveValue("2016-09")
    })

    it("allows filling in end date", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const endDateInput = screen.getByLabelText(/end date/i)
      await user.type(endDateInput, "2020-05")

      expect(endDateInput).toHaveValue("2020-05")
    })

    it("allows filling in GPA", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const gpaInput = screen.getByLabelText(/gpa/i)
      await user.type(gpaInput, "3.8")

      expect(gpaInput).toHaveValue("3.8")
    })
  })

  describe("Current Study Checkbox", () => {
    it("disables end date when current is checked", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const currentCheckbox = screen.getByLabelText(/i currently study here/i)
      const endDateInput = screen.getByLabelText(/end date/i)

      expect(endDateInput).not.toBeDisabled()

      await user.click(currentCheckbox)

      await waitFor(() => {
        expect(endDateInput).toBeDisabled()
      })
    })

    it("clears end date when current is checked", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const endDateInput = screen.getByLabelText(/end date/i)
      const currentCheckbox = screen.getByLabelText(/i currently study here/i)

      // First, fill in end date
      await user.type(endDateInput, "2024-05")
      expect(endDateInput).toHaveValue("2024-05")

      // Then check current
      await user.click(currentCheckbox)

      await waitFor(() => {
        expect(endDateInput).toHaveValue("")
      })
    })

    it("enables end date when current is unchecked", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const currentCheckbox = screen.getByLabelText(/i currently study here/i)
      const endDateInput = screen.getByLabelText(/end date/i)

      await user.click(currentCheckbox)
      await waitFor(() => expect(endDateInput).toBeDisabled())

      await user.click(currentCheckbox)
      await waitFor(() => expect(endDateInput).not.toBeDisabled())
    })

    it("updates description text when current is checked", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const currentCheckbox = screen.getByLabelText(/i currently study here/i)

      // Both start and end date have "Format: YYYY-MM" initially
      const formatTexts = screen.getAllByText(/format: yyyy-mm/i)
      expect(formatTexts).toHaveLength(2)

      await user.click(currentCheckbox)

      await waitFor(() => {
        expect(screen.getByText(/currently studying/i)).toBeInTheDocument()
      })
    })
  })

  describe("Honors Management", () => {
    it("does not show honors inputs by default", () => {
      render(<EducationFormDialog {...defaultProps} />)

      expect(screen.queryByPlaceholderText(/dean's list/i)).not.toBeInTheDocument()
    })

    it("shows honors section after adding an honor", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const addButton = screen.getByRole("button", { name: /add honor\/award/i })
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getByText("Honors & Awards (optional)")).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/dean's list/i)).toBeInTheDocument()
      })
    })

    it("allows adding multiple honors", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const addButton = screen.getByRole("button", { name: /add honor\/award/i })

      await user.click(addButton)
      await user.click(addButton)
      await user.click(addButton)

      await waitFor(() => {
        const honorInputs = screen.getAllByPlaceholderText(/dean's list/i)
        expect(honorInputs).toHaveLength(3)
      })
    })

    it("allows typing in honor inputs", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))

      const honorInput = await screen.findByPlaceholderText(/dean's list/i)
      await user.type(honorInput, "Dean's List")

      expect(honorInput).toHaveValue("Dean's List")
    })

    it("allows removing honors", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      // Add two honors
      const addButton = screen.getByRole("button", { name: /add honor\/award/i })
      await user.click(addButton)
      await user.click(addButton)

      await waitFor(() => {
        expect(screen.getAllByPlaceholderText(/dean's list/i)).toHaveLength(2)
      })

      // Remove one
      const removeButtons = screen.getAllByRole("button", { name: "" })
      const removeButton = removeButtons.find((btn) => btn.querySelector("svg") && !btn.textContent)
      if (removeButton) {
        await user.click(removeButton)
      }

      await waitFor(() => {
        const honorInputs = screen.getAllByPlaceholderText(/dean's list/i)
        expect(honorInputs).toHaveLength(1)
      })
    })

    it("can remove all honors", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/dean's list/i)).toBeInTheDocument()
      })

      const removeButtons = screen.getAllByRole("button", { name: "" })
      const removeButton = removeButtons.find((btn) => btn.querySelector("svg") && !btn.textContent)
      if (removeButton) {
        await user.click(removeButton)
      }

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/dean's list/i)).not.toBeInTheDocument()
      })
    })

    it("renders with default honors", async () => {
      render(
        <EducationFormDialog
          {...defaultProps}
          defaultValues={{
            honors: ["Honor 1", "Honor 2"],
          }}
        />,
      )

      const honorInputs = screen.getAllByPlaceholderText(/dean's list/i)
      expect(honorInputs).toHaveLength(2)
      expect(honorInputs[0]).toHaveValue("Honor 1")
      expect(honorInputs[1]).toHaveValue("Honor 2")
    })
  })

  describe("Form Submission", () => {
    it("submits form with valid data", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/institution/i), "MIT")
      await user.type(screen.getByLabelText(/^degree$/i), "Bachelor of Science")
      await user.type(screen.getByLabelText(/field of study/i), "Computer Science")
      await user.type(screen.getByLabelText(/start date/i), "2016-09")
      await user.type(screen.getByLabelText(/end date/i), "2020-05")
      await user.type(screen.getByLabelText(/gpa/i), "3.8")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

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
        )
      })
    })

    it("submits form with current study", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/institution/i), "Stanford")
      await user.type(screen.getByLabelText(/^degree$/i), "Master of Science")
      await user.type(screen.getByLabelText(/field of study/i), "AI")
      await user.type(screen.getByLabelText(/start date/i), "2023-09")
      await user.click(screen.getByLabelText(/i currently study here/i))

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

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
        )
      })
    })

    it("submits form with honors", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/institution/i), "Harvard")
      await user.type(screen.getByLabelText(/^degree$/i), "PhD")
      await user.type(screen.getByLabelText(/field of study/i), "Physics")
      await user.type(screen.getByLabelText(/start date/i), "2020-09")

      // Add honors
      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))
      const honorInput = await screen.findByPlaceholderText(/dean's list/i)
      await user.type(honorInput, "Summa Cum Laude")

      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))
      const honorInputs = screen.getAllByPlaceholderText(/dean's list/i)
      await user.type(honorInputs[1], "Dean's List")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            honors: ["Summa Cum Laude", "Dean's List"],
          }),
        )
      })
    })

    it("filters out empty honors on submit", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/institution/i), "Test U")
      await user.type(screen.getByLabelText(/^degree$/i), "BS")
      await user.type(screen.getByLabelText(/field of study/i), "Math")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")

      // Add multiple honors but leave some empty
      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))
      const honorInput = await screen.findByPlaceholderText(/dean's list/i)
      await user.type(honorInput, "First honor")

      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))
      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))

      const honorInputs = screen.getAllByPlaceholderText(/dean's list/i)
      await user.type(honorInputs[2], "Third honor")
      // Leave second one empty

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            honors: ["First honor", "Third honor"],
          }),
        )
      })
    })

    it("submits form without optional GPA", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/institution/i), "Test U")
      await user.type(screen.getByLabelText(/^degree$/i), "BA")
      await user.type(screen.getByLabelText(/field of study/i), "English")
      await user.type(screen.getByLabelText(/start date/i), "2018-09")
      await user.type(screen.getByLabelText(/end date/i), "2022-05")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            institution: "Test U",
            degree: "BA",
            field: "English",
            gpa: "",
          }),
        )
      })
    })

    it("closes dialog after successful submission", async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(<EducationFormDialog {...defaultProps} onOpenChange={onOpenChange} />)

      await user.type(screen.getByLabelText(/institution/i), "Test")
      await user.type(screen.getByLabelText(/^degree$/i), "Degree")
      await user.type(screen.getByLabelText(/field of study/i), "Field")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false)
      })
    })

    it("resets form after submission", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      const institutionInput = screen.getByLabelText(/institution/i)
      await user.type(institutionInput, "Test Institution")
      await user.type(screen.getByLabelText(/^degree$/i), "Test Degree")
      await user.type(screen.getByLabelText(/field of study/i), "Test Field")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(institutionInput).toHaveValue("")
      })
    })

    it("resets honors after submission", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      await user.type(screen.getByLabelText(/institution/i), "Test")
      await user.type(screen.getByLabelText(/^degree$/i), "Degree")
      await user.type(screen.getByLabelText(/field of study/i), "Field")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")

      // Add an honor
      await user.click(screen.getByRole("button", { name: /add honor\/award/i }))
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/dean's list/i)).toBeInTheDocument()
      })

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(screen.queryByPlaceholderText(/dean's list/i)).not.toBeInTheDocument()
      })
    })
  })

  describe("Cancel Button", () => {
    it("closes dialog when cancel is clicked", async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      render(<EducationFormDialog {...defaultProps} onOpenChange={onOpenChange} />)

      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      await user.click(cancelButton)

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    it("does not submit form when cancel is clicked", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/institution/i), "Test")
      const cancelButton = screen.getByRole("button", { name: /cancel/i })
      await user.click(cancelButton)

      expect(onSubmit).not.toHaveBeenCalled()
    })
  })

  describe("Default Values", () => {
    it("populates form with default values", () => {
      const defaultValues = {
        institution: "Default University",
        degree: "Default Degree",
        field: "Default Field",
        startDate: "2016-09",
        endDate: "2020-05",
        current: false,
        gpa: "3.8",
        honors: ["Honor 1", "Honor 2"],
      }

      render(<EducationFormDialog {...defaultProps} defaultValues={defaultValues} />)

      expect(screen.getByLabelText(/institution/i)).toHaveValue("Default University")
      expect(screen.getByLabelText(/^degree$/i)).toHaveValue("Default Degree")
      expect(screen.getByLabelText(/field of study/i)).toHaveValue("Default Field")
      expect(screen.getByLabelText(/start date/i)).toHaveValue("2016-09")
      expect(screen.getByLabelText(/end date/i)).toHaveValue("2020-05")
      expect(screen.getByLabelText(/gpa/i)).toHaveValue("3.8")
    })

    it("handles partial default values", () => {
      const defaultValues = {
        institution: "Partial University",
        degree: "Partial Degree",
      }

      render(<EducationFormDialog {...defaultProps} defaultValues={defaultValues} />)

      expect(screen.getByLabelText(/institution/i)).toHaveValue("Partial University")
      expect(screen.getByLabelText(/^degree$/i)).toHaveValue("Partial Degree")
      expect(screen.getByLabelText(/field of study/i)).toHaveValue("")
      expect(screen.getByLabelText(/start date/i)).toHaveValue("")
      expect(screen.getByLabelText(/end date/i)).toHaveValue("")
    })
  })

  describe("Form Validation", () => {
    it("requires institution field", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      // Fill in other required fields but leave institution empty
      await user.type(screen.getByLabelText(/^degree$/i), "Degree")
      await user.type(screen.getByLabelText(/field of study/i), "Field")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Form should not submit without institution
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })
    })

    it("requires degree field", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      // Fill in other required fields but leave degree empty
      await user.type(screen.getByLabelText(/institution/i), "Test U")
      await user.type(screen.getByLabelText(/field of study/i), "Field")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Form should not submit without degree
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })
    })

    it("requires field of study", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      // Fill in other required fields but leave field empty
      await user.type(screen.getByLabelText(/institution/i), "Test U")
      await user.type(screen.getByLabelText(/^degree$/i), "Degree")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Form should not submit without field
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })
    })

    it("requires start date field", async () => {
      const user = userEvent.setup()
      render(<EducationFormDialog {...defaultProps} />)

      // Fill in other required fields but leave start date empty
      await user.type(screen.getByLabelText(/institution/i), "Test U")
      await user.type(screen.getByLabelText(/^degree$/i), "Degree")
      await user.type(screen.getByLabelText(/field of study/i), "Field")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        // Form should not submit without start date
        expect(defaultProps.onSubmit).not.toHaveBeenCalled()
      })
    })
  })

  describe("GPA Field", () => {
    it("accepts valid GPA format", async () => {
      const user = userEvent.setup()
      const onSubmit = vi.fn()
      render(<EducationFormDialog {...defaultProps} onSubmit={onSubmit} />)

      await user.type(screen.getByLabelText(/institution/i), "Test U")
      await user.type(screen.getByLabelText(/^degree$/i), "BS")
      await user.type(screen.getByLabelText(/field of study/i), "CS")
      await user.type(screen.getByLabelText(/start date/i), "2020-01")
      await user.type(screen.getByLabelText(/gpa/i), "3.8/4.0")

      const submitButton = screen.getByRole("button", { name: /^save$/i })
      await user.click(submitButton)

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            gpa: "3.8/4.0",
          }),
        )
      })
    })

    it("shows GPA description text", () => {
      render(<EducationFormDialog {...defaultProps} />)

      expect(screen.getByText(/e\.g\., 3\.8 or 3\.8\/4\.0/i)).toBeInTheDocument()
    })
  })
})
