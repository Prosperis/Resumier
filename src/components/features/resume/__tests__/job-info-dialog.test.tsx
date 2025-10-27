import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { useResumeStore } from "@/stores"
import { JobInfoDialog } from "../job-info-dialog"

// Mock the store
vi.mock("@/stores", () => ({
  useResumeStore: vi.fn(),
}))

// Mock UI components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children, className }: any) => (
    <div className={className} data-testid="dialog-content">
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
}))

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: any) => <aside data-testid="sidebar">{children}</aside>,
  SidebarContent: ({ children }: any) => <div data-testid="sidebar-content">{children}</div>,
  SidebarGroup: ({ children }: any) => <div data-testid="sidebar-group">{children}</div>,
  SidebarGroupContent: ({ children }: any) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
  SidebarMenu: ({ children }: any) => <ul data-testid="sidebar-menu">{children}</ul>,
  SidebarMenuItem: ({ children }: any) => <li data-testid="sidebar-menu-item">{children}</li>,
  SidebarMenuButton: ({ children, onClick, isActive }: any) => (
    <button onClick={onClick} data-active={isActive} data-testid="sidebar-menu-button">
      {children}
    </button>
  ),
  SidebarProvider: ({ children }: any) => <div data-testid="sidebar-provider">{children}</div>,
}))

vi.mock("@/components/ui/input", () => ({
  Input: ({ value, onChange, placeholder, id, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={`input-${id}`}
      {...props}
    />
  ),
}))

vi.mock("@/components/ui/label", () => ({
  Label: ({ children, htmlFor }: any) => (
    <label htmlFor={htmlFor} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}))

vi.mock("@/components/ui/textarea", () => ({
  Textarea: ({ value, onChange, placeholder, id }: any) => (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid={`textarea-${id}`}
    />
  ),
}))

vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onChange, children, id }: any) => (
    <select id={id} value={value} onChange={onChange} data-testid={`select-${id}`}>
      {children}
    </select>
  ),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, type = "button", variant, size, className, ...props }: any) => (
    <button
      type={type}
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      data-testid="button"
      {...props}
    >
      {children}
    </button>
  ),
}))

vi.mock("lucide-react", () => ({
  Plus: () => <span data-testid="plus-icon">+</span>,
  Trash: () => <span data-testid="trash-icon">×</span>,
}))

describe("JobInfoDialog", () => {
  const mockSetJobInfo = vi.fn()
  const mockAddJob = vi.fn()
  const mockRemoveJob = vi.fn()
  const mockOnOpenChange = vi.fn()

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    ;(useResumeStore as any).mockImplementation((selector: any) =>
      selector({
        jobInfo: {},
        setJobInfo: mockSetJobInfo,
        jobs: [],
        addJob: mockAddJob,
        removeJob: mockRemoveJob,
      }),
    )
  })

  describe("Dialog Rendering", () => {
    it("should render dialog when open", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByTestId("dialog")).toBeInTheDocument()
    })

    it("should not render dialog when closed", () => {
      render(<JobInfoDialog open={false} onOpenChange={mockOnOpenChange} />)
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument()
    })

    it("should render dialog title", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByTestId("dialog-title")).toHaveTextContent("Job Information")
    })

    it("should render sidebar with navigation", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByTestId("sidebar")).toBeInTheDocument()
    })
  })

  describe("Section Navigation", () => {
    it("should render New Job section by default", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByText("New Job")).toBeInTheDocument()
    })

    it("should render Jobs section link", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByText("Jobs")).toBeInTheDocument()
    })

    it("should switch to Jobs section when clicked", async () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const jobsButton = screen.getAllByTestId("sidebar-menu-button")[1]
      fireEvent.click(jobsButton)
      // Jobs section should show table
      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument()
      })
    })

    it("should switch back to details section", async () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const buttons = screen.getAllByTestId("sidebar-menu-button")
      fireEvent.click(buttons[1]) // Click Jobs
      fireEvent.click(buttons[0]) // Click back to New Job
      await waitFor(() => {
        expect(screen.getByTestId("input-job")).toBeInTheDocument()
      })
    })
  })

  describe("Form Fields", () => {
    it("should render all form fields", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByTestId("input-job")).toBeInTheDocument()
      expect(screen.getByTestId("input-company")).toBeInTheDocument()
      expect(screen.getByTestId("select-workType")).toBeInTheDocument()
      expect(screen.getByTestId("input-location")).toBeInTheDocument()
      expect(screen.getByTestId("textarea-description")).toBeInTheDocument()
      expect(screen.getByTestId("input-basePay")).toBeInTheDocument()
      expect(screen.getByTestId("input-bonus")).toBeInTheDocument()
      expect(screen.getByTestId("input-stocks")).toBeInTheDocument()
    })

    it("should render all labels", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByTestId("label-job")).toHaveTextContent("Job Title")
      expect(screen.getByTestId("label-company")).toHaveTextContent("Company")
      expect(screen.getByTestId("label-workType")).toHaveTextContent("Type of Work")
      expect(screen.getByTestId("label-location")).toHaveTextContent("Location")
      expect(screen.getByTestId("label-description")).toHaveTextContent("Description")
      expect(screen.getByText("Benefits")).toBeInTheDocument()
      expect(screen.getByTestId("label-basePay")).toHaveTextContent("Base Pay")
      expect(screen.getByTestId("label-bonus")).toHaveTextContent("Bonus")
      expect(screen.getByTestId("label-stocks")).toHaveTextContent("Stocks/Options")
    })

    it("should have correct placeholders", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByPlaceholderText("Desired role")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Company name")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Company location")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Job description")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Annual salary")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Bonus or incentives")).toBeInTheDocument()
      expect(screen.getByPlaceholderText("Stock options or RSUs")).toBeInTheDocument()
    })
  })

  describe("Form Input", () => {
    it("should update job title input", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByTestId("input-job")
      await user.type(input, "Software Engineer")
      expect(input).toHaveValue("Software Engineer")
    })

    it("should update company input", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByTestId("input-company")
      await user.type(input, "Tech Corp")
      expect(input).toHaveValue("Tech Corp")
    })

    it("should update location input", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByTestId("input-location")
      await user.type(input, "San Francisco, CA")
      expect(input).toHaveValue("San Francisco, CA")
    })

    it("should update description textarea", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const textarea = screen.getByTestId("textarea-description")
      await user.type(textarea, "Great opportunity")
      expect(textarea).toHaveValue("Great opportunity")
    })

    it("should update base pay input", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByTestId("input-basePay")
      await user.type(input, "$120,000")
      expect(input).toHaveValue("$120,000")
    })

    it("should update bonus input", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByTestId("input-bonus")
      await user.type(input, "$10,000")
      expect(input).toHaveValue("$10,000")
    })

    it("should update stocks input", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByTestId("input-stocks")
      await user.type(input, "1000 RSUs")
      expect(input).toHaveValue("1000 RSUs")
    })
  })

  describe("Work Type Selection", () => {
    it("should render work type select with options", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const select = screen.getByTestId("select-workType")
      expect(select).toBeInTheDocument()
      expect(screen.getByText("Select")).toBeInTheDocument()
      expect(screen.getByText("Onsite")).toBeInTheDocument()
      expect(screen.getByText("Remote")).toBeInTheDocument()
      expect(screen.getByText("Hybrid")).toBeInTheDocument()
    })

    it("should update work type selection", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const select = screen.getByTestId("select-workType")
      await user.selectOptions(select, "remote")
      expect(select).toHaveValue("remote")
    })

    it("should allow onsite selection", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const select = screen.getByTestId("select-workType")
      await user.selectOptions(select, "onsite")
      expect(select).toHaveValue("onsite")
    })

    it("should allow hybrid selection", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const select = screen.getByTestId("select-workType")
      await user.selectOptions(select, "hybrid")
      expect(select).toHaveValue("hybrid")
    })
  })

  describe("Benefits Management", () => {
    it("should render benefit input field", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByPlaceholderText("Add benefit")).toBeInTheDocument()
    })

    it("should render Add Benefit button", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByText("Add Benefit")).toBeInTheDocument()
    })

    it("should render Use Template button", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByText("Use Template")).toBeInTheDocument()
    })

    it("should add benefit when button clicked", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByPlaceholderText("Add benefit")
      await user.type(input, "Health Insurance")
      const addButton = screen.getByText("Add Benefit")
      await user.click(addButton)
      expect(screen.getByDisplayValue("Health Insurance")).toBeInTheDocument()
    })

    it("should not add empty benefit", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const addButton = screen.getByText("Add Benefit")
      await user.click(addButton)
      // Should not add any input fields
      const inputs = screen.queryAllByPlaceholderText("Benefit")
      expect(inputs).toHaveLength(0)
    })

    it("should not add whitespace-only benefit", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByPlaceholderText("Add benefit")
      await user.type(input, "   ")
      const addButton = screen.getByText("Add Benefit")
      await user.click(addButton)
      const inputs = screen.queryAllByPlaceholderText("Benefit")
      expect(inputs).toHaveLength(0)
    })

    it("should clear benefit input after adding", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByPlaceholderText("Add benefit")
      await user.type(input, "Health Insurance")
      const addButton = screen.getByText("Add Benefit")
      await user.click(addButton)
      expect(input).toHaveValue("")
    })

    it("should add standard benefits template", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const templateButton = screen.getByText("Use Template")
      await user.click(templateButton)
      expect(screen.getByDisplayValue("Health Insurance")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Dental Insurance")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Vision Insurance")).toBeInTheDocument()
      expect(screen.getByDisplayValue("401(k)")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Paid Time Off")).toBeInTheDocument()
    })

    it("should allow editing added benefits", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByPlaceholderText("Add benefit")
      await user.type(input, "Health Insurance")
      await user.click(screen.getByText("Add Benefit"))
      const benefitInput = screen.getByDisplayValue("Health Insurance")
      await user.clear(benefitInput)
      await user.type(benefitInput, "Premium Health")
      expect(benefitInput).toHaveValue("Premium Health")
    })

    it("should remove benefit when trash icon clicked", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByPlaceholderText("Add benefit")
      await user.type(input, "Health Insurance")
      await user.click(screen.getByText("Add Benefit"))
      const trashIcons = screen.getAllByTestId("trash-icon")
      await user.click(trashIcons[0].closest("button")!)
      expect(screen.queryByDisplayValue("Health Insurance")).not.toBeInTheDocument()
    })

    it("should add multiple benefits", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const input = screen.getByPlaceholderText("Add benefit")

      await user.type(input, "Health Insurance")
      await user.click(screen.getByText("Add Benefit"))

      await user.type(input, "Dental Insurance")
      await user.click(screen.getByText("Add Benefit"))

      expect(screen.getByDisplayValue("Health Insurance")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Dental Insurance")).toBeInTheDocument()
    })
  })

  describe("Form Submission", () => {
    it("should render Add Job submit button", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByText("Add Job")).toBeInTheDocument()
    })

    it("should call setJobInfo and addJob on submit", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)

      await user.type(screen.getByTestId("input-job"), "Software Engineer")
      await user.type(screen.getByTestId("input-company"), "Tech Corp")
      await user.type(screen.getByTestId("input-location"), "SF")
      await user.type(screen.getByTestId("textarea-description"), "Great job")
      await user.type(screen.getByTestId("input-basePay"), "$120k")
      await user.type(screen.getByTestId("input-bonus"), "$10k")
      await user.type(screen.getByTestId("input-stocks"), "1000 RSUs")
      await user.selectOptions(screen.getByTestId("select-workType"), "remote")

      const submitButton = screen.getByText("Add Job")
      await user.click(submitButton)

      expect(mockSetJobInfo).toHaveBeenCalledWith({
        title: "Software Engineer",
        company: "Tech Corp",
        location: "SF",
        description: "Great job",
        basePay: "$120k",
        bonus: "$10k",
        stocks: "1000 RSUs",
        workType: "remote",
        benefits: [],
      })
      expect(mockAddJob).toHaveBeenCalled()
    })

    it("should clear form after submission", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)

      await user.type(screen.getByTestId("input-job"), "Engineer")
      await user.type(screen.getByTestId("input-company"), "Corp")
      await user.click(screen.getByText("Add Job"))

      expect(screen.getByTestId("input-job")).toHaveValue("")
      expect(screen.getByTestId("input-company")).toHaveValue("")
    })

    it("should include benefits in submission", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)

      const benefitInput = screen.getByPlaceholderText("Add benefit")
      await user.type(benefitInput, "Health Insurance")
      await user.click(screen.getByText("Add Benefit"))

      await user.type(screen.getByTestId("input-job"), "Engineer")
      await user.click(screen.getByText("Add Job"))

      expect(mockSetJobInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          benefits: ["Health Insurance"],
        }),
      )
    })
  })

  describe("Jobs List Section", () => {
    beforeEach(() => {
      ;(useResumeStore as any).mockImplementation((selector: any) =>
        selector({
          jobInfo: {},
          setJobInfo: mockSetJobInfo,
          jobs: [
            {
              title: "Software Engineer",
              company: "Tech Corp",
              workType: "remote",
              location: "SF",
              basePay: "$120k",
            },
            {
              title: "Product Manager",
              company: "Startup Inc",
              workType: "hybrid",
              location: "NY",
              basePay: "$150k",
            },
          ],
          addJob: mockAddJob,
          removeJob: mockRemoveJob,
        }),
      )
    })

    it("should render jobs table", async () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const jobsButton = screen.getAllByTestId("sidebar-menu-button")[1]
      fireEvent.click(jobsButton)

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument()
        expect(screen.getByText("Company")).toBeInTheDocument()
        expect(screen.getByText("Work Type")).toBeInTheDocument()
        expect(screen.getByText("Location")).toBeInTheDocument()
        expect(screen.getByText("Base Pay")).toBeInTheDocument()
      })
    })

    it("should display all jobs in table", async () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const jobsButton = screen.getAllByTestId("sidebar-menu-button")[1]
      fireEvent.click(jobsButton)

      await waitFor(() => {
        expect(screen.getByText("Software Engineer")).toBeInTheDocument()
        expect(screen.getByText("Tech Corp")).toBeInTheDocument()
        expect(screen.getByText("remote")).toBeInTheDocument()
        expect(screen.getByText("SF")).toBeInTheDocument()
        expect(screen.getByText("$120k")).toBeInTheDocument()

        expect(screen.getByText("Product Manager")).toBeInTheDocument()
        expect(screen.getByText("Startup Inc")).toBeInTheDocument()
        expect(screen.getByText("hybrid")).toBeInTheDocument()
        expect(screen.getByText("NY")).toBeInTheDocument()
        expect(screen.getByText("$150k")).toBeInTheDocument()
      })
    })

    it("should render Remove button for each job", async () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const jobsButton = screen.getAllByTestId("sidebar-menu-button")[1]
      fireEvent.click(jobsButton)

      await waitFor(() => {
        const removeButtons = screen.getAllByText("Remove")
        expect(removeButtons).toHaveLength(2)
      })
    })

    it("should call removeJob when Remove clicked", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const jobsButton = screen.getAllByTestId("sidebar-menu-button")[1]
      fireEvent.click(jobsButton)

      await waitFor(async () => {
        const removeButtons = screen.getAllByText("Remove")
        await user.click(removeButtons[0])
        expect(mockRemoveJob).toHaveBeenCalledWith(0)
      })
    })

    it("should call removeJob with correct index", async () => {
      const user = userEvent.setup()
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const jobsButton = screen.getAllByTestId("sidebar-menu-button")[1]
      fireEvent.click(jobsButton)

      await waitFor(async () => {
        const removeButtons = screen.getAllByText("Remove")
        await user.click(removeButtons[1])
        expect(mockRemoveJob).toHaveBeenCalledWith(1)
      })
    })
  })

  describe("Pre-filled Data", () => {
    beforeEach(() => {
      ;(useResumeStore as any).mockImplementation((selector: any) =>
        selector({
          jobInfo: {
            title: "Senior Developer",
            company: "Big Tech",
            location: "Seattle",
            description: "Leading projects",
            benefits: ["Health", "Dental"],
            workType: "hybrid",
            basePay: "$180k",
            bonus: "$20k",
            stocks: "2000 RSUs",
          },
          setJobInfo: mockSetJobInfo,
          jobs: [],
          addJob: mockAddJob,
          removeJob: mockRemoveJob,
        }),
      )
    })

    it("should pre-fill form with existing job info", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByTestId("input-job")).toHaveValue("Senior Developer")
      expect(screen.getByTestId("input-company")).toHaveValue("Big Tech")
      expect(screen.getByTestId("input-location")).toHaveValue("Seattle")
      expect(screen.getByTestId("textarea-description")).toHaveValue("Leading projects")
      expect(screen.getByTestId("input-basePay")).toHaveValue("$180k")
      expect(screen.getByTestId("input-bonus")).toHaveValue("$20k")
      expect(screen.getByTestId("input-stocks")).toHaveValue("2000 RSUs")
      expect(screen.getByTestId("select-workType")).toHaveValue("hybrid")
    })

    it("should pre-fill benefits", () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      expect(screen.getByDisplayValue("Health")).toBeInTheDocument()
      expect(screen.getByDisplayValue("Dental")).toBeInTheDocument()
    })
  })

  describe("Empty State", () => {
    it("should render empty jobs table when no jobs", async () => {
      render(<JobInfoDialog open={true} onOpenChange={mockOnOpenChange} />)
      const jobsButton = screen.getAllByTestId("sidebar-menu-button")[1]
      fireEvent.click(jobsButton)

      await waitFor(() => {
        expect(screen.getByText("Title")).toBeInTheDocument()
        // Table should be empty
        const removeButtons = screen.queryAllByText("Remove")
        expect(removeButtons).toHaveLength(0)
      })
    })
  })
})
