import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockApi, useMockApi } from "../mock";
import { mockDb } from "../mock-db";

// Mock the mock-db module
vi.mock("../mock-db", () => ({
  mockDb: {
    getResumes: vi.fn(),
    getResume: vi.fn(),
    createResume: vi.fn(),
    updateResume: vi.fn(),
    deleteResume: vi.fn(),
  },
}));

describe("useMockApi", () => {
  it("returns true in development mode", () => {
    vi.stubEnv("MODE", "development");
    expect(useMockApi()).toBe(true);
    vi.unstubAllEnvs();
  });

  it("returns true when VITE_USE_MOCK_API is true", () => {
    vi.stubEnv("MODE", "production");
    vi.stubEnv("VITE_USE_MOCK_API", "true");
    expect(useMockApi()).toBe(true);
    vi.unstubAllEnvs();
  });

  it("returns false in production without flag", () => {
    vi.stubEnv("MODE", "production");
    vi.stubEnv("VITE_USE_MOCK_API", "false");
    expect(useMockApi()).toBe(false);
    vi.unstubAllEnvs();
  });
});

describe("mockApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("route", () => {
    it("routes to resumes handler", async () => {
      (mockDb.getResumes as any).mockResolvedValue([]);

      const result = await mockApi.route("/api/resumes", "GET");

      expect(result).toEqual([]);
      expect(mockDb.getResumes).toHaveBeenCalled();
    });

    it("routes to auth handler", async () => {
      const result = (await mockApi.route("/api/auth/login", "POST", {
        email: "demo@example.com",
        password: "demo123",
      })) as any;

      expect(result).toHaveProperty("user");
      expect(result.user).toHaveProperty("token");
    });

    it("throws error for unknown endpoint", async () => {
      await expect(mockApi.route("/api/unknown", "GET")).rejects.toThrow(
        "Mock API: Unknown endpoint /api/unknown"
      );
    });
  });

  describe("handleResumes", () => {
    describe("GET", () => {
      it("returns all resumes", async () => {
        const mockResumes = [
          { id: "1", title: "Resume 1" },
          { id: "2", title: "Resume 2" },
        ];
        vi.mocked(mockDb.getResumes).mockReturnValue(mockResumes as any);

        const result = await mockApi.handleResumes("GET");

        expect(result).toEqual(mockResumes);
        expect(mockDb.getResumes).toHaveBeenCalled();
      });

      it("returns single resume by ID", async () => {
        const mockResume = { id: "1", title: "Resume 1" };
        vi.mocked(mockDb.getResume).mockReturnValue(mockResume as any);

        const result = await mockApi.handleResumes("GET", "1");

        expect(result).toEqual(mockResume);
        expect(mockDb.getResume).toHaveBeenCalledWith("1");
      });

      it("throws 404 when resume not found", async () => {
        (mockDb.getResume as any).mockReturnValue(undefined);

        await expect(mockApi.handleResumes("GET", "999")).rejects.toEqual({
          status: 404,
          message: "Resume not found",
        });
      });
    });

    describe("POST", () => {
      it("creates new resume", async () => {
        const mockResume = { id: "3", title: "New Resume" };
        vi.mocked(mockDb.createResume).mockReturnValue(mockResume as any);

        const result = await mockApi.handleResumes("POST", undefined, {
          title: "New Resume",
        });

        expect(result).toEqual(mockResume);
        expect(mockDb.createResume).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: "user-1",
            title: "New Resume",
            content: expect.any(Object),
          })
        );
      });

      it("creates resume with custom content", async () => {
        const mockResume = { id: "3", title: "Custom Resume" };
        vi.mocked(mockDb.createResume).mockReturnValue(mockResume as any);

        const customContent = {
          personalInfo: {
            name: "John Doe",
            email: "john@example.com",
            phone: "",
            location: "",
            summary: "",
          },
        };

        await mockApi.handleResumes("POST", undefined, {
          title: "Custom Resume",
          content: customContent,
        });

        expect(mockDb.createResume).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Custom Resume",
            content: expect.objectContaining(customContent),
          })
        );
      });

      it("throws 400 when title is missing", async () => {
        await expect(mockApi.handleResumes("POST", undefined, {})).rejects.toEqual({
          status: 400,
          message: "Title is required",
        });
      });

      it("throws 400 when body is undefined", async () => {
        await expect(mockApi.handleResumes("POST", undefined, undefined)).rejects.toEqual({
          status: 400,
          message: "Title is required",
        });
      });

      it("throws 400 when title is empty", async () => {
        await expect(mockApi.handleResumes("POST", undefined, { title: "" })).rejects.toEqual({
          status: 400,
          message: "Title is required",
        });
      });
    });

    describe("PUT/PATCH", () => {
      it("updates resume with PUT", async () => {
        const mockResume = { id: "1", title: "Updated Resume" };
        vi.mocked(mockDb.updateResume).mockReturnValue(mockResume as any);

        const result = await mockApi.handleResumes("PUT", "1", {
          title: "Updated Resume",
        });

        expect(result).toEqual(mockResume);
        expect(mockDb.updateResume).toHaveBeenCalledWith("1", { title: "Updated Resume" });
      });

      it("updates resume with PATCH", async () => {
        const mockResume = { id: "1", title: "Patched Resume" };
        vi.mocked(mockDb.updateResume).mockReturnValue(mockResume as any);

        const result = await mockApi.handleResumes("PATCH", "1", {
          title: "Patched Resume",
        });

        expect(result).toEqual(mockResume);
        expect(mockDb.updateResume).toHaveBeenCalledWith("1", { title: "Patched Resume" });
      });

      it("throws 400 when ID is missing", async () => {
        await expect(mockApi.handleResumes("PUT", undefined, { title: "Test" })).rejects.toEqual({
          status: 400,
          message: "Resume ID is required",
        });
      });

      it("throws 404 when resume not found", async () => {
        (mockDb.updateResume as any).mockReturnValue(null);

        await expect(mockApi.handleResumes("PUT", "999", { title: "Test" })).rejects.toEqual({
          status: 404,
          message: "Resume not found",
        });
      });
    });

    describe("DELETE", () => {
      it("deletes resume", async () => {
        (mockDb.deleteResume as any).mockReturnValue(true);

        const result = await mockApi.handleResumes("DELETE", "1");

        expect(result).toEqual({ success: true });
        expect(mockDb.deleteResume).toHaveBeenCalledWith("1");
      });

      it("throws 400 when ID is missing", async () => {
        await expect(mockApi.handleResumes("DELETE", undefined)).rejects.toEqual({
          status: 400,
          message: "Resume ID is required",
        });
      });

      it("throws 404 when resume not found", async () => {
        (mockDb.deleteResume as any).mockReturnValue(false);

        await expect(mockApi.handleResumes("DELETE", "999")).rejects.toEqual({
          status: 404,
          message: "Resume not found",
        });
      });
    });

    describe("unsupported methods", () => {
      it("throws 405 for unsupported method", async () => {
        await expect(mockApi.handleResumes("OPTIONS", undefined)).rejects.toEqual({
          status: 405,
          message: "Method not allowed",
        });
      });
    });
  });

  describe("handleAuth", () => {
    describe("login", () => {
      it("successfully logs in with correct credentials", async () => {
        const result = await mockApi.handleAuth("/api/auth/login", "POST", {
          email: "demo@example.com",
          password: "demo123",
        });

        expect(result).toHaveProperty("user");
        expect(result.user.email).toBe("demo@example.com");
        expect(result.user.name).toBe("Demo User");
        expect(result.user.id).toBe("user-1");
        expect(result.user.token).toContain("mock-jwt-token");
      });

      it("throws 401 with incorrect credentials", async () => {
        await expect(
          mockApi.handleAuth("/api/auth/login", "POST", {
            email: "wrong@example.com",
            password: "wrong",
          })
        ).rejects.toEqual({
          status: 401,
          message: "Invalid email or password",
        });
      });

      it("throws 401 with correct email but wrong password", async () => {
        await expect(
          mockApi.handleAuth("/api/auth/login", "POST", {
            email: "demo@example.com",
            password: "wrongpassword",
          })
        ).rejects.toEqual({
          status: 401,
          message: "Invalid email or password",
        });
      });
    });

    describe("logout", () => {
      it("successfully logs out", async () => {
        const result = await mockApi.handleAuth("/api/auth/logout", "POST");

        expect(result).toHaveProperty("user");
        expect(result.user.id).toBe("");
        expect(result.user.email).toBe("");
        expect(result.user.name).toBe("");
        expect(result.user.token).toBe("");
      });
    });

    describe("me", () => {
      it("returns current user", async () => {
        const result = await mockApi.handleAuth("/api/auth/me", "GET");

        expect(result).toHaveProperty("user");
        expect(result.user.email).toBe("demo@example.com");
        expect(result.user.name).toBe("Demo User");
        expect(result.user.id).toBe("user-1");
        expect(result.user.token).toBe("mock-jwt-token");
      });
    });

    describe("unknown endpoints", () => {
      it("throws 404 for unknown auth endpoint", async () => {
        await expect(mockApi.handleAuth("/api/auth/unknown", "GET")).rejects.toEqual({
          status: 404,
          message: "Auth endpoint not found",
        });
      });
    });
  });
});
