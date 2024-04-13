import { create } from "zustand";

export const useStateStore = create((set) => ({
  state: "lobby",
  setState: (nextState) => set({ state: nextState }),
}));
