export interface NewCoursePlan {
  expectedGrade: number;
  credits: number;
}

export interface ImprovementPlan {
  increaseAmount: number;
  credits: number;
}

export interface GpaSimulationParams {
  currentGpa: number;
  accumulatedCredits: number;
  requiredCredits: number;
  newCourses: NewCoursePlan[];
  improvements: ImprovementPlan[];
}

export interface GpaSimulationResult {
  newGpa: number;
  totalPointsGained: number;
  addedCredits: number;
  newTotalCredits: number;
  remainingCredits: number;
}
