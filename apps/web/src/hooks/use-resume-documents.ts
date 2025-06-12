import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface ResumeDocument {
  id: string
  name: string
}

interface DocumentsState {
  documents: ResumeDocument[]
  addDocument: (doc: ResumeDocument) => void
}

export const useResumeDocuments = create<DocumentsState>()(
  persist(
    (set) => ({
      documents: [],
      addDocument: (doc) =>
        set((state) => ({ documents: [...state.documents, doc] })),
    }),
    {
      name: "resumier-documents",
      storage: createJSONStorage(() => localStorage),
    },
  ),
)
