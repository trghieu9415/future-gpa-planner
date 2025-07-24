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
  id: string;
  courseId: string;
  name: string;
  credits: number;
  points: Points;
  letterGrade: LetterGrade;
}

export interface TargetCredits {
  a: number;
  b: number;
  c: number;
  d: number;
  finalGPA: number;
}

export interface GPAModeProps {
  currentGPA: number | null;
  setCurrentGPA: (value: number | null) => void;
  accumulatedCredits: number | null;
  setAccumulatedCredits: (value: number | null) => void;
  requiredCredits: number | null;
  setRequiredCredits: (value: number | null) => void;
}
export type Rule = { from: LetterGrade; to: LetterGrade; points: number };
export type ImprovementPriority = Rule[];

export interface ImprovementCourse {
  course: Course;
  rule: Rule;
  impact: number; // Impact of the improvement in terms of credits * points
}
