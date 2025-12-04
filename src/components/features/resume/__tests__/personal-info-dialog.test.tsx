import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useResumeStore } from "@/stores";
import { PersonalInfoDialog } from "../personal-info-dialog";

// Create query client for tests
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
});

// Wrapper component
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Mock the store
vi.mock("@/stores", () => ({
  useResumeStore: vi.fn(),
}));

// Track current section for mock - using object to allow reference updates
const mockState = {
  currentSection: "basic" as string,
};
const mockSetPersonalInfoSection = vi.fn((section: string) => {
  mockState.currentSection = section;
});

// Mock the UI store - use getter to get dynamic value
vi.mock("@/stores/ui-store", () => ({
  useUIStore: vi.fn((selector: any) => {
    const state = {
      get personalInfoSection() {
        return mockState.currentSection;
      },
      setPersonalInfoSection: mockSetPersonalInfoSection,
    };
    return selector(state);
  }),
  selectPersonalInfoSection: (state: any) => state.personalInfoSection,
  selectSetPersonalInfoSection: (state: any) => state.setPersonalInfoSection,
}));

// Mock UI components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) =>
    open ? <div data-testid="dialog">{children}</div> : null,
  DialogContent: ({ children, className }: any) => (
    <div className={className} data-testid="dialog-content">
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children, className }: any) => (
    <h2 className={className} data-testid="dialog-title">
      {children}
    </h2>
  ),
}));

vi.mock("@/components/ui/sidebar", () => ({
  Sidebar: ({ children }: any) => (
    <aside data-testid="sidebar">{children}</aside>
  ),
  SidebarContent: ({ children }: any) => (
    <div data-testid="sidebar-content">{children}</div>
  ),
  SidebarGroup: ({ children }: any) => (
    <div data-testid="sidebar-group">{children}</div>
  ),
  SidebarGroupContent: ({ children }: any) => (
    <div data-testid="sidebar-group-content">{children}</div>
  ),
  SidebarHeader: ({ children }: any) => (
    <div data-testid="sidebar-header">{children}</div>
  ),
  SidebarMenu: ({ children }: any) => (
    <ul data-testid="sidebar-menu">{children}</ul>
  ),
  SidebarMenuItem: ({ children }: any) => (
    <li data-testid="sidebar-menu-item">{children}</li>
  ),
  SidebarMenuButton: ({ children, onClick, isActive }: any) => (
    <button
      onClick={onClick}
      data-active={isActive}
      data-testid="sidebar-menu-button"
    >
      {children}
    </button>
  ),
  SidebarProvider: ({ children }: any) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarSeparator: () => <hr data-testid="sidebar-separator" />,
}));

// Mock section components
vi.mock("@/components/features/resume/sections", () => ({
  BasicInfoSection: ({ name, email, onSave }: any) => (
    <div data-testid="basic-info-section">
      <span>Name: {name}</span>
      <span>Email: {email}</span>
      <button onClick={onSave} data-testid="save-button">
        Save
      </button>
    </div>
  ),
  ExperienceSection: ({ experiences, addExperience }: any) => (
    <div data-testid="experience-section">
      <div>Experiences: {experiences.length}</div>
      <button onClick={addExperience} data-testid="add-experience-button">
        Add Experience
      </button>
    </div>
  ),
  EducationSection: ({ education, addEducation }: any) => (
    <div data-testid="education-section">
      <div>Education: {education.length}</div>
      <button onClick={addEducation} data-testid="add-education-button">
        Add Education
      </button>
    </div>
  ),
  SkillsSection: ({ skills, addSkill }: any) => (
    <div data-testid="skills-section">
      <div>Skills: {skills.length}</div>
      <button onClick={addSkill} data-testid="add-skill-button">
        Add Skill
      </button>
    </div>
  ),
  CertificationsSection: ({ certifications, addCertification }: any) => (
    <div data-testid="certifications-section">
      <div>Certifications: {certifications.length}</div>
      <button onClick={addCertification} data-testid="add-certification-button">
        Add Certification
      </button>
    </div>
  ),
  LinksSection: ({ links, addLink }: any) => (
    <div data-testid="links-section">
      <div>Links: {links.length}</div>
      <button onClick={addLink} data-testid="add-link-button">
        Add Link
      </button>
    </div>
  ),
}));

describe("PersonalInfoDialog", () => {
  const mockSetUserInfo = vi.fn();
  const mockOnOpenChange = vi.fn();

  beforeEach(() => {
    // Reset section to "basic" before each test
    mockState.currentSection = "basic";
    mockSetPersonalInfoSection.mockClear();
    // Mock reset handled by vitest config (clearMocks: true)
    (useResumeStore as any).mockReturnValue({
      userInfo: {
        name: "",
        email: "",
        phone: "",
        address: "",
        experiences: [],
        education: [],
        skills: [],
        certifications: [],
        links: [],
      },
      setUserInfo: mockSetUserInfo,
    });
  });

  describe("Dialog Rendering", () => {
    it("should render dialog when open", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    it("should not render dialog when closed", () => {
      render(
        <PersonalInfoDialog open={false} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("should render dialog title", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      const titles = screen.getAllByTestId("dialog-title");
      expect(titles[0]).toHaveTextContent("Personal Information");
    });

    it("should render sidebar", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
    });

    it("should render sidebar separator", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("sidebar-separator")).toBeInTheDocument();
    });
  });

  describe("Section Navigation", () => {
    it("should render all navigation menu items", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Basic Info")).toBeInTheDocument();
      expect(screen.getByText("Experience")).toBeInTheDocument();
      expect(screen.getByText("Education")).toBeInTheDocument();
      expect(screen.getByText("Skills")).toBeInTheDocument();
      expect(screen.getByText("Certifications")).toBeInTheDocument();
      expect(screen.getByText("Links")).toBeInTheDocument();
    });

    it("should show Basic Info section by default", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("basic-info-section")).toBeInTheDocument();
    });

    it("should call setSection when clicking Experience", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      const buttons = screen.getAllByTestId("sidebar-menu-button");
      fireEvent.click(buttons[1]); // Experience
      expect(mockSetPersonalInfoSection).toHaveBeenCalledWith("experience");
    });

    it("should render Experience section when section is experience", () => {
      mockState.currentSection = "experience";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("experience-section")).toBeInTheDocument();
    });

    it("should call setSection when clicking Education", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      const buttons = screen.getAllByTestId("sidebar-menu-button");
      fireEvent.click(buttons[2]); // Education
      expect(mockSetPersonalInfoSection).toHaveBeenCalledWith("education");
    });

    it("should render Education section when section is education", () => {
      mockState.currentSection = "education";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("education-section")).toBeInTheDocument();
    });

    it("should call setSection when clicking Skills", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      const buttons = screen.getAllByTestId("sidebar-menu-button");
      fireEvent.click(buttons[3]); // Skills
      expect(mockSetPersonalInfoSection).toHaveBeenCalledWith("skills");
    });

    it("should render Skills section when section is skills", () => {
      mockState.currentSection = "skills";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("skills-section")).toBeInTheDocument();
    });

    it("should call setSection when clicking Certifications", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      const buttons = screen.getAllByTestId("sidebar-menu-button");
      fireEvent.click(buttons[4]); // Certifications
      expect(mockSetPersonalInfoSection).toHaveBeenCalledWith("certifications");
    });

    it("should render Certifications section when section is certifications", () => {
      mockState.currentSection = "certifications";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("certifications-section")).toBeInTheDocument();
    });

    it("should call setSection when clicking Links", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      const buttons = screen.getAllByTestId("sidebar-menu-button");
      fireEvent.click(buttons[5]); // Links
      expect(mockSetPersonalInfoSection).toHaveBeenCalledWith("links");
    });

    it("should render Links section when section is links", () => {
      mockState.currentSection = "links";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByTestId("links-section")).toBeInTheDocument();
    });

    it("should call setSection for multiple navigation clicks", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      const buttons = screen.getAllByTestId("sidebar-menu-button");

      fireEvent.click(buttons[3]); // Skills
      expect(mockSetPersonalInfoSection).toHaveBeenCalledWith("skills");

      fireEvent.click(buttons[0]); // Back to Basic
      expect(mockSetPersonalInfoSection).toHaveBeenCalledWith("basic");
    });
  });

  describe("Experience Management", () => {
    it("should add experience", async () => {
      mockState.currentSection = "experience";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-experience-button");
      await user.click(addButton);
      expect(screen.getByText("Experiences: 1")).toBeInTheDocument();
    });

    it("should show initial experience count", () => {
      mockState.currentSection = "experience";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Experiences: 0")).toBeInTheDocument();
    });
  });

  describe("Education Management", () => {
    it("should add education", async () => {
      mockState.currentSection = "education";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-education-button");
      await user.click(addButton);
      expect(screen.getByText("Education: 1")).toBeInTheDocument();
    });

    it("should show initial education count", () => {
      mockState.currentSection = "education";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Education: 0")).toBeInTheDocument();
    });
  });

  describe("Skills Management", () => {
    it("should add skill", async () => {
      mockState.currentSection = "skills";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-skill-button");
      await user.click(addButton);
      expect(screen.getByText("Skills: 1")).toBeInTheDocument();
    });

    it("should show initial skills count", () => {
      mockState.currentSection = "skills";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Skills: 0")).toBeInTheDocument();
    });
  });

  describe("Certifications Management", () => {
    it("should add certification", async () => {
      mockState.currentSection = "certifications";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-certification-button");
      await user.click(addButton);
      expect(screen.getByText("Certifications: 1")).toBeInTheDocument();
    });

    it("should show initial certifications count", () => {
      mockState.currentSection = "certifications";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Certifications: 0")).toBeInTheDocument();
    });
  });

  describe("Links Management", () => {
    it("should add link", async () => {
      mockState.currentSection = "links";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-link-button");
      await user.click(addButton);
      expect(screen.getByText("Links: 1")).toBeInTheDocument();
    });

    it("should show initial links count", () => {
      mockState.currentSection = "links";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Links: 0")).toBeInTheDocument();
    });
  });

  describe("Form Submission", () => {
    it("should call setUserInfo on save", async () => {
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const saveButton = screen.getByTestId("save-button");
      await user.click(saveButton);

      expect(mockSetUserInfo).toHaveBeenCalled();
    });

    it("should close dialog on save", async () => {
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const saveButton = screen.getByTestId("save-button");
      await user.click(saveButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it("should save with initial empty data", async () => {
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const saveButton = screen.getByTestId("save-button");
      await user.click(saveButton);

      expect(mockSetUserInfo).toHaveBeenCalledWith({
        name: "",
        email: "",
        phone: "",
        address: "",
        customUrl: "",
        links: [],
        experiences: [],
        education: [],
        skills: [],
        certifications: [],
      });
    });
  });

  describe("Pre-filled Data", () => {
    beforeEach(() => {
      // Reset section to "basic" before each test
      mockState.currentSection = "basic";
      (useResumeStore as any).mockReturnValue({
        userInfo: {
          name: "John Doe",
          email: "john@example.com",
          phone: "555-1234",
          address: "123 Main St",
          experiences: [{ company: "Tech Corp" }],
          education: [{ school: "University" }],
          skills: [{ name: "JavaScript" }],
          certifications: [{ name: "AWS" }],
          links: [{ url: "https://example.com" }],
        },
        setUserInfo: mockSetUserInfo,
      });
    });

    it("should display pre-filled basic info", () => {
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Name: John Doe")).toBeInTheDocument();
      expect(screen.getByText("Email: john@example.com")).toBeInTheDocument();
    });

    it("should display pre-filled experiences count", () => {
      mockState.currentSection = "experience";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Experiences: 1")).toBeInTheDocument();
    });

    it("should display pre-filled education count", () => {
      mockState.currentSection = "education";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Education: 1")).toBeInTheDocument();
    });

    it("should display pre-filled skills count", () => {
      mockState.currentSection = "skills";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Skills: 1")).toBeInTheDocument();
    });

    it("should display pre-filled certifications count", () => {
      mockState.currentSection = "certifications";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Certifications: 1")).toBeInTheDocument();
    });

    it("should display pre-filled links count", () => {
      mockState.currentSection = "links";
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );
      expect(screen.getByText("Links: 1")).toBeInTheDocument();
    });
  });

  describe("Multiple Additions", () => {
    it("should add multiple experiences", async () => {
      mockState.currentSection = "experience";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-experience-button");
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      expect(screen.getByText("Experiences: 3")).toBeInTheDocument();
    });

    it("should add multiple skills", async () => {
      mockState.currentSection = "skills";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-skill-button");
      await user.click(addButton);
      await user.click(addButton);
      expect(screen.getByText("Skills: 2")).toBeInTheDocument();
    });

    it("should add multiple links", async () => {
      mockState.currentSection = "links";
      const user = userEvent.setup();
      render(
        <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
        {
          wrapper: Wrapper,
        },
      );

      const addButton = screen.getByTestId("add-link-button");
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      await user.click(addButton);
      expect(screen.getByText("Links: 4")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle undefined userInfo gracefully", () => {
      (useResumeStore as any).mockReturnValue({
        userInfo: {},
        setUserInfo: mockSetUserInfo,
      });

      expect(() =>
        render(
          <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
          {
            wrapper: Wrapper,
          },
        ),
      ).not.toThrow();
    });

    it("should handle null arrays in userInfo", () => {
      (useResumeStore as any).mockReturnValue({
        userInfo: {
          experiences: null,
          education: null,
          skills: null,
          certifications: null,
          links: null,
        },
        setUserInfo: mockSetUserInfo,
      });

      expect(() =>
        render(
          <PersonalInfoDialog open={true} onOpenChange={mockOnOpenChange} />,
          {
            wrapper: Wrapper,
          },
        ),
      ).not.toThrow();
    });
  });
});
