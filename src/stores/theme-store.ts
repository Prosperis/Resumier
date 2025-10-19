import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

export type Theme = "light" | "dark"

interface ThemeStore {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const initialState = {
  theme: "light" as Theme,
}

export const useThemeStore = create<ThemeStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        setTheme: (theme) => {
          set({ theme })
          // Update DOM
          if (theme === "dark") {
            document.documentElement.classList.add("dark")
          } else {
            document.documentElement.classList.remove("dark")
          }
        },
        toggleTheme: () => {
          set((state) => {
            const newTheme = state.theme === "dark" ? "light" : "dark"
            // Update DOM
            if (newTheme === "dark") {
              document.documentElement.classList.add("dark")
            } else {
              document.documentElement.classList.remove("dark")
            }
            return { theme: newTheme }
          })
        },
      }),
      {
        name: "resumier-theme",
        // Initialize DOM on hydration
        onRehydrateStorage: () => (state) => {
          if (state) {
            if (state.theme === "dark") {
              document.documentElement.classList.add("dark")
            } else {
              document.documentElement.classList.remove("dark")
            }
          }
        },
      },
    ),
    { name: "ThemeStore" },
  ),
)

// Selectors for optimized access
export const selectTheme = (state: ThemeStore) => state.theme
export const selectSetTheme = (state: ThemeStore) => state.setTheme
export const selectToggleTheme = (state: ThemeStore) => state.toggleTheme
