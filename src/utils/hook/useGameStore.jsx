import { create } from "zustand";

export const useGameStore = create((set) => ({
  documentId: "0",
  setDocumentId: (id) => set({ documentId: id }),

  eventData: null,
  setEventData: (data) => {
    set({ eventData: data });
  },

  qbankData: null,
  setQbankData: (data) => {
    set({ qbankData: data });
  },

  reply: 0,
  setReply: (num) => {
    set({ reply: num });
  },

  userId: null,
  setUserId: (nextUserId) => set({ userId: nextUserId }),
}));
