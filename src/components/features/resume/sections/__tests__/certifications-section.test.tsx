import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import type { Certification } from "@/stores";
import { CertificationsSection } from "../certifications-section";

describe("CertificationsSection", () => {
  const mockCertifications: Certification[] = [
    {
      name: "AWS Certified Developer",
      expiration: "2025-12-31",
    },
    {
      name: "Google Cloud Professional",
      expiration: "2024-06-30",
    },
  ];

  const defaultProps = {
    certifications: mockCertifications,
    addCertification: vi.fn(),
    updateCertification: vi.fn(),
    removeCertification: vi.fn(),
  };

  it("renders all certifications", () => {
    render(<CertificationsSection {...defaultProps} />);

    expect(screen.getByDisplayValue("AWS Certified Developer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Google Cloud Professional")).toBeInTheDocument();
  });

  it("renders certification expiration dates", () => {
    render(<CertificationsSection {...defaultProps} />);

    expect(screen.getByDisplayValue("2025-12-31")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-06-30")).toBeInTheDocument();
  });

  it("renders Add Certification button", () => {
    render(<CertificationsSection {...defaultProps} />);

    expect(screen.getByRole("button", { name: /add certification/i })).toBeInTheDocument();
  });

  it("calls addCertification when Add button is clicked", async () => {
    const user = userEvent.setup();
    render(<CertificationsSection {...defaultProps} />);

    const addButton = screen.getByRole("button", {
      name: /add certification/i,
    });
    await user.click(addButton);

    expect(defaultProps.addCertification).toHaveBeenCalledTimes(1);
  });

  it("renders Remove button for each certification", () => {
    render(<CertificationsSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    expect(removeButtons).toHaveLength(mockCertifications.length);
  });

  it("calls removeCertification with correct index when Remove is clicked", async () => {
    const user = userEvent.setup();
    render(<CertificationsSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[0]);

    expect(defaultProps.removeCertification).toHaveBeenCalledWith(0);
  });

  it("calls updateCertification when certification name is changed", async () => {
    const user = userEvent.setup();
    render(<CertificationsSection {...defaultProps} />);

    const nameInput = screen.getByDisplayValue("AWS Certified Developer");
    await user.clear(nameInput);
    await user.type(nameInput, "New Certification");

    // The function is called for each character typed after the clear
    expect(defaultProps.updateCertification).toHaveBeenCalled();
    expect(defaultProps.updateCertification).toHaveBeenCalledWith(
      0,
      "name",
      expect.stringContaining("N"),
    );
  });

  it("renders empty state with only Add button when no certifications", () => {
    render(<CertificationsSection {...defaultProps} certifications={[]} />);

    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add certification/i })).toBeInTheDocument();
  });

  it("handles certifications with null values", () => {
    const certsWithNulls: Certification[] = [{ name: null, expiration: null }];

    render(<CertificationsSection {...defaultProps} certifications={certsWithNulls} />);

    const nameInput = screen.getByPlaceholderText("Certification name");
    expect(nameInput).toHaveValue("");
  });

  it("displays correct placeholder text for certification name", () => {
    render(
      <CertificationsSection {...defaultProps} certifications={[{ name: "", expiration: "" }]} />,
    );

    expect(screen.getByPlaceholderText("Certification name")).toBeInTheDocument();
  });

  it("renders labels for certification fields", () => {
    render(<CertificationsSection {...defaultProps} />);

    expect(screen.getAllByText("Certification")).toHaveLength(mockCertifications.length);
    expect(screen.getAllByText("Expiration")).toHaveLength(mockCertifications.length);
  });

  it("calls removeCertification with correct index for second item", async () => {
    const user = userEvent.setup();
    render(<CertificationsSection {...defaultProps} />);

    const removeButtons = screen.getAllByRole("button", { name: /remove/i });
    await user.click(removeButtons[1]);

    expect(defaultProps.removeCertification).toHaveBeenCalledWith(1);
  });

  it("renders date input type for expiration field", () => {
    render(<CertificationsSection {...defaultProps} />);

    const dateInputs = screen.getAllByDisplayValue(/2025-12-31|2024-06-30/);
    dateInputs.forEach((input) => {
      expect(input).toHaveAttribute("type", "date");
    });
  });

  it("renders certifications in bordered containers", () => {
    const { container } = render(<CertificationsSection {...defaultProps} />);

    const certContainers = container.querySelectorAll(".border.p-4.rounded-md");
    expect(certContainers).toHaveLength(mockCertifications.length);
  });
});
