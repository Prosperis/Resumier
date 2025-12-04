import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { CertificationFormDialog } from "../certification-form-dialog";

describe("CertificationFormDialog", () => {
  let defaultProps: {
    open: boolean;
    onOpenChange: ReturnType<typeof vi.fn>;
    onSubmit: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    defaultProps = {
      open: true,
      onOpenChange: vi.fn(),
      onSubmit: vi.fn(),
    };
  });
  describe("Rendering", () => {
    it("renders the dialog when open", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByText("Add Certification")).toBeInTheDocument();
      expect(
        screen.getByText("Add your certification details."),
      ).toBeInTheDocument();
    });
    it("renders with custom title and description", () => {
      render(
        <CertificationFormDialog
          {...defaultProps}
          title="Edit Certification"
          description="Update your certification information."
        />,
      );
      expect(screen.getByText("Edit Certification")).toBeInTheDocument();
      expect(
        screen.getByText("Update your certification information."),
      ).toBeInTheDocument();
    });
    it("does not render when closed", () => {
      render(<CertificationFormDialog {...defaultProps} open={false} />);
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    it("renders all form fields", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      expect(screen.getByLabelText(/certification name/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/issuing organization/i),
      ).toBeInTheDocument();
      // Date pickers are buttons, not inputs, so check for labels
      expect(screen.getByText("Issue Date")).toBeInTheDocument();
      expect(screen.getByText("Expiry Date")).toBeInTheDocument();
      expect(screen.getByLabelText(/credential id/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/credential url/i)).toBeInTheDocument();
    });
    it("renders action buttons", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /cancel/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /^save$/i }),
      ).toBeInTheDocument();
    });
    it("shows field descriptions", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      expect(screen.getByText(/format: yyyy-mm/i)).toBeInTheDocument();
      expect(screen.getByText(/leave blank if no expiry/i)).toBeInTheDocument();
      expect(
        screen.getByText(/certificate or credential number/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/link to verify the certification/i),
      ).toBeInTheDocument();
    });
  });
  describe("Form Interaction", () => {
    it("allows filling in certification name", async () => {
      const user = userEvent.setup();
      render(<CertificationFormDialog {...defaultProps} />);
      const nameInput = screen.getByLabelText(/certification name/i);
      await user.type(nameInput, "AWS Certified Solutions Architect");
      expect(nameInput).toHaveValue("AWS Certified Solutions Architect");
    });
    it("allows filling in issuing organization", async () => {
      const user = userEvent.setup();
      render(<CertificationFormDialog {...defaultProps} />);
      const issuerInput = screen.getByLabelText(/issuing organization/i);
      await user.type(issuerInput, "Amazon Web Services");
      expect(issuerInput).toHaveValue("Amazon Web Services");
    });
    it("allows filling in issue date", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      // MonthPicker uses buttons, not inputs
      const dateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      await user.click(dateButtons[0]); // Issue date button
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /jun/i }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: /jun/i }));
      // Verify by submitting
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            date: expect.stringMatching(/\d{4}-06/),
          }),
        );
      });
    });
    it("allows filling in expiry date", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      // MonthPicker uses buttons - find the second button (expiry date)
      const dateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      await user.click(dateButtons[1]); // Expiry date button
      await waitFor(() => {
        expect(
          screen.getByRole("button", { name: /jun/i }),
        ).toBeInTheDocument();
      });
      await user.click(screen.getByRole("button", { name: /jun/i }));
      // Verify by submitting
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            expiryDate: expect.stringMatching(/\d{4}-06/),
          }),
        );
      });
    });
    it("allows filling in credential ID", async () => {
      const user = userEvent.setup();
      render(<CertificationFormDialog {...defaultProps} />);
      const credentialInput = screen.getByLabelText(/credential id/i);
      await user.type(credentialInput, "ABC123XYZ");
      expect(credentialInput).toHaveValue("ABC123XYZ");
    });
    it("allows filling in credential URL", async () => {
      const user = userEvent.setup();
      render(<CertificationFormDialog {...defaultProps} />);
      const urlInput = screen.getByLabelText(/credential url/i);
      await user.type(urlInput, "https://www.credly.com/badges/example");
      expect(urlInput).toHaveValue("https://www.credly.com/badges/example");
    });
  });
  describe("Form Submission", () => {
    it("submits form with all required fields", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ date: "2023-06" }}
        />,
      );
      await user.type(
        screen.getByLabelText(/certification name/i),
        "AWS Solutions Architect",
      );
      await user.type(screen.getByLabelText(/issuing organization/i), "AWS");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "AWS Solutions Architect",
            issuer: "AWS",
            date: "2023-06",
          }),
        );
      });
    });
    it("submits form with all fields including optional ones", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ date: "2023-06", expiryDate: "2026-06" }}
        />,
      );
      await user.type(
        screen.getByLabelText(/certification name/i),
        "AWS Solutions Architect",
      );
      await user.type(screen.getByLabelText(/issuing organization/i), "AWS");
      await user.type(screen.getByLabelText(/credential id/i), "ABC123");
      await user.type(
        screen.getByLabelText(/credential url/i),
        "https://example.com/cert",
      );
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: "AWS Solutions Architect",
          issuer: "AWS",
          date: "2023-06",
          expiryDate: "2026-06",
          credentialId: "ABC123",
          url: "https://example.com/cert",
        });
      });
    });
    it("submits form without optional expiry date", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ date: "2022-01" }}
        />,
      );
      await user.type(screen.getByLabelText(/certification name/i), "PMP");
      await user.type(screen.getByLabelText(/issuing organization/i), "PMI");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "PMP",
            issuer: "PMI",
            date: "2022-01",
            expiryDate: "",
          }),
        );
      });
    });
    it("submits form without optional credential ID", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ date: "2021-03" }}
        />,
      );
      await user.type(screen.getByLabelText(/certification name/i), "CISSP");
      await user.type(screen.getByLabelText(/issuing organization/i), "ISC2");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "CISSP",
            issuer: "ISC2",
            date: "2021-03",
            credentialId: "",
          }),
        );
      });
    });
    it("submits form without optional URL", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ date: "2023-09" }}
        />,
      );
      await user.type(screen.getByLabelText(/certification name/i), "CKA");
      await user.type(screen.getByLabelText(/issuing organization/i), "CNCF");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "CKA",
            issuer: "CNCF",
            date: "2023-09",
            url: "",
          }),
        );
      });
    });
    it("closes dialog after successful submission", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onOpenChange={onOpenChange}
          defaultValues={{ date: "2023-01" }}
        />,
      );
      await user.type(
        screen.getByLabelText(/certification name/i),
        "Test Cert",
      );
      await user.type(
        screen.getByLabelText(/issuing organization/i),
        "Test Org",
      );
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });
    it("resets form after submission", async () => {
      const user = userEvent.setup();
      render(
        <CertificationFormDialog
          {...defaultProps}
          defaultValues={{ date: "2023-01" }}
        />,
      );
      const nameInput = screen.getByLabelText(/certification name/i);
      await user.type(nameInput, "Test Certification");
      await user.type(
        screen.getByLabelText(/issuing organization/i),
        "Test Org",
      );
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(nameInput).toHaveValue("");
      });
    });
  });
  describe("Cancel Button", () => {
    it("closes dialog when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onOpenChange={onOpenChange}
        />,
      );
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("does not submit form when cancel is clicked", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      await user.type(screen.getByLabelText(/certification name/i), "Test");
      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
  describe("Default Values", () => {
    it("populates form with default values", () => {
      const defaultValues = {
        name: "Default Cert",
        issuer: "Default Org",
        date: "2022-06",
        expiryDate: "2025-06",
        credentialId: "DEF456",
        url: "https://default.com/cert",
      };
      render(
        <CertificationFormDialog
          {...defaultProps}
          defaultValues={defaultValues}
        />,
      );
      expect(screen.getByLabelText(/certification name/i)).toHaveValue(
        "Default Cert",
      );
      expect(screen.getByLabelText(/issuing organization/i)).toHaveValue(
        "Default Org",
      );
      // Date pickers show formatted dates
      expect(screen.getByText(/june 2022/i)).toBeInTheDocument();
      expect(screen.getByText(/june 2025/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/credential id/i)).toHaveValue("DEF456");
      expect(screen.getByLabelText(/credential url/i)).toHaveValue(
        "https://default.com/cert",
      );
    });
    it("handles partial default values", () => {
      const defaultValues = {
        name: "Partial Cert",
        issuer: "Partial Org",
        date: "2021-01",
      };
      render(
        <CertificationFormDialog
          {...defaultProps}
          defaultValues={defaultValues}
        />,
      );
      expect(screen.getByLabelText(/certification name/i)).toHaveValue(
        "Partial Cert",
      );
      expect(screen.getByLabelText(/issuing organization/i)).toHaveValue(
        "Partial Org",
      );
      // Issue date shows formatted, expiry shows placeholder
      expect(screen.getByText(/january 2021/i)).toBeInTheDocument();
      expect(screen.getByText(/pick a month/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/credential id/i)).toHaveValue("");
      expect(screen.getByLabelText(/credential url/i)).toHaveValue("");
    });
  });
  describe("Form Validation", () => {
    it("all fields are optional and form can submit with minimal data", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      // Just click submit without filling anything
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        // Form should submit with empty values since all fields are optional
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "",
            issuer: "",
            date: "",
            expiryDate: "",
            credentialId: "",
            url: "",
          }),
        );
      });
    });
    it("allows empty URL field", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(<CertificationFormDialog {...defaultProps} onSubmit={onSubmit} />);
      // Submit without URL - should work since URL is optional
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "",
          }),
        );
      });
    });
  });
  describe("URL Field", () => {
    it("accepts valid URL format", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ date: "2023-01" }}
        />,
      );
      await user.type(screen.getByLabelText(/certification name/i), "Test");
      await user.type(screen.getByLabelText(/issuing organization/i), "Org");
      await user.type(
        screen.getByLabelText(/credential url/i),
        "https://www.credly.com/badges/12345",
      );
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            url: "https://www.credly.com/badges/12345",
          }),
        );
      });
    });
    it("has url input type", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      const urlInput = screen.getByLabelText(/credential url/i);
      expect(urlInput).toHaveAttribute("type", "url");
    });
  });
  describe("Date Fields", () => {
    it("renders date pickers as buttons with MonthPicker", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      // Date pickers are buttons, not month inputs
      const dateButtons = screen.getAllByRole("button", {
        name: /pick a month/i,
      });
      expect(dateButtons).toHaveLength(2); // Issue date and expiry date
    });
    it("shows formatted dates when values are set", () => {
      render(
        <CertificationFormDialog
          {...defaultProps}
          defaultValues={{ date: "2023-01", expiryDate: "2026-01" }}
        />,
      );
      expect(screen.getByText(/january 2023/i)).toBeInTheDocument();
      expect(screen.getByText(/january 2026/i)).toBeInTheDocument();
    });
    it("allows expiry date to be after issue date", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();
      render(
        <CertificationFormDialog
          {...defaultProps}
          onSubmit={onSubmit}
          defaultValues={{ date: "2023-01", expiryDate: "2026-01" }}
        />,
      );
      await user.type(screen.getByLabelText(/certification name/i), "Cert");
      await user.type(screen.getByLabelText(/issuing organization/i), "Org");
      const submitButton = screen.getByRole("button", { name: /^save$/i });
      await user.click(submitButton);
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            date: "2023-01",
            expiryDate: "2026-01",
          }),
        );
      });
    });
  });
  describe("Placeholder Text", () => {
    it("shows helpful placeholder for certification name", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      const nameInput = screen.getByPlaceholderText(
        /aws certified solutions architect/i,
      );
      expect(nameInput).toBeInTheDocument();
    });
    it("shows helpful placeholder for issuing organization", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      const issuerInput = screen.getByPlaceholderText(/amazon web services/i);
      expect(issuerInput).toBeInTheDocument();
    });
    it("shows helpful placeholder for credential ID", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      const credentialInput = screen.getByPlaceholderText(/abc123xyz/i);
      expect(credentialInput).toBeInTheDocument();
    });
    it("shows helpful placeholder for URL", () => {
      render(<CertificationFormDialog {...defaultProps} />);
      const urlInput = screen.getByPlaceholderText(
        /https:\/\/www\.credly\.com\/badges\//i,
      );
      expect(urlInput).toBeInTheDocument();
    });
  });
});
