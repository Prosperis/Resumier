import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { authApi } from "@/lib/api/auth";
import { setUser as setSentryUser } from "@/lib/monitoring/sentry";
import { 
  authClient,
  signInWithGoogle,
  signInWithMicrosoft,
  signInWithDropbox,
  type AuthProvider,
} from "@/lib/auth/client";

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  token?: string; // JWT token for API requests
  provider?: AuthProvider; // OAuth provider used for authentication
  accessToken?: string; // OAuth access token for API calls
}

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isGuest: boolean; // Flag for guest mode
  isDemo: boolean; // Flag for demo mode
  isLoading: boolean;
  error: string | null;
  connectedProvider: AuthProvider | null; // Currently connected OAuth provider

  // Actions
  setUser: (user: User | null) => void;
  setGuest: (isGuest: boolean) => void;
  setDemo: (isDemo: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setConnectedProvider: (provider: AuthProvider | null) => void;
  login: (email: string, password: string) => Promise<void>;
  loginWithOAuth: (provider: AuthProvider) => Promise<void>;
  loginAsGuest: () => void; // New action for guest mode
  loginAsDemo: () => void; // New action for demo mode
  logout: () => void;
  clearError: () => void;
  syncSession: () => Promise<void>; // Sync with Better Auth session
}

const initialState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
  isDemo: false,
  isLoading: false,
  error: null,
  connectedProvider: null as AuthProvider | null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
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
            isDemo: false, // Clear demo mode when user logs in
            error: null,
          });
        },

        setGuest: (isGuest) => set({ isGuest }),

        setDemo: (isDemo) => set({ isDemo }),

        setLoading: (isLoading) => set({ isLoading }),

        setError: (error) => set({ error, isLoading: false }),

        setConnectedProvider: (provider) => set({ connectedProvider: provider }),

        loginWithOAuth: async (provider: AuthProvider) => {
          set({ isLoading: true, error: null });
          
          try {
            // Start OAuth flow based on provider
            let result;
            switch (provider) {
              case "google":
                result = await signInWithGoogle();
                break;
              case "microsoft":
                result = await signInWithMicrosoft();
                break;
              case "dropbox":
                result = await signInWithDropbox();
                break;
              default:
                throw new Error(`Unsupported provider: ${provider}`);
            }
            
            if (result?.error) {
              throw new Error(result.error.message || "OAuth sign in failed");
            }
            
            // The page will redirect to the OAuth provider
            // Session will be synced after redirect callback
          } catch (error) {
            const message = error instanceof Error ? error.message : "OAuth login failed";
            set({
              isLoading: false,
              error: message,
            });
          }
        },

        // Sync session with Better Auth
        syncSession: async () => {
          try {
            const session = await authClient.getSession();
            
            if (session?.data?.user) {
              const userData = session.data.user;
              const user: User = {
                id: userData.id,
                email: userData.email || "",
                name: userData.name || "",
                avatar: userData.image || undefined,
                // Access token for API calls
                accessToken: (session.data as { accessToken?: string }).accessToken,
              };
              
              // Determine provider from session if available
              const account = (session.data as { account?: { provider: string } }).account;
              const provider = account?.provider as AuthProvider | undefined;
              
              // Set user in Sentry
              setSentryUser({
                id: user.id,
                email: user.email,
                name: user.name,
              });
              
              set({
                user,
                isAuthenticated: true,
                isGuest: false,
                isDemo: false,
                isLoading: false,
                error: null,
                connectedProvider: provider || null,
              });
            } else {
              // No session - check if we were in guest mode
              const currentState = get();
              if (!currentState.isGuest && !currentState.isDemo) {
                set({
                  user: null,
                  isAuthenticated: false,
                  connectedProvider: null,
                });
              }
            }
          } catch (error) {
            console.error("Failed to sync session:", error);
          }
        },

        loginAsGuest: () => {
          // Set guest mode without authentication
          // Guest users get a temporary ID and can use IndexedDB storage
          const guestUser: User = {
            id: `guest-${Date.now()}`,
            email: "",
            name: "Guest User",
          };

          set({
            user: guestUser,
            isAuthenticated: false, // Guest users are not authenticated
            isGuest: true,
            isDemo: false,
            isLoading: false,
            error: null,
          });
        },

        loginAsDemo: () => {
          // Set demo mode with pre-populated data
          // Demo users get a special ID and use pre-loaded John Doe data
          const demoUser: User = {
            id: `demo-${Date.now()}`,
            email: "demo@resumier.app",
            name: "Demo User",
          };

          set({
            user: demoUser,
            isAuthenticated: false, // Demo users are not authenticated
            isGuest: true, // Demo mode is a type of guest mode
            isDemo: true,
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
            const message = error instanceof Error ? error.message : "Login failed";
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
              // Sign out from Better Auth
              await authClient.signOut();
              // Also call legacy API if needed
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
        // Persist user, auth status, guest mode, demo mode, and provider
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          isGuest: state.isGuest,
          isDemo: state.isDemo,
          connectedProvider: state.connectedProvider,
        }),
      },
    ),
    { name: "AuthStore" },
  ),
);

// Selectors for optimized access
export const selectUser = (state: AuthStore) => state.user;
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated;
export const selectIsGuest = (state: AuthStore) => state.isGuest;
export const selectIsDemo = (state: AuthStore) => state.isDemo;
export const selectIsLoading = (state: AuthStore) => state.isLoading;
export const selectError = (state: AuthStore) => state.error;
export const selectConnectedProvider = (state: AuthStore) => state.connectedProvider;

export const selectAuthActions = (state: AuthStore) => ({
  login: state.login,
  loginWithOAuth: state.loginWithOAuth,
  logout: state.logout,
  setUser: state.setUser,
  clearError: state.clearError,
  syncSession: state.syncSession,
});
