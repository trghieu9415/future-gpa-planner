export interface Grade {
  letter: string;
  value: number;
}

export interface GradingSystem {
  grades: Grade[];
}

export interface GpaGoalParams {
  currentGpa: number;
  accumulatedCredits: number;
  requiredCredits: number;
  gradingSystem: GradingSystem;
  targetGpa: number;
}

export interface GradeCombination {
  gradeLetter: string;
  credits: number;
}

export interface GpaGoalResult {
  targetGpa: number;
  finalGpa: number;
  isPossible: boolean;
  combinations: GradeCombination[];
}
