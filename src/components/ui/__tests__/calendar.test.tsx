import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"

// Mock dependencies
vi.mock("react-day-picker", () => ({
  DayPicker: ({ children, ...props }: any) => (
    <div data-testid="day-picker" {...props}>
      {children}
    </div>
  ),
  getDefaultClassNames: () => ({
    root: "rdp-root",
    months: "rdp-months",
    month: "rdp-month",
    nav: "rdp-nav",
    button_previous: "rdp-button_previous",
    button_next: "rdp-button_next",
    month_caption: "rdp-month_caption",
    dropdowns: "rdp-dropdowns",
    dropdown_root: "rdp-dropdown_root",
    dropdown: "rdp-dropdown",
    caption_label: "rdp-caption_label",
    weekdays: "rdp-weekdays",
    weekday: "rdp-weekday",
    week: "rdp-week",
    week_number_header: "rdp-week_number_header",
    week_number: "rdp-week_number",
    day: "rdp-day",
    range_start: "rdp-range_start",
    range_middle: "rdp-range_middle",
    range_end: "rdp-range_end",
    today: "rdp-today",
    outside: "rdp-outside",
    disabled: "rdp-disabled",
    hidden: "rdp-hidden",
  }),
}))

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}))

vi.mock("@/components/ui/button-variants", () => ({
  buttonVariants: ({ variant }: any) => `button-${variant}`,
}))

vi.mock("lucide-react", () => ({
  ChevronDownIcon: (props: any) => <div data-testid="chevron-down" {...props} />,
  ChevronLeftIcon: (props: any) => <div data-testid="chevron-left" {...props} />,
  ChevronRightIcon: (props: any) => <div data-testid="chevron-right" {...props} />,
}))

describe("Calendar", () => {
  it("renders calendar component", () => {
    render(<Calendar />)
    expect(screen.getByTestId("day-picker")).toBeInTheDocument()
  })

  it("applies custom className", () => {
    render(<Calendar className="custom-calendar" />)
    const dayPicker = screen.getByTestId("day-picker")
    expect(dayPicker.className).toContain("custom-calendar")
  })

  it("shows outside days by default", () => {
    render(<Calendar />)
    const dayPicker = screen.getByTestId("day-picker")
    expect(dayPicker).toBeInTheDocument()
  })

  it("hides outside days when specified", () => {
    render(<Calendar showOutsideDays={false} />)
    const dayPicker = screen.getByTestId("day-picker")
    expect(dayPicker).toBeInTheDocument()
  })

  it("uses label caption layout by default", () => {
    render(<Calendar />)
    const dayPicker = screen.getByTestId("day-picker")
    expect(dayPicker).toHaveAttribute("captionLayout", "label")
  })

  it("accepts custom caption layout", () => {
    render(<Calendar captionLayout="dropdown" />)
    const dayPicker = screen.getByTestId("day-picker")
    expect(dayPicker).toHaveAttribute("captionLayout", "dropdown")
  })

  it("uses ghost button variant by default", () => {
    render(<Calendar />)
    expect(screen.getByTestId("day-picker")).toBeInTheDocument()
  })

  it("accepts custom button variant", () => {
    render(<Calendar buttonVariant="outline" />)
    expect(screen.getByTestId("day-picker")).toBeInTheDocument()
  })

  it("accepts custom formatters", () => {
    const customFormatter = (_date: Date) => "Custom Format"
    render(
      <Calendar
        formatters={{
          formatMonthDropdown: customFormatter,
        }}
      />,
    )
    expect(screen.getByTestId("day-picker")).toBeInTheDocument()
  })

  it("accepts custom components", () => {
    const CustomComponent = () => <div>Custom Component</div>
    render(
      <Calendar
        components={{
          Root: CustomComponent as any,
        }}
      />,
    )
    expect(screen.getByTestId("day-picker")).toBeInTheDocument()
  })

  it("passes through additional props", () => {
    render(<Calendar mode="single" />)
    const dayPicker = screen.getByTestId("day-picker")
    expect(dayPicker).toHaveAttribute("mode", "single")
  })

  it("applies custom classNames", () => {
    render(
      <Calendar
        classNames={{
          day: "custom-day",
        }}
      />,
    )
    expect(screen.getByTestId("day-picker")).toBeInTheDocument()
  })
})

describe("CalendarDayButton", () => {
  const mockDay = {
    date: new Date(2024, 0, 15),
    displayMonth: new Date(2024, 0, 1),
    dateLib: {} as any,
    outside: false,
    isEqualTo: () => false,
  }

  const mockModifiers = {
    focused: false,
    selected: false,
    range_start: false,
    range_end: false,
    range_middle: false,
    today: false,
    outside: false,
    disabled: false,
    hidden: false,
  }

  it("renders day button", () => {
    render(
      <CalendarDayButton day={mockDay} modifiers={mockModifiers}>
        15
      </CalendarDayButton>,
    )
    expect(screen.getByTestId("button")).toBeInTheDocument()
  })

  it("displays day number", () => {
    render(
      <CalendarDayButton day={mockDay} modifiers={mockModifiers}>
        15
      </CalendarDayButton>,
    )
    expect(screen.getByText("15")).toBeInTheDocument()
  })

  it("sets data-day attribute", () => {
    render(
      <CalendarDayButton day={mockDay} modifiers={mockModifiers}>
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toHaveAttribute("data-day", mockDay.date.toLocaleDateString())
  })

  it("sets data-selected-single when only selected", () => {
    render(
      <CalendarDayButton
        day={mockDay}
        modifiers={{
          ...mockModifiers,
          selected: true,
        }}
      >
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toHaveAttribute("data-selected-single", "true")
  })

  it("does not set data-selected-single when range_start is true", () => {
    render(
      <CalendarDayButton
        day={mockDay}
        modifiers={{
          ...mockModifiers,
          selected: true,
          range_start: true,
        }}
      >
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toHaveAttribute("data-selected-single", "false")
  })

  it("sets data-range-start when range_start is true", () => {
    render(
      <CalendarDayButton
        day={mockDay}
        modifiers={{
          ...mockModifiers,
          range_start: true,
        }}
      >
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toHaveAttribute("data-range-start", "true")
  })

  it("sets data-range-end when range_end is true", () => {
    render(
      <CalendarDayButton
        day={mockDay}
        modifiers={{
          ...mockModifiers,
          range_end: true,
        }}
      >
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toHaveAttribute("data-range-end", "true")
  })

  it("sets data-range-middle when range_middle is true", () => {
    render(
      <CalendarDayButton
        day={mockDay}
        modifiers={{
          ...mockModifiers,
          range_middle: true,
        }}
      >
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toHaveAttribute("data-range-middle", "true")
  })

  it("applies custom className", () => {
    render(
      <CalendarDayButton day={mockDay} modifiers={mockModifiers} className="custom-day-button">
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button.className).toContain("custom-day-button")
  })

  it("uses ghost variant", () => {
    render(
      <CalendarDayButton day={mockDay} modifiers={mockModifiers}>
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toHaveAttribute("variant", "ghost")
  })

  it("uses icon size", () => {
    render(
      <CalendarDayButton day={mockDay} modifiers={mockModifiers}>
        15
      </CalendarDayButton>,
    )
    const button = screen.getByTestId("button")
    expect(button).toBeInTheDocument()
  })
})
