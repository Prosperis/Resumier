import * as Sentry from "@sentry/react";
import { NetworkError, parseErrorResponse } from "./errors";
import { mockApi, useMockApi } from "./mock";

/**
 * API Client Configuration
 */
interface ApiClientConfig {
  baseUrl: string;
  getAuthToken?: () => string | null;
}

/**
 * API Request Options
 */
interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * API Client
 * Handles HTTP requests with automatic error handling and auth token injection
 */
export class ApiClient {
  private baseUrl: string;
  private getAuthToken: () => string | null;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.getAuthToken = config.getAuthToken || (() => null);
  }

  /**
   * Make an HTTP request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
  ): Promise<T> {
    // Use mock API in development
    if (useMockApi()) {
      const result = await mockApi.route(
        endpoint,
        options.method || "GET",
        options.body,
      );
      return result as T;
    }

    // Real API request
    const url = `${this.baseUrl}${endpoint}`;

    // Build headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // Add auth token if available
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Build request init
    const init: RequestInit = {
      ...options,
      headers,
    };

    // Stringify body if present
    if (options.body !== undefined) {
      init.body = JSON.stringify(options.body);
    }

    try {
      // Make request
      const response = await fetch(url, init);

      // Handle non-2xx responses
      if (!response.ok) {
        let errorData: unknown;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: response.statusText };
        }

        // Track API errors in Sentry
        Sentry.captureMessage(`API Error: ${endpoint}`, {
          level: response.status >= 500 ? "error" : "warning",
          tags: {
            type: "api_error",
            status: response.status.toString(),
            endpoint,
            method: options.method || "GET",
          },
          extra: {
            url,
            status: response.status,
            statusText: response.statusText,
            errorData,
          },
        });

        parseErrorResponse(response.status, errorData);
      }

      // Parse response
      // Handle 204 No Content
      if (response.status === 204) {
        return undefined as T;
      }

      // Try to parse JSON
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        return await response.json();
      }

      // Return response as-is for non-JSON responses
      return (await response.text()) as T;
    } catch (error) {
      // Handle network errors
      if (error instanceof TypeError) {
        throw new NetworkError(
          "Network request failed. Please check your connection.",
        );
      }

      // Re-throw API errors
      throw error;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

/**
 * Default API client instance
 * Uses environment variable or defaults to /api
 */
export const apiClient = new ApiClient({
  baseUrl: import.meta.env.VITE_API_URL || "/api",
  getAuthToken: () => {
    // Get token from localStorage (where auth store persists it)
    try {
      const authState = localStorage.getItem("auth-storage");
      if (authState) {
        const parsed = JSON.parse(authState);
        return parsed?.state?.user?.token || null;
      }
    } catch {
      // Ignore errors
    }
    return null;
  },
});
