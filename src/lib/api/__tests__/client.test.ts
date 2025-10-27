import { beforeEach, describe, expect, it, vi } from "vitest"
import { ApiClient } from "../client"
import { ApiError, NetworkError, NotFoundError, ServerError, UnauthorizedError } from "../errors"
import { mockApi, useMockApi } from "../mock"

// Mock dependencies
vi.mock("../mock", () => ({
  useMockApi: vi.fn(),
  mockApi: {
    route: vi.fn(),
  },
}))

vi.mock("../errors", async () => {
  const actual = await vi.importActual<typeof import("../errors")>("../errors")
  return {
    ...actual,
    parseErrorResponse: vi.fn((status: number, data: unknown) => {
      // Call the real implementation
      actual.parseErrorResponse(status, data)
    }),
  }
})

/**
 * Tests for API Client
 * Tests HTTP methods, error handling, auth token injection, and mock API routing
 */
describe("ApiClient", () => {
  let client: ApiClient
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock fetch
    mockFetch = vi.fn()
    global.fetch = mockFetch(
      // Default to real API (not mock)
      useMockApi as any,
    ).mockReturnValue(false)

    // Create client instance
    client = new ApiClient({
      baseUrl: "https://api.example.com",
      getAuthToken: () => "test-token",
    })
  })

  describe("Constructor", () => {
    it("initializes with baseUrl", () => {
      const testClient = new ApiClient({
        baseUrl: "https://test.api.com",
      })
      expect(testClient).toBeDefined()
    })

    it("uses provided getAuthToken function", () => {
      const getToken = vi.fn(() => "custom-token")
      const testClient = new ApiClient({
        baseUrl: "https://api.com",
        getAuthToken: getToken,
      })
      expect(testClient).toBeDefined()
    })

    it("defaults to no auth token if getAuthToken not provided", async () => {
      const testClient = new ApiClient({
        baseUrl: "https://api.com",
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ data: "test" }),
      })

      await testClient.get("/test")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.com/test",
        expect.objectContaining({
          headers: expect.not.objectContaining({
            Authorization: expect.anything(),
          }),
        }),
      )
    })
  })

  describe("GET requests", () => {
    it("makes GET request to correct endpoint", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ id: 1, name: "Test" }),
      })

      const result = await client.get<{ id: number; name: string }>("/users/1")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "GET",
        }),
      )
      expect(result).toEqual({ id: 1, name: "Test" })
    })

    it("includes auth token in headers", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      })

      await client.get("/protected")

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer test-token",
          }),
        }),
      )
    })

    it("sets Content-Type header", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      })

      await client.get("/data")

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      )
    })

    it("allows custom headers", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      })

      await client.get("/data", {
        headers: { "X-Custom-Header": "custom-value" },
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "X-Custom-Header": "custom-value",
          }),
        }),
      )
    })
  })

  describe("POST requests", () => {
    it("makes POST request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 201,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ id: 2, name: "Created" }),
      })

      const body = { name: "New User", email: "test@example.com" }
      const result = await client.post("/users", body)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(body),
        }),
      )
      expect(result).toEqual({ id: 2, name: "Created" })
    })

    it("handles POST without body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true }),
      })

      await client.post("/action")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/action",
        expect.objectContaining({
          method: "POST",
          body: undefined,
        }),
      )
    })
  })

  describe("PUT requests", () => {
    it("makes PUT request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ id: 1, name: "Updated" }),
      })

      const body = { name: "Updated User" }
      const result = await client.put("/users/1", body)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(body),
        }),
      )
      expect(result).toEqual({ id: 1, name: "Updated" })
    })
  })

  describe("PATCH requests", () => {
    it("makes PATCH request with body", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ id: 1, email: "newemail@example.com" }),
      })

      const body = { email: "newemail@example.com" }
      const result = await client.patch("/users/1", body)

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(body),
        }),
      )
      expect(result).toEqual({ id: 1, email: "newemail@example.com" })
    })
  })

  describe("DELETE requests", () => {
    it("makes DELETE request", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
      })

      const result = await client.delete("/users/1")

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.example.com/users/1",
        expect.objectContaining({
          method: "DELETE",
        }),
      )
      expect(result).toBeUndefined()
    })

    it("handles DELETE with JSON response", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true }),
      })

      const result = await client.delete("/users/1")

      expect(result).toEqual({ success: true })
    })
  })

  describe("Response Handling", () => {
    it("returns undefined for 204 No Content", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 204,
      })

      const result = await client.get("/no-content")

      expect(result).toBeUndefined()
    })

    it("parses JSON response", async () => {
      const jsonData = { items: [1, 2, 3], total: 3 }
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => jsonData,
      })

      const result = await client.get("/items")

      expect(result).toEqual(jsonData)
    })

    it("returns text for non-JSON responses", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "text/plain" }),
        text: async () => "Plain text response",
      })

      const result = await client.get("/text")

      expect(result).toBe("Plain text response")
    })

    it("handles response with charset in content-type", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json; charset=utf-8" }),
        json: async () => ({ data: "test" }),
      })

      const result = await client.get("/data")

      expect(result).toEqual({ data: "test" })
    })
  })

  describe("Error Handling", () => {
    it("throws error for 404 Not Found", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
        json: async () => ({ message: "Resource not found" }),
      })

      await expect(client.get("/missing")).rejects.toThrow(NotFoundError)
    })

    it("throws error for 401 Unauthorized", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        json: async () => ({ message: "Authentication required" }),
      })

      await expect(client.get("/protected")).rejects.toThrow(UnauthorizedError)
    })

    it("throws error for 500 Server Error", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({ message: "Server error" }),
      })

      await expect(client.get("/error")).rejects.toThrow(ServerError)
    })

    it("handles error response without JSON body", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => {
          throw new Error("Invalid JSON")
        },
      })

      await expect(client.get("/bad")).rejects.toThrow(ApiError)
    })

    it("throws NetworkError for network failures", async () => {
      mockFetch.mockRejectedValue(new TypeError("Failed to fetch"))

      await expect(client.get("/network-error")).rejects.toThrow(NetworkError)
      await expect(client.get("/network-error")).rejects.toThrow(
        "Network request failed. Please check your connection.",
      )
    })

    it("re-throws non-TypeError errors", async () => {
      const customError = new Error("Custom error")
      mockFetch.mockRejectedValue(customError)

      await expect(client.get("/custom-error")).rejects.toThrow(customError)
    })
  })

  describe("Mock API Integration", () => {
    beforeEach(() => {
      // Enable mock API
      ;(useMockApi as any).mockReturnValue(true)
    })

    it("routes to mock API when enabled", async () => {
      ;(mockApi.route as any).mockResolvedValue({ id: 1, name: "Mock Data" })

      const result = await client.get("/users/1")

      expect(mockApi.route).toHaveBeenCalledWith("/users/1", "GET", undefined)
      expect(mockFetch).not.toHaveBeenCalled()
      expect(result).toEqual({ id: 1, name: "Mock Data" })
    })

    it("passes body to mock API for POST", async () => {
      ;(mockApi.route as any).mockResolvedValue({ id: 2, name: "Created" })

      const body = { name: "New User" }
      await client.post("/users", body)

      expect(mockApi.route).toHaveBeenCalledWith("/users", "POST", body)
    })

    it("uses GET method by default for mock API", async () => {
      ;(mockApi.route as any).mockResolvedValue([])

      await client.get("/items")

      expect(mockApi.route).toHaveBeenCalledWith("/items", "GET", undefined)
    })

    it("respects method for all HTTP verbs in mock mode", async () => {
      ;(mockApi.route as any).mockResolvedValue({})

      await client.put("/users/1", { name: "Updated" })
      expect(mockApi.route).toHaveBeenCalledWith("/users/1", "PUT", { name: "Updated" })

      await client.patch("/users/1", { email: "new@example.com" })
      expect(mockApi.route).toHaveBeenCalledWith("/users/1", "PATCH", {
        email: "new@example.com",
      })

      await client.delete("/users/1")
      expect(mockApi.route).toHaveBeenCalledWith("/users/1", "DELETE", undefined)
    })
  })

  describe("Request Configuration", () => {
    it("merges custom request options", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      })

      await client.get("/data", {
        signal: new AbortController().signal,
        cache: "no-cache",
      })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
          cache: "no-cache",
        }),
      )
    })

    it("allows overriding default headers", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      })

      await client.post(
        "/data",
        { test: "data" },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Custom": "value",
          },
        },
      )

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Custom": "value",
          }),
        }),
      )
    })
  })

  describe("Auth Token", () => {
    it("omits Authorization header when token is null", async () => {
      const clientNoAuth = new ApiClient({
        baseUrl: "https://api.com",
        getAuthToken: () => null,
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      })

      await clientNoAuth.get("/public")

      const callArgs = mockFetch.mock.calls[0][1] as RequestInit
      expect(callArgs.headers).not.toHaveProperty("Authorization")
    })

    it("calls getAuthToken function for each request", async () => {
      const getToken = vi.fn(() => "dynamic-token")
      const dynamicClient = new ApiClient({
        baseUrl: "https://api.com",
        getAuthToken: getToken,
      })

      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({}),
      })

      await dynamicClient.get("/test1")
      await dynamicClient.get("/test2")

      expect(getToken).toHaveBeenCalledTimes(2)
    })
  })
})
