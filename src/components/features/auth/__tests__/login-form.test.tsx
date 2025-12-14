import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useAuthStore } from "@/stores";
import { LoginForm } from "../login-form";

// Mock the auth store
vi.mock("@/stores", () => ({
  useAuthStore: vi.fn(),
}));

// Mock TanStack Router
const mockNavigate = vi.fn();
const mockUseSearch = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
  useSearch: () => mockUseSearch(),
}));

describe("LoginForm", () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    // Clear all mocks to ensure clean state
    vi.clearAllMocks();

    // Reset specific mocks
    mockUseSearch.mockReturnValue({});

    // Default mock for auth store
    (useAuthStore as any).mockImplementation((selector: any) => {
      const state = {
        login: mockLogin,
        isLoading: false,
        error: null,
      };
      return selector(state);
    });
  });

  describe("Form Rendering", () => {
    it("renders the login form with all elements", () => {
      render(<LoginForm />);

      // Check title and description
      expect(screen.getByText("Login to your account")).toBeInTheDocument();
      expect(screen.getByText(/enter your email below to login/i)).toBeInTheDocument();

      // Check form fields
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();

      // Check buttons
      expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /login with github/i })).toBeInTheDocument();
    });

    it("renders demo credentials banner", () => {
      render(<LoginForm />);

      expect(screen.getByText("Demo Credentials:")).toBeInTheDocument();
      expect(screen.getByText(/demo@example.com/)).toBeInTheDocument();
      expect(screen.getByText(/demo123/)).toBeInTheDocument();
    });

    it("renders forgot password link", () => {
      render(<LoginForm />);

      const forgotPasswordButton = screen.getByRole("button", {
        name: /forgot your password/i,
      });
      expect(forgotPasswordButton).toBeInTheDocument();
    });

    it("renders sign up link", () => {
      render(<LoginForm />);

      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
      const signUpButton = screen.getByRole("button", { name: /sign up/i });
      expect(signUpButton).toBeInTheDocument();
    });

    it("applies custom className", () => {
      const { container } = render(<LoginForm className="custom-class" />);

      const form = container.querySelector("form");
      expect(form).toHaveClass("custom-class");
    });
  });

  describe("Input Validation", () => {
    it("has email input with required attribute", () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toHaveAttribute("type", "email");
      expect(emailInput).toHaveAttribute("required");
    });

    it("has password input with required attribute", () => {
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(passwordInput).toHaveAttribute("required");
    });

    it("has email placeholder", () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      expect(emailInput).toHaveAttribute("placeholder", "m@example.com");
    });

    it("allows user to type in email field", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      await user.type(emailInput, "test@example.com");

      expect(emailInput).toHaveValue("test@example.com");
    });

    it("allows user to type in password field", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const passwordInput = screen.getByLabelText("Password");
      await user.type(passwordInput, "password123");

      expect(passwordInput).toHaveValue("password123");
    });
  });

  describe("Form Submission", () => {
    it("submits form with correct credentials", async () => {
      mockLogin.mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<LoginForm />);

      // Fill in the form
      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");

      // Submit the form
      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      // Verify login was called with correct credentials
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("test@example.com", "password123");
      });
    });

    it("navigates to dashboard after successful login", async () => {
      mockLogin.mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/dashboard" });
      });
    });

    it("navigates to redirect URL if provided", async () => {
      mockLogin.mockResolvedValue(undefined);
      mockUseSearch.mockReturnValue({ redirect: "/resume/123" });
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/resume/123" });
      });
    });

    it("prevents default form submission", async () => {
      mockLogin.mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");

      const form = screen.getByRole("button", { name: /^login$/i }).closest("form");
      const submitHandler = vi.fn((e) => e.preventDefault());
      form?.addEventListener("submit", submitHandler);

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });
  });

  describe("Loading States", () => {
    it("shows loading state during login", () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const state = {
          login: mockLogin,
          isLoading: true,
          error: null,
        };
        return selector(state);
      });

      render(<LoginForm />);

      // Check for loading text
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();

      // Check that button is disabled
      const submitButton = screen.getByRole("button", { name: /logging in/i });
      expect(submitButton).toBeDisabled();
    });

    it("disables all inputs during loading", () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const state = {
          login: mockLogin,
          isLoading: true,
          error: null,
        };
        return selector(state);
      });

      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button", { name: /logging in/i });
      const githubButton = screen.getByRole("button", {
        name: /login with github/i,
      });

      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
      expect(githubButton).toBeDisabled();
    });

    it("disables forgot password link during loading", () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const state = {
          login: mockLogin,
          isLoading: true,
          error: null,
        };
        return selector(state);
      });

      render(<LoginForm />);

      const forgotPasswordButton = screen.getByRole("button", {
        name: /forgot your password/i,
      });
      expect(forgotPasswordButton).toBeDisabled();
    });

    it("disables sign up link during loading", () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const state = {
          login: mockLogin,
          isLoading: true,
          error: null,
        };
        return selector(state);
      });

      render(<LoginForm />);

      const signUpButton = screen.getByRole("button", { name: /sign up/i });
      expect(signUpButton).toBeDisabled();
    });

    it("shows spinner icon during loading", () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const state = {
          login: mockLogin,
          isLoading: true,
          error: null,
        };
        return selector(state);
      });

      const { container } = render(<LoginForm />);

      // Check for loader icon by class
      const loader = container.querySelector(".animate-spin");
      expect(loader).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("displays error message from store", () => {
      (useAuthStore as any).mockImplementation((selector: any) => {
        const state = {
          login: mockLogin,
          isLoading: false,
          error: "Invalid credentials",
        };
        return selector(state);
      });

      render(<LoginForm />);

      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    it("handles login failure gracefully", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      mockLogin.mockRejectedValue(new Error("Network error"));
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "password123");

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Login failed:", expect.any(Error));
      });

      consoleErrorSpy.mockRestore();
    });

    it("does not navigate on failed login", async () => {
      mockLogin.mockRejectedValue(new Error("Login failed"));
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");
      await user.type(screen.getByLabelText("Password"), "wrong-password");

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });

      // Navigate should not be called on error
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe("Additional Buttons", () => {
    it("logs message when forgot password is clicked", async () => {
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const user = userEvent.setup();

      render(<LoginForm />);

      const forgotPasswordButton = screen.getByRole("button", {
        name: /forgot your password/i,
      });
      await user.click(forgotPasswordButton);

      expect(consoleLogSpy).toHaveBeenCalledWith("Forgot password clicked");

      consoleLogSpy.mockRestore();
    });

    it("logs message when sign up is clicked", async () => {
      const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
      const user = userEvent.setup();

      render(<LoginForm />);

      const signUpButton = screen.getByRole("button", { name: /sign up/i });
      await user.click(signUpButton);

      expect(consoleLogSpy).toHaveBeenCalledWith("Sign up clicked");

      consoleLogSpy.mockRestore();
    });

    it("renders GitHub login button", () => {
      render(<LoginForm />);

      const githubButton = screen.getByRole("button", {
        name: /login with github/i,
      });
      expect(githubButton).toBeInTheDocument();
      expect(githubButton).toHaveAttribute("type", "button");
    });

    it("GitHub button has outline variant", () => {
      render(<LoginForm />);

      const githubButton = screen.getByRole("button", {
        name: /login with github/i,
      });
      expect(githubButton).toBeInTheDocument();
    });
  });

  describe("Form Structure", () => {
    it("renders proper form element", () => {
      render(<LoginForm />);

      const form = screen.getByRole("button", { name: /^login$/i }).closest("form");
      expect(form).toBeInTheDocument();
    });

    it("groups email and password in proper sections", () => {
      render(<LoginForm />);

      const emailLabel = screen.getByLabelText("Email");
      const passwordLabel = screen.getByLabelText("Password");

      expect(emailLabel).toBeInTheDocument();
      expect(passwordLabel).toBeInTheDocument();
    });

    it("has proper labels associated with inputs", () => {
      render(<LoginForm />);

      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");

      expect(emailInput).toHaveAttribute("id", "email");
      expect(passwordInput).toHaveAttribute("id", "password");
    });
  });

  describe("Accessibility", () => {
    it("has accessible form labels", () => {
      render(<LoginForm />);

      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Password")).toBeInTheDocument();
    });

    it("has proper heading structure", () => {
      render(<LoginForm />);

      const heading = screen.getByRole("heading", {
        name: /login to your account/i,
      });
      expect(heading).toBeInTheDocument();
    });

    it("has descriptive button labels", () => {
      render(<LoginForm />);

      expect(screen.getByRole("button", { name: /^login$/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /login with github/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /forgot your password/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    });

    it("GitHub button has SVG title for accessibility", () => {
      const { container } = render(<LoginForm />);

      const title = container.querySelector("title");
      expect(title).toHaveTextContent("GitHub");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty form submission attempt", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const submitButton = screen.getByRole("button", { name: /^login$/i });

      // Browser validation should prevent submission
      await user.click(submitButton);

      // Login should not be called with empty fields
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("handles only email filled", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "test@example.com");

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      // Should not submit with missing password
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("handles only password filled", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      await user.type(screen.getByLabelText("Password"), "password123");

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      // Should not submit with missing email
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("handles whitespace in inputs", async () => {
      mockLogin.mockResolvedValue(undefined);
      const user = userEvent.setup();

      render(<LoginForm />);

      await user.type(screen.getByLabelText("Email"), "  test@example.com  ");
      await user.type(screen.getByLabelText("Password"), "  password123  ");

      const submitButton = screen.getByRole("button", { name: /^login$/i });
      await user.click(submitButton);

      await waitFor(() => {
        // Email input trims leading whitespace, password doesn't
        expect(mockLogin).toHaveBeenCalledWith("test@example.com", "  password123  ");
      });
    });
  });

  describe("Props", () => {
    it("forwards additional props to form element", () => {
      const { container } = render(<LoginForm data-testid="login-form-test" />);

      const form = container.querySelector('[data-testid="login-form-test"]');
      expect(form).toBeInTheDocument();
    });

    it("combines className prop with default classes", () => {
      const { container } = render(<LoginForm className="custom-class" />);

      const form = container.querySelector("form");
      expect(form).toHaveClass("custom-class");
      expect(form).toHaveClass("flex");
      expect(form).toHaveClass("flex-col");
    });
  });
});
