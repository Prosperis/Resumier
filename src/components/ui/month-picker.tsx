"use client"

import * as React from "react"
import { CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface MonthPickerProps {
  value?: string // Format: YYYY-MM
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  placeholder?: string
}

export const MonthPicker = React.forwardRef<HTMLButtonElement, MonthPickerProps>(
  ({ value, onChange, disabled, className, placeholder = "Pick a month" }, ref) => {
    const [date, setDate] = React.useState<Date | undefined>(
      value ? new Date(value + "-01") : undefined
    )
    // year is the SELECTED year (derived from value)
    const [year, setYear] = React.useState<number>(
      value ? parseInt(value.split("-")[0]) : new Date().getFullYear()
    )
    // menuYear is the year currently being VIEWED in the menu
    const [menuYear, setMenuYear] = React.useState<number>(year)
    
    const [menuView, setMenuView] = React.useState<"month" | "year">("month")
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
      if (value) {
        const [y, m] = value.split("-").map(Number)
        if (!isNaN(y) && !isNaN(m)) {
          setYear(y)
          setMenuYear(y)
          setDate(new Date(y, m - 1))
        }
      } else {
        setDate(undefined)
        // Initialize menuYear to current year if no value, or keep existing if we want persistence?
        // Standard behavior: reset to current year if cleared? or keep context?
        // Let's keep it simple: if cleared, don't force reset menuYear so user context stays
      }
    }, [value])

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]

    const handleMonthSelect = (monthIndex: number) => {
      const newDate = new Date(menuYear, monthIndex)
      // Format as YYYY-MM
      const formatted = `${menuYear}-${String(monthIndex + 1).padStart(2, "0")}`
      onChange(formatted)
      setYear(menuYear)
      setDate(newDate)
      setOpen(false)
      setMenuView("month")
    }

    const handleYearSelect = (selectedYear: number) => {
      setMenuYear(selectedYear)
      setMenuView("month")
    }

    const handleNext = () => {
      if (menuView === "year") {
        setMenuYear((prev) => prev + 12)
      } else {
        setMenuYear((prev) => prev + 1)
      }
    }

    const handlePrev = () => {
      if (menuView === "year") {
        setMenuYear((prev) => prev - 12)
      } else {
        setMenuYear((prev) => prev - 1)
      }
    }

    // Calculate year range for year view (12 years grid)
    const startYear = Math.floor(menuYear / 12) * 12
    const endYear = startYear + 11

    return (
      <Popover
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (isOpen) {
            setMenuYear(year)
            setMenuView("month")
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-3 w-3 opacity-50" />
            <span className="truncate">
              {date ? (
                date.toLocaleString("default", { month: "long", year: "numeric" })
              ) : (
                <span>{placeholder}</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0" align="start">
          <div className="flex items-center justify-between border-b p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs font-semibold"
              onClick={() => setMenuView((prev) => (prev === "month" ? "year" : "month"))}
            >
              {menuView === "year" ? `${startYear}-${endYear}` : menuYear}
              <ChevronDown className={cn("ml-1 h-3 w-3 transition-transform", menuView === "year" && "rotate-180")} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleNext}
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1 p-1">
            {menuView === "month" ? (
              months.map((month, index) => (
                <Button
                  key={month}
                  variant={
                    date &&
                    date.getMonth() === index &&
                    date.getFullYear() === menuYear
                      ? "default"
                      : "ghost"
                  }
                  className={cn(
                    "h-7 text-[10px]",
                    date &&
                      date.getMonth() === index &&
                      date.getFullYear() === menuYear &&
                      "bg-primary text-primary-foreground hover:bg-primary/90"
                  )}
                  onClick={() => handleMonthSelect(index)}
                >
                  {month.slice(0, 3)}
                </Button>
              ))
            ) : (
              Array.from({ length: 12 }).map((_, i) => {
                const currentYear = startYear + i
                return (
                  <Button
                    key={currentYear}
                    variant={currentYear === year ? "default" : "ghost"}
                    className={cn(
                      "h-7 text-[10px]",
                      currentYear === year &&
                        "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                    onClick={() => handleYearSelect(currentYear)}
                  >
                    {currentYear}
                  </Button>
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)
MonthPicker.displayName = "MonthPicker"
