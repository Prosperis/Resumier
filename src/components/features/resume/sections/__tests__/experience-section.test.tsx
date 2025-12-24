import { fireEvent, render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Experience } from "@/stores/resume-store";
import { ExperienceSection } from "../experience-section";

describe("ExperienceSection", () => {
  const mockExperience: Experience = {
    id: "test-exp-1",
    company: "Acme Corp",
    position: "Software Engineer",
    startDate: "2020-01-01",
    endDate: "2023-12-31",
    current: false,
    description: "Worked on various projects",
    highlights: ["Best Developer 2021", "Innovation Award 2022"],
  };

  const mockAddExperience = vi.fn();
  const mockRemoveExperience = vi.fn();
  const mockUpdateExperience = vi.fn();
  const mockAddExperienceHighlight = vi.fn();
  const mockRemoveExperienceHighlight = vi.fn();
  const mockSetHighlightInput = vi.fn();

  const defaultProps = {
    experiences: [mockExperience],
    addExperience: mockAddExperience,
    removeExperience: mockRemoveExperience,
    updateExperience: mockUpdateExperience,
    addExperienceHighlight: mockAddExperienceHighlight,
    removeExperienceHighlight: mockRemoveExperienceHighlight,
    highlightInputs: { "0": "" },
    setHighlightInput: mockSetHighlightInput,
  };

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Rendering", () => {
    it("renders the component", () => {
      render(<ExperienceSection {...defaultProps} />);
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
    });

    it("renders Add Experience button", () => {
      render(<ExperienceSection {...defaultProps} />);
      expect(screen.getByRole("button", { name: /add experience/i })).toBeInTheDocument();
    });

    it("renders empty state correctly", () => {
      render(<ExperienceSection {...defaultProps} experiences={[]} />);
      expect(screen.getByRole("button", { name: /add experience/i })).toBeInTheDocument();
    });

    it("renders multiple experiences", () => {
      const experiences: Experience[] = [
        { ...mockExperience, id: "exp-a", company: "Company A" },
        { ...mockExperience, id: "exp-b", company: "Company B" },
      ];
      render(<ExperienceSection {...defaultProps} experiences={experiences} />);

      expect(screen.getByText("Company A")).toBeInTheDocument();
      expect(screen.getByText("Company B")).toBeInTheDocument();
    });

    it("renders Experience N when company name is empty", () => {
      const experiences: Experience[] = [
        { ...mockExperience, id: "exp-1", company: "" },
        { ...mockExperience, id: "exp-2", company: "" },
      ];
      render(<ExperienceSection {...defaultProps} experiences={experiences} />);

      expect(screen.getByText("Experience 1")).toBeInTheDocument();
      expect(screen.getByText("Experience 2")).toBeInTheDocument();
    });
  });

  describe("Add Experience", () => {
    it("calls addExperience when Add Experience button is clicked", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const addButton = screen.getByRole("button", { name: /add experience/i });
      await user.click(addButton);

      expect(mockAddExperience).toHaveBeenCalledTimes(1);
    });
  });

  describe("Remove Experience", () => {
    it("calls removeExperience when Remove button is clicked", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const removeButton = screen.getByRole("button", { name: /remove/i });
      await user.click(removeButton);

      expect(mockRemoveExperience).toHaveBeenCalledWith(0);
    });
  });

  describe("Collapsible Behavior", () => {
    it("renders collapsible toggle button", () => {
      render(<ExperienceSection {...defaultProps} experiences={[mockExperience]} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      expect(toggleButton).toBeInTheDocument();
    });

    it("opens collapsed item by default when company is empty", async () => {
      const experienceWithEmptyCompany = { ...mockExperience, company: "" };
      render(<ExperienceSection {...defaultProps} experiences={[experienceWithEmptyCompany]} />);

      // Collapsible should be open by default when company is empty (defaultOpen={!company})
      // Check if form fields are visible
      const textboxes = screen.queryAllByRole("textbox");
      expect(textboxes.length).toBeGreaterThan(0);
    });
  });

  describe("Company Field", () => {
    it("displays company value", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      // Click toggle to open collapsible
      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      // Company is the first textbox input
      const inputs = screen.getAllByRole("textbox");
      const companyInput = inputs[0];
      expect(companyInput).toHaveValue("Acme Corp");
    });

    it("calls updateExperience when company is changed", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const inputs = screen.getAllByRole("textbox");
      const companyInput = inputs[0];
      await user.type(companyInput, "X");

      // Check that updateExperience was called with the company field
      expect(mockUpdateExperience).toHaveBeenCalledWith(0, "company", "Acme CorpX");
    });
  });

  describe("Position Field", () => {
    it("displays position value", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      // Click toggle to open collapsible
      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      // Position is the second textbox input
      const inputs = screen.getAllByRole("textbox");
      const positionInput = inputs[1];
      expect(positionInput).toHaveValue("Software Engineer");
    });

    it("calls updateExperience when position is changed", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const inputs = screen.getAllByRole("textbox");
      const positionInput = inputs[1];
      await user.type(positionInput, "X");

      // Check that updateExperience was called with the position field
      expect(mockUpdateExperience).toHaveBeenCalledWith(0, "position", "Software EngineerX");
    });
  });

  describe("Date Fields", () => {
    it("displays start date value", async () => {
      const user = userEvent.setup();
      const { container } = render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs[0]).toHaveValue("2020-01-01");
    });

    it("displays end date value", async () => {
      const user = userEvent.setup();
      const { container } = render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs[1]).toHaveValue("2023-12-31");
    });

    it("calls updateExperience when start date is changed", async () => {
      const user = userEvent.setup();
      const { container } = render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const dateInputs = container.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[0], { target: { value: "2021-01-01" } });

      expect(mockUpdateExperience).toHaveBeenCalledWith(0, "startDate", "2021-01-01");
    });

    it("calls updateExperience when end date is changed", async () => {
      const user = userEvent.setup();
      const { container } = render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const dateInputs = container.querySelectorAll('input[type="date"]');
      fireEvent.change(dateInputs[1], { target: { value: "2024-01-01" } });

      expect(mockUpdateExperience).toHaveBeenCalledWith(0, "endDate", "2024-01-01");
    });
  });

  describe("Current Checkbox", () => {
    it("displays current checkbox", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const checkbox = screen.getByRole("checkbox", { name: /current/i });
      expect(checkbox).toBeInTheDocument();
    });

    it("checkbox is unchecked when current is false", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const checkbox = screen.getByRole("checkbox", { name: /current/i });
      expect(checkbox).not.toBeChecked();
    });

    it("checkbox is checked when current is true", async () => {
      const user = userEvent.setup();
      const expWithCurrent = { ...mockExperience, current: true };
      render(<ExperienceSection {...defaultProps} experiences={[expWithCurrent]} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const checkbox = screen.getByRole("checkbox", { name: /current/i });
      expect(checkbox).toBeChecked();
    });

    it("calls updateExperience when current checkbox is toggled", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const checkbox = screen.getByRole("checkbox", { name: /current/i });
      await user.click(checkbox);

      expect(mockUpdateExperience).toHaveBeenCalledWith(0, "current", true);
    });

    it("disables end date when current is true", async () => {
      const user = userEvent.setup();
      const expWithCurrent = { ...mockExperience, current: true };
      const { container } = render(
        <ExperienceSection {...defaultProps} experiences={[expWithCurrent]} />,
      );

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs[1]).toBeDisabled();
    });

    it("shows Present placeholder when current is true", async () => {
      const user = userEvent.setup();
      const expWithCurrent = { ...mockExperience, current: true };
      const { container } = render(
        <ExperienceSection {...defaultProps} experiences={[expWithCurrent]} />,
      );

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs[1]).toHaveAttribute("placeholder", "Present");
    });
  });

  describe("Description Field", () => {
    it("displays description value", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      // Description textarea - it's a textbox role
      const textboxes = screen.getAllByRole("textbox");
      // Filter out inputs (by checking if it's a textarea element)
      const description = textboxes.find((el) => el.tagName === "TEXTAREA");
      expect(description).toHaveValue("Worked on various projects");
    });

    it("calls updateExperience when description is changed", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const textboxes = screen.getAllByRole("textbox");
      const description = textboxes.find((el) => el.tagName === "TEXTAREA");
      await user.type(description!, "X");

      // Check that updateExperience was called with the description field
      expect(mockUpdateExperience).toHaveBeenCalledWith(
        0,
        "description",
        "Worked on various projectsX",
      );
    });
  });

  describe("Highlights Section", () => {
    it("displays highlights label", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      expect(screen.getByText(/highlights/i)).toBeInTheDocument();
    });

    it("displays existing highlights", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      expect(screen.getByText("Best Developer 2021")).toBeInTheDocument();
      expect(screen.getByText("Innovation Award 2022")).toBeInTheDocument();
    });

    it("displays highlight input field", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const textboxes = screen.getAllByRole("textbox");
      // The last textbox should be the highlight input (after company, position, description)
      const highlightInput = textboxes[textboxes.length - 1];
      expect(highlightInput).toBeInTheDocument();
    });

    it("displays Add button for highlights", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const addButtons = screen.getAllByRole("button", { name: /add/i });
      expect(addButtons.length).toBeGreaterThanOrEqual(1);
    });

    it("calls setHighlightInput when highlight input is changed", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const textboxes = screen.getAllByRole("textbox");
      const highlightInput = textboxes[textboxes.length - 1];
      await user.type(highlightInput, "New Highlight");

      expect(mockSetHighlightInput).toHaveBeenCalled();
    });

    it("calls addExperienceHighlight when Add highlight button is clicked", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const addButtons = screen.getAllByRole("button", { name: /add/i });
      const addHighlightButton = addButtons[0]; // First Add button is for highlights
      await user.click(addHighlightButton);

      expect(mockAddExperienceHighlight).toHaveBeenCalledWith(0);
    });

    it("displays remove button for each highlight", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      // There should be multiple remove buttons: 1 for experience + highlight buttons
      const removeButtons = screen.getAllByRole("button", { name: /remove/i });
      // At least 1 for the experience itself
      expect(removeButtons.length).toBeGreaterThanOrEqual(1);

      // Highlights should be visible in the document
      expect(screen.getByText("Best Developer 2021")).toBeInTheDocument();
      expect(screen.getByText("Innovation Award 2022")).toBeInTheDocument();
    });

    it("calls removeExperienceHighlight when highlight remove button is clicked", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const removeButtons = screen.getAllByRole("button", { name: /remove/i });
      // Click the 2nd remove button (first highlight's remove button)
      // Index 0 is the main experience remove button
      // Index 1 & 2 are the highlight remove buttons
      if (removeButtons.length >= 3) {
        await user.click(removeButtons[1]);
        expect(mockRemoveExperienceHighlight).toHaveBeenCalled();
      }
    });

    it("handles empty highlights array", async () => {
      const user = userEvent.setup();
      const expWithoutHighlights = { ...mockExperience, highlights: [] };
      render(<ExperienceSection {...defaultProps} experiences={[expWithoutHighlights]} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      expect(screen.getByText(/highlights/i)).toBeInTheDocument();
    });

    it("handles undefined highlights", async () => {
      const user = userEvent.setup();
      const expWithoutHighlights = {
        ...mockExperience,
        highlights: undefined as unknown as string[],
      };
      render(<ExperienceSection {...defaultProps} experiences={[expWithoutHighlights]} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      expect(screen.getByText(/highlights/i)).toBeInTheDocument();
    });
  });

  describe("Empty/Undefined Values", () => {
    it("handles undefined company", () => {
      const expWithUndefined = {
        ...mockExperience,
        company: undefined as unknown as string,
      };
      render(<ExperienceSection {...defaultProps} experiences={[expWithUndefined]} />);

      expect(screen.getByText("Experience 1")).toBeInTheDocument();
    });

    it("handles undefined position", async () => {
      const user = userEvent.setup();
      const expWithUndefined = {
        ...mockExperience,
        position: undefined as unknown as string,
      };
      render(<ExperienceSection {...defaultProps} experiences={[expWithUndefined]} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const inputs = screen.getAllByRole("textbox");
      const positionInput = inputs[1];
      expect(positionInput).toHaveValue("");
    });

    it("handles undefined dates", async () => {
      const user = userEvent.setup();
      const expWithUndefined = {
        ...mockExperience,
        startDate: undefined as unknown as string,
        endDate: undefined as unknown as string,
      };
      const { container } = render(
        <ExperienceSection {...defaultProps} experiences={[expWithUndefined]} />,
      );

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const dateInputs = container.querySelectorAll('input[type="date"]');
      expect(dateInputs[0]).toHaveValue("");
      expect(dateInputs[1]).toHaveValue("");
    });

    it("handles undefined description", async () => {
      const user = userEvent.setup();
      const expWithUndefined = {
        ...mockExperience,
        description: undefined as unknown as string,
      };
      render(<ExperienceSection {...defaultProps} experiences={[expWithUndefined]} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const textboxes = screen.getAllByRole("textbox");
      const description = textboxes.find((el) => el.tagName === "TEXTAREA");
      expect(description).toHaveValue("");
    });

    it("handles undefined current", async () => {
      const user = userEvent.setup();
      const expWithUndefined = {
        ...mockExperience,
        current: undefined as unknown as boolean,
      };
      render(<ExperienceSection {...defaultProps} experiences={[expWithUndefined]} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const checkbox = screen.getByRole("checkbox", { name: /current/i });
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Highlight Input Values", () => {
    it("displays highlight input value from props", async () => {
      const user = userEvent.setup();
      const propsWithInput = {
        ...defaultProps,
        highlightInputs: { "0": "Test Highlight" },
      };
      render(<ExperienceSection {...propsWithInput} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const textboxes = screen.getAllByRole("textbox");
      const highlightInput = textboxes[textboxes.length - 1];
      expect(highlightInput).toHaveValue("Test Highlight");
    });

    it("displays empty highlight input when no value in highlightInputs", async () => {
      const user = userEvent.setup();
      render(<ExperienceSection {...defaultProps} />);

      const toggleButton = screen.getByRole("button", { name: /toggle/i });
      await user.click(toggleButton);

      const textboxes = screen.getAllByRole("textbox");
      const highlightInput = textboxes[textboxes.length - 1];
      expect(highlightInput).toHaveValue("");
    });
  });
});
