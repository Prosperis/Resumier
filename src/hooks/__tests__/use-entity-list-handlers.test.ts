import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useEntityListHandlers } from "../use-entity-list-handlers";

// Mock dependencies
const mockMutate = vi.fn();
const mockToast = vi.fn();

vi.mock("@/hooks/api", () => ({
  useUpdateResume: vi.fn(() => ({
    mutate: mockMutate,
  })),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: vi.fn(() => ({
    toast: mockToast,
  })),
}));

interface TestEntity {
  id: string;
  name: string;
}

describe("useEntityListHandlers", () => {
  const mockItems: TestEntity[] = [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
  ];

  const defaultOptions = {
    resumeId: "resume-123",
    entityKey: "experience" as const,
    getCurrentItems: () => mockItems,
    entityLabel: "Experience",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("returns initial state with no editing", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      expect(result.current.editingId).toBeNull();
      expect(result.current.isAddingNew).toBe(false);
      expect(result.current.isEditing).toBe(false);
    });
  });

  describe("handleAdd", () => {
    it("sets isAddingNew to true", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      act(() => {
        result.current.handleAdd();
      });

      expect(result.current.isAddingNew).toBe(true);
      expect(result.current.editingId).toBeNull();
      expect(result.current.isEditing).toBe(true);
    });

    it("clears editingId when adding new", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      // First set editing state
      act(() => {
        result.current.handleEdit("1");
      });
      expect(result.current.editingId).toBe("1");

      // Then add new
      act(() => {
        result.current.handleAdd();
      });

      expect(result.current.isAddingNew).toBe(true);
      expect(result.current.editingId).toBeNull();
    });
  });

  describe("handleEdit", () => {
    it("sets editingId to the provided id", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      act(() => {
        result.current.handleEdit("2");
      });

      expect(result.current.editingId).toBe("2");
      expect(result.current.isAddingNew).toBe(false);
      expect(result.current.isEditing).toBe(true);
    });

    it("clears isAddingNew when editing", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      // First set adding state
      act(() => {
        result.current.handleAdd();
      });
      expect(result.current.isAddingNew).toBe(true);

      // Then edit
      act(() => {
        result.current.handleEdit("1");
      });

      expect(result.current.editingId).toBe("1");
      expect(result.current.isAddingNew).toBe(false);
    });
  });

  describe("handleCancel", () => {
    it("clears both editingId and isAddingNew", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      // Set editing state
      act(() => {
        result.current.handleEdit("1");
      });

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.editingId).toBeNull();
      expect(result.current.isAddingNew).toBe(false);
      expect(result.current.isEditing).toBe(false);
    });

    it("clears isAddingNew when canceling add", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      act(() => {
        result.current.handleAdd();
      });

      act(() => {
        result.current.handleCancel();
      });

      expect(result.current.isAddingNew).toBe(false);
      expect(result.current.isEditing).toBe(false);
    });
  });

  describe("handleDelete", () => {
    it("calls updateResume with filtered items", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      act(() => {
        result.current.handleDelete("1");
      });

      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "resume-123",
          data: {
            content: {
              experience: [{ id: "2", name: "Item 2" }],
            },
          },
        },
        expect.any(Object),
      );
    });

    it("shows success toast on successful delete", () => {
      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      act(() => {
        result.current.handleDelete("1");
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Experience deleted",
      });
    });

    it("shows error toast on delete failure", () => {
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Network error"));
      });

      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      act(() => {
        result.current.handleDelete("1");
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to delete: Network error",
        variant: "destructive",
      });
    });
  });

  describe("handleReorder", () => {
    it("calls updateResume with reordered items", () => {
      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      const reordered = [mockItems[1], mockItems[0]];

      act(() => {
        result.current.handleReorder(reordered);
      });

      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "resume-123",
          data: {
            content: {
              experience: reordered,
            },
          },
        },
        expect.any(Object),
      );
    });

    it("shows error toast on reorder failure", () => {
      mockMutate.mockImplementation((_, options) => {
        options.onError(new Error("Reorder failed"));
      });

      const { result } = renderHook(() => useEntityListHandlers(defaultOptions));

      act(() => {
        result.current.handleReorder(mockItems);
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to reorder: Reorder failed",
        variant: "destructive",
      });
    });
  });

  describe("with different entity types", () => {
    it("works with education entity", () => {
      const educationItems = [{ id: "edu-1", name: "Education 1" }];
      const { result } = renderHook(() =>
        useEntityListHandlers({
          resumeId: "resume-123",
          entityKey: "education",
          getCurrentItems: () => educationItems,
          entityLabel: "Education",
        }),
      );

      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      act(() => {
        result.current.handleDelete("edu-1");
      });

      expect(mockMutate).toHaveBeenCalledWith(
        {
          id: "resume-123",
          data: {
            content: {
              education: [],
            },
          },
        },
        expect.any(Object),
      );

      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Education deleted",
      });
    });

    it("works with certifications entity", () => {
      const certItems = [{ id: "cert-1", name: "Cert 1" }];
      const { result } = renderHook(() =>
        useEntityListHandlers({
          resumeId: "resume-123",
          entityKey: "certifications",
          getCurrentItems: () => certItems,
          entityLabel: "Certification",
        }),
      );

      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      act(() => {
        result.current.handleDelete("cert-1");
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Certification deleted",
      });
    });

    it("works with links entity", () => {
      const linkItems = [{ id: "link-1", name: "Link 1" }];
      const { result } = renderHook(() =>
        useEntityListHandlers({
          resumeId: "resume-123",
          entityKey: "links",
          getCurrentItems: () => linkItems,
          entityLabel: "Link",
        }),
      );

      mockMutate.mockImplementation((_, options) => {
        options.onSuccess();
      });

      act(() => {
        result.current.handleDelete("link-1");
      });

      expect(mockToast).toHaveBeenCalledWith({
        title: "Success",
        description: "Link deleted",
      });
    });
  });
});
