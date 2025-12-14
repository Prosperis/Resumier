import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Link } from "@/stores";
import { LinksSection } from "../links-section";

describe("LinksSection", () => {
  const mockLinks: Link[] = [
    {
      label: "LinkedIn",
      url: "https://linkedin.com/in/johndoe",
    },
    {
      label: "GitHub",
      url: "https://github.com/johndoe",
    },
  ];

  const defaultProps = {
    customUrl: "johndoe",
    links: mockLinks,
    setCustomUrl: vi.fn(),
    addLink: vi.fn(),
    updateLink: vi.fn(),
    removeLink: vi.fn(),
  };

  it("renders custom URL input", () => {
    render(<LinksSection {...defaultProps} />);

    expect(screen.getByLabelText(/custom url/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("johndoe")).toBeInTheDocument();
  });

  it("renders all links", () => {
    render(<LinksSection {...defaultProps} />);

    expect(screen.getByDisplayValue("LinkedIn")).toBeInTheDocument();
    expect(screen.getByDisplayValue("GitHub")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://linkedin.com/in/johndoe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://github.com/johndoe")).toBeInTheDocument();
  });

  it("renders Add Link button", () => {
    render(<LinksSection {...defaultProps} />);

    expect(screen.getByRole("button", { name: /add link/i })).toBeInTheDocument();
  });

  it("calls addLink when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<LinksSection {...defaultProps} />);

    const addButton = screen.getByRole("button", { name: /add link/i });
    await user.click(addButton);

    expect(defaultProps.addLink).toHaveBeenCalledTimes(1);
  });

  it("renders Remove button for each link", () => {
    render(<LinksSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(mockLinks.length);
  });

  it("calls removeLink with correct index when Remove is clicked", async () => {
    const user = userEvent.setup();
    render(<LinksSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(defaultProps.removeLink).toHaveBeenCalledWith(0);
  });

  it("calls setCustomUrl when custom URL is changed", async () => {
    const user = userEvent.setup();
    render(<LinksSection {...defaultProps} />);

    const customUrlInput = screen.getByLabelText(/custom url/i);
    await user.clear(customUrlInput);
    await user.type(customUrlInput, "newname");

    // The function is called for each character typed
    expect(defaultProps.setCustomUrl).toHaveBeenCalled();
    expect(defaultProps.setCustomUrl).toHaveBeenCalledWith(expect.stringContaining("n"));
  });

  it("calls updateLink when link label is changed", async () => {
    const user = userEvent.setup();
    render(<LinksSection {...defaultProps} />);

    const labelInput = screen.getByDisplayValue("LinkedIn");
    await user.clear(labelInput);
    await user.type(labelInput, "Twitter");

    expect(defaultProps.updateLink).toHaveBeenCalled();
    expect(defaultProps.updateLink).toHaveBeenCalledWith(0, "label", expect.stringContaining("T"));
  });

  it("calls updateLink when link URL is changed", async () => {
    const user = userEvent.setup();
    render(<LinksSection {...defaultProps} />);

    const urlInput = screen.getByDisplayValue("https://linkedin.com/in/johndoe");
    await user.clear(urlInput);
    await user.type(urlInput, "https://twitter.com");

    expect(defaultProps.updateLink).toHaveBeenCalled();
    expect(defaultProps.updateLink).toHaveBeenCalledWith(0, "url", expect.stringContaining("http"));
  });

  it("renders empty links section with Add button", () => {
    render(<LinksSection {...defaultProps} links={[]} />);

    expect(screen.getByLabelText(/custom url/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add link/i })).toBeInTheDocument();
    expect(screen.queryByText("Label")).not.toBeInTheDocument();
  });

  it("handles links with null values", () => {
    const linksWithNulls: Link[] = [{ label: null, url: null }];

    render(<LinksSection {...defaultProps} links={linksWithNulls} />);

    const labelInput = screen.getByPlaceholderText("LinkedIn");
    const urlInput = screen.getByPlaceholderText("https://linkedin.com/in/you");

    expect(labelInput).toHaveValue("");
    expect(urlInput).toHaveValue("");
  });

  it("displays correct placeholder text for custom URL", () => {
    render(<LinksSection {...defaultProps} customUrl="" />);

    expect(screen.getByPlaceholderText("yourname")).toBeInTheDocument();
  });

  it("displays correct placeholder text for link label", () => {
    render(<LinksSection {...defaultProps} links={[{ label: "", url: "" }]} />);

    expect(screen.getByPlaceholderText("LinkedIn")).toBeInTheDocument();
  });

  it("displays correct placeholder text for link URL", () => {
    render(<LinksSection {...defaultProps} links={[{ label: "", url: "" }]} />);

    expect(screen.getByPlaceholderText("https://linkedin.com/in/you")).toBeInTheDocument();
  });

  it("renders labels for link fields", () => {
    render(<LinksSection {...defaultProps} />);

    expect(screen.getByText(/custom url/i)).toBeInTheDocument();
    expect(screen.getAllByText("Label")).toHaveLength(mockLinks.length);
    expect(screen.getAllByText("URL")).toHaveLength(mockLinks.length);
  });

  it("calls removeLink with correct index for second item", async () => {
    const user = userEvent.setup();
    render(<LinksSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[1]);

    expect(defaultProps.removeLink).toHaveBeenCalledWith(1);
  });

  it("renders links in bordered containers", () => {
    const { container } = render(<LinksSection {...defaultProps} />);

    const linkContainers = container.querySelectorAll(".border.p-4.rounded-md");
    expect(linkContainers).toHaveLength(mockLinks.length);
  });

  it("renders custom URL input with correct id", () => {
    render(<LinksSection {...defaultProps} />);

    const customUrlInput = screen.getByLabelText(/custom url/i);
    expect(customUrlInput).toHaveAttribute("id", "custom-url");
  });

  it("handles empty custom URL", () => {
    render(<LinksSection {...defaultProps} customUrl="" />);

    const customUrlInput = screen.getByLabelText(/custom url/i);
    expect(customUrlInput).toHaveValue("");
  });

  it("updates multiple links independently", async () => {
    const user = userEvent.setup();
    render(<LinksSection {...defaultProps} />);

    const githubLabel = screen.getByDisplayValue("GitHub");
    await user.clear(githubLabel);
    await user.type(githubLabel, "Portfolio");

    expect(defaultProps.updateLink).toHaveBeenCalled();
    expect(defaultProps.updateLink).toHaveBeenCalledWith(1, "label", expect.stringContaining("P"));
  });
});
