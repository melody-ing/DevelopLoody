import { create } from "zustand";

export const useGameStore = create((set) => ({
  documentId: "uRjHQ7uQS06iBADYJSSH",
  setDocumentId: (id) => set({ documentId: id }),

  userId: null,
  setUserId: (nextUserId) => set({ userId: nextUserId }),
}));
