import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
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

// Mock all form components
vi.mock("../forms/personal-info-form", () => ({
  PersonalInfoForm: vi.fn(({ defaultValues }) => (
    <div data-testid="personal-info-form">
      <div>Name: {defaultValues?.name || "Empty"}</div>
    </div>
  )),
}));

vi.mock("../forms/skills-form", () => ({
  SkillsForm: vi.fn(({ skills }) => (
    <div data-testid="skills-form">
      <div>Technical: {skills?.technical?.join(", ") || "None"}</div>
    </div>
  )),
}));

vi.mock("../forms/experience-list", () => ({
  ExperienceList: vi.fn(({ experiences, onEdit, onDelete, onReorder }) => (
    <div data-testid="experience-list">
      {experiences.length === 0 ? (
        <div>No experiences</div>
      ) : (
        experiences.map((exp: any) => (
          <div key={exp.id} data-testid={`experience-${exp.id}`}>
            <div>{exp.position}</div>
            <button onClick={() => onEdit(exp)}>Edit {exp.id}</button>
            <button onClick={() => onDelete(exp.id)}>Delete {exp.id}</button>
            <button onClick={() => onReorder([exp])}>Reorder</button>
          </div>
        ))
      )}
    </div>
  )),
}));

vi.mock("../forms/education-list", () => ({
  EducationList: vi.fn(({ education, onEdit, onDelete, onReorder }) => (
    <div data-testid="education-list">
      {education.length === 0 ? (
        <div>No education</div>
      ) : (
        education.map((edu: any) => (
          <div key={edu.id} data-testid={`education-${edu.id}`}>
            <div>{edu.degree}</div>
            <button onClick={() => onEdit(edu)}>Edit {edu.id}</button>
            <button onClick={() => onDelete(edu.id)}>Delete {edu.id}</button>
            <button onClick={() => onReorder([edu])}>Reorder</button>
          </div>
        ))
      )}
    </div>
  )),
}));

vi.mock("../forms/certification-list", () => ({
  CertificationList: vi.fn(
    ({ certifications, onEdit, onDelete, onReorder }) => (
      <div data-testid="certification-list">
        {certifications.length === 0 ? (
          <div>No certifications</div>
        ) : (
          certifications.map((cert: any) => (
            <div key={cert.id} data-testid={`certification-${cert.id}`}>
              <div>{cert.name}</div>
              <button onClick={() => onEdit(cert)}>Edit {cert.id}</button>
              <button onClick={() => onDelete(cert.id)}>
                Delete {cert.id}
              </button>
              <button onClick={() => onReorder([cert])}>Reorder</button>
            </div>
          ))
        )}
      </div>
    ),
  ),
}));

vi.mock("../forms/link-list", () => ({
  LinkList: vi.fn(({ links, onEdit, onDelete, onReorder }) => (
    <div data-testid="link-list">
      {links.length === 0 ? (
        <div>No links</div>
      ) : (
        links.map((link: any) => (
          <div key={link.id} data-testid={`link-${link.id}`}>
            <div>{link.label}</div>
            <button onClick={() => onEdit(link)}>Edit {link.id}</button>
            <button onClick={() => onDelete(link.id)}>Delete {link.id}</button>
            <button onClick={() => onReorder([link])}>Reorder</button>
          </div>
        ))
      )}
    </div>
  )),
}));

vi.mock("../forms/experience-form-dialog", () => ({
  ExperienceFormDialog: vi.fn(({ open, onSubmit, defaultValues }) =>
    open ? (
      <div data-testid="experience-form-dialog">
        <h2>Experience Dialog</h2>
        <div>{defaultValues ? "Editing" : "Adding"}</div>
        <button
          onClick={() =>
            onSubmit(
              defaultValues || {
                position: "New Position",
                company: "New Company",
                startDate: "2024-01",
                endDate: "",
                current: true,
                description: "Test",
              },
            )
          }
        >
          Submit Experience
        </button>
      </div>
    ) : null,
  ),
}));

vi.mock("../forms/education-form-dialog", () => ({
  EducationFormDialog: vi.fn(({ open, onSubmit, defaultValues }) =>
    open ? (
      <div data-testid="education-form-dialog">
        <h2>Education Dialog</h2>
        <div>{defaultValues ? "Editing" : "Adding"}</div>
        <button
          onClick={() =>
            onSubmit(
              defaultValues || {
                degree: "Bachelor",
                field: "CS",
                institution: "University",
                startDate: "2020",
                endDate: "2024",
                current: false,
              },
            )
          }
        >
          Submit Education
        </button>
      </div>
    ) : null,
  ),
}));

vi.mock("../forms/certification-form-dialog", () => ({
  CertificationFormDialog: vi.fn(({ open, onSubmit, defaultValues }) =>
    open ? (
      <div data-testid="certification-form-dialog">
        <h2>Certification Dialog</h2>
        <div>{defaultValues ? "Editing" : "Adding"}</div>
        <button
          onClick={() =>
            onSubmit(
              defaultValues || {
                name: "AWS Cert",
                issuer: "Amazon",
                date: "2024",
              },
            )
          }
        >
          Submit Certification
        </button>
      </div>
    ) : null,
  ),
}));

vi.mock("../forms/link-form-dialog", () => ({
  LinkFormDialog: vi.fn(({ open, onSubmit, defaultValues }) =>
    open ? (
      <div data-testid="link-form-dialog">
        <h2>Link Dialog</h2>
        <div>{defaultValues ? "Editing" : "Adding"}</div>
        <button
          onClick={() =>
            onSubmit(
              defaultValues || {
                label: "GitHub",
                url: "https://github.com/test",
              },
            )
          }
        >
          Submit Link
        </button>
      </div>
    ) : null,
  ),
}));

const mockResume: Resume = {
  id: "resume-123",
  userId: "user-1",
  title: "My Resume",
  content: {
    personalInfo: {
      name: "John Doe",
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
    // Mock reset handled by vitest config (clearMocks: true)
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

    it("renders all main sections", () => {
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

      expect(
        screen.getByText(/Basic information about yourself/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Add your professional experience/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Add your educational background/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/List your technical skills/),
      ).toBeInTheDocument();
    });

    it("renders Add buttons for each section", () => {
      render(<ResumeBuilder />);

      expect(
        screen.getByRole("button", { name: /Add Experience/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add Education/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add Certification/ }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /Add Link/ }),
      ).toBeInTheDocument();
    });

    it("renders PersonalInfoForm with default values", () => {
      render(<ResumeBuilder />);

      const form = screen.getByTestId("personal-info-form");
      expect(within(form).getByText(/John Doe/)).toBeInTheDocument();
    });

    it("renders SkillsForm with skills data", () => {
      render(<ResumeBuilder />);

      const form = screen.getByTestId("skills-form");
      expect(
        within(form).getByText(/JavaScript, TypeScript/),
      ).toBeInTheDocument();
    });
  });

  describe("Experience Management", () => {
    it("opens add experience dialog when Add button is clicked", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      const addButton = screen.getByRole("button", { name: /Add Experience/ });
      await user.click(addButton);

      expect(screen.getByTestId("experience-form-dialog")).toBeInTheDocument();
      expect(screen.getByText("Adding")).toBeInTheDocument();
    });

    it("opens edit experience dialog with existing data", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      const editButton = screen.getByRole("button", { name: /Edit exp-1/ });
      await user.click(editButton);

      expect(screen.getByTestId("experience-form-dialog")).toBeInTheDocument();
      expect(screen.getByText("Editing")).toBeInTheDocument();
    });

    it("adds new experience successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Experience/ }));
      await user.click(
        screen.getByRole("button", { name: /Submit Experience/ }),
      );

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Experience added successfully",
        });
      });
    });

    it("updates existing experience successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit exp-1/ }));
      await user.click(
        screen.getByRole("button", { name: /Submit Experience/ }),
      );

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Experience updated successfully",
        });
      });
    });

    it("handles experience save error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Network error"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Experience/ }));
      await user.click(
        screen.getByRole("button", { name: /Submit Experience/ }),
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to save experience: Network error",
          variant: "destructive",
        });
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
          description: "Experience deleted successfully",
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
          description: "Failed to delete experience: Delete failed",
          variant: "destructive",
        });
      });
    });

    it("reorders experiences without showing toast", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      // Get the reorder button from the experience list specifically
      const experienceList = screen.getByTestId("experience-list");
      const reorderButton = within(experienceList).getByRole("button", {
        name: /Reorder/,
      });
      await user.click(reorderButton);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(mockToast).not.toHaveBeenCalled();
      });
    });

    it("handles experience reorder error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Reorder failed"));
      });

      render(<ResumeBuilder />);

      const reorderButtons = screen.getAllByRole("button", { name: /Reorder/ });
      await user.click(reorderButtons[0]);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to reorder experiences: Reorder failed",
          variant: "destructive",
        });
      });
    });
  });

  describe("Education Management", () => {
    it("opens add education dialog", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Education/ }));

      expect(screen.getByTestId("education-form-dialog")).toBeInTheDocument();
      expect(screen.getByText("Adding")).toBeInTheDocument();
    });

    it("opens edit education dialog", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit edu-1/ }));

      expect(screen.getByTestId("education-form-dialog")).toBeInTheDocument();
      expect(screen.getByText("Editing")).toBeInTheDocument();
    });

    it("adds new education successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Education/ }));
      await user.click(
        screen.getByRole("button", { name: /Submit Education/ }),
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Education added successfully",
        });
      });
    });

    it("updates education successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit edu-1/ }));
      await user.click(
        screen.getByRole("button", { name: /Submit Education/ }),
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Education updated successfully",
        });
      });
    });

    it("handles education save error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Save failed"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Education/ }));
      await user.click(
        screen.getByRole("button", { name: /Submit Education/ }),
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to save education: Save failed",
          variant: "destructive",
        });
      });
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
          description: "Education deleted successfully",
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
          description: "Failed to delete education: Delete failed",
          variant: "destructive",
        });
      });
    });

    it("reorders education without toast", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      const reorderButtons = screen.getAllByRole("button", { name: /Reorder/ });
      await user.click(reorderButtons[1]);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(mockToast).not.toHaveBeenCalled();
      });
    });

    it("handles education reorder error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Reorder failed"));
      });

      render(<ResumeBuilder />);

      const reorderButtons = screen.getAllByRole("button", { name: /Reorder/ });
      await user.click(reorderButtons[1]);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to reorder education: Reorder failed",
          variant: "destructive",
        });
      });
    });
  });

  describe("Certification Management", () => {
    it("opens add certification dialog", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      await user.click(
        screen.getByRole("button", { name: /Add Certification/ }),
      );

      expect(
        screen.getByTestId("certification-form-dialog"),
      ).toBeInTheDocument();
    });

    it("opens edit certification dialog", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit cert-1/ }));

      expect(
        screen.getByTestId("certification-form-dialog"),
      ).toBeInTheDocument();
    });

    it("adds new certification successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(
        screen.getByRole("button", { name: /Add Certification/ }),
      );
      await user.click(
        screen.getByRole("button", { name: /Submit Certification/ }),
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Certification added successfully",
        });
      });
    });

    it("updates certification successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit cert-1/ }));
      await user.click(
        screen.getByRole("button", { name: /Submit Certification/ }),
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Certification updated successfully",
        });
      });
    });

    it("handles certification save error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Save failed"));
      });

      render(<ResumeBuilder />);

      await user.click(
        screen.getByRole("button", { name: /Add Certification/ }),
      );
      await user.click(
        screen.getByRole("button", { name: /Submit Certification/ }),
      );

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to save certification: Save failed",
          variant: "destructive",
        });
      });
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
          description: "Certification deleted successfully",
        });
      });
    });

    it("handles certification delete error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Delete failed"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete cert-1/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to delete certification: Delete failed",
          variant: "destructive",
        });
      });
    });

    it("reorders certifications without toast", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      const reorderButtons = screen.getAllByRole("button", { name: /Reorder/ });
      await user.click(reorderButtons[2]);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(mockToast).not.toHaveBeenCalled();
      });
    });

    it("handles certification reorder error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Reorder failed"));
      });

      render(<ResumeBuilder />);

      const reorderButtons = screen.getAllByRole("button", { name: /Reorder/ });
      await user.click(reorderButtons[2]);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to reorder certifications: Reorder failed",
          variant: "destructive",
        });
      });
    });
  });

  describe("Link Management", () => {
    it("opens add link dialog", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Link/ }));

      expect(screen.getByTestId("link-form-dialog")).toBeInTheDocument();
    });

    it("opens edit link dialog", async () => {
      const user = userEvent.setup();
      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit link-1/ }));

      expect(screen.getByTestId("link-form-dialog")).toBeInTheDocument();
    });

    it("adds new link successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Link/ }));
      await user.click(screen.getByRole("button", { name: /Submit Link/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Link added successfully",
        });
      });
    });

    it("updates link successfully", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Edit link-1/ }));
      await user.click(screen.getByRole("button", { name: /Submit Link/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Success",
          description: "Link updated successfully",
        });
      });
    });

    it("handles link save error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Save failed"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Add Link/ }));
      await user.click(screen.getByRole("button", { name: /Submit Link/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to save link: Save failed",
          variant: "destructive",
        });
      });
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
          description: "Link deleted successfully",
        });
      });
    });

    it("handles link delete error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Delete failed"));
      });

      render(<ResumeBuilder />);

      await user.click(screen.getByRole("button", { name: /Delete link-1/ }));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to delete link: Delete failed",
          variant: "destructive",
        });
      });
    });

    it("reorders links without toast", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      render(<ResumeBuilder />);

      const reorderButtons = screen.getAllByRole("button", { name: /Reorder/ });
      await user.click(reorderButtons[3]);

      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalled();
        expect(mockToast).not.toHaveBeenCalled();
      });
    });

    it("handles link reorder error", async () => {
      const user = userEvent.setup();
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Reorder failed"));
      });

      render(<ResumeBuilder />);

      const reorderButtons = screen.getAllByRole("button", { name: /Reorder/ });
      await user.click(reorderButtons[3]);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Error",
          description: "Failed to reorder links: Reorder failed",
          variant: "destructive",
        });
      });
    });
  });

  describe("Empty State Handling", () => {
    it("handles resume with no content gracefully", () => {
      const emptyResume: Resume = {
        ...mockResume,
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
          skills: { technical: [], languages: [], tools: [], soft: [] },
          certifications: [],
          links: [],
        },
      };

      mockUseResume.mockReturnValue({ data: emptyResume });
      render(<ResumeBuilder />);

      expect(screen.getByText("No experiences")).toBeInTheDocument();
      expect(screen.getByText("No education")).toBeInTheDocument();
      expect(screen.getByText("No certifications")).toBeInTheDocument();
      expect(screen.getByText("No links")).toBeInTheDocument();
    });
  });

  describe("Layout and Structure", () => {
    it("renders sections in cards", () => {
      const { container } = render(<ResumeBuilder />);

      const cards = container.querySelectorAll('[class*="card"]');
      expect(cards.length).toBeGreaterThan(0);
    });

    it("uses max-width container", () => {
      const { container } = render(<ResumeBuilder />);

      const mainContainer = container.querySelector(".max-w-4xl");
      expect(mainContainer).toBeInTheDocument();
    });

    it("has spacing between sections", () => {
      const { container } = render(<ResumeBuilder />);

      const spacedContainer = container.querySelector(".space-y-8");
      expect(spacedContainer).toBeInTheDocument();
    });
  });
});
