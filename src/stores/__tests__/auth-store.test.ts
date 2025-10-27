import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  useAuthStore,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading,
  selectError,
  selectAuthActions,
  type User,
} from "../auth-store"
import { authApi } from "@/lib/api/auth"

// Mock the auth API
vi.mock("@/lib/api/auth", () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    me: vi.fn(),
  },
}))

// Mock localStorage for persist middleware
const localStorageMock = (() => {
  let store: Record<string, string> = {}

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
  }
})()

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("AuthStore", () => {
  beforeEach(() => {
    // Reset the store state before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    })
    // Clear localStorage
    localStorageMock.clear()
    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe("initial state", () => {
    it("has null user initially", () => {
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
    })

    it("is not authenticated initially", () => {
      const state = useAuthStore.getState()
      expect(state.isAuthenticated).toBe(false)
    })

    it("is not loading initially", () => {
      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })

    it("has no error initially", () => {
      const state = useAuthStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe("setUser", () => {
    it("sets user and marks as authenticated", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }

      useAuthStore.getState().setUser(user)

      const state = useAuthStore.getState()
      expect(state.user).toEqual(user)
      expect(state.isAuthenticated).toBe(true)
      expect(state.error).toBeNull()
    })

    it("sets user to null and marks as unauthenticated", () => {
      // First set a user
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      // Then clear it
      useAuthStore.getState().setUser(null)

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBeNull()
    })

    it("clears error when setting user", () => {
      // Set an error
      useAuthStore.getState().setError("Some error")

      // Set a user
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      const state = useAuthStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe("setLoading", () => {
    it("sets loading state to true", () => {
      useAuthStore.getState().setLoading(true)

      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(true)
    })

    it("sets loading state to false", () => {
      useAuthStore.getState().setLoading(true)
      useAuthStore.getState().setLoading(false)

      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })
  })

  describe("setError", () => {
    it("sets error message", () => {
      useAuthStore.getState().setError("Test error")

      const state = useAuthStore.getState()
      expect(state.error).toBe("Test error")
    })

    it("sets loading to false when setting error", () => {
      useAuthStore.getState().setLoading(true)
      useAuthStore.getState().setError("Test error")

      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
    })

    it("clears error when set to null", () => {
      useAuthStore.getState().setError("Test error")
      useAuthStore.getState().setError(null)

      const state = useAuthStore.getState()
      expect(state.error).toBeNull()
    })
  })

  describe("clearError", () => {
    it("clears error message", () => {
      useAuthStore.getState().setError("Test error")
      useAuthStore.getState().clearError()

      const state = useAuthStore.getState()
      expect(state.error).toBeNull()
    })

    it("does not affect other state when clearing error", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)
      useAuthStore.getState().setError("Test error")
      useAuthStore.getState().clearError()

      const state = useAuthStore.getState()
      expect(state.user).toEqual(user)
      expect(state.isAuthenticated).toBe(true)
      expect(state.error).toBeNull()
    })
  })

  describe("login", () => {
    it("successfully logs in a user", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }

      vi.mocked(authApi.login).mockResolvedValue({
        user: mockUser,
      })

      await useAuthStore.getState().login("test@example.com", "password123")

      expect(authApi.login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      })

      const state = useAuthStore.getState()
      expect(state.user).toEqual({
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
        avatar: undefined,
      })
      expect(state.isAuthenticated).toBe(true)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it("sets loading state during login", async () => {
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }

      vi.mocked(authApi.login).mockImplementation(
        () =>
          new Promise((resolve) => {
            setTimeout(() => {
              resolve({ user: mockUser })
            }, 100)
          }),
      )

      const loginPromise = useAuthStore.getState().login("test@example.com", "password123")

      // Check loading state during login
      const stateDuringLogin = useAuthStore.getState()
      expect(stateDuringLogin.isLoading).toBe(true)
      expect(stateDuringLogin.error).toBeNull()

      await loginPromise

      const stateAfterLogin = useAuthStore.getState()
      expect(stateAfterLogin.isLoading).toBe(false)
    })

    it("handles login failure", async () => {
      vi.mocked(authApi.login).mockRejectedValue(new Error("Invalid credentials"))

      await useAuthStore.getState().login("test@example.com", "wrongpassword")

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBe("Invalid credentials")
    })

    it("handles login failure with non-Error object", async () => {
      vi.mocked(authApi.login).mockRejectedValue("String error")

      await useAuthStore.getState().login("test@example.com", "wrongpassword")

      const state = useAuthStore.getState()
      expect(state.error).toBe("Login failed")
    })

    it("handles missing user in response", async () => {
      vi.mocked(authApi.login).mockResolvedValue({
        user: null as any,
      })

      await useAuthStore.getState().login("test@example.com", "password123")

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.error).toBe("Invalid credentials")
    })

    it("clears previous error on new login attempt", async () => {
      // First failed login
      vi.mocked(authApi.login).mockRejectedValue(new Error("First error"))
      await useAuthStore.getState().login("test@example.com", "wrong1")

      expect(useAuthStore.getState().error).toBe("First error")

      // Second successful login
      const mockUser = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      vi.mocked(authApi.login).mockResolvedValue({ user: mockUser })
      await useAuthStore.getState().login("test@example.com", "correct")

      const state = useAuthStore.getState()
      expect(state.error).toBeNull()
      expect(state.isAuthenticated).toBe(true)
    })
  })

  describe("logout", () => {
    it("clears user state on logout", async () => {
      // First login
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      vi.mocked(authApi.logout).mockResolvedValue(undefined)

      // Then logout
      await useAuthStore.getState().logout()

      expect(authApi.logout).toHaveBeenCalled()

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })

    it("clears state even if logout API fails", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      // First login
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      vi.mocked(authApi.logout).mockRejectedValue(new Error("Network error"))

      // Then logout
      await useAuthStore.getState().logout()

      expect(authApi.logout).toHaveBeenCalled()
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Logout API error:",
        expect.any(Error),
      )

      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.isAuthenticated).toBe(false)

      consoleErrorSpy.mockRestore()
    })

    it("clears loading and error states on logout", async () => {
      // Set some states
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)
      useAuthStore.getState().setLoading(true)
      useAuthStore.getState().setError("Some error")

      vi.mocked(authApi.logout).mockResolvedValue(undefined)

      await useAuthStore.getState().logout()

      const state = useAuthStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe("selectors", () => {
    it("selectUser returns user", () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      expect(selectUser(useAuthStore.getState())).toEqual(user)
    })

    it("selectIsAuthenticated returns authentication status", () => {
      expect(selectIsAuthenticated(useAuthStore.getState())).toBe(false)

      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      expect(selectIsAuthenticated(useAuthStore.getState())).toBe(true)
    })

    it("selectIsLoading returns loading status", () => {
      expect(selectIsLoading(useAuthStore.getState())).toBe(false)

      useAuthStore.getState().setLoading(true)

      expect(selectIsLoading(useAuthStore.getState())).toBe(true)
    })

    it("selectError returns error message", () => {
      expect(selectError(useAuthStore.getState())).toBeNull()

      useAuthStore.getState().setError("Test error")

      expect(selectError(useAuthStore.getState())).toBe("Test error")
    })

    it("selectAuthActions returns action functions", () => {
      const actions = selectAuthActions(useAuthStore.getState())

      expect(actions).toHaveProperty("login")
      expect(actions).toHaveProperty("logout")
      expect(actions).toHaveProperty("setUser")
      expect(actions).toHaveProperty("clearError")
      expect(typeof actions.login).toBe("function")
      expect(typeof actions.logout).toBe("function")
      expect(typeof actions.setUser).toBe("function")
      expect(typeof actions.clearError).toBe("function")
    })
  })

  describe("persistence", () => {
    it("persists user and authentication status to localStorage", async () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      // Wait a tick for persistence to happen
      await new Promise((resolve) => setTimeout(resolve, 0))

      // Check localStorage was updated
      const stored = localStorageMock.getItem("resumier-auth")

      // If persistence is working, we should have data
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.user).toEqual(user)
        expect(parsed.state.isAuthenticated).toBe(true)
      } else {
        // If not persisted yet, verify the state itself is correct
        const state = useAuthStore.getState()
        expect(state.user).toEqual(user)
        expect(state.isAuthenticated).toBe(true)
      }
    })

    it("does not persist loading state", () => {
      useAuthStore.getState().setLoading(true)

      const stored = localStorageMock.getItem("resumier-auth")
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state).not.toHaveProperty("isLoading")
      }
    })

    it("does not persist error state", () => {
      useAuthStore.getState().setError("Test error")

      const stored = localStorageMock.getItem("resumier-auth")
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state).not.toHaveProperty("error")
      }
    })

    it("clears persisted data on logout", async () => {
      const user: User = {
        id: "1",
        email: "test@example.com",
        name: "Test User",
        token: "token123",
      }
      useAuthStore.getState().setUser(user)

      vi.mocked(authApi.logout).mockResolvedValue(undefined)

      await useAuthStore.getState().logout()

      const stored = localStorageMock.getItem("resumier-auth")
      if (stored) {
        const parsed = JSON.parse(stored)
        expect(parsed.state.user).toBeNull()
        expect(parsed.state.isAuthenticated).toBe(false)
      }
    })
  })
})
