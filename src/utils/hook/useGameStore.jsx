import { create } from "zustand";

export const useGameStore = create((set) => ({
  userId: null,
  setUserId: (nextUserId) => set({ userId: nextUserId }),

  state: "game",
  setState: (nextState) => set({ state: nextState }),
}));
