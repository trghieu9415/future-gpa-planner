import { GpaSimulationParams, GpaSimulationResult } from "../types/gpaSimulation";

export function simulateNewGpa(params: GpaSimulationParams): GpaSimulationResult {
  const { currentGpa, accumulatedCredits, requiredCredits, newCourses, improvements } = params;

  const currentTotalPoints = currentGpa * accumulatedCredits;

  let addedCredits = 0;
  let pointsFromNewCourses = 0;
  for (const course of newCourses) {
    addedCredits += course.credits;
    pointsFromNewCourses += course.credits * course.expectedGrade;
  }

  let pointsFromImprovements = 0;
  for (const imp of improvements) {
    pointsFromImprovements += imp.credits * imp.increaseAmount;
  }

  const totalPointsGained = pointsFromNewCourses + pointsFromImprovements;
  const newTotalCredits = accumulatedCredits + addedCredits;

  if (newTotalCredits === 0) {
    return {
      newGpa: 0,
      totalPointsGained: 0,
      addedCredits,
      newTotalCredits: 0,
      remainingCredits: requiredCredits,
    };
  }

  const exactNewGpa = (currentTotalPoints + totalPointsGained) / newTotalCredits;
  const newGpa = Math.round(exactNewGpa * 100) / 100;
  const remainingCredits = Math.max(0, requiredCredits - newTotalCredits);

  return {
    newGpa,
    totalPointsGained,
    addedCredits,
    newTotalCredits,
    remainingCredits,
  };
}
