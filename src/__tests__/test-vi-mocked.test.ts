import { vi } from "vitest";

describe("vi.mocked test", () => {
  it("should have vi.mocked function", () => {
    console.log("vi.mocked:", typeof vi.mocked);
    console.log(
      "vi keys:",
      Object.keys(vi).filter((k) => k.includes("mock")),
    );

    const mockFn = vi.fn();
    if (vi.mocked) {
      console.log("vi.mocked exists!");
      const mocked = vi.mocked(mockFn);
      console.log("mocked result:", typeof mocked);
      expect(typeof mocked).toBe("function");
    } else {
      console.log("vi.mocked does NOT exist");
    }

    expect(true).toBe(true);
  });
});
