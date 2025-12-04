describe("Mock verification", () => {
  it("window.matchMedia exists", () => {
    expect(window.matchMedia).toBeDefined();
  });

  it("window.matchMedia returns correct object", () => {
    console.log("typeof window.matchMedia:", typeof window.matchMedia);
    console.log("window.matchMedia:", window.matchMedia);
    const result = window.matchMedia("(prefers-reduced-motion)");
    console.log("result:", result);
    expect(result).toBeDefined();
    expect(result.addEventListener).toBeDefined();
  });

  it("ResizeObserver exists", () => {
    expect(window.ResizeObserver).toBeDefined();
  });

  it("ResizeObserver can be instantiated", () => {
    const ro = new ResizeObserver(() => {});
    expect(ro).toBeDefined();
    expect(ro.observe).toBeDefined();
  });
});
