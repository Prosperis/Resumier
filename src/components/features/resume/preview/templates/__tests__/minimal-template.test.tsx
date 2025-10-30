import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Resume } from "@/lib/api/types";
import { MinimalTemplate } from "../minimal-template";

const mockResumeMinimal: Resume = {
  id: "1",
  userId: "user1",
  title: "Test Resume",
  content: {
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      location: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      languages: [],
      tools: [],
      soft: [],
    },
    certifications: [],
    links: [],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockResumeFull: Resume = {
  id: "1",
  userId: "user1",
  title: "Full Resume",
  content: {
    personalInfo: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "555-5678",
      location: "San Francisco, CA",
      summary: "Creative designer with passion for user experience",
    },
    experience: [
      {
        id: "exp1",
        position: "Lead Designer",
        company: "Design Studio",
        startDate: "2021-03",
        endDate: "2024-01",
        current: false,
        description: "Managed design team",
        highlights: ["Created brand guidelines", "Improved UX metrics by 40%"],
      },
      {
        id: "exp2",
        position: "UX Designer",
        company: "Tech Startup",
        startDate: "2019-06",
        endDate: "",
        current: true,
        description: "",
        highlights: [],
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "Bachelor of Arts",
        field: "Graphic Design",
        institution: "Art Institute",
        startDate: "2015",
        endDate: "2019",
        current: false,
        gpa: "3.9",
        honors: ["Summa Cum Laude", "Best Portfolio Award"],
      },
    ],
    skills: {
      technical: ["Figma", "Adobe XD", "Sketch"],
      languages: ["English", "French", "German"],
      tools: ["Photoshop", "Illustrator"],
      soft: ["Creativity", "Problem Solving"],
    },
    certifications: [
      {
        id: "cert1",
        name: "UX Certification",
        issuer: "Nielsen Norman Group",
        date: "2020",
      },
    ],
    links: [
      {
        id: "link1",
        label: "Portfolio",
        url: "https://janesmith.com",
      },
    ],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("MinimalTemplate", () => {
  describe("Header Section", () => {
    it("renders default name when personalInfo.name is empty", () => {
      render(<MinimalTemplate resume={mockResumeMinimal} />);
      expect(screen.getByText("Your Name")).toBeInTheDocument();
    });

    it("renders personal name when provided", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    it("renders email when provided", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    it("renders phone when provided", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("555-5678")).toBeInTheDocument();
    });

    it("renders location when provided", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("San Francisco, CA")).toBeInTheDocument();
    });

    it("applies minimal design header styles", () => {
      const { container } = render(<MinimalTemplate resume={mockResumeFull} />);
      const heading = screen.getByText("Jane Smith");
      expect(heading).toHaveClass("text-5xl", "font-light", "mb-3", "tracking-tight");
    });
  });

  describe("Summary Section", () => {
    it("renders summary when provided", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(
        screen.getByText("Creative designer with passion for user experience")
      ).toBeInTheDocument();
    });

    it("does not render summary section when empty", () => {
      const { container } = render(<MinimalTemplate resume={mockResumeMinimal} />);
      const summaryText = container.querySelector(".text-sm.leading-relaxed.text-gray-700");
      expect(summaryText).not.toBeInTheDocument();
    });
  });

  describe("Experience Section", () => {
    it("renders experience section heading with minimal style", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      const heading = screen.getByText("Experience");
      expect(heading).toHaveClass(
        "text-xs",
        "font-semibold",
        "uppercase",
        "tracking-wider",
        "text-gray-500"
      );
    });

    it("does not render experience section when empty", () => {
      render(<MinimalTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Experience")).not.toBeInTheDocument();
    });

    it("renders position and company", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Lead Designer")).toBeInTheDocument();
      expect(screen.getByText("Design Studio")).toBeInTheDocument();
    });

    it("renders date range with em dash separator", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2021-03 — 2024-01")).toBeInTheDocument();
    });

    it('renders "Present" for current positions', () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2019-06 — Present")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Managed design team")).toBeInTheDocument();
    });

    it("renders highlights with em dash bullets", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Created brand guidelines")).toBeInTheDocument();
      expect(screen.getByText("Improved UX metrics by 40%")).toBeInTheDocument();
    });

    it("does not render highlights section when empty", () => {
      const { container } = render(<MinimalTemplate resume={mockResumeFull} />);
      // UX Designer has no highlights
      const allHighlights = screen.getAllByText(/Created|Improved/);
      expect(allHighlights.length).toBe(2); // Only from Lead Designer
    });
  });

  describe("Education Section", () => {
    it("renders education section heading", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Education")).toBeInTheDocument();
    });

    it("does not render education section when empty", () => {
      render(<MinimalTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Education")).not.toBeInTheDocument();
    });

    it("renders degree, institution, and field separately", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Bachelor of Arts")).toBeInTheDocument();
      expect(screen.getByText("Art Institute")).toBeInTheDocument();
      expect(screen.getByText("Graphic Design")).toBeInTheDocument();
    });

    it("renders date range with em dash", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2015 — 2019")).toBeInTheDocument();
    });

    it("renders GPA when provided", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("GPA: 3.9")).toBeInTheDocument();
    });

    it("renders honors with em dash bullets", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Summa Cum Laude")).toBeInTheDocument();
      expect(screen.getByText("Best Portfolio Award")).toBeInTheDocument();
    });
  });

  describe("Skills Section", () => {
    it("renders skills section heading", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Skills")).toBeInTheDocument();
    });

    it("does not render skills section when all categories are empty", () => {
      render(<MinimalTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Skills")).not.toBeInTheDocument();
    });

    it("renders technical skills with bullet separators", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Technical")).toBeInTheDocument();
      expect(screen.getByText("Figma • Adobe XD • Sketch")).toBeInTheDocument();
    });

    it("renders language skills with bullet separators", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Languages")).toBeInTheDocument();
      expect(screen.getByText("English • French • German")).toBeInTheDocument();
    });

    it("renders tools with bullet separators", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Tools")).toBeInTheDocument();
      expect(screen.getByText("Photoshop • Illustrator")).toBeInTheDocument();
    });

    it("renders soft skills with bullet separators", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Soft Skills")).toBeInTheDocument();
      expect(screen.getByText("Creativity • Problem Solving")).toBeInTheDocument();
    });

    it("uses grid layout for skills", () => {
      const { container } = render(<MinimalTemplate resume={mockResumeFull} />);
      const skillsGrid = container.querySelector(".grid.grid-cols-2");
      expect(skillsGrid).toBeInTheDocument();
    });
  });

  describe("Certifications Section", () => {
    it("renders certifications section", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Certifications")).toBeInTheDocument();
    });

    it("does not render certifications section when empty", () => {
      render(<MinimalTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Certifications")).not.toBeInTheDocument();
    });

    it("renders certification name, issuer, and date with bullet separator", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("UX Certification")).toBeInTheDocument();
      expect(screen.getByText("Nielsen Norman Group • 2020")).toBeInTheDocument();
    });
  });

  describe("Links Section", () => {
    it("renders links section", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Links")).toBeInTheDocument();
    });

    it("does not render links section when empty", () => {
      render(<MinimalTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Links")).not.toBeInTheDocument();
    });

    it("renders link label with minimum width", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      const label = screen.getByText("Portfolio");
      expect(label).toHaveClass("min-w-[100px]");
    });

    it("renders link with correct href and target", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      const link = screen.getByRole("link", { name: /janesmith\.com/ });
      expect(link).toHaveAttribute("href", "https://janesmith.com");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("applies hover styles to links", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      const link = screen.getByRole("link", { name: /janesmith\.com/ });
      expect(link).toHaveClass("hover:text-gray-900");
    });
  });

  describe("Layout and Styling", () => {
    it("applies minimal template container styles", () => {
      const { container } = render(<MinimalTemplate resume={mockResumeFull} />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        "bg-white",
        "text-gray-900",
        "shadow-lg",
        "max-w-[21cm]",
        "mx-auto",
        "p-16",
        "font-sans"
      );
    });

    it("uses larger spacing between sections", () => {
      const { container } = render(<MinimalTemplate resume={mockResumeFull} />);
      const sections = container.querySelectorAll("section");
      sections.forEach((section) => {
        expect(section).toHaveClass("mb-12");
      });
    });

    it("uses light font weight for name", () => {
      render(<MinimalTemplate resume={mockResumeFull} />);
      const name = screen.getByText("Jane Smith");
      expect(name).toHaveClass("font-light");
    });
  });

  describe("Conditional Rendering", () => {
    it("renders only sections with content", () => {
      const sparseResume: Resume = {
        ...mockResumeMinimal,
        content: {
          ...mockResumeMinimal.content,
          personalInfo: {
            ...mockResumeMinimal.content.personalInfo,
            name: "Test User",
            summary: "A brief summary",
          },
          skills: {
            technical: ["JavaScript"],
            languages: [],
            tools: [],
            soft: [],
          },
        },
      };
      render(<MinimalTemplate resume={sparseResume} />);

      // Should render
      expect(screen.getByText("Test User")).toBeInTheDocument();
      expect(screen.getByText("A brief summary")).toBeInTheDocument();
      expect(screen.getByText("Skills")).toBeInTheDocument();

      // Should not render
      expect(screen.queryByText("Experience")).not.toBeInTheDocument();
      expect(screen.queryByText("Education")).not.toBeInTheDocument();
      expect(screen.queryByText("Certifications")).not.toBeInTheDocument();
      expect(screen.queryByText("Links")).not.toBeInTheDocument();
    });
  });
});
