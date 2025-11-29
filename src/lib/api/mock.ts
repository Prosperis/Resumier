import { get, set } from "idb-keyval";
import { mockDb } from "./mock-db";
import type { CreateResumeDto, Resume, UpdateResumeDto } from "./types";

const IDB_STORE_KEY = "resumier-web-store";

/**
 * Check if we should use mock API
 * Returns true in development, when VITE_USE_MOCK_API is set,
 * or when in guest/demo mode (since there's no real backend)
 */
export function useMockApi(): boolean {
  // Always use mock API in development
  if (import.meta.env.MODE === "development") {
    return true;
  }

  // Use mock API if explicitly enabled
  if (import.meta.env.VITE_USE_MOCK_API === "true") {
    return true;
  }

  // Use mock API in guest/demo mode (check localStorage for auth state)
  try {
    const authData = localStorage.getItem("resumier-auth");
    if (authData) {
      const auth = JSON.parse(authData);
      if (auth?.state?.isGuest || auth?.state?.isDemo) {
        return true;
      }
    }
  } catch {
    // Ignore errors
  }

  return false;
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
  async route(
    endpoint: string,
    method: string,
    body?: unknown,
  ): Promise<unknown> {
    await delay();

    // Parse endpoint
    const [, resource, id] =
      endpoint.match(/^\/api\/(\w+)(?:\/([^/]+))?/) || [];

    if (resource === "resumes") {
      return this.handleResumes(method, id, body);
    }

    if (resource === "auth") {
      return this.handleAuth(endpoint, method, body);
    }

    if (resource === "linkedin") {
      return this.handleLinkedIn(endpoint, method, body);
    }

    throw new Error(`Mock API: Unknown endpoint ${endpoint}`);
  },

  /**
   * Handle /api/resumes requests
   * Checks IndexedDB first for guest/demo mode data, falls back to in-memory mockDb
   */
  async handleResumes(
    method: string,
    id?: string,
    body?: unknown,
  ): Promise<Resume | Resume[] | { success: boolean }> {
    // Helper to get resumes from IndexedDB
    const getResumesFromIDB = async (): Promise<Resume[] | null> => {
      try {
        const idbData = await get(IDB_STORE_KEY);
        if (idbData && typeof idbData === "object" && "resumes" in idbData) {
          const resumes = (idbData as { resumes: Resume[] }).resumes;
          if (resumes && resumes.length > 0) {
            return resumes;
          }
        }
      } catch (error) {
        console.warn("Failed to read from IndexedDB:", error);
      }
      return null;
    };

    // Helper to save resumes to IndexedDB
    const saveResumesToIDB = async (resumes: Resume[]): Promise<void> => {
      try {
        await set(IDB_STORE_KEY, { resumes });
      } catch (error) {
        console.warn("Failed to save to IndexedDB:", error);
      }
    };

    switch (method) {
      case "GET": {
        // Try IndexedDB first
        const idbResumes = await getResumesFromIDB();
        
        if (id) {
          // GET /api/resumes/:id
          if (idbResumes) {
            const resume = idbResumes.find((r) => r.id === id);
            if (resume) {
              return resume;
            }
          }
          
          // Fall back to mockDb
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
        if (idbResumes) {
          return idbResumes;
        }
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
            firstName: "",
            lastName: "",
            nameOrder: "firstLast" as const,
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

        const now = new Date().toISOString();
        const newResume: Resume = {
          id: crypto.randomUUID(),
          userId: "user-1",
          title: createData.title,
          content: createData.content
            ? { ...defaultContent, ...createData.content }
            : defaultContent,
          createdAt: now,
          updatedAt: now,
        };

        // Try to save to IndexedDB first
        const existingResumes = await getResumesFromIDB();
        if (existingResumes !== null) {
          await saveResumesToIDB([...existingResumes, newResume]);
        } else {
          // Fall back to mockDb
          mockDb.createResume({
            userId: "user-1",
            title: createData.title,
            content: createData.content
              ? { ...defaultContent, ...createData.content }
              : defaultContent,
          });
        }

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
        
        // Try IndexedDB first
        const idbResumes = await getResumesFromIDB();
        if (idbResumes) {
          const resumeIndex = idbResumes.findIndex((r) => r.id === id);
          if (resumeIndex !== -1) {
            const existingResume = idbResumes[resumeIndex];
            const updated: Resume = {
              ...existingResume,
              ...updateData,
              content: updateData.content
                ? { ...existingResume.content, ...updateData.content }
                : existingResume.content,
              updatedAt: new Date().toISOString(),
            };
            const updatedResumes = [...idbResumes];
            updatedResumes[resumeIndex] = updated;
            await saveResumesToIDB(updatedResumes);
            return updated;
          }
        }

        // Fall back to mockDb
        const updated = mockDb.updateResume(
          id,
          updateData as Partial<Omit<Resume, "id" | "createdAt">>,
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

        // Try IndexedDB first
        const idbResumes = await getResumesFromIDB();
        if (idbResumes) {
          const filtered = idbResumes.filter((r) => r.id !== id);
          if (filtered.length < idbResumes.length) {
            await saveResumesToIDB(filtered);
            return { success: true };
          }
        }

        // Fall back to mockDb
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
    body?: unknown,
  ): Promise<unknown> {
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

    if (endpoint === "/api/auth/linkedin/token" && method === "POST") {
      // Handle LinkedIn token exchange
      const { code } = body as { code: string };

      if (!code) {
        throw {
          status: 400,
          message: "No authorization code provided",
        };
      }

      await delay(300); // Simulate server-side token exchange

      // Return a mock access token
      // In production, this would make a real request to LinkedIn's token endpoint
      return {
        access_token: `linkedin-mock-token-${Date.now()}`,
        expires_in: 5184000, // 60 days
        token_type: "Bearer",
      };
    }

    throw {
      status: 404,
      message: "Auth endpoint not found",
    };
  },

  /**
   * Handle /api/linkedin requests
   */
  async handleLinkedIn(
    endpoint: string,
    method: string,
    body?: unknown,
  ): Promise<unknown> {
    if (endpoint === "/api/linkedin/import" && method === "POST") {
      // Handle LinkedIn public profile import from URL
      const { profileUrl } = body as { profileUrl: string };

      if (!profileUrl) {
        throw {
          status: 400,
          message: "No profile URL provided",
        };
      }

      if (!profileUrl.includes("linkedin.com")) {
        throw {
          status: 400,
          message: "Invalid LinkedIn URL format",
        };
      }

      await delay(500); // Simulate web scraping/parsing

      // Generate unique IDs using timestamp + counter to avoid duplicate key errors
      const timestamp = Date.now();
      let counter = 0;
      const generateId = (prefix: string) =>
        `${prefix}-${timestamp}-${counter++}`;

      // Return mock public LinkedIn profile data
      return {
        personalInfo: {
          firstName: "John",
          lastName: "Doe",
          nameOrder: "firstLast" as const,
          email: "john.doe@linkedin.com",
          phone: "+1 (555) 123-4567",
          location: "San Francisco, CA",
          summary:
            "Senior Software Engineer with 10+ years of experience building scalable web applications. Passionate about open source and mentoring junior developers.",
        },
        experience: [
          {
            id: generateId("exp"),
            company: "Tech Company Inc.",
            position: "Senior Software Engineer",
            startDate: "2020-01",
            endDate: "",
            current: true,
            description:
              "Led development of core platform features and mentored a team of 5 engineers",
            highlights: [
              "Increased system performance by 40%",
              "Implemented CI/CD pipeline reducing deployment time by 60%",
              "Mentored 5 junior developers",
            ],
          },
          {
            id: generateId("exp-prev"),
            company: "StartUp Corp",
            position: "Full Stack Developer",
            startDate: "2017-06",
            endDate: "2019-12",
            current: false,
            description:
              "Built and maintained multiple web applications using React and Node.js",
            highlights: [
              "Built 3 customer-facing web applications",
              "Implemented real-time features using WebSockets",
            ],
          },
        ],
        education: [
          {
            id: generateId("edu"),
            institution: "University of California",
            degree: "Bachelor of Science",
            field: "Computer Science",
            startDate: "2013-09",
            endDate: "2017-05",
            gpa: "3.8",
          },
        ],
        skills: {
          technical: [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Python",
            "SQL",
          ],
          languages: ["English", "Spanish"],
          tools: ["Git", "Docker", "AWS", "Figma"],
          soft: [
            "Leadership",
            "Communication",
            "Problem Solving",
            "Team Collaboration",
          ],
        },
        certifications: [
          {
            id: generateId("cert"),
            name: "AWS Solutions Architect Associate",
            issuer: "Amazon Web Services",
            date: "2021-06",
          },
        ],
        links: [
          {
            id: generateId("link"),
            label: "LinkedIn",
            url: "https://www.linkedin.com/in/johndoe",
            type: "linkedin" as const,
          },
          {
            id: generateId("link-gh"),
            label: "GitHub",
            url: "https://github.com/johndoe",
            type: "github" as const,
          },
          {
            id: generateId("link-portfolio"),
            label: "Portfolio",
            url: "https://johndoe.dev",
            type: "website" as const,
          },
        ],
      };
    }

    throw {
      status: 404,
      message: "LinkedIn endpoint not found",
    };
  },
};
