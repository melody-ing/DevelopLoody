import { create } from "zustand";

export const useBgm = create((set) => ({
  isPlayBgm: true,
  setIsPlayBgm: () => set((state) => ({ isPlayBgm: !state.isPlayBgm })),

  isAiLoading: false,
  setIsAiLoading: () => set((state) => ({ isAiLoading: !state.isAiLoading })),

  isAiGenerate: false,
  setIsAiGenerate: () =>
    set((state) => ({ isAiGenerate: !state.isAiGenerate })),

  aiQbankId: "",
  setAiQbankId: (id) => set((state) => ({ aiQbankId: id })),
}));
