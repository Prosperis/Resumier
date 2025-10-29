import { describe, expect, it } from "vitest"
import { cn } from "@/lib/utils"

describe("cn utility", () => {
  it("merges tailwind classes correctly", () => {
    expect(cn("p-2", "p-4")).toBe("p-4")
  })
  it("ignores falsy values", () => {
    expect(cn("p-2", null, undefined, false, "text-center")).toBe("p-2 text-center")
  })
  it("handles conditional classes", () => {
    const isActive = true
    expect(cn("base", isActive && "active")).toBe("base active")
  })
  it("handles arrays of classes", () => {
    expect(cn(["p-2", "m-2"])).toBe("p-2 m-2")
  })
  it("merges conflicting classes with tailwind-merge", () => {
    expect(cn("px-2 py-1 px-3")).toBe("py-1 px-3")
  })
})
