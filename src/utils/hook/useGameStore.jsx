import { create } from "zustand";

export const useGameStore = create((set) => ({
  documentId: "uRjHQ7uQS06iBADYJSSH",
  setDocumentId: (id) => set({ documentId: id }),

  reply: 0,
  setReply: (users) => {
    const num = Object.values(users).filter(
      (user) => user.selected !== undefined
    )?.length;
    set({ reply: num });
  },

  userId: null,
  setUserId: (nextUserId) => set({ userId: nextUserId }),
}));
