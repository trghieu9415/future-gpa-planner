import { GpaGoalParams, GpaGoalResult, GradeCombination } from "../types/grade";

export function getGpaStrategy(params: GpaGoalParams): GpaGoalResult {
  const { currentGpa, accumulatedCredits, requiredCredits, gradingSystem, targetGpa } = params;

  const remainingCredits = requiredCredits - accumulatedCredits;

  const combinations: GradeCombination[] = gradingSystem.grades.map((grade) => ({
    gradeLetter: grade.letter,
    credits: 0,
  }));

  const setCreditsForGrade = (letter: string, credits: number) => {
    const target = combinations.find((c) => c.gradeLetter === letter);
    if (target) target.credits = credits;
  };

  if (remainingCredits <= 0) {
    return {
      targetGpa,
      finalGpa: currentGpa,
      isPossible: currentGpa >= targetGpa,
      combinations,
    };
  }

  const sortedGrades = [...gradingSystem.grades].sort((a, b) => a.value - b.value);
  const minGrade = sortedGrades[0];
  const maxGrade = sortedGrades[sortedGrades.length - 1];

  const currentTotalPoints = currentGpa * accumulatedCredits;
  const targetTotalPoints = targetGpa * requiredCredits;

  const getRoundedGpa = (addedPoints: number) => {
    return Math.round(((currentTotalPoints + addedPoints) / requiredCredits) * 100) / 100;
  };

  const bestCaseGpa = getRoundedGpa(remainingCredits * maxGrade.value);
  const worstCaseGpa = getRoundedGpa(remainingCredits * minGrade.value);

  let achievedPoints = 0;
  let isPossible = true;

  if (bestCaseGpa < targetGpa) {
    setCreditsForGrade(maxGrade.letter, remainingCredits);
    achievedPoints = maxGrade.value * remainingCredits;
    isPossible = false;
  } else if (worstCaseGpa >= targetGpa) {
    setCreditsForGrade(minGrade.letter, remainingCredits);
    achievedPoints = minGrade.value * remainingCredits;
    isPossible = true;
  } else {
    const requiredPoints = targetTotalPoints - currentTotalPoints;
    const requiredAverage = requiredPoints / remainingCredits;

    let lowerGradeIndex = Math.max(0, sortedGrades.length - 2);

    for (let i = 0; i < sortedGrades.length; i++) {
      if (sortedGrades[i].value >= requiredAverage) {
        lowerGradeIndex = Math.max(0, i - 1);
        break;
      }
    }

    const lowerGrade = sortedGrades[lowerGradeIndex];
    const upperGrade = sortedGrades[lowerGradeIndex + 1];

    const diff = upperGrade.value - lowerGrade.value;
    const pointsDeficit = requiredPoints - remainingCredits * lowerGrade.value;

    let creditsHigh = Math.ceil(pointsDeficit / diff);
    if (creditsHigh > remainingCredits) creditsHigh = remainingCredits;

    while (creditsHigh > 0) {
      const testCreditsHigh = creditsHigh - 1;
      const testCreditsLow = remainingCredits - testCreditsHigh;
      const testPoints = testCreditsLow * lowerGrade.value + testCreditsHigh * upperGrade.value;

      const testRoundedGpa = getRoundedGpa(testPoints);

      if (testRoundedGpa >= targetGpa) {
        creditsHigh = testCreditsHigh;
      } else {
        break;
      }
    }

    const creditsLow = remainingCredits - creditsHigh;

    setCreditsForGrade(lowerGrade.letter, creditsLow);
    setCreditsForGrade(upperGrade.letter, creditsHigh);

    achievedPoints = creditsLow * lowerGrade.value + creditsHigh * upperGrade.value;
    isPossible = true;
  }

  const finalGpa = getRoundedGpa(achievedPoints);

  return {
    targetGpa,
    finalGpa,
    isPossible,
    combinations,
  };
}
