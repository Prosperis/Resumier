import { createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

/**
 * TanStack Router instance
 * Configure router with generated route tree
 */
export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
})

// Register router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
