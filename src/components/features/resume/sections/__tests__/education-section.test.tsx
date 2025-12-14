import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Education } from "@/stores";
import { EducationSection } from "../education-section";

describe("EducationSection", () => {
  const mockEducation: Education[] = [
    {
      school: "MIT",
      degree: "BS Computer Science",
      startDate: "2018-09-01",
      endDate: "2022-05-31",
      description: "Focused on AI and ML",
    },
    {
      school: "Stanford",
      degree: "MS Computer Science",
      startDate: "2022-09-01",
      endDate: "2024-05-31",
      description: "Research in distributed systems",
    },
  ];

  const defaultProps = {
    education: mockEducation,
    addEducation: vi.fn(),
    updateEducation: vi.fn(),
    removeEducation: vi.fn(),
  };

  it("renders all education entries", () => {
    render(<EducationSection {...defaultProps} />);

    expect(screen.getByDisplayValue("MIT")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Stanford")).toBeInTheDocument();
  });

  it("renders all degree information", () => {
    render(<EducationSection {...defaultProps} />);

    expect(screen.getByDisplayValue("BS Computer Science")).toBeInTheDocument();
    expect(screen.getByDisplayValue("MS Computer Science")).toBeInTheDocument();
  });

  it("renders start and end dates", () => {
    render(<EducationSection {...defaultProps} />);

    expect(screen.getByDisplayValue("2018-09-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2022-05-31")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2022-09-01")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-05-31")).toBeInTheDocument();
  });

  it("renders descriptions", () => {
    render(<EducationSection {...defaultProps} />);

    expect(screen.getByDisplayValue("Focused on AI and ML")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Research in distributed systems")).toBeInTheDocument();
  });

  it("renders Add Education button", () => {
    render(<EducationSection {...defaultProps} />);

    expect(screen.getByRole("button", { name: /add education/i })).toBeInTheDocument();
  });

  it("calls addEducation when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<EducationSection {...defaultProps} />);

    const addButton = screen.getByRole("button", { name: /add education/i });
    await user.click(addButton);

    expect(defaultProps.addEducation).toHaveBeenCalledTimes(1);
  });

  it("renders Remove button for each education entry", () => {
    render(<EducationSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(mockEducation.length);
  });

  it("calls removeEducation with correct index when Remove is clicked", async () => {
    const user = userEvent.setup();
    render(<EducationSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(defaultProps.removeEducation).toHaveBeenCalledWith(0);
  });

  it("calls updateEducation when school name is changed", async () => {
    const user = userEvent.setup();
    render(<EducationSection {...defaultProps} />);

    const schoolInput = screen.getByDisplayValue("MIT");
    await user.clear(schoolInput);
    await user.type(schoolInput, "Harvard");

    // The function is called for each character typed
    expect(defaultProps.updateEducation).toHaveBeenCalled();
    expect(defaultProps.updateEducation).toHaveBeenCalledWith(
      0,
      "school",
      expect.stringContaining("H"),
    );
  });

  it("calls updateEducation when degree is changed", async () => {
    const user = userEvent.setup();
    render(<EducationSection {...defaultProps} />);

    const degreeInput = screen.getByDisplayValue("BS Computer Science");
    await user.clear(degreeInput);
    await user.type(degreeInput, "BA");

    expect(defaultProps.updateEducation).toHaveBeenCalled();
    expect(defaultProps.updateEducation).toHaveBeenCalledWith(
      0,
      "degree",
      expect.stringContaining("B"),
    );
  });

  it("calls updateEducation when description is changed", async () => {
    const user = userEvent.setup();
    render(<EducationSection {...defaultProps} />);

    const descriptionInput = screen.getByDisplayValue("Focused on AI and ML");
    await user.clear(descriptionInput);
    await user.type(descriptionInput, "New description");

    // The function is called for each character typed
    expect(defaultProps.updateEducation).toHaveBeenCalled();
    expect(defaultProps.updateEducation).toHaveBeenCalledWith(
      0,
      "description",
      expect.stringContaining("N"),
    );
  });

  it("renders empty state with only Add button when no education", () => {
    render(<EducationSection {...defaultProps} education={[]} />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add education/i })).toBeInTheDocument();
  });

  it("handles education with null values", () => {
    const educationWithNulls: Education[] = [
      {
        school: null,
        degree: null,
        startDate: null,
        endDate: null,
        description: null,
      },
    ];

    render(<EducationSection {...defaultProps} education={educationWithNulls} />);

    const textInputs = screen.getAllByRole("textbox");
    textInputs.forEach((input) => {
      expect(input).toHaveValue("");
    });
  });

  it("renders labels for all fields", () => {
    render(<EducationSection {...defaultProps} />);

    expect(screen.getAllByText("School")).toHaveLength(mockEducation.length);
    expect(screen.getAllByText("Degree")).toHaveLength(mockEducation.length);
    expect(screen.getAllByText("Start Date")).toHaveLength(mockEducation.length);
    expect(screen.getAllByText("End Date")).toHaveLength(mockEducation.length);
    expect(screen.getAllByText("Description")).toHaveLength(mockEducation.length);
  });

  it("renders date input types for date fields", () => {
    const { container } = render(<EducationSection {...defaultProps} />);

    const dateInputs = container.querySelectorAll('input[type="date"]');
    // Should have 2 education entries * 2 dates each = 4 date inputs
    expect(dateInputs).toHaveLength(4);
  });

  it("calls removeEducation with correct index for second item", async () => {
    const user = userEvent.setup();
    render(<EducationSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[1]);

    expect(defaultProps.removeEducation).toHaveBeenCalledWith(1);
  });

  it("renders education entries in bordered containers", () => {
    const { container } = render(<EducationSection {...defaultProps} />);

    const educationContainers = container.querySelectorAll(".border.p-4.rounded-md");
    expect(educationContainers).toHaveLength(mockEducation.length);
  });

  it("renders textarea for description field", () => {
    render(<EducationSection {...defaultProps} />);

    const descriptions = screen.getAllByDisplayValue(
      /Focused on AI and ML|Research in distributed systems/,
    );
    expect(descriptions).toHaveLength(2);
  });
});
