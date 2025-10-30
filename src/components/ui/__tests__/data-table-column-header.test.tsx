import type { Column } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";

describe("DataTableColumnHeader", () => {
  const createMockColumn = (
    canSort: boolean,
    sorted: false | "asc" | "desc" = false,
  ) => {
    return {
      getCanSort: vi.fn(() => canSort),
      getIsSorted: vi.fn(() => sorted),
      toggleSorting: vi.fn(),
    } as unknown as Column<any, any>;
  };

  it("should render title without sort button when column cannot sort", () => {
    const column = createMockColumn(false);
    render(<DataTableColumnHeader column={column} title="Name" />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("should render sort button when column can sort", () => {
    const column = createMockColumn(true);
    render(<DataTableColumnHeader column={column} title="Email" />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("should show unsorted icon when column is not sorted", () => {
    const column = createMockColumn(true, false);
    const { container } = render(
      <DataTableColumnHeader column={column} title="Age" />,
    );

    // ChevronsUpDown icon for unsorted state
    const icon = container.querySelector(".lucide-chevrons-up-down");
    expect(icon).toBeInTheDocument();
  });

  it("should show ascending icon when sorted ascending", () => {
    const column = createMockColumn(true, "asc");
    const { container } = render(
      <DataTableColumnHeader column={column} title="Age" />,
    );

    // ArrowUp icon for ascending
    const icon = container.querySelector(".lucide-arrow-up");
    expect(icon).toBeInTheDocument();
  });

  it("should show descending icon when sorted descending", () => {
    const column = createMockColumn(true, "desc");
    const { container } = render(
      <DataTableColumnHeader column={column} title="Age" />,
    );

    // ArrowDown icon for descending
    const icon = container.querySelector(".lucide-arrow-down");
    expect(icon).toBeInTheDocument();
  });

  it("should toggle sorting to descending when currently unsorted", async () => {
    const user = userEvent.setup();
    const column = createMockColumn(true, false);

    render(<DataTableColumnHeader column={column} title="Name" />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(column.toggleSorting).toHaveBeenCalledWith(false);
  });

  it("should toggle sorting to descending when currently ascending", async () => {
    const user = userEvent.setup();
    const column = createMockColumn(true, "asc");

    render(<DataTableColumnHeader column={column} title="Name" />);

    const button = screen.getByRole("button");
    await user.click(button);

    // When sorted "asc", toggleSorting is called with true (meaning NOT ascending)
    expect(column.toggleSorting).toHaveBeenCalledWith(true);
  });

  it("should toggle sorting to ascending when currently descending", async () => {
    const user = userEvent.setup();
    const column = createMockColumn(true, "desc");

    render(<DataTableColumnHeader column={column} title="Name" />);

    const button = screen.getByRole("button");
    await user.click(button);

    // When sorted "desc", toggleSorting is called with false (meaning ascending)
    expect(column.toggleSorting).toHaveBeenCalledWith(false);
  });

  it("should apply custom className", () => {
    const column = createMockColumn(false);
    const { container } = render(
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="custom-class"
      />,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("custom-class");
  });

  it("should apply className to sortable column container", () => {
    const column = createMockColumn(true);
    const { container } = render(
      <DataTableColumnHeader
        column={column}
        title="Name"
        className="custom-class"
      />,
    );

    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain("custom-class");
    expect(div.className).toContain("flex");
  });
});
