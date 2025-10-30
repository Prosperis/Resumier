import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthStore } from "@/stores";

// Mock dependencies
vi.mock("@/stores", () => ({
  useAuthStore: {
    getState: vi.fn(),
  },
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  createLazyFileRoute: vi.fn(() => (config: any) => ({ ...config })),
  useParams: vi.fn(() => ({ id: "test-resume-id" })),
  useNavigate: vi.fn(),
}));

vi.mock("@/hooks/api", () => ({
  useResume: vi.fn(),
}));

vi.mock("@/components/features/resume/pdf-viewer", () => ({
  PdfViewer: () => <div data-testid="pdf-viewer">PDF Preview</div>,
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children, onClick, variant, size }: any) => (
    <button
      data-testid={`button-${variant || "default"}`}
      onClick={onClick}
      data-size={size}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/components/ui/route-error", () => ({
  RouteError: ({ title, error }: { title: string; error: Error }) => (
    <div data-testid="route-error">
      <h1>{title}</h1>
      <p>{error.message}</p>
    </div>
  ),
}));

vi.mock("@/components/ui/route-loading", () => ({
  RouteLoadingFallback: ({ message }: { message: string }) => (
    <div data-testid="loading-fallback">{message}</div>
  ),
}));

vi.mock("lucide-react", () => ({
  ArrowLeft: () => <svg data-testid="arrow-left-icon" />,
  Download: () => <svg data-testid="download-icon" />,
}));

// Import the route module and hooks after setting up mocks
const { Route: previewRoute } = await import("../$id.preview.lazy");
const { useResume } = await import("@/hooks/api");
const { useNavigate } = await import("@tanstack/react-router");

describe("Resume Preview Route (/resume/$id/preview)", () => {
  const mockNavigate = vi.fn();
  const consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});

  beforeEach(() => {
    // Mock reset handled by vitest config (clearMocks: true)
    (useAuthStore.getState as any).mockReturnValue({
      isAuthenticated: true,
      user: { id: "1", email: "test@example.com", name: "Test User" },
      login: vi.fn(),
      logout: vi.fn(),
    });
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  const renderPreviewRoute = () => {
    const Component = (previewRoute as any).component;
    if (!Component) {
      throw new Error("Component not found in route");
    }
    return render(<Component />);
  };

  describe("Authentication", () => {
    it("allows access when authenticated", () => {
      (useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Resume", content: {} },
        isLoading: false,
        error: null,
      } as any);

      expect(() => renderPreviewRoute()).not.toThrow();
    });
  });

  describe("Loading State", () => {
    it("shows loading fallback when fetching resume", () => {
      (useResume as any).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
      } as any);

      renderPreviewRoute();

      expect(screen.getByTestId("loading-fallback")).toBeInTheDocument();
      expect(screen.getByText("Loading preview...")).toBeInTheDocument();
    });
  });

  describe("Error State", () => {
    it("shows error component when resume fetch fails", () => {
      const testError = new Error("Failed to load resume");
      (useResume as any).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: testError,
      } as any);

      renderPreviewRoute();

      expect(screen.getByTestId("route-error")).toBeInTheDocument();
      expect(screen.getByText("Failed to load resume")).toBeInTheDocument();
    });

    it("shows error when resume is not found", () => {
      (useResume as any).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      } as any);

      renderPreviewRoute();

      expect(screen.getByTestId("route-error")).toBeInTheDocument();
      expect(screen.getByText("Resume not found")).toBeInTheDocument();
    });
  });

  describe("Success State", () => {
    beforeEach(() => {
      (useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Test Resume", content: {} },
        isLoading: false,
        error: null,
      } as any);
    });

    it("renders the PDF viewer", () => {
      renderPreviewRoute();
      expect(screen.getByTestId("pdf-viewer")).toBeInTheDocument();
      expect(screen.getByText("PDF Preview")).toBeInTheDocument();
    });

    it("displays the resume title in header", () => {
      renderPreviewRoute();
      expect(screen.getByText("My Test Resume")).toBeInTheDocument();
    });

    it("displays preview mode label", () => {
      renderPreviewRoute();
      expect(screen.getByText("Preview Mode")).toBeInTheDocument();
    });

    it("renders back to editor button", () => {
      renderPreviewRoute();
      expect(screen.getByText("Back to Editor")).toBeInTheDocument();
    });

    it("renders download PDF button", () => {
      renderPreviewRoute();
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
    });

    it("renders arrow left icon", () => {
      renderPreviewRoute();
      expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
    });

    it("renders download icon", () => {
      renderPreviewRoute();
      expect(screen.getByTestId("download-icon")).toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    beforeEach(() => {
      (useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Test Resume", content: {} },
        isLoading: false,
        error: null,
      } as any);
    });

    it("navigates back to editor when back button is clicked", () => {
      renderPreviewRoute();

      const backButton = screen.getByText("Back to Editor").closest("button");
      fireEvent.click(backButton!);

      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/resume/$id",
        params: { id: "test-resume-id" },
      });
    });
  });

  describe("Download Functionality", () => {
    beforeEach(() => {
      (useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Test Resume", content: {} },
        isLoading: false,
        error: null,
      } as any);
    });

    it("renders download button", () => {
      renderPreviewRoute();

      const downloadButton = screen.getByText("Download PDF");
      expect(downloadButton).toBeInTheDocument();
    });
  });

  describe("Layout", () => {
    beforeEach(() => {
      (useResume as any).mockReturnValue({
        data: { id: "test-resume-id", title: "My Resume", content: {} },
        isLoading: false,
        error: null,
      } as any);
    });

    it("uses full screen layout", () => {
      const { container } = renderPreviewRoute();
      const mainDiv = container.querySelector(".h-screen.flex.flex-col");
      expect(mainDiv).toBeInTheDocument();
    });

    it("has a header with border", () => {
      const { container } = renderPreviewRoute();
      const header = container.querySelector(".border-b.bg-background");
      expect(header).toBeInTheDocument();
    });

    it("has a scrollable preview area", () => {
      const { container } = renderPreviewRoute();
      const previewArea = container.querySelector(".flex-1.overflow-auto");
      expect(previewArea).toBeInTheDocument();
    });
  });

  describe("Route Configuration", () => {
    it("has a component property", () => {
      expect(previewRoute).toHaveProperty("component");
    });

    // Note: Lazy routes only have the component property.
    // pendingComponent, errorComponent, and beforeLoad are defined in the main route file ($id.preview.tsx)
  });
});
