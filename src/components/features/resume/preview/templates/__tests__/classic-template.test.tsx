import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { Resume } from "@/lib/api/types";
import { ClassicTemplate } from "../classic-template";

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
      name: "John Doe",
      email: "john@example.com",
      phone: "555-1234",
      location: "New York, NY",
      summary: "Experienced software engineer with 10+ years",
    },
    experience: [
      {
        id: "exp1",
        position: "Senior Developer",
        company: "Tech Corp",
        startDate: "2020-01",
        endDate: "2023-12",
        current: false,
        description: "Led development team",
        highlights: ["Built scalable systems", "Mentored junior developers"],
      },
      {
        id: "exp2",
        position: "Developer",
        company: "StartUp Inc",
        startDate: "2018-01",
        endDate: "",
        current: true,
        description: "Full stack development",
        highlights: [],
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "Bachelor of Science",
        field: "Computer Science",
        institution: "State University",
        startDate: "2014",
        endDate: "2018",
        current: false,
        gpa: "3.8",
        honors: ["Dean's List", "Cum Laude"],
      },
      {
        id: "edu2",
        degree: "Master of Science",
        field: "Software Engineering",
        institution: "Tech University",
        startDate: "2019",
        endDate: "",
        current: true,
        gpa: "",
        honors: [],
      },
    ],
    skills: {
      technical: ["JavaScript", "TypeScript", "React"],
      languages: ["English", "Spanish"],
      tools: ["Git", "Docker"],
      soft: ["Leadership", "Communication"],
    },
    certifications: [
      {
        id: "cert1",
        name: "AWS Certified",
        issuer: "Amazon",
        date: "2022",
      },
      {
        id: "cert2",
        name: "React Certified",
        issuer: "Meta",
        date: "2023",
      },
    ],
    links: [
      {
        id: "link1",
        label: "GitHub",
        url: "https://github.com/johndoe",
      },
      {
        id: "link2",
        label: "LinkedIn",
        url: "https://linkedin.com/in/johndoe",
      },
    ],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("ClassicTemplate", () => {
  describe("Header Section", () => {
    it("renders default name when personalInfo.name is empty", () => {
      render(<ClassicTemplate resume={mockResumeMinimal} />);
      expect(screen.getByText("Your Name")).toBeInTheDocument();
    });

    it("renders personal name when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("renders email when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    it("renders phone when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("555-1234")).toBeInTheDocument();
    });

    it("renders location when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("New York, NY")).toBeInTheDocument();
    });

    it("renders bullet separators between contact items", () => {
      const { container } = render(<ClassicTemplate resume={mockResumeFull} />);
      const bullets = container.querySelectorAll("span");
      const bulletTexts = Array.from(bullets)
        .map((span) => span.textContent)
        .filter((text) => text === "•");
      expect(bulletTexts.length).toBeGreaterThan(0);
    });

    it("applies header styling classes", () => {
      const { container } = render(<ClassicTemplate resume={mockResumeFull} />);
      const header = container.querySelector("header");
      expect(header).toHaveClass("text-center", "mb-8", "pb-4", "border-b-2", "border-black");
    });
  });

  describe("Professional Summary Section", () => {
    it("renders summary when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Professional Summary")).toBeInTheDocument();
      expect(screen.getByText("Experienced software engineer with 10+ years")).toBeInTheDocument();
    });

    it("does not render summary section when empty", () => {
      render(<ClassicTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Professional Summary")).not.toBeInTheDocument();
    });
  });

  describe("Professional Experience Section", () => {
    it("renders experience section when experiences exist", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Professional Experience")).toBeInTheDocument();
    });

    it("does not render experience section when empty", () => {
      render(<ClassicTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Professional Experience")).not.toBeInTheDocument();
    });

    it("renders position and company for each experience", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Senior Developer")).toBeInTheDocument();
      expect(screen.getByText("Tech Corp")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("StartUp Inc")).toBeInTheDocument();
    });

    it("renders date range with end date", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2020-01 - 2023-12")).toBeInTheDocument();
    });

    it('renders "Present" for current positions', () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2018-01 - Present")).toBeInTheDocument();
    });

    it("renders description when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Led development team")).toBeInTheDocument();
      expect(screen.getByText("Full stack development")).toBeInTheDocument();
    });

    it("renders highlights as bullet list", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Built scalable systems")).toBeInTheDocument();
      expect(screen.getByText("Mentored junior developers")).toBeInTheDocument();
    });

    it("does not render highlights when empty", () => {
      const resumeNoHighlights: Resume = {
        ...mockResumeMinimal,
        content: {
          ...mockResumeMinimal.content,
          experience: [
            {
              id: "exp1",
              position: "Developer",
              company: "Company",
              startDate: "2020",
              endDate: "2021",
              current: false,
              description: "Work",
              highlights: [],
            },
          ],
        },
      };
      const { container } = render(<ClassicTemplate resume={resumeNoHighlights} />);
      const lists = container.querySelectorAll("ul");
      expect(lists.length).toBe(0);
    });
  });

  describe("Education Section", () => {
    it("renders education section when education exists", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Education")).toBeInTheDocument();
    });

    it("does not render education section when empty", () => {
      render(<ClassicTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Education")).not.toBeInTheDocument();
    });

    it("renders degree, field, and institution", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Bachelor of Science in Computer Science")).toBeInTheDocument();
      expect(screen.getByText("State University")).toBeInTheDocument();
    });

    it("renders date range with end date", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2014 - 2018")).toBeInTheDocument();
    });

    it('renders "Present" for current education', () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2019 - Present")).toBeInTheDocument();
    });

    it("renders GPA when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("GPA: 3.8")).toBeInTheDocument();
    });

    it("does not render GPA when empty", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      const gpaElements = screen.getAllByText(/GPA:/);
      expect(gpaElements).toHaveLength(1); // Only one GPA shown (first edu has GPA, second doesn't)
    });

    it("renders honors when provided", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Dean's List")).toBeInTheDocument();
      expect(screen.getByText("Cum Laude")).toBeInTheDocument();
    });
  });

  describe("Skills Section", () => {
    it("renders skills section when skills exist", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Skills")).toBeInTheDocument();
    });

    it("does not render skills section when all skills are empty", () => {
      render(<ClassicTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Skills")).not.toBeInTheDocument();
    });

    it("renders technical skills", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Technical:")).toBeInTheDocument();
      expect(screen.getByText("JavaScript, TypeScript, React")).toBeInTheDocument();
    });

    it("renders language skills", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Languages:")).toBeInTheDocument();
      expect(screen.getByText("English, Spanish")).toBeInTheDocument();
    });

    it("renders tools", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Tools:")).toBeInTheDocument();
      expect(screen.getByText("Git, Docker")).toBeInTheDocument();
    });

    it("renders soft skills", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Soft Skills:")).toBeInTheDocument();
      expect(screen.getByText("Leadership, Communication")).toBeInTheDocument();
    });

    it("renders only provided skill categories", () => {
      const resumePartialSkills: Resume = {
        ...mockResumeMinimal,
        content: {
          ...mockResumeMinimal.content,
          skills: {
            technical: ["JavaScript"],
            languages: [],
            tools: [],
            soft: [],
          },
        },
      };
      render(<ClassicTemplate resume={resumePartialSkills} />);
      expect(screen.getByText("Technical:")).toBeInTheDocument();
      expect(screen.queryByText("Languages:")).not.toBeInTheDocument();
      expect(screen.queryByText("Tools:")).not.toBeInTheDocument();
      expect(screen.queryByText("Soft Skills:")).not.toBeInTheDocument();
    });
  });

  describe("Certifications Section", () => {
    it("renders certifications section when certifications exist", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Certifications")).toBeInTheDocument();
    });

    it("does not render certifications section when empty", () => {
      render(<ClassicTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Certifications")).not.toBeInTheDocument();
    });

    it("renders certification name, issuer, and date", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText(/AWS Certified/)).toBeInTheDocument();
      expect(screen.getByText(/Amazon/)).toBeInTheDocument();
      expect(screen.getByText(/2022/)).toBeInTheDocument();
    });

    it("renders multiple certifications", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText(/React Certified/)).toBeInTheDocument();
      expect(screen.getByText(/Meta/)).toBeInTheDocument();
    });
  });

  describe("Professional Links Section", () => {
    it("renders links section when links exist", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Professional Links")).toBeInTheDocument();
    });

    it("does not render links section when empty", () => {
      render(<ClassicTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Professional Links")).not.toBeInTheDocument();
    });

    it("renders link labels and URLs", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      expect(screen.getByText("GitHub:")).toBeInTheDocument();
      expect(screen.getByText("LinkedIn:")).toBeInTheDocument();
    });

    it("renders links with correct href attributes", () => {
      render(<ClassicTemplate resume={mockResumeFull} />);
      const githubLink = screen.getByRole("link", { name: /github\.com/ });
      expect(githubLink).toHaveAttribute("href", "https://github.com/johndoe");
      expect(githubLink).toHaveAttribute("target", "_blank");
      expect(githubLink).toHaveAttribute("rel", "noopener noreferrer");
    });
  });

  describe("Layout and Styling", () => {
    it("applies classic template container styles", () => {
      const { container } = render(<ClassicTemplate resume={mockResumeFull} />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        "bg-white",
        "text-black",
        "shadow-lg",
        "max-w-[21cm]",
        "mx-auto",
        "p-12",
        "font-serif"
      );
    });

    it("applies uppercase and border styles to section headings", () => {
      const { container } = render(<ClassicTemplate resume={mockResumeFull} />);
      const headings = container.querySelectorAll("h2");
      headings.forEach((heading) => {
        expect(heading).toHaveClass("uppercase", "border-b", "border-black");
      });
    });
  });
});
