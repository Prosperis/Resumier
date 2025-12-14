import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { vi } from "vitest";
import { BasicInfoSection } from "../basic-info-section";

describe("BasicInfoSection", () => {
  const mockOnNameChange = vi.fn();
  const mockOnEmailChange = vi.fn();
  const mockOnPhoneChange = vi.fn();
  const mockOnAddressChange = vi.fn();
  const mockOnLinkedInUrlChange = vi.fn();
  const mockOnImport = vi.fn();
  const mockOnSave = vi.fn();

  const defaultProps = {
    name: "John Doe",
    email: "john@example.com",
    phone: "555-555-5555",
    address: "123 Main St",
    linkedInUrl: "https://linkedin.com/in/johndoe",
    onNameChange: mockOnNameChange,
    onEmailChange: mockOnEmailChange,
    onPhoneChange: mockOnPhoneChange,
    onAddressChange: mockOnAddressChange,
    onLinkedInUrlChange: mockOnLinkedInUrlChange,
    onImport: mockOnImport,
    importing: false,
    onSave: mockOnSave,
  };

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
  });

  describe("Rendering", () => {
    it("renders all form fields with labels", () => {
      render(<BasicInfoSection {...defaultProps} />);

      expect(screen.getByLabelText("Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();
      expect(screen.getByLabelText("Address")).toBeInTheDocument();
      expect(screen.getByLabelText("LinkedIn Profile URL")).toBeInTheDocument();
    });

    it("displays current values in inputs", () => {
      render(<BasicInfoSection {...defaultProps} />);

      expect(screen.getByLabelText("Name")).toHaveValue("John Doe");
      expect(screen.getByLabelText("Email")).toHaveValue("john@example.com");
      expect(screen.getByLabelText("Phone")).toHaveValue("555-555-5555");
      expect(screen.getByLabelText("Address")).toHaveValue("123 Main St");
      expect(screen.getByLabelText("LinkedIn Profile URL")).toHaveValue(
        "https://linkedin.com/in/johndoe",
      );
    });

    it("renders email input with correct type", () => {
      render(<BasicInfoSection {...defaultProps} />);

      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toHaveAttribute("type", "email");
    });

    it("renders with placeholders", () => {
      render(
        <BasicInfoSection {...defaultProps} name="" email="" phone="" address="" linkedInUrl="" />,
      );

      expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("555-555-5555")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Your address")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("https://www.linkedin.com/in/username"),
      ).toBeInTheDocument();
    });
  });

  describe("Name Field", () => {
    it("calls onNameChange when name is typed", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} name="" />);

      const nameInput = screen.getByLabelText("Name");
      await user.type(nameInput, "Jane");

      expect(mockOnNameChange).toHaveBeenCalledWith("J");
      expect(mockOnNameChange).toHaveBeenCalledWith("a");
      expect(mockOnNameChange).toHaveBeenCalledWith("n");
      expect(mockOnNameChange).toHaveBeenCalledWith("e");
    });

    it("calls onNameChange when name is cleared", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} />);

      const nameInput = screen.getByLabelText("Name");
      await user.clear(nameInput);

      expect(mockOnNameChange).toHaveBeenCalledWith("");
    });
  });

  describe("Email Field", () => {
    it("calls onEmailChange when email is typed", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} email="" />);

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "test@example.com");

      expect(mockOnEmailChange).toHaveBeenCalled();
      expect(mockOnEmailChange).toHaveBeenCalledWith("t");
    });

    it("calls onEmailChange when email is cleared", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} />);

      const emailInput = screen.getByLabelText("Email");
      await user.clear(emailInput);

      expect(mockOnEmailChange).toHaveBeenCalledWith("");
    });
  });

  describe("Phone Field", () => {
    it("calls onPhoneChange when phone is typed", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} phone="" />);

      const phoneInput = screen.getByLabelText("Phone");
      await user.type(phoneInput, "123");

      expect(mockOnPhoneChange).toHaveBeenCalledWith("1");
      expect(mockOnPhoneChange).toHaveBeenCalledWith("2");
      expect(mockOnPhoneChange).toHaveBeenCalledWith("3");
    });

    it("calls onPhoneChange when phone is cleared", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} />);

      const phoneInput = screen.getByLabelText("Phone");
      await user.clear(phoneInput);

      expect(mockOnPhoneChange).toHaveBeenCalledWith("");
    });
  });

  describe("Address Field", () => {
    it("calls onAddressChange when address is typed", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} address="" />);

      const addressInput = screen.getByLabelText("Address");
      await user.type(addressInput, "456 Oak Ave");

      expect(mockOnAddressChange).toHaveBeenCalled();
      expect(mockOnAddressChange).toHaveBeenCalledWith("4");
    });

    it("calls onAddressChange when address is cleared", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} />);

      const addressInput = screen.getByLabelText("Address");
      await user.clear(addressInput);

      expect(mockOnAddressChange).toHaveBeenCalledWith("");
    });
  });

  describe("LinkedIn Field", () => {
    it("calls onLinkedInUrlChange when LinkedIn URL is typed", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} linkedInUrl="" />);

      const linkedInInput = screen.getByLabelText("LinkedIn Profile URL");
      await user.type(linkedInInput, "https://linkedin.com");

      expect(mockOnLinkedInUrlChange).toHaveBeenCalled();
      expect(mockOnLinkedInUrlChange).toHaveBeenCalledWith("h");
    });

    it("calls onLinkedInUrlChange when LinkedIn URL is cleared", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} />);

      const linkedInInput = screen.getByLabelText("LinkedIn Profile URL");
      await user.clear(linkedInInput);

      expect(mockOnLinkedInUrlChange).toHaveBeenCalledWith("");
    });
  });

  describe("Import Button", () => {
    it("renders import from LinkedIn button", () => {
      render(<BasicInfoSection {...defaultProps} />);

      expect(screen.getByText("Import from LinkedIn")).toBeInTheDocument();
    });

    it("calls onImport when import button is clicked", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} />);

      const importButton = screen.getByText("Import from LinkedIn");
      await user.click(importButton);

      expect(mockOnImport).toHaveBeenCalledTimes(1);
    });

    it("disables import button when importing is true", () => {
      render(<BasicInfoSection {...defaultProps} importing={true} />);

      const importButton = screen.getByRole("button", {
        name: /Import from LinkedIn/i,
      });
      expect(importButton).toBeDisabled();
    });

    it("enables import button when not importing", () => {
      render(<BasicInfoSection {...defaultProps} importing={false} />);

      const importButton = screen.getByText("Import from LinkedIn");
      expect(importButton).not.toBeDisabled();
    });
  });

  describe("Save Button", () => {
    it("renders save button", () => {
      render(<BasicInfoSection {...defaultProps} />);

      expect(screen.getByText("Save")).toBeInTheDocument();
    });

    it("calls onSave when save button is clicked", async () => {
      const user = userEvent.setup();
      render(<BasicInfoSection {...defaultProps} />);

      const saveButton = screen.getByText("Save");
      await user.click(saveButton);

      expect(mockOnSave).toHaveBeenCalledTimes(1);
    });

    it("calls onSave when form is submitted", async () => {
      const user = userEvent.setup();
      const { container } = render(<BasicInfoSection {...defaultProps} />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();

      // Submit via Enter key on an input
      const nameInput = screen.getByLabelText("Name");
      await user.type(nameInput, "{Enter}");

      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  describe("Form Structure", () => {
    it("renders as a form element", () => {
      const { container } = render(<BasicInfoSection {...defaultProps} />);

      const form = container.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("has proper grid layout", () => {
      const { container } = render(<BasicInfoSection {...defaultProps} />);

      const form = container.querySelector("form");
      expect(form).toHaveClass("grid", "gap-4");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string values", () => {
      render(
        <BasicInfoSection {...defaultProps} name="" email="" phone="" address="" linkedInUrl="" />,
      );

      expect(screen.getByLabelText("Name")).toHaveValue("");
      expect(screen.getByLabelText("Email")).toHaveValue("");
      expect(screen.getByLabelText("Phone")).toHaveValue("");
      expect(screen.getByLabelText("Address")).toHaveValue("");
      expect(screen.getByLabelText("LinkedIn Profile URL")).toHaveValue("");
    });

    it("handles very long input values", () => {
      const longName = "A".repeat(200);
      const longEmail = `${"a".repeat(50)}@${"example".repeat(10)}.com`;
      const longPhone = "1".repeat(50);
      const longAddress = `${"123 ".repeat(50)}Main St`;
      const longUrl = `https://linkedin.com/in/${"a".repeat(100)}`;

      render(
        <BasicInfoSection
          {...defaultProps}
          name={longName}
          email={longEmail}
          phone={longPhone}
          address={longAddress}
          linkedInUrl={longUrl}
        />,
      );

      expect(screen.getByLabelText("Name")).toHaveValue(longName);
      expect(screen.getByLabelText("Email")).toHaveValue(longEmail);
      expect(screen.getByLabelText("Phone")).toHaveValue(longPhone);
      expect(screen.getByLabelText("Address")).toHaveValue(longAddress);
      expect(screen.getByLabelText("LinkedIn Profile URL")).toHaveValue(longUrl);
    });

    it("handles special characters in inputs", () => {
      const specialName = "O'Brien-Smith";
      const specialEmail = "user+test@example.com";
      const specialPhone = "+1 (555) 123-4567";
      const specialAddress = "123 Main St, Apt #4B";
      const specialUrl = "https://linkedin.com/in/user-name_123";

      render(
        <BasicInfoSection
          {...defaultProps}
          name={specialName}
          email={specialEmail}
          phone={specialPhone}
          address={specialAddress}
          linkedInUrl={specialUrl}
        />,
      );

      expect(screen.getByLabelText("Name")).toHaveValue(specialName);
      expect(screen.getByLabelText("Email")).toHaveValue(specialEmail);
      expect(screen.getByLabelText("Phone")).toHaveValue(specialPhone);
      expect(screen.getByLabelText("Address")).toHaveValue(specialAddress);
      expect(screen.getByLabelText("LinkedIn Profile URL")).toHaveValue(specialUrl);
    });
  });

  describe("Input IDs", () => {
    it("has correct id attributes for inputs", () => {
      render(<BasicInfoSection {...defaultProps} />);

      expect(screen.getByLabelText("Name")).toHaveAttribute("id", "name");
      expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
      expect(screen.getByLabelText("Phone")).toHaveAttribute("id", "phone");
      expect(screen.getByLabelText("Address")).toHaveAttribute("id", "address");
      expect(screen.getByLabelText("LinkedIn Profile URL")).toHaveAttribute("id", "linkedin");
    });
  });
});
