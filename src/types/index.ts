export type LetterGrade = "A" | "B" | "C" | "D" | "F";
export type Points = 4.0 | 3.0 | 2.0 | 1.0 | 0.0;
export const letterGradeToPoints: Record<LetterGrade, Points> = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export interface Course {
  id?: string;
  courseId: string;
  name: string;
  credits: number;
  points?: Points;
  letterGrade?: LetterGrade;
}

export interface TargetCredits {
  a: number;
  b: number;
  c: number;
  d: number;
  finalGpa: number;
}

export interface GpaModeProps {
  currentGpa: number | null;
  setCurrentGpa: (value: number | null) => void;
  accumulatedCredits: number | null;
  setAccumulatedCredits: (value: number | null) => void;
  requiredCredits: number | null;
  setRequiredCredits: (value: number | null) => void;
}
