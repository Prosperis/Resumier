import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Resume } from "@/lib/api/types";
import { ResumeBuilder } from "../resume-builder";

// Mock dependencies
vi.mock("@tanstack/react-router", () => ({
  useParams: vi.fn(() => ({ id: "resume-123" })),
}));

vi.mock("@/hooks/api", () => ({
  useResume: vi.fn(),
  useUpdateResume: vi.fn(),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock("@/stores/auth-store", () => ({
  useAuthStore: vi.fn(() => false),
  selectIsDemo: vi.fn(),
}));

// Track which section is open for tests
let currentOpenSection = "personal";

vi.mock("@/stores/ui-store", () => ({
  useUIStore: vi.fn((selector) => {
    if (typeof selector === "function" && selector.name?.includes("toggle")) {
      return (sectionId: string) => {
        currentOpenSection = sectionId;
      };
    }
    return currentOpenSection;
  }),
  selectResumeBuilderSection: vi.fn(),
  selectToggleResumeBuilderSection: vi.fn(),
}));

// Mock lazy-loaded components via the lazy module
vi.mock("../lazy", () => ({
  FormSkeleton: () => <div>Loading form...</div>,
  ListSkeleton: () => <div>Loading list...</div>,
  LazyPersonalInfoForm: vi.fn(({ defaultValues }) => (
    <div data-testid="personal-info-form">
      <div>Name: {defaultValues?.firstName || "Empty"}</div>
    </div>
  )),
  LazySkillsForm: vi.fn(({ skills }) => (
    <div data-testid="skills-form">
      <div>Technical: {skills?.technical?.join(", ") || "None"}</div>
    </div>
  )),
  LazyExperienceList: vi.fn(
    ({ experiences, editingId, isAddingNew, onEdit, onClose, onDelete, onReorder }) => (
      <div data-testid="experience-list">
        {isAddingNew && <div data-testid="adding-experience">Adding new experience</div>}
        {editingId && <div data-testid="editing-experience">Editing {editingId}</div>}
        {experiences.length === 0 && !isAddingNew ? (
          <div>No experiences added yet</div>
        ) : (
          experiences.map((exp: any) => (
            <div key={exp.id} data-testid={`experience-${exp.id}`}>
              <div>{exp.position}</div>
              <button onClick={() => onEdit(exp.id)}>Edit {exp.id}</button>
              <button onClick={() => onDelete(exp.id)}>Delete {exp.id}</button>
              <button onClick={() => onReorder([exp])}>Reorder exp</button>
            </div>
          ))
        )}
        {(isAddingNew || editingId) && <button onClick={onClose}>Close</button>}
      </div>
    ),
  ),
  LazyEducationList: vi.fn(
    ({ education, editingId, isAddingNew, onEdit, onClose, onDelete, onReorder }) => (
      <div data-testid="education-list">
        {isAddingNew && <div data-testid="adding-education">Adding new education</div>}
        {editingId && <div data-testid="editing-education">Editing {editingId}</div>}
        {education.length === 0 && !isAddingNew ? (
          <div>No education added yet</div>
        ) : (
          education.map((edu: any) => (
            <div key={edu.id} data-testid={`education-${edu.id}`}>
              <div>{edu.degree}</div>
              <button onClick={() => onEdit(edu.id)}>Edit {edu.id}</button>
              <button onClick={() => onDelete(edu.id)}>Delete {edu.id}</button>
              <button onClick={() => onReorder([edu])}>Reorder edu</button>
            </div>
          ))
        )}
        {(isAddingNew || editingId) && <button onClick={onClose}>Close</button>}
      </div>
    ),
  ),
  LazyCertificationList: vi.fn(
    ({ certifications, editingId, isAddingNew, onEdit, onClose, onDelete, onReorder }) => (
      <div data-testid="certification-list">
        {isAddingNew && <div data-testid="adding-certification">Adding new certification</div>}
        {editingId && <div data-testid="editing-certification">Editing {editingId}</div>}
        {certifications.length === 0 && !isAddingNew ? (
          <div>No certifications added yet</div>
        ) : (
          certifications.map((cert: any) => (
            <div key={cert.id} data-testid={`certification-${cert.id}`}>
              <div>{cert.name}</div>
              <button onClick={() => onEdit(cert.id)}>Edit {cert.id}</button>
              <button onClick={() => onDelete(cert.id)}>Delete {cert.id}</button>
              <button onClick={() => onReorder([cert])}>Reorder cert</button>
            </div>
          ))
        )}
        {(isAddingNew || editingId) && <button onClick={onClose}>Close</button>}
      </div>
    ),
  ),
  LazyLinkList: vi.fn(({ links, editingId, isAddingNew, onEdit, onClose, onDelete, onReorder }) => (
    <div data-testid="link-list">
      {isAddingNew && <div data-testid="adding-link">Adding new link</div>}
      {editingId && <div data-testid="editing-link">Editing {editingId}</div>}
      {links.length === 0 && !isAddingNew ? (
        <div>No links added yet</div>
      ) : (
        links.map((link: any) => (
          <div key={link.id} data-testid={`link-${link.id}`}>
            <div>{link.label}</div>
            <button onClick={() => onEdit(link.id)}>Edit {link.id}</button>
            <button onClick={() => onDelete(link.id)}>Delete {link.id}</button>
            <button onClick={() => onReorder([link])}>Reorder link</button>
          </div>
        ))
      )}
      {(isAddingNew || editingId) && <button onClick={onClose}>Close</button>}
    </div>
  )),
}));

// Mock import dialog
vi.mock("../import/import-dialog", () => ({
  ImportDialog: vi.fn(({ trigger }) => <div data-testid="import-dialog">{trigger}</div>),
}));

const mockResume: Resume = {
  id: "resume-123",
  userId: "user-1",
  title: "My Resume",
  content: {
    personalInfo: {
      firstName: "John",
      lastName: "Doe",
      nameOrder: "firstLast",
      email: "john@example.com",
      phone: "555-1234",
      location: "New York",
      summary: "Software Engineer",
    },
    experience: [
      {
        id: "exp-1",
        position: "Senior Developer",
        company: "Tech Corp",
        startDate: "2020-01",
        endDate: "2023-12",
        current: false,
        description: "Led team",
        highlights: ["Built systems"],
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "BS",
        field: "Computer Science",
        institution: "University",
        startDate: "2016",
        endDate: "2020",
        current: false,
        gpa: "3.8",
        honors: ["Dean's List"],
      },
    ],
    skills: {
      technical: ["JavaScript", "TypeScript"],
      languages: ["English"],
      tools: ["Git"],
      soft: ["Leadership"],
    },
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified",
        issuer: "Amazon",
        date: "2023",
      },
    ],
    links: [
      {
        id: "link-1",
        label: "GitHub",
        url: "https://github.com/johndoe",
        type: "github",
      },
    ],
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe("ResumeBuilder", () => {
  let mockUseResume: ReturnType<typeof vi.fn>;
  let mockMutate: ReturnType<typeof vi.fn>;
  let mockToast: ReturnType<typeof vi.fn>;
  let mockUseUpdateResume: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    // Reset open section
    currentOpenSection = "personal";

    mockUseResume = vi.fn().mockReturnValue({ data: mockResume });
    mockMutate = vi.fn();
    mockToast = vi.fn();
    mockUseUpdateResume = vi.fn().mockReturnValue({ mutate: mockMutate });

    const apiModule = await import("@/hooks/api");
    const toastModule = await import("@/hooks/use-toast");

    (apiModule.useResume as any).mockImplementation(mockUseResume);
    (apiModule.useUpdateResume as any).mockImplementation(mockUseUpdateResume);
    (toastModule.useToast as any).mockReturnValue({ toast: mockToast });
  });

  describe("Rendering", () => {
    it("renders null when resume data is not loaded", () => {
      mockUseResume.mockReturnValue({ data: null });
      const { container } = render(<ResumeBuilder />);
      expect(container.firstChild).toBeNull();
    });

    it("renders all section headers", () => {
      render(<ResumeBuilder />);

      expect(screen.getByText("Personal Information")).toBeInTheDocument();
      expect(screen.getByText("Work Experience")).toBeInTheDocument();
      expect(screen.getByText("Education")).toBeInTheDocument();
      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(screen.getByText("Certifications")).toBeInTheDocument();
      expect(screen.getByText("Links")).toBeInTheDocument();
    });

    it("renders section descriptions", () => {
      render(<ResumeBuilder />);

      expect(screen.getByText(/Basic contact info and summary/)).toBeInTheDocument();
      expect(screen.getByText(/Professional experience and accomplishments/)).toBeInTheDocument();
      expect(screen.getByText(/Educational background and achievements/)).toBeInTheDocument();
    });

    it("renders import section when not in demo mode", () => {
      render(<ResumeBuilder />);

      expect(screen.getByText("Quick Start")).toBeInTheDocument();
      expect(screen.getByText(/Import from LinkedIn/)).toBeInTheDocument();
    });

    it("renders collapsible sections", () => {
      const { container } = render(<ResumeBuilder />);

      const collapsibles = container.querySelectorAll('[data-slot="collapsible"]');
      expect(collapsibles.length).toBeGreaterThanOrEqual(6); // 6 sections
    });
  });

  describe("Experience Section", () => {
    beforeEach(() => {
      currentOpenSection = "experience";
    });

    it("renders experience list", () => {
      render(<ResumeBuilder />);
      expect(screen.getByTestId("experience-list")).toBeInTheDocument();
    });

    it("shows editing state when Edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit exp-1/ }));

      await waitFor(() => {
        expect(screen.getByTestId("editing-experience")).toBeInTheDocument();
      });
    });

    it("deletes experience successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete exp-1/ }));

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Experience deleted",
        });
      });
    });

    it("handles experience delete error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Delete failed"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete exp-1/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to delete: Delete failed",
          variant: "destructive",
        });
      });
    });

    it("handles experience reorder error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Reorder failed"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Reorder exp/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to reorder: Reorder failed",
          variant: "destructive",
        });
      });
    });
  });

  describe("Education Section", () => {
    beforeEach(() => {
      currentOpenSection = "education";
    });

    it("renders education list", () => {
      render(<ResumeBuilder />);
      expect(screen.getByTestId("education-list")).toBeInTheDocument();
    });

    it("deletes education successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete edu-1/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Education deleted",
        });
      });
    });

    it("handles education delete error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Delete failed"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete edu-1/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to delete: Delete failed",
          variant: "destructive",
        });
      });
    });
  });

  describe("Certifications Section", () => {
    beforeEach(() => {
      currentOpenSection = "certifications";
    });

    it("renders certification list", () => {
      render(<ResumeBuilder />);
      expect(screen.getByTestId("certification-list")).toBeInTheDocument();
    });

    it("deletes certification successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete cert-1/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Certification deleted",
        });
      });
    });
  });

  describe("Links Section", () => {
    beforeEach(() => {
      currentOpenSection = "links";
    });

    it("renders link list", () => {
      render(<ResumeBuilder />);
      expect(screen.getByTestId("link-list")).toBeInTheDocument();
    });

    it("deletes link successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete link-1/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Link deleted",
        });
      });
    });
  });

  describe("Skills Section", () => {
    beforeEach(() => {
      currentOpenSection = "skills";
    });

    it("renders skills form", () => {
      render(<ResumeBuilder />);
      expect(screen.getByTestId("skills-form")).toBeInTheDocument();
    });

    it("displays skills data", () => {
      render(<ResumeBuilder />);
      expect(screen.getByText(/JavaScript, TypeScript/)).toBeInTheDocument();
    });
  });

  describe("Personal Info Section", () => {
    beforeEach(() => {
      currentOpenSection = "personal";
    });

    it("renders personal info form", () => {
      render(<ResumeBuilder />);
      expect(screen.getByTestId("personal-info-form")).toBeInTheDocument();
    });

    it("displays personal info data", () => {
      render(<ResumeBuilder />);
      expect(screen.getByText(/John/)).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    it("uses full width container", () => {
      const { container } = render(<ResumeBuilder />);
      const mainContainer = container.querySelector(".w-full");
      expect(mainContainer).toBeInTheDocument();
    });

    it("has borders between sections", () => {
      const { container } = render(<ResumeBuilder />);
      const borderedSections = container.querySelectorAll(".border-b");
      expect(borderedSections.length).toBeGreaterThan(0);
    });
  });
});
