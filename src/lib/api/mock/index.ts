/**
 * Mock API Entry Point
 * Routes mock API requests to appropriate handlers
 */

import type { CreateResumeDto, UpdateResumeDto } from "../types";
import { mockResumeApi } from "./resumes";

/**
 * Mock API Router
 * Simulates API routing by parsing endpoint paths
 */
export const mockApi = {
  /**
   * Route API request to appropriate handler
   */
  async route(endpoint: string, method: string, body?: unknown): Promise<unknown> {
    // Remove leading/trailing slashes
    const path = endpoint.replace(/^\/|\/$/g, "");
    const segments = path.split("/");

    // Parse route
    // Routes:
    // GET    /api/resumes        -> getAll
    // GET    /api/resumes/:id    -> getById
    // POST   /api/resumes        -> create
    // PUT    /api/resumes/:id    -> update
    // DELETE /api/resumes/:id    -> delete

    if (segments[0] === "api" && segments[1] === "resumes") {
      const resumeId = segments[2];

      switch (method) {
        case "GET":
          if (resumeId) {
            return mockResumeApi.getById(resumeId);
          }
          return mockResumeApi.getAll();

        case "POST":
          return mockResumeApi.create(body as CreateResumeDto);

        case "PUT":
        case "PATCH":
          if (!resumeId) {
            throw new Error("Resume ID is required for update");
          }
          return mockResumeApi.update(resumeId, body as UpdateResumeDto);

        case "DELETE":
          if (!resumeId) {
            throw new Error("Resume ID is required for delete");
          }
          return mockResumeApi.delete(resumeId);

        default:
          throw new Error(`Method ${method} not supported`);
      }
    }

    throw new Error(`Unknown endpoint: ${endpoint}`);
  },
};

/**
 * Check if we should use mock API
 * Uses mock API in development or when VITE_USE_MOCK_API is true
 */
export function useMockApi(): boolean {
  return import.meta.env.DEV || import.meta.env.VITE_USE_MOCK_API === "true";
}
