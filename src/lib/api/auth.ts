import { apiClient } from "./client";

/**
 * Auth API Types
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

export interface AuthResponse {
  user: User;
}

/**
 * Auth API Client
 * Handles authentication-related API calls
 */
export const authApi = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/login", credentials);
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiClient.post("/api/auth/logout");
  },

  /**
   * Get current user
   */
  async me(): Promise<AuthResponse> {
    return apiClient.get<AuthResponse>("/api/auth/me");
  },

  /**
   * Register new user (TODO: implement when needed)
   */
  async register(data: { email: string; password: string; name: string }): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>("/api/auth/register", data);
  },

  /**
   * Request password reset (TODO: implement when needed)
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/api/auth/forgot-password", {
      email,
    });
  },

  /**
   * Reset password (TODO: implement when needed)
   */
  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return apiClient.post<{ message: string }>("/api/auth/reset-password", {
      token,
      password,
    });
  },
};
