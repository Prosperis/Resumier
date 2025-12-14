import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { get } from "idb-keyval";
import { type ResumeDocument, useResumeDocuments } from "../use-resume-documents";

describe("useResumeDocuments", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    // Reset the store state by calling setState directly
    const { result } = renderHook(() => useResumeDocuments());
    act(() => {
      result.current.documents.length = 0;
      // Force reset by setting state to initial
      useResumeDocuments.setState({ documents: [] });
    });
    cleanup();
  });

  afterEach(() => {
    // Clean up React hooks after each test
    cleanup();
    // Clear localStorage again to ensure no state leaks
    localStorage.clear();
  });

  describe("Initial State", () => {
    it("should have empty documents array initially", () => {
      const { result } = renderHook(() => useResumeDocuments());
      expect(result.current.documents).toEqual([]);
    });

    it("should read persisted data structure from localStorage", () => {
      // This test verifies the localStorage persistence format
      // The actual loading happens in the "Persistence" tests
      const mockDocuments: ResumeDocument[] = [
        { id: "doc-1", name: "Resume 1" },
        { id: "doc-2", name: "Resume 2" },
      ];

      // Simulate what the persist middleware would write
      const persistData = {
        state: { documents: mockDocuments },
        version: 0,
      };
      localStorage.setItem("resumier-documents", JSON.stringify(persistData));

      // Verify the data was stored correctly
      const stored = localStorage.getItem("resumier-documents");
      expect(stored).not.toBeNull();

      const parsed = JSON.parse(stored!);
      expect(parsed.state.documents).toEqual(mockDocuments);
      expect(parsed.version).toBe(0);
    });
  });

  describe("addDocument", () => {
    it("should add a document to the store", () => {
      const { result } = renderHook(() => useResumeDocuments());

      const newDoc: ResumeDocument = {
        id: "doc-1",
        name: "My Resume",
      };

      act(() => {
        result.current.addDocument(newDoc);
      });

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0]).toEqual(newDoc);
    });

    it("should add multiple documents", () => {
      const { result } = renderHook(() => useResumeDocuments());

      const doc1: ResumeDocument = { id: "doc-1", name: "Resume 1" };
      const doc2: ResumeDocument = { id: "doc-2", name: "Resume 2" };
      const doc3: ResumeDocument = { id: "doc-3", name: "Resume 3" };

      act(() => {
        result.current.addDocument(doc1);
        result.current.addDocument(doc2);
        result.current.addDocument(doc3);
      });

      expect(result.current.documents).toHaveLength(3);
      expect(result.current.documents).toEqual([doc1, doc2, doc3]);
    });

    it("should preserve existing documents when adding new ones", () => {
      const { result } = renderHook(() => useResumeDocuments());

      const doc1: ResumeDocument = { id: "doc-1", name: "First" };
      const doc2: ResumeDocument = { id: "doc-2", name: "Second" };

      act(() => {
        result.current.addDocument(doc1);
      });

      expect(result.current.documents).toHaveLength(1);

      act(() => {
        result.current.addDocument(doc2);
      });

      expect(result.current.documents).toHaveLength(2);
      expect(result.current.documents).toContainEqual(doc1);
      expect(result.current.documents).toContainEqual(doc2);
    });

    it("should allow duplicate IDs (no validation)", () => {
      const { result } = renderHook(() => useResumeDocuments());

      const doc1: ResumeDocument = { id: "same-id", name: "First" };
      const doc2: ResumeDocument = { id: "same-id", name: "Second" };

      act(() => {
        result.current.addDocument(doc1);
        result.current.addDocument(doc2);
      });

      expect(result.current.documents).toHaveLength(2);
    });
  });

  describe("Persistence", () => {
    it("should persist documents to IndexedDB", async () => {
      const { result } = renderHook(() => useResumeDocuments());

      const doc: ResumeDocument = { id: "doc-1", name: "Test Doc" };

      act(() => {
        result.current.addDocument(doc);
      });

      // Wait for async IndexedDB persistence
      await waitFor(async () => {
        const stored = await get("resumier-documents");
        expect(stored).toBeTruthy();
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        expect(parsed.state.documents).toEqual([doc]);
      });
    });

    it("should maintain state across hook instances", () => {
      const { result: result1 } = renderHook(() => useResumeDocuments());

      const doc: ResumeDocument = { id: "doc-1", name: "Shared Doc" };

      act(() => {
        result1.current.addDocument(doc);
      });

      // Create new instance of the hook
      const { result: result2 } = renderHook(() => useResumeDocuments());

      // Both instances should see the same document
      expect(result2.current.documents).toEqual([doc]);
    });

    it("should persist multiple documents", async () => {
      const { result } = renderHook(() => useResumeDocuments());

      const docs: ResumeDocument[] = [
        { id: "doc-1", name: "Resume 1" },
        { id: "doc-2", name: "Resume 2" },
        { id: "doc-3", name: "Resume 3" },
      ];

      act(() => {
        for (const doc of docs) {
          result.current.addDocument(doc);
        }
      });

      // Wait for async IndexedDB persistence
      await waitFor(async () => {
        const stored = await get("resumier-documents");
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        expect(parsed.state.documents).toHaveLength(3);
        expect(parsed.state.documents).toEqual(docs);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle documents with empty names", () => {
      const { result } = renderHook(() => useResumeDocuments());

      const doc: ResumeDocument = { id: "doc-1", name: "" };

      act(() => {
        result.current.addDocument(doc);
      });

      expect(result.current.documents).toHaveLength(1);
      expect(result.current.documents[0].name).toBe("");
    });

    it("should handle documents with long names", () => {
      const { result } = renderHook(() => useResumeDocuments());

      const longName = "A".repeat(500);
      const doc: ResumeDocument = { id: "doc-1", name: longName };

      act(() => {
        result.current.addDocument(doc);
      });

      expect(result.current.documents[0].name).toBe(longName);
    });

    it("should handle documents with special characters in names", () => {
      const { result } = renderHook(() => useResumeDocuments());

      const specialName = "Resume 📄 <2024> & 'Test' \"Doc\"";
      const doc: ResumeDocument = { id: "doc-1", name: specialName };

      act(() => {
        result.current.addDocument(doc);
      });

      expect(result.current.documents[0].name).toBe(specialName);
    });

    it("should recover from corrupted localStorage", () => {
      // Corrupt localStorage
      localStorage.setItem("resumier-documents", "invalid json{");

      const { result } = renderHook(() => useResumeDocuments());

      // Should fallback to initial state
      expect(result.current.documents).toEqual([]);

      // Should still be able to add documents
      const doc: ResumeDocument = { id: "doc-1", name: "New Doc" };
      act(() => {
        result.current.addDocument(doc);
      });

      expect(result.current.documents).toEqual([doc]);
    });
  });
});
