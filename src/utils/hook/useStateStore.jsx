import { create } from "zustand";

export const useStateStore = create((set) => ({
  state: "game",
  setState: (nextState) => set({ state: nextState }),
}));
