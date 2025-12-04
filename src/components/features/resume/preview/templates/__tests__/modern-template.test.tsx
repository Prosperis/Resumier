import { render, screen } from "@testing-library/react";
import type { Resume } from "@/lib/api/types";
import { ModernTemplate } from "../modern-template";

const mockResumeMinimal: Resume = {
  id: "1",
  userId: "user1",
  title: "Test Resume",
  content: {
    personalInfo: {
      firstName: "",
      lastName: "",
      nameOrder: "firstLast",
      email: "",
      phone: "",
      phoneFormat: "national",
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
      firstName: "Alex",
      lastName: "Johnson",
      nameOrder: "firstLast",
      email: "alex@example.com",
      phone: "+15559999999",
      phoneFormat: "national",
      location: "Seattle, WA",
      summary: "Full-stack developer passionate about clean code",
    },
    experience: [
      {
        id: "exp1",
        position: "Senior Engineer",
        company: "Tech Giant",
        startDate: "2022-01",
        endDate: "2024-06",
        current: false,
        description: "Led backend development",
        highlights: [
          "Optimized database queries",
          "Reduced API latency by 50%",
        ],
      },
    ],
    education: [
      {
        id: "edu1",
        degree: "Master of Engineering",
        field: "Computer Science",
        institution: "Tech University",
        startDate: "2018",
        endDate: "2020",
        current: false,
        gpa: "4.0",
        honors: ["Outstanding Graduate"],
      },
    ],
    skills: {
      technical: ["Python", "Go", "Rust"],
      languages: ["English", "Japanese"],
      tools: ["Kubernetes", "Terraform"],
      soft: ["Teamwork", "Agile"],
    },
    certifications: [
      {
        id: "cert1",
        name: "Kubernetes Certified",
        issuer: "CNCF",
        date: "2023",
      },
    ],
    links: [
      {
        id: "link1",
        label: "Blog",
        url: "https://alexjohnson.dev",
      },
    ],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("ModernTemplate", () => {
  describe("Header Section", () => {
    it("renders default name when personalInfo names are empty", () => {
      render(<ModernTemplate resume={mockResumeMinimal} />);
      expect(screen.getByText("Your Name")).toBeInTheDocument();
    });

    it("renders personal name when provided", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Alex Johnson")).toBeInTheDocument();
    });

    it("applies colored header background with inline styles", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      const header = container.querySelector(".p-8");
      expect(header).toBeInTheDocument();
      expect(header).toHaveStyle({ backgroundColor: "rgb(139, 92, 246)" });
    });

    it("renders email with Mail icon", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("alex@example.com")).toBeInTheDocument();
    });

    it("renders phone formatted", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      // Phone is formatted as national format
      expect(screen.getByText("(555) 999-9999")).toBeInTheDocument();
    });

    it("renders location with MapPin icon", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Seattle, WA")).toBeInTheDocument();
    });
  });

  describe("Layout Structure", () => {
    it("uses three-column grid layout", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      const grid = container.querySelector(".grid.grid-cols-3");
      expect(grid).toBeInTheDocument();
    });

    it("main content section spans 2 columns", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      const mainContent = container.querySelector(".col-span-2");
      expect(mainContent).toBeInTheDocument();
    });

    it("sidebar content is in the third column", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      // Skills, certifications, and links should be in sidebar
      const sections = container.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe("Professional Summary Section", () => {
    it("renders summary in main content area", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Professional Summary")).toBeInTheDocument();
      expect(
        screen.getByText("Full-stack developer passionate about clean code"),
      ).toBeInTheDocument();
    });

    it("does not render summary when empty", () => {
      render(<ModernTemplate resume={mockResumeMinimal} />);
      expect(
        screen.queryByText("Professional Summary"),
      ).not.toBeInTheDocument();
    });

    it("applies primary color to summary heading with inline styles", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      const summaryHeading = screen.getByText("Professional Summary");
      expect(summaryHeading).toHaveStyle({ color: "rgb(139, 92, 246)" });
    });
  });

  describe("Experience Section", () => {
    it("renders experience section with Briefcase icon", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      const experienceHeading = screen.getByText("Experience");
      expect(experienceHeading).toBeInTheDocument();
    });

    it("does not render experience section when empty", () => {
      render(<ModernTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Experience")).not.toBeInTheDocument();
    });

    it("renders position and company", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
      expect(screen.getByText("Tech Giant")).toBeInTheDocument();
    });

    it("renders date range", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("2022-01 - 2024-06")).toBeInTheDocument();
    });

    it("renders description", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Led backend development")).toBeInTheDocument();
    });

    it("renders highlights as bullet list", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(
        screen.getByText("Optimized database queries"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Reduced API latency by 50%"),
      ).toBeInTheDocument();
    });
  });

  describe("Education Section", () => {
    it("renders education section with GraduationCap icon", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      const educationHeading = screen.getByText("Education");
      expect(educationHeading).toBeInTheDocument();
    });

    it("does not render education section when empty", () => {
      render(<ModernTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Education")).not.toBeInTheDocument();
    });

    it("renders degree, institution, and field", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Master of Engineering")).toBeInTheDocument();
      expect(screen.getByText("Tech University")).toBeInTheDocument();
      expect(screen.getByText("Computer Science")).toBeInTheDocument();
    });

    it("renders GPA when provided", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("GPA: 4.0")).toBeInTheDocument();
    });

    it("renders honors", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Outstanding Graduate")).toBeInTheDocument();
    });
  });

  describe("Skills Section in Sidebar", () => {
    it("renders skills section in sidebar", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Skills")).toBeInTheDocument();
    });

    it("does not render skills section when all categories are empty", () => {
      render(<ModernTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Skills")).not.toBeInTheDocument();
    });

    it("renders technical skills as badges", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Technical")).toBeInTheDocument();
      expect(screen.getByText("Python")).toBeInTheDocument();
      expect(screen.getByText("Go")).toBeInTheDocument();
      expect(screen.getByText("Rust")).toBeInTheDocument();
    });

    it("applies badge styling to skill items with inline styles", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      // Skills use inline styles for background color
      const badges = container.querySelectorAll(".rounded.px-2.py-1.text-xs");
      expect(badges.length).toBeGreaterThan(0);
    });

    it("renders language skills as badges", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Languages")).toBeInTheDocument();
      expect(screen.getByText("English")).toBeInTheDocument();
      expect(screen.getByText("Japanese")).toBeInTheDocument();
    });

    it("renders tools as badges", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Tools")).toBeInTheDocument();
      expect(screen.getByText("Kubernetes")).toBeInTheDocument();
      expect(screen.getByText("Terraform")).toBeInTheDocument();
    });

    it("renders soft skills as badges", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Soft Skills")).toBeInTheDocument();
      expect(screen.getByText("Teamwork")).toBeInTheDocument();
      expect(screen.getByText("Agile")).toBeInTheDocument();
    });
  });

  describe("Certifications Section in Sidebar", () => {
    it("renders certifications section with Award icon", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Certifications")).toBeInTheDocument();
    });

    it("does not render certifications section when empty", () => {
      render(<ModernTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Certifications")).not.toBeInTheDocument();
    });

    it("renders certification name, issuer, and date", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Kubernetes Certified")).toBeInTheDocument();
      expect(screen.getByText("CNCF")).toBeInTheDocument();
      expect(screen.getByText("2023")).toBeInTheDocument();
    });
  });

  describe("Links Section in Sidebar", () => {
    it("renders links section with LinkIcon", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Links")).toBeInTheDocument();
    });

    it("does not render links section when empty", () => {
      render(<ModernTemplate resume={mockResumeMinimal} />);
      expect(screen.queryByText("Links")).not.toBeInTheDocument();
    });

    it("renders link label and URL", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      expect(screen.getByText("Blog")).toBeInTheDocument();
      const link = screen.getByRole("link", { name: /alexjohnson\.dev/ });
      expect(link).toBeInTheDocument();
    });

    it("renders link with correct attributes", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      const link = screen.getByRole("link", { name: /alexjohnson\.dev/ });
      expect(link).toHaveAttribute("href", "https://alexjohnson.dev");
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("applies hover underline to links", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      const link = screen.getByRole("link", { name: /alexjohnson\.dev/ });
      expect(link).toHaveClass("hover:underline");
    });

    it("applies break-all for long URLs", () => {
      render(<ModernTemplate resume={mockResumeFull} />);
      const link = screen.getByRole("link", { name: /alexjohnson\.dev/ });
      expect(link).toHaveClass("break-all");
    });
  });

  describe("Styling and Theming", () => {
    it("applies modern template container styles", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      const mainDiv = container.firstChild;
      expect(mainDiv).toHaveClass(
        "bg-white",
        "shadow-lg",
        "max-w-[21cm]",
        "mx-auto",
      );
    });

    it("uses primary color theme consistently with inline styles", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      // Check that section headings have primary color via inline styles
      const experienceHeading = screen.getByText("Experience");
      expect(experienceHeading).toHaveStyle({ color: "rgb(139, 92, 246)" });
    });

    it("applies border to section headings", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      const headingsWithBorder = container.querySelectorAll(".border-b-2");
      expect(headingsWithBorder.length).toBeGreaterThan(0);
    });
  });

  describe("Conditional Rendering", () => {
    it("renders only populated sections", () => {
      const sparseResume: Resume = {
        ...mockResumeMinimal,
        content: {
          ...mockResumeMinimal.content,
          personalInfo: {
            ...mockResumeMinimal.content.personalInfo,
            firstName: "Minimal",
            lastName: "User",
            email: "minimal@test.com",
          },
          experience: [
            {
              id: "exp1",
              position: "Developer",
              company: "Company",
              startDate: "2020",
              endDate: "2021",
              current: false,
              description: "",
              highlights: [],
            },
          ],
        },
      };
      render(<ModernTemplate resume={sparseResume} />);

      // Should render
      expect(screen.getByText("Minimal User")).toBeInTheDocument();
      expect(screen.getByText("minimal@test.com")).toBeInTheDocument();
      expect(screen.getByText("Experience")).toBeInTheDocument();

      // Should not render
      expect(
        screen.queryByText("Professional Summary"),
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Education")).not.toBeInTheDocument();
      expect(screen.queryByText("Skills")).not.toBeInTheDocument();
      expect(screen.queryByText("Certifications")).not.toBeInTheDocument();
      expect(screen.queryByText("Links")).not.toBeInTheDocument();
    });

    it('renders "Present" for current experience', () => {
      const currentResume: Resume = {
        ...mockResumeMinimal,
        content: {
          ...mockResumeMinimal.content,
          personalInfo: {
            ...mockResumeMinimal.content.personalInfo,
            firstName: "Test",
            lastName: "",
          },
          experience: [
            {
              id: "exp1",
              position: "Current Position",
              company: "Current Company",
              startDate: "2023-01",
              endDate: "",
              current: true,
              description: "",
              highlights: [],
            },
          ],
        },
      };
      render(<ModernTemplate resume={currentResume} />);
      expect(screen.getByText("2023-01 - Present")).toBeInTheDocument();
    });

    it('renders "Present" for current education', () => {
      const currentResume: Resume = {
        ...mockResumeMinimal,
        content: {
          ...mockResumeMinimal.content,
          personalInfo: {
            ...mockResumeMinimal.content.personalInfo,
            firstName: "Test",
            lastName: "",
          },
          education: [
            {
              id: "edu1",
              degree: "PhD",
              field: "CS",
              institution: "University",
              startDate: "2023",
              endDate: "",
              current: true,
              gpa: "",
              honors: [],
            },
          ],
        },
      };
      render(<ModernTemplate resume={currentResume} />);
      expect(screen.getByText("2023 - Present")).toBeInTheDocument();
    });
  });

  describe("Icon Integration", () => {
    it("renders lucide-react icons correctly", () => {
      const { container } = render(<ModernTemplate resume={mockResumeFull} />);
      // Icons are rendered as SVG elements by lucide-react
      const svgs = container.querySelectorAll("svg");
      expect(svgs.length).toBeGreaterThan(0);
    });
  });
});
