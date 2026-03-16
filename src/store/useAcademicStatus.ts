import { LetterSystem } from "@/consts/GradingScale";
import { GradingSystem } from "@/pages/gpa-calculator/types/grade";
import { create } from "zustand";

interface AcademicStatus {
  currentGpa: number | null;
  accumulatedCredits: number | null;
  requiredCredits: number | null;
  gradingSystem: GradingSystem;
  setCurrentGpa: (value: number | null) => void;
  setAccumulatedCredits: (value: number | null) => void;
  setRequiredCredits: (value: number | null) => void;
  setGradingSystem: (value: GradingSystem) => void;
}

export const useAcademicStatus = create<AcademicStatus>((set) => ({
  currentGpa: null,
  accumulatedCredits: null,
  requiredCredits: null,
  gradingSystem: LetterSystem,
  setCurrentGpa: (value) => set({ currentGpa: value }),
  setAccumulatedCredits: (value) => set({ accumulatedCredits: value }),
  setRequiredCredits: (value) => set({ requiredCredits: value }),
  setGradingSystem: (value) => set({ gradingSystem: value }),
}));
