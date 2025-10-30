import { mockDb } from "./mock-db";
import type { CreateResumeDto, Resume, UpdateResumeDto } from "./types";

/**
 * Check if we should use mock API
 */
export function useMockApi(): boolean {
  return import.meta.env.MODE === "development" || import.meta.env.VITE_USE_MOCK_API === "true";
}

/**
 * Simulate network delay
 */
async function delay(ms?: number) {
  const delayTime = ms ?? Math.random() * 500 + 200; // 200-700ms
  await new Promise((resolve) => setTimeout(resolve, delayTime));
}

/**
 * Mock API Router
 * Routes API calls to mock database
 */
export const mockApi = {
  /**
   * Route a request to the appropriate handler
   */
  async route(endpoint: string, method: string, body?: unknown): Promise<unknown> {
    await delay();

    // Parse endpoint
    const [, resource, id] = endpoint.match(/^\/api\/(\w+)(?:\/([^/]+))?/) || [];

    if (resource === "resumes") {
      return this.handleResumes(method, id, body);
    }

    if (resource === "auth") {
      return this.handleAuth(endpoint, method, body);
    }

    throw new Error(`Mock API: Unknown endpoint ${endpoint}`);
  },

  /**
   * Handle /api/resumes requests
   */
  async handleResumes(
    method: string,
    id?: string,
    body?: unknown
  ): Promise<Resume | Resume[] | { success: boolean }> {
    switch (method) {
      case "GET": {
        if (id) {
          // GET /api/resumes/:id
          const resume = mockDb.getResume(id);
          if (!resume) {
            throw {
              status: 404,
              message: "Resume not found",
            };
          }
          return resume;
        }
        // GET /api/resumes
        return mockDb.getResumes();
      }

      case "POST": {
        // POST /api/resumes
        const createData = body as CreateResumeDto;
        if (!createData || !createData.title) {
          throw {
            status: 400,
            message: "Title is required",
          };
        }

        const defaultContent = {
          personalInfo: {
            name: "",
            email: "",
            phone: "",
            location: "",
            summary: "",
          },
          experience: [],
          education: [],
          skills: {
            technical: [],
            languages: [],
            tools: [],
            soft: [],
          },
          certifications: [],
          links: [],
        };

        const newResume = mockDb.createResume({
          userId: "user-1", // Mock user ID
          title: createData.title,
          content: createData.content
            ? { ...defaultContent, ...createData.content }
            : defaultContent,
        });

        return newResume;
      }

      case "PUT":
      case "PATCH": {
        // PUT/PATCH /api/resumes/:id
        if (!id) {
          throw {
            status: 400,
            message: "Resume ID is required",
          };
        }

        const updateData = body as UpdateResumeDto;
        // Cast to appropriate type for mockDb
        const updated = mockDb.updateResume(
          id,
          updateData as Partial<Omit<Resume, "id" | "createdAt">>
        );

        if (!updated) {
          throw {
            status: 404,
            message: "Resume not found",
          };
        }

        return updated;
      }

      case "DELETE": {
        // DELETE /api/resumes/:id
        if (!id) {
          throw {
            status: 400,
            message: "Resume ID is required",
          };
        }

        const deleted = mockDb.deleteResume(id);
        if (!deleted) {
          throw {
            status: 404,
            message: "Resume not found",
          };
        }

        return { success: true };
      }

      default:
        throw {
          status: 405,
          message: "Method not allowed",
        };
    }
  },

  /**
   * Handle /api/auth requests
   */
  async handleAuth(
    endpoint: string,
    method: string,
    body?: unknown
  ): Promise<{ user: { id: string; email: string; name: string; token: string } }> {
    if (endpoint === "/api/auth/login" && method === "POST") {
      const { email, password } = body as { email: string; password: string };

      // Simulate authentication (mock credentials)
      if (email === "demo@example.com" && password === "demo123") {
        await delay(800); // Simulate auth check delay
        return {
          user: {
            id: "user-1",
            email: "demo@example.com",
            name: "Demo User",
            token: `mock-jwt-token-${Date.now()}`,
          },
        };
      }

      // Invalid credentials
      throw {
        status: 401,
        message: "Invalid email or password",
      };
    }

    if (endpoint === "/api/auth/logout" && method === "POST") {
      await delay(200);
      return { user: { id: "", email: "", name: "", token: "" } }; // Return empty user on logout
    }

    if (endpoint === "/api/auth/me" && method === "GET") {
      // Check if token exists (would normally validate on server)
      await delay(300);
      return {
        user: {
          id: "user-1",
          email: "demo@example.com",
          name: "Demo User",
          token: "mock-jwt-token",
        },
      };
    }

    throw {
      status: 404,
      message: "Auth endpoint not found",
    };
  },
};
