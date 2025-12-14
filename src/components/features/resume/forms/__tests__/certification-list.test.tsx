import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";
import type { Certification } from "@/lib/api/types";

// Mock @dnd-kit modules
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: any) => children,
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => children,
  verticalListSortingStrategy: vi.fn(),
  sortableKeyboardCoordinates: vi.fn(),
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
}));

vi.mock("@dnd-kit/utilities", () => ({
  CSS: {
    Transform: {
      toString: () => "",
    },
  },
}));

vi.mock("../dnd/sortable-item", () => ({
  SortableItem: ({ children }: any) => children,
}));

vi.mock("../dnd/drag-handle", () => ({
  DragHandle: () => null,
}));

vi.mock("../certification-inline-form", () => ({
  CertificationInlineForm: () => null,
}));

import { CertificationList } from "../certification-list";

describe("CertificationList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnReorder = vi.fn();
  const mockOnClose = vi.fn();

  const defaultProps = {
    resumeId: "test-resume-id",
    editingId: null,
    isAddingNew: false,
    onEdit: mockOnEdit,
    onClose: mockOnClose,
    onDelete: mockOnDelete,
    onReorder: mockOnReorder,
  };

  const mockCertifications: Certification[] = [
    {
      id: "1",
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      date: "2023-06",
      expiryDate: "2026-06",
      credentialId: "AWS-123456",
      url: "https://aws.amazon.com/certification",
    },
    {
      id: "2",
      name: "Professional Scrum Master I",
      issuer: "Scrum.org",
      date: "2022-03",
      credentialId: undefined,
      url: undefined,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Empty State", () => {
    it("renders empty state when no certifications are provided", () => {
      render(<CertificationList {...defaultProps} certifications={[]} />);

      expect(screen.getByText("No certifications added yet.")).toBeInTheDocument();
      expect(screen.getByText("Click the + button to add a certification.")).toBeInTheDocument();
    });

    it("renders empty state card with dashed border", () => {
      const { container } = render(<CertificationList {...defaultProps} certifications={[]} />);

      const card = container.querySelector(".border-dashed");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Certification Rendering", () => {
    it("renders all certifications", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      expect(screen.getByText("AWS Certified Solutions Architect")).toBeInTheDocument();
      expect(screen.getByText("Professional Scrum Master I")).toBeInTheDocument();
    });

    it("displays certification issuer", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Scrum.org")).toBeInTheDocument();
    });

    it("displays issue date", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      expect(screen.getByText(/Issued Jun 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Mar 2022/)).toBeInTheDocument();
    });

    it("displays expiry date when provided", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      expect(screen.getByText(/Expires Jun 2026/)).toBeInTheDocument();
    });

    it("does not display expiry date when not provided", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const psmText = screen.getByText(/Issued Mar 2022/);
      expect(psmText.textContent).not.toContain("Expires");
    });

    it("displays credential ID when provided", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      expect(screen.getByText(/ID: AWS-123456/)).toBeInTheDocument();
    });

    it("does not display credential ID when not provided", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const credentialIds = screen.queryAllByText(/ID:/);
      expect(credentialIds).toHaveLength(1);
    });

    it("displays external link icon when URL is provided", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const links = screen.getAllByRole("link");
      const awsLink = links.find(
        (l) => l.getAttribute("href") === "https://aws.amazon.com/certification",
      );
      expect(awsLink).toBeInTheDocument();
      expect(awsLink).toHaveAttribute("target", "_blank");
      expect(awsLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("displays calendar icon with dates", () => {
      const { container } = render(
        <CertificationList {...defaultProps} certifications={mockCertifications} />,
      );

      const calendarIcons = container.querySelectorAll("svg");
      expect(calendarIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Edit Functionality", () => {
    it("calls onEdit with certification id when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) => btn.querySelector(".lucide-square-pen"));
      await user.click(editButtons[0]);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith("1");
    });

    it("edit button is rendered as icon button", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) => btn.querySelector(".lucide-square-pen"));
      expect(editButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Delete Functionality", () => {
    it("calls onDelete with certification ID when delete button is clicked", async () => {
      const user = userEvent.setup();
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const buttons = screen.getAllByRole("button");
      const deleteButtons = buttons.filter((btn) => btn.querySelector(".lucide-trash"));
      await user.click(deleteButtons[0]);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("delete button is rendered as icon button", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const buttons = screen.getAllByRole("button");
      const deleteButtons = buttons.filter((btn) => btn.querySelector(".lucide-trash"));
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  describe("Date Formatting", () => {
    it("formats dates correctly for all months", () => {
      const certWithAllMonths: Certification[] = [
        { id: "1", name: "Cert 1", issuer: "Issuer", date: "2023-01" },
        { id: "2", name: "Cert 2", issuer: "Issuer", date: "2023-02" },
        { id: "3", name: "Cert 3", issuer: "Issuer", date: "2023-03" },
        { id: "4", name: "Cert 4", issuer: "Issuer", date: "2023-04" },
        { id: "5", name: "Cert 5", issuer: "Issuer", date: "2023-05" },
        { id: "6", name: "Cert 6", issuer: "Issuer", date: "2023-06" },
        { id: "7", name: "Cert 7", issuer: "Issuer", date: "2023-07" },
        { id: "8", name: "Cert 8", issuer: "Issuer", date: "2023-08" },
        { id: "9", name: "Cert 9", issuer: "Issuer", date: "2023-09" },
        { id: "10", name: "Cert 10", issuer: "Issuer", date: "2023-10" },
        { id: "11", name: "Cert 11", issuer: "Issuer", date: "2023-11" },
        { id: "12", name: "Cert 12", issuer: "Issuer", date: "2023-12" },
      ];

      render(<CertificationList {...defaultProps} certifications={certWithAllMonths} />);

      expect(screen.getByText(/Issued Jan 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Feb 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Mar 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Apr 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued May 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Jun 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Jul 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Aug 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Sep 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Oct 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Nov 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Dec 2023/)).toBeInTheDocument();
    });

    it("formats expiry dates correctly", () => {
      const cert: Certification[] = [
        {
          id: "1",
          name: "Test Cert",
          issuer: "Test Issuer",
          date: "2020-01",
          expiryDate: "2023-12",
        },
      ];

      render(<CertificationList {...defaultProps} certifications={cert} />);

      expect(screen.getByText(/Issued Jan 2020/)).toBeInTheDocument();
      expect(screen.getByText(/Expires Dec 2023/)).toBeInTheDocument();
    });
  });

  describe("Multiple Certifications", () => {
    it("renders multiple certifications in order", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const certNames = screen.getAllByRole("heading", { level: 3 });
      expect(certNames).toHaveLength(2);
      expect(certNames[0]).toHaveTextContent("AWS Certified Solutions Architect");
      expect(certNames[1]).toHaveTextContent("Professional Scrum Master I");
    });

    it("each certification has its own edit and delete buttons", () => {
      render(<CertificationList {...defaultProps} certifications={mockCertifications} />);

      const buttons = screen.getAllByRole("button");
      const editButtons = buttons.filter((btn) => btn.querySelector(".lucide-square-pen"));
      const deleteButtons = buttons.filter((btn) => btn.querySelector(".lucide-trash"));

      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  describe("Edge Cases", () => {
    it("handles very long certification names", () => {
      const longNameCert: Certification[] = [
        {
          id: "1",
          name: "AWS Certified Advanced Networking Specialty Certification with Extended Title",
          issuer: "Amazon Web Services",
          date: "2023-06",
        },
      ];

      render(<CertificationList {...defaultProps} certifications={longNameCert} />);

      expect(
        screen.getByText(
          "AWS Certified Advanced Networking Specialty Certification with Extended Title",
        ),
      ).toBeInTheDocument();
    });

    it("handles very long issuer names", () => {
      const longIssuerCert: Certification[] = [
        {
          id: "1",
          name: "Test Certification",
          issuer:
            "International Association of Professional Certification Bodies and Standards Organizations",
          date: "2023-06",
        },
      ];

      render(<CertificationList {...defaultProps} certifications={longIssuerCert} />);

      expect(
        screen.getByText(
          "International Association of Professional Certification Bodies and Standards Organizations",
        ),
      ).toBeInTheDocument();
    });

    it("handles certification with all optional fields", () => {
      const fullCert: Certification[] = [
        {
          id: "1",
          name: "Full Certification",
          issuer: "Full Issuer",
          date: "2023-06",
          expiryDate: "2026-06",
          credentialId: "FULL-123456",
          url: "https://example.com/cert",
        },
      ];

      render(<CertificationList {...defaultProps} certifications={fullCert} />);

      expect(screen.getByText("Full Certification")).toBeInTheDocument();
      expect(screen.getByText("Full Issuer")).toBeInTheDocument();
      expect(screen.getByText(/Issued Jun 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Expires Jun 2026/)).toBeInTheDocument();
      expect(screen.getByText(/ID: FULL-123456/)).toBeInTheDocument();
    });

    it("handles certification with minimal fields", () => {
      const minimalCert: Certification[] = [
        {
          id: "1",
          name: "Minimal Cert",
          issuer: "Minimal Issuer",
          date: "2023-06",
        },
      ];

      render(<CertificationList {...defaultProps} certifications={minimalCert} />);

      expect(screen.getByText("Minimal Cert")).toBeInTheDocument();
      expect(screen.getByText("Minimal Issuer")).toBeInTheDocument();
      expect(screen.getByText(/Issued Jun 2023/)).toBeInTheDocument();
      expect(screen.queryByText(/Expires/)).not.toBeInTheDocument();
      expect(screen.queryByText(/ID:/)).not.toBeInTheDocument();
    });

    it("handles very long credential IDs", () => {
      const longIdCert: Certification[] = [
        {
          id: "1",
          name: "Test Cert",
          issuer: "Test Issuer",
          date: "2023-06",
          credentialId: "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-VERY-LONG-CREDENTIAL-ID",
        },
      ];

      render(<CertificationList {...defaultProps} certifications={longIdCert} />);

      expect(
        screen.getByText(/ID: ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-VERY-LONG-CREDENTIAL-ID/),
      ).toBeInTheDocument();
    });
  });
});
