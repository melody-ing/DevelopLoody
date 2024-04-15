import { create } from "zustand";

export const useGameStore = create((set) => ({
  documentId: "uRjHQ7uQS06iBADYJSSH",
  setDocumentId: (id) => set({ documentId: id }),

  reply: 0,
  setReply: (num) => {
    set({ reply: num });
  },

  userId: null,
  setUserId: (nextUserId) => set({ userId: nextUserId }),
}));
