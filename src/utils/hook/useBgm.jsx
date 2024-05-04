import { create } from "zustand";

export const useBgm = create((set) => ({
  isPlayBgm: true,
  setIsPlayBgm: () => set((state) => ({ isPlayBgm: !state.isPlayBgm })),
}));
