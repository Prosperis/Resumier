import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { authApi } from "@/lib/api/auth";
import {
  selectAuthActions,
  selectError,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
  type User,
  useAuthStore,
} from "../auth-store";

// Mock auth API
vi.mock("@/lib/api/auth", () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

/**
 * Tests for Auth Store
 * Tests authentication state management, login/logout, and persistence
 */
describe("AuthStore", () => {
  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks();

    // Reset store state
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    // Clear localStorage
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("has correct initial state", () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe("Selectors", () => {
    it("selectUser returns the user", () => {
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };
      useAuthStore.setState({ user: mockUser });

      const { result } = renderHook(() => useAuthStore(selectUser));
      expect(result.current).toEqual(mockUser);
    });

    it("selectIsAuthenticated returns authentication status", () => {
      useAuthStore.setState({ isAuthenticated: true });

      const { result } = renderHook(() => useAuthStore(selectIsAuthenticated));
      expect(result.current).toBe(true);
    });

    it("selectIsLoading returns loading status", () => {
      useAuthStore.setState({ isLoading: true });

      const { result } = renderHook(() => useAuthStore(selectIsLoading));
      expect(result.current).toBe(true);
    });

    it("selectError returns error message", () => {
      useAuthStore.setState({ error: "Test error" });

      const { result } = renderHook(() => useAuthStore(selectError));
      expect(result.current).toBe("Test error");
    });

    it("selectAuthActions returns all action methods", () => {
      const { result } = renderHook(() => useAuthStore(selectAuthActions));

      expect(result.current).toHaveProperty("login");
      expect(result.current).toHaveProperty("logout");
      expect(result.current).toHaveProperty("setUser");
      expect(result.current).toHaveProperty("clearError");
      expect(typeof result.current.login).toBe("function");
      expect(typeof result.current.logout).toBe("function");
    });
  });

  describe("setUser", () => {
    it("sets user and marks as authenticated", () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("clears user and marks as not authenticated when null", () => {
      const { result } = renderHook(() => useAuthStore());

      // First set a user
      act(() => {
        result.current.setUser({
          id: "1",
          email: "test@example.com",
          name: "Test User",
        });
      });

      // Then clear it
      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("clears error when setting user", () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error first
      act(() => {
        result.current.setError("Previous error");
      });

      // Set user should clear error
      act(() => {
        result.current.setUser({
          id: "1",
          email: "test@example.com",
          name: "Test User",
        });
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("setLoading", () => {
    it("sets loading state to true", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });

    it("sets loading state to false", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe("setError", () => {
    it("sets error message and stops loading", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError("Test error message");
      });

      expect(result.current.error).toBe("Test error message");
      expect(result.current.isLoading).toBe(false);
    });

    it("clears error when set to null", () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error first
      act(() => {
        result.current.setError("Error");
      });

      // Clear it
      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("clearError", () => {
    it("clears error message", () => {
      const { result } = renderHook(() => useAuthStore());

      // Set error first
      act(() => {
        result.current.setError("Test error");
      });

      // Clear it
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe("login", () => {
    it("successfully logs in user", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "mock-token",
      };
      vi.mocked(authApi.login).mockResolvedValue({ user: mockUser });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login("test@example.com", "password");
      });

      expect(authApi.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("sets loading state during login", async () => {
      (authApi.login as any).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  user: {
                    id: "1",
                    email: "test@example.com",
                    name: "Test",
                    token: "token",
                  },
                }),
              100,
            ),
          ),
      );

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.login("test@example.com", "password");
      });

      // Should be loading immediately
      expect(result.current.isLoading).toBe(true);
      expect(result.current.error).toBeNull();
    });

    it("handles login failure with error message", async () => {
      (authApi.login as any).mockRejectedValue(
        new Error("Invalid credentials"),
      );

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login("test@example.com", "wrong-password");
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe("Invalid credentials");
    });

    it("handles login failure when response has no user", async () => {
      (authApi.login as any).mockResolvedValue({ user: null } as any);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login("test@example.com", "password");
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toBe("Invalid credentials");
    });

    it("handles generic errors during login", async () => {
      (authApi.login as any).mockRejectedValue("Generic error");

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login("test@example.com", "password");
      });

      expect(result.current.error).toBe("Login failed");
    });
  });

  describe("logout", () => {
    it("successfully logs out and clears state", async () => {
      (authApi.logout as any).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      // Set authenticated user first
      act(() => {
        result.current.setUser({
          id: "1",
          email: "test@example.com",
          name: "Test User",
          token: "token",
        });
      });

      // Logout
      await act(async () => {
        await result.current.logout();
      });

      expect(authApi.logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it("clears state even if logout API fails", async () => {
      (authApi.logout as any).mockRejectedValue(new Error("API error"));
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      const { result } = renderHook(() => useAuthStore());

      // Set authenticated user first
      act(() => {
        result.current.setUser({
          id: "1",
          email: "test@example.com",
          name: "Test User",
          token: "token",
        });
      });

      // Logout should still clear local state
      await act(async () => {
        await result.current.logout();
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        "Logout API error:",
        expect.any(Error),
      );
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe("Persistence", () => {
    it("persists user and isAuthenticated to localStorage", () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      // Check localStorage
      const stored = localStorage.getItem("resumier-auth");
      expect(stored).toBeTruthy();

      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.user).toEqual(mockUser);
        expect(parsed.state.isAuthenticated).toBe(true);
        // Should NOT persist loading and error
        expect(parsed.state.isLoading).toBeUndefined();
        expect(parsed.state.error).toBeUndefined();
      }
    });

    it("does not persist loading and error states", () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
        result.current.setError("Test error");
      });

      const stored = localStorage.getItem("resumier-auth");
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.state.isLoading).toBeUndefined();
        expect(parsed.state.error).toBeUndefined();
      }
    });
  });
});
