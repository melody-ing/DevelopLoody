import { create } from "zustand";

export const useStateStore = create((set) => ({
  state: "game",
  answer: 0,
  setState: (nextState) => set({ state: nextState }),
  setAnswer: (answer) => set({ answer }),
}));
