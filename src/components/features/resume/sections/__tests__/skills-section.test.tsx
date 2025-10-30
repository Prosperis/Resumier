import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Skill } from "@/stores";
import { SkillsSection } from "../skills-section";

describe("SkillsSection", () => {
  const mockAddSkill = vi.fn();
  const mockUpdateSkill = vi.fn();
  const mockRemoveSkill = vi.fn();

  const mockSkills: Skill[] = [
    {
      name: "JavaScript",
      years: "5",
      proficiency: "expert",
    },
    {
      name: "TypeScript",
      years: "3",
      proficiency: "professional",
    },
  ];

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Rendering", () => {
    it("renders all skills", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      expect(screen.getByDisplayValue("JavaScript")).toBeInTheDocument();
      expect(screen.getByDisplayValue("TypeScript")).toBeInTheDocument();
    });

    it("renders add skill button", () => {
      render(
        <SkillsSection
          skills={[]}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      expect(screen.getByText("Add Skill")).toBeInTheDocument();
    });

    it("renders empty state with only add button", () => {
      render(
        <SkillsSection
          skills={[]}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.queryAllByText("Remove");
      expect(removeButtons).toHaveLength(0);
      expect(screen.getByText("Add Skill")).toBeInTheDocument();
    });

    it("renders correct number of skill cards", () => {
      const { container } = render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const skillCards = container.querySelectorAll(".border.p-4.rounded-md");
      expect(skillCards).toHaveLength(2);
    });
  });

  describe("Skill Name Input", () => {
    it("displays skill names", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      expect(screen.getByDisplayValue("JavaScript")).toBeInTheDocument();
      expect(screen.getByDisplayValue("TypeScript")).toBeInTheDocument();
    });

    it("calls updateSkill when skill name is changed", async () => {
      const user = userEvent.setup();
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const skillInput = screen.getByDisplayValue("JavaScript");
      await user.type(skillInput, "X");

      expect(mockUpdateSkill).toHaveBeenCalled();
      expect(mockUpdateSkill).toHaveBeenCalledWith(0, "name", expect.any(String));
    });

    it("renders skill name placeholder", () => {
      render(
        <SkillsSection
          skills={[{ name: "", years: "", proficiency: "" }]}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      expect(screen.getByPlaceholderText("Skill name")).toBeInTheDocument();
    });
  });

  describe("Years of Experience Input", () => {
    it("displays years of experience", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      expect(screen.getByDisplayValue("5")).toBeInTheDocument();
      expect(screen.getByDisplayValue("3")).toBeInTheDocument();
    });

    it("calls updateSkill when years is changed", async () => {
      const user = userEvent.setup();
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const yearsInput = screen.getByDisplayValue("5");
      await user.type(yearsInput, "7");

      expect(mockUpdateSkill).toHaveBeenCalled();
      expect(mockUpdateSkill).toHaveBeenCalledWith(0, "years", expect.any(String));
    });

    it("renders years input as number type", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const yearsInput = screen.getByDisplayValue("5");
      expect(yearsInput).toHaveAttribute("type", "number");
    });

    it("has min attribute of 0 for years input", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const yearsInput = screen.getByDisplayValue("5");
      expect(yearsInput).toHaveAttribute("min", "0");
    });

    it("renders years placeholder", () => {
      render(
        <SkillsSection
          skills={[{ name: "Test", years: "", proficiency: "" }]}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      expect(screen.getByPlaceholderText("0")).toBeInTheDocument();
    });
  });

  describe("Proficiency Select", () => {
    it("displays proficiency values", () => {
      const { container } = render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const selects = container.querySelectorAll("select");
      expect(selects[0]).toHaveValue("expert");
      expect(selects[1]).toHaveValue("professional");
    });

    it("calls updateSkill when proficiency is changed", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const proficiencySelect = container.querySelectorAll("select")[0];
      await user.selectOptions(proficiencySelect, "intermediate");

      expect(mockUpdateSkill).toHaveBeenCalledWith(0, "proficiency", "intermediate");
    });

    it("has correct proficiency options", () => {
      const { container } = render(
        <SkillsSection
          skills={[{ name: "Test", years: "1", proficiency: "" }]}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const select = container.querySelector("select");
      expect(select).toContainHTML('<option value="">Select</option>');
      expect(select).toContainHTML('<option value="beginner">Beginner</option>');
      expect(select).toContainHTML('<option value="intermediate">Intermediate</option>');
      expect(select).toContainHTML('<option value="professional">Professional</option>');
      expect(select).toContainHTML('<option value="expert">Expert</option>');
    });

    it("includes numeric proficiency options 1-10", () => {
      const { container } = render(
        <SkillsSection
          skills={[{ name: "Test", years: "1", proficiency: "" }]}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const select = container.querySelector("select");
      for (let i = 1; i <= 10; i++) {
        expect(select).toContainHTML(`<option value="${i}">${i}</option>`);
      }
    });
  });

  describe("Add Skill Button", () => {
    it("calls addSkill when add button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const addButton = screen.getByText("Add Skill");
      await user.click(addButton);

      expect(mockAddSkill).toHaveBeenCalledTimes(1);
    });

    it("renders add button with Plus icon", () => {
      const { container } = render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const addButton = screen.getByText("Add Skill");
      const svg = addButton.parentElement?.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("has outline variant for add button", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const addButton = screen.getByText("Add Skill");
      expect(addButton.className).toContain("outline");
    });
  });

  describe("Remove Skill Button", () => {
    it("renders remove button for each skill", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(2);
    });

    it("calls removeSkill with correct index when remove is clicked", async () => {
      const user = userEvent.setup();
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      await user.click(removeButtons[0]);

      expect(mockRemoveSkill).toHaveBeenCalledWith(0);
    });

    it("calls removeSkill with correct index for second skill", async () => {
      const user = userEvent.setup();
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      await user.click(removeButtons[1]);

      expect(mockRemoveSkill).toHaveBeenCalledWith(1);
    });

    it("renders remove button with Trash icon", () => {
      const { container } = render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      const svg = removeButtons[0].parentElement?.querySelector("svg");
      expect(svg).toBeInTheDocument();
    });

    it("has outline variant for remove button", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons[0].className).toContain("outline");
    });

    it("has sm size for remove button", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons[0].className).toContain("sm");
    });
  });

  describe("Labels", () => {
    it("renders Skill label for each skill", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const skillLabels = screen.getAllByText("Skill");
      expect(skillLabels).toHaveLength(2);
    });

    it("renders Years of Experience label for each skill", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const yearsLabels = screen.getAllByText("Years of Experience");
      expect(yearsLabels).toHaveLength(2);
    });

    it("renders Proficiency label for each skill", () => {
      render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const proficiencyLabels = screen.getAllByText("Proficiency");
      expect(proficiencyLabels).toHaveLength(2);
    });
  });

  describe("Edge Cases", () => {
    it("handles empty skill values", () => {
      const emptySkill: Skill[] = [
        {
          name: "",
          years: "",
          proficiency: "",
        },
      ];

      const { container } = render(
        <SkillsSection
          skills={emptySkill}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const nameInput = screen.getByPlaceholderText("Skill name");
      const yearsInput = screen.getByPlaceholderText("0");
      const proficiencySelect = container.querySelector("select");

      expect(nameInput).toHaveValue("");
      expect(yearsInput).toHaveValue(null);
      expect(proficiencySelect).toHaveValue("");
    });

    it("handles null skill values", () => {
      const nullSkill: Skill[] = [
        {
          name: null as any,
          years: null as any,
          proficiency: null as any,
        },
      ];

      const { container } = render(
        <SkillsSection
          skills={nullSkill}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const nameInput = screen.getByPlaceholderText("Skill name");
      const yearsInput = screen.getByPlaceholderText("0");
      const proficiencySelect = container.querySelector("select");

      expect(nameInput).toHaveValue("");
      expect(yearsInput).toHaveValue(null);
      expect(proficiencySelect).toHaveValue("");
    });

    it("handles large number of skills", () => {
      const manySkills: Skill[] = Array.from({ length: 20 }, (_, i) => ({
        name: `Skill ${i + 1}`,
        years: `${i + 1}`,
        proficiency: "intermediate",
      }));

      render(
        <SkillsSection
          skills={manySkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const removeButtons = screen.getAllByText("Remove");
      expect(removeButtons).toHaveLength(20);
    });

    it("handles very long skill names", () => {
      const longNameSkill: Skill[] = [
        {
          name: "A".repeat(200),
          years: "5",
          proficiency: "expert",
        },
      ];

      render(
        <SkillsSection
          skills={longNameSkill}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      expect(screen.getByDisplayValue("A".repeat(200))).toBeInTheDocument();
    });

    it("handles numeric proficiency values", () => {
      const numericProficiencySkill: Skill[] = [
        {
          name: "JavaScript",
          years: "5",
          proficiency: "7",
        },
      ];

      const { container } = render(
        <SkillsSection
          skills={numericProficiencySkill}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const proficiencySelect = container.querySelector("select");
      expect(proficiencySelect).toHaveValue("7");
    });
  });

  describe("Multiple Skills", () => {
    it("maintains separate state for each skill", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const nameInputs = container.querySelectorAll('input[placeholder="Skill name"]');
      await user.type(nameInputs[0], "X");

      expect(mockUpdateSkill).toHaveBeenCalledWith(0, "name", expect.any(String));
      expect(mockUpdateSkill).not.toHaveBeenCalledWith(1, "name", expect.any(String));
    });

    it("can update different fields of different skills", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <SkillsSection
          skills={mockSkills}
          addSkill={mockAddSkill}
          updateSkill={mockUpdateSkill}
          removeSkill={mockRemoveSkill}
        />
      );

      const nameInputs = container.querySelectorAll('input[placeholder="Skill name"]');
      const yearsInputs = container.querySelectorAll('input[type="number"]');

      await user.type(nameInputs[0], "X");
      await user.type(yearsInputs[1], "9");

      expect(mockUpdateSkill).toHaveBeenCalledWith(0, "name", expect.any(String));
      expect(mockUpdateSkill).toHaveBeenCalledWith(1, "years", expect.any(String));
    });
  });
});
