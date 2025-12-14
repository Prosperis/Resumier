import { del, get, set as idbSet } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ResumeDocument {
  id: string;
  name: string;
}

interface DocumentsState {
  documents: ResumeDocument[];
  addDocument: (doc: ResumeDocument) => void;
}

export const useResumeDocuments = create<DocumentsState>()(
  persist(
    (set) => ({
      documents: [],
      addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),
    }),
    {
      name: "resumier-documents",
      // Use IndexedDB for consistency with resume store
      storage: createJSONStorage(() => ({
        async getItem(name: string) {
          const value = await get(name);
          return value ?? null;
        },
        async setItem(name: string, value: unknown) {
          await idbSet(name, value);
        },
        async removeItem(name: string) {
          await del(name);
        },
      })),
    },
  ),
);
