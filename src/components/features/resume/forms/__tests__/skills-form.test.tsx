import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SkillsForm } from "../skills-form";

// Mock the useAutoSave hook
vi.mock("@/hooks/use-auto-save", () => ({
  useAutoSave: vi.fn(() => ({
    save: vi.fn(),
    isSaving: false,
  })),
}));
describe("SkillsForm", () => {
  const defaultProps = {
    resumeId: "resume-123",
  };
  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });
  describe("Rendering", () => {
    it("renders the form card", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(
        screen.getByText(/add your skills by category.*press enter to add a skill/i)
      ).toBeInTheDocument();
    });
    it("renders all skill category fields", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(screen.getByPlaceholderText(/react, typescript, node\.js/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/english \(native\), spanish \(fluent\)/i)
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/git, docker, figma/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/leadership, communication, problem solving/i)
      ).toBeInTheDocument();
    });
    it("shows field descriptions", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(
        screen.getByText(/programming languages, frameworks, and technologies/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/spoken languages and proficiency levels/i)).toBeInTheDocument();
      expect(screen.getByText(/development tools, software, and platforms/i)).toBeInTheDocument();
      expect(screen.getByText(/interpersonal and professional skills/i)).toBeInTheDocument();
    });
    it("shows placeholder text for all fields", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(screen.getByPlaceholderText(/react, typescript, node\.js/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/english \(native\), spanish \(fluent\)/i)
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/git, docker, figma/i)).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/leadership, communication, problem solving/i)
      ).toBeInTheDocument();
    });
  });
  describe("Adding Skills - Technical", () => {
    it("adds a technical skill when Enter is pressed", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(technicalInput).toHaveValue("");
    });
    it("adds multiple technical skills", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "Node.js");
      await user.keyboard("{Enter}");
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
    it("trims whitespace when adding skills", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "  React  ");
      await user.keyboard("{Enter}");
      expect(screen.getByText("React")).toBeInTheDocument();
    });
    it("does not add empty skills", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "   ");
      await user.keyboard("{Enter}");
      // Should not add any badge
      expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
    });
    it("prevents duplicate skills", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      // Should only have one "React" badge
      const reactBadges = screen.getAllByText("React");
      expect(reactBadges).toHaveLength(1);
    });
  });
  describe("Adding Skills - Other Categories", () => {
    it("adds language skills", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const languageInput = screen.getByPlaceholderText(/english \(native\), spanish/i);
      await user.type(languageInput, "English (Native)");
      await user.keyboard("{Enter}");
      expect(screen.getByText("English (Native)")).toBeInTheDocument();
    });
    it("adds tool skills", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const toolsInput = screen.getByPlaceholderText(/git, docker, figma/i);
      await user.type(toolsInput, "Docker");
      await user.keyboard("{Enter}");
      expect(screen.getByText("Docker")).toBeInTheDocument();
    });
    it("adds soft skills", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const softInput = screen.getByPlaceholderText(/leadership, communication/i);
      await user.type(softInput, "Leadership");
      await user.keyboard("{Enter}");
      expect(screen.getByText("Leadership")).toBeInTheDocument();
    });
    it("adds skills to all categories independently", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      // Add technical skill
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      // Add language
      const languageInput = screen.getByPlaceholderText(/english \(native\), spanish/i);
      await user.type(languageInput, "English");
      await user.keyboard("{Enter}");
      // Add tool
      const toolsInput = screen.getByPlaceholderText(/git, docker, figma/i);
      await user.type(toolsInput, "Git");
      await user.keyboard("{Enter}");
      // Add soft skill
      const softInput = screen.getByPlaceholderText(/leadership, communication/i);
      await user.type(softInput, "Teamwork");
      await user.keyboard("{Enter}");
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Git")).toBeInTheDocument();
      expect(screen.getByText("Teamwork")).toBeInTheDocument();
    });
  });
  describe("Removing Skills - Click Remove Button", () => {
    it("removes a skill when X button is clicked", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      expect(screen.getByText("React")).toBeInTheDocument();
      const removeButton = screen.getByRole("button", { name: /remove react/i });
      await user.click(removeButton);
      expect(screen.queryByText("React")).not.toBeInTheDocument();
    });
    it("removes correct skill when multiple exist", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      // Add three skills
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "Node.js");
      await user.keyboard("{Enter}");
      // Remove TypeScript
      const removeTypeScriptButton = screen.getByRole("button", { name: /remove typescript/i });
      await user.click(removeTypeScriptButton);
      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
    it("removes all skills one by one", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      // Add two skills
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Enter}");
      // Remove first skill
      const removeReactButton = screen.getByRole("button", { name: /remove react/i });
      await user.click(removeReactButton);
      expect(screen.queryByText("React")).not.toBeInTheDocument();
      // Remove second skill
      const removeTypeScriptButton = screen.getByRole("button", { name: /remove typescript/i });
      await user.click(removeTypeScriptButton);
      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
    });
  });
  describe("Removing Skills - Backspace", () => {
    it("removes last skill when Backspace is pressed on empty input", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      // Add skills
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Enter}");
      // Press backspace on empty input
      await user.click(technicalInput);
      await user.keyboard("{Backspace}");
      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
    });
    it("does not remove skill when Backspace is pressed with text in input", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      // Add a skill
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      // Type something and press backspace
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Backspace}");
      // React should still be there, and input should have "TypeScrip"
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(technicalInput).toHaveValue("TypeScrip");
    });
    it("removes multiple skills with repeated Backspace", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      // Add three skills
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "Node.js");
      await user.keyboard("{Enter}");
      // Remove all with backspace
      await user.keyboard("{Backspace}");
      expect(screen.queryByText("Node.js")).not.toBeInTheDocument();
      await user.keyboard("{Backspace}");
      expect(screen.queryByText("TypeScript")).not.toBeInTheDocument();
      await user.keyboard("{Backspace}");
      expect(screen.queryByText("React")).not.toBeInTheDocument();
    });
  });
  describe("Default Values", () => {
    it("displays existing technical skills", () => {
      const skills = {
        technical: ["React", "TypeScript", "Node.js"],
        languages: [],
        tools: [],
        soft: [],
      };
      render(<SkillsForm {...defaultProps} skills={skills} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("Node.js")).toBeInTheDocument();
    });
    it("displays existing language skills", () => {
      const skills = {
        technical: [],
        languages: ["English (Native)", "Spanish (Fluent)"],
        tools: [],
        soft: [],
      };
      render(<SkillsForm {...defaultProps} skills={skills} />);
      expect(screen.getByText("English (Native)")).toBeInTheDocument();
      expect(screen.getByText("Spanish (Fluent)")).toBeInTheDocument();
    });
    it("displays existing tool skills", () => {
      const skills = {
        technical: [],
        languages: [],
        tools: ["Git", "Docker", "Figma"],
        soft: [],
      };
      render(<SkillsForm {...defaultProps} skills={skills} />);
      expect(screen.getByText("Git")).toBeInTheDocument();
      expect(screen.getByText("Docker")).toBeInTheDocument();
      expect(screen.getByText("Figma")).toBeInTheDocument();
    });
    it("displays existing soft skills", () => {
      const skills = {
        technical: [],
        languages: [],
        tools: [],
        soft: ["Leadership", "Communication", "Problem Solving"],
      };
      render(<SkillsForm {...defaultProps} skills={skills} />);
      expect(screen.getByText("Leadership")).toBeInTheDocument();
      expect(screen.getByText("Communication")).toBeInTheDocument();
      expect(screen.getByText("Problem Solving")).toBeInTheDocument();
    });
    it("displays skills in all categories", () => {
      const skills = {
        technical: ["React", "TypeScript"],
        languages: ["English"],
        tools: ["Git"],
        soft: ["Leadership"],
      };
      render(<SkillsForm {...defaultProps} skills={skills} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Git")).toBeInTheDocument();
      expect(screen.getByText("Leadership")).toBeInTheDocument();
    });
    it("allows adding more skills to existing categories", async () => {
      const user = userEvent.setup();
      const skills = {
        technical: ["React"],
        languages: [],
        tools: [],
        soft: [],
      };
      render(<SkillsForm {...defaultProps} skills={skills} />);
      expect(screen.getByText("React")).toBeInTheDocument();
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Enter}");
      expect(screen.getByText("React")).toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
    it("allows removing default skills", async () => {
      const user = userEvent.setup();
      const skills = {
        technical: ["React", "TypeScript"],
        languages: [],
        tools: [],
        soft: [],
      };
      render(<SkillsForm {...defaultProps} skills={skills} />);
      const removeReactButton = screen.getByRole("button", { name: /remove react/i });
      await user.click(removeReactButton);
      expect(screen.queryByText("React")).not.toBeInTheDocument();
      expect(screen.getByText("TypeScript")).toBeInTheDocument();
    });
  });
  describe("Badge Display", () => {
    it("displays skills as badges with remove buttons", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      const badge = screen.getByText("React");
      expect(badge).toBeInTheDocument();
      const removeButton = screen.getByRole("button", { name: /remove react/i });
      expect(removeButton).toBeInTheDocument();
    });
    it("displays multiple badges in same category", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "TypeScript");
      await user.keyboard("{Enter}");
      await user.type(technicalInput, "Node.js");
      await user.keyboard("{Enter}");
      expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(3);
    });
  });
  describe("Input Field Behavior", () => {
    it("clears input field after adding skill", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      expect(technicalInput).toHaveValue("React");
      await user.keyboard("{Enter}");
      expect(technicalInput).toHaveValue("");
    });
    it("maintains focus on input after adding skill", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      // Input should still be focused after adding
      expect(technicalInput).toHaveFocus();
    });
    it("allows typing immediately after adding a skill", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "React");
      await user.keyboard("{Enter}");
      // Should be able to type immediately
      await user.type(technicalInput, "TypeScript");
      expect(technicalInput).toHaveValue("TypeScript");
    });
  });
  describe("Edge Cases", () => {
    it("handles Enter key on empty input gracefully", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      // Press Enter without typing anything
      await user.click(technicalInput);
      await user.keyboard("{Enter}");
      // Should not add any badge or throw error
      expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
    });
    it("handles Backspace on empty category gracefully", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      // Press Backspace without any skills
      await user.click(technicalInput);
      await user.keyboard("{Backspace}");
      // Should not throw error or cause issues
      expect(screen.queryByRole("button", { name: /remove/i })).not.toBeInTheDocument();
    });
    it("handles adding skills with special characters", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "C++");
      await user.keyboard("{Enter}");
      expect(screen.getByText("C++")).toBeInTheDocument();
    });
    it("handles adding skills with numbers", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, "Vue 3");
      await user.keyboard("{Enter}");
      expect(screen.getByText("Vue 3")).toBeInTheDocument();
    });
    it("handles long skill names", async () => {
      const user = userEvent.setup();
      render(<SkillsForm {...defaultProps} />);
      const longSkill = "Advanced Machine Learning and Artificial Intelligence";
      const technicalInput = screen.getByPlaceholderText(/react, typescript, node\.js/i);
      await user.type(technicalInput, longSkill);
      await user.keyboard("{Enter}");
      expect(screen.getByText(longSkill)).toBeInTheDocument();
    });
  });
  describe("Form Labels and Descriptions", () => {
    it("shows correct label for technical skills", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(screen.getByText("Technical Skills")).toBeInTheDocument();
      expect(
        screen.getByText(/programming languages, frameworks, and technologies/i)
      ).toBeInTheDocument();
    });
    it("shows correct label for languages", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(screen.getByText("Languages")).toBeInTheDocument();
      expect(screen.getByText(/spoken languages and proficiency levels/i)).toBeInTheDocument();
    });
    it("shows correct label for tools", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(screen.getByText("Tools & Software")).toBeInTheDocument();
      expect(screen.getByText(/development tools, software, and platforms/i)).toBeInTheDocument();
    });
    it("shows correct label for soft skills", () => {
      render(<SkillsForm {...defaultProps} />);
      expect(screen.getByText("Soft Skills")).toBeInTheDocument();
      expect(screen.getByText(/interpersonal and professional skills/i)).toBeInTheDocument();
    });
  });
});
