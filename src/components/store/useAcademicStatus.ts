import { create } from "zustand";

export const useAcademicStatus = create<{
  currentGPA: number | null;
  accumulatedCredits: number | null;
  requiredCredits: number | null;
  setCurrentGPA: (value: number | null) => void;
  setAccumulatedCredits: (value: number | null) => void;
  setRequiredCredits: (value: number | null) => void;
}>((set) => ({
  currentGPA: null,
  accumulatedCredits: null,
  requiredCredits: null,
  setCurrentGPA: (value) => set({ currentGPA: value }),
  setAccumulatedCredits: (value) => set({ accumulatedCredits: value }),
  setRequiredCredits: (value) => set({ requiredCredits: value }),
}));
