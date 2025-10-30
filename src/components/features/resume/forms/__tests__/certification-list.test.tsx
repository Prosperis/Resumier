import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { CertificationFormData } from "@/lib/validations/certifications";
import { CertificationList } from "../certification-list";

// Mock @dnd-kit modules
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  closestCenter: vi.fn(),
  useSensor: vi.fn(),
  useSensors: vi.fn(() => []),
  PointerSensor: vi.fn(),
  KeyboardSensor: vi.fn(),
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
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
  SortableItem: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("../dnd/drag-handle", () => ({
  DragHandle: () => <div>Drag Handle</div>,
}));

describe("CertificationList", () => {
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnReorder = vi.fn();

  const mockCertifications: CertificationFormData[] = [
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
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Empty State", () => {
    it("renders empty state when no certifications are provided", () => {
      render(
        <CertificationList
          certifications={[]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByText("No certifications added yet."),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Click "Add Certification" to get started.'),
      ).toBeInTheDocument();
    });

    it("renders empty state card with dashed border", () => {
      const { container } = render(
        <CertificationList
          certifications={[]}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const card = container.querySelector(".border-dashed");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Certification Rendering", () => {
    it("renders all certifications", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByText("AWS Certified Solutions Architect"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Professional Scrum Master I"),
      ).toBeInTheDocument();
    });

    it("displays certification issuer", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByText("Scrum.org")).toBeInTheDocument();
    });

    it("displays issue date", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText(/Issued Jun 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Issued Mar 2022/)).toBeInTheDocument();
    });

    it("displays expiry date when provided", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText(/Expires Jun 2026/)).toBeInTheDocument();
    });

    it("does not display expiry date when not provided", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const psmText = screen.getByText(/Issued Mar 2022/);
      expect(psmText.textContent).not.toContain("Expires");
    });

    it("displays credential ID when provided", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText(/Credential ID: AWS-123456/)).toBeInTheDocument();
    });

    it("does not display credential ID when not provided", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const credentialIds = screen.queryAllByText(/Credential ID:/);
      expect(credentialIds).toHaveLength(1);
    });

    it("displays external link icon when URL is provided", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const link = screen.getByLabelText(
        "View AWS Certified Solutions Architect credential",
      );
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        "https://aws.amazon.com/certification",
      );
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("does not display external link icon when URL is not provided", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const link = screen.queryByLabelText(
        "View Professional Scrum Master I credential",
      );
      expect(link).not.toBeInTheDocument();
    });

    it("displays calendar icon with dates", () => {
      const { container } = render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const calendarIcons = container.querySelectorAll("svg");
      expect(calendarIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Edit Functionality", () => {
    it("calls onEdit with certification when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const editButton = screen.getByLabelText(
        "Edit AWS Certified Solutions Architect certification",
      );
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledWith(mockCertifications[0]);
    });

    it("renders edit button with correct aria-label", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByLabelText(
          "Edit AWS Certified Solutions Architect certification",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Edit Professional Scrum Master I certification"),
      ).toBeInTheDocument();
    });

    it("edit button is rendered as icon button", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const editButton = screen.getByLabelText(
        "Edit AWS Certified Solutions Architect certification",
      );
      expect(editButton).toBeInTheDocument();
      expect(editButton.tagName).toBe("BUTTON");
    });
  });

  describe("Delete Functionality", () => {
    it("calls onDelete with certification ID when delete button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const deleteButton = screen.getByLabelText(
        "Delete AWS Certified Solutions Architect certification",
      );
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).toHaveBeenCalledWith("1");
    });

    it("renders delete button with correct aria-label", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByLabelText(
          "Delete AWS Certified Solutions Architect certification",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          "Delete Professional Scrum Master I certification",
        ),
      ).toBeInTheDocument();
    });

    it("delete button is rendered as icon button", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const deleteButton = screen.getByLabelText(
        "Delete AWS Certified Solutions Architect certification",
      );
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton.tagName).toBe("BUTTON");
    });
  });

  describe("Date Formatting", () => {
    it("formats dates correctly for all months", () => {
      const certWithAllMonths: CertificationFormData[] = [
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

      render(
        <CertificationList
          certifications={certWithAllMonths}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

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
      const cert: CertificationFormData[] = [
        {
          id: "1",
          name: "Test Cert",
          issuer: "Test Issuer",
          date: "2020-01",
          expiryDate: "2023-12",
        },
      ];

      render(
        <CertificationList
          certifications={cert}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText(/Issued Jan 2020/)).toBeInTheDocument();
      expect(screen.getByText(/Expires Dec 2023/)).toBeInTheDocument();
    });
  });

  describe("Multiple Certifications", () => {
    it("renders multiple certifications in order", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      const certNames = screen.getAllByRole("heading", { level: 3 });
      expect(certNames).toHaveLength(2);
      expect(certNames[0]).toHaveTextContent(
        "AWS Certified Solutions Architect",
      );
      expect(certNames[1]).toHaveTextContent("Professional Scrum Master I");
    });

    it("each certification has its own edit and delete buttons", () => {
      render(
        <CertificationList
          certifications={mockCertifications}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByLabelText(
          "Edit AWS Certified Solutions Architect certification",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          "Delete AWS Certified Solutions Architect certification",
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("Edit Professional Scrum Master I certification"),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(
          "Delete Professional Scrum Master I certification",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles very long certification names", () => {
      const longNameCert: CertificationFormData[] = [
        {
          id: "1",
          name: "AWS Certified Advanced Networking Specialty Certification with Extended Title",
          issuer: "Amazon Web Services",
          date: "2023-06",
        },
      ];

      render(
        <CertificationList
          certifications={longNameCert}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByText(
          "AWS Certified Advanced Networking Specialty Certification with Extended Title",
        ),
      ).toBeInTheDocument();
    });

    it("handles very long issuer names", () => {
      const longIssuerCert: CertificationFormData[] = [
        {
          id: "1",
          name: "Test Certification",
          issuer:
            "International Association of Professional Certification Bodies and Standards Organizations",
          date: "2023-06",
        },
      ];

      render(
        <CertificationList
          certifications={longIssuerCert}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByText(
          "International Association of Professional Certification Bodies and Standards Organizations",
        ),
      ).toBeInTheDocument();
    });

    it("handles certification with all optional fields", () => {
      const fullCert: CertificationFormData[] = [
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

      render(
        <CertificationList
          certifications={fullCert}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText("Full Certification")).toBeInTheDocument();
      expect(screen.getByText("Full Issuer")).toBeInTheDocument();
      expect(screen.getByText(/Issued Jun 2023/)).toBeInTheDocument();
      expect(screen.getByText(/Expires Jun 2026/)).toBeInTheDocument();
      expect(
        screen.getByText(/Credential ID: FULL-123456/),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText("View Full Certification credential"),
      ).toBeInTheDocument();
    });

    it("handles certification with minimal fields", () => {
      const minimalCert: CertificationFormData[] = [
        {
          id: "1",
          name: "Minimal Cert",
          issuer: "Minimal Issuer",
          date: "2023-06",
        },
      ];

      render(
        <CertificationList
          certifications={minimalCert}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(screen.getByText("Minimal Cert")).toBeInTheDocument();
      expect(screen.getByText("Minimal Issuer")).toBeInTheDocument();
      expect(screen.getByText(/Issued Jun 2023/)).toBeInTheDocument();
      expect(screen.queryByText(/Expires/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Credential ID:/)).not.toBeInTheDocument();
      expect(
        screen.queryByLabelText(/View .* credential/),
      ).not.toBeInTheDocument();
    });

    it("handles very long credential IDs", () => {
      const longIdCert: CertificationFormData[] = [
        {
          id: "1",
          name: "Test Cert",
          issuer: "Test Issuer",
          date: "2023-06",
          credentialId:
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-VERY-LONG-CREDENTIAL-ID",
        },
      ];

      render(
        <CertificationList
          certifications={longIdCert}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          onReorder={mockOnReorder}
        />,
      );

      expect(
        screen.getByText(
          /Credential ID: ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-VERY-LONG-CREDENTIAL-ID/,
        ),
      ).toBeInTheDocument();
    });
  });
});
