import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";
import { setUser as setSentryUser } from "@/lib/monitoring/sentry";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  token?: string; // JWT token for API requests
}

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean; // Flag for guest mode
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setGuest: (isGuest: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  loginAsGuest: () => void; // New action for guest mode
  logout: () => void;
  clearError: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        setUser: (user) => {
          // Set user in Sentry for error tracking
          if (user) {
            setSentryUser({
              id: user.id,
              email: user.email,
              name: user.name,
            });
          } else {
            setSentryUser(null);
          }

          set({
            user,
            isAuthenticated: !!user,
            isGuest: false, // Clear guest mode when user logs in
            error: null,
          });
        },

        setGuest: (isGuest) => set({ isGuest }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error, isLoading: false }),

        loginAsGuest: () => {
          // Set guest mode without authentication
          // Guest users get a temporary ID and can use IndexedDB storage
          const guestUser: User = {
            id: `guest-${Date.now()}`,
            email: '',
            name: 'Guest User',
          };

          set({
            user: guestUser,
            isAuthenticated: false, // Guest users are not authenticated
            isGuest: true,
            isLoading: false,
            error: null,
          });
        },

        login: async (email: string, password: string) => {
          set({ isLoading: true, error: null });

          try {
            // Call auth API
            const response = await authApi.login({ email, password });

            if (response.user) {
              const user: User = {
                id: response.user.id,
                email: response.user.email,
                name: response.user.name,
                token: response.user.token,
                avatar: undefined,
              };

              // Set user in Sentry for error tracking
              setSentryUser({
                id: user.id,
                email: user.email,
                name: user.name,
              });

              set({
                user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              });
            } else {
              throw new Error("Invalid credentials");
            }
          } catch (error) {
            const message =
              error instanceof Error ? error.message : "Login failed";
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: message,
            });
          }
        },

        logout: async () => {
          try {
            // Only call logout API if user is authenticated (not guest)
            const currentState = useAuthStore.getState();
            if (currentState.isAuthenticated && !currentState.isGuest) {
              await authApi.logout();
            }
          } catch (error) {
            // Log error but still clear local state
            console.error("Logout API error:", error);
          } finally {
            // Clear Sentry user context
            setSentryUser(null);

            // Always clear local state
            set({
              ...initialState,
            });
          }
        },

        clearError: () => set({ error: null }),
      }),
      {
        name: "resumier-auth",
        storage: createJSONStorage(() => localStorage),
        // Persist user, auth status, and guest mode
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isGuest: state.isGuest,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);

// Selectors for optimized access
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) =>
  state.isAuthenticated;
export const selectIsGuest = (state: AuthStore) => state.isGuest;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;

export const selectAuthActions = (state: AuthStore) => ({
  login: state.login,
  logout: state.logout,
  setUser: state.setUser,
  clearError: state.clearError,
});
