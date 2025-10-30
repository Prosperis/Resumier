// Using globals from vitest config
describe("debug test without imports", () => {
  it("should pass", () => {
    expect(1 + 1).toBe(2);
  });
});
