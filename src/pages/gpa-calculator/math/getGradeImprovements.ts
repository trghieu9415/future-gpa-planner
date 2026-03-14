import { GradingSystem } from "../types/grade";

export function getGradeImprovements(gradingSystem: GradingSystem): number[] {
  const values = gradingSystem.grades.map((grade) => grade.value).sort((a, b) => a - b);
  const uniqueIncreases = new Set<number>();

  for (let i = 0; i < values.length; i++) {
    for (let j = i + 1; j < values.length; j++) {
      const diff = values[j] - values[i];
      const cleanDiff = Math.round(diff * 100) / 100;

      if (cleanDiff > 0) {
        uniqueIncreases.add(cleanDiff);
      }
    }
  }

  return Array.from(uniqueIncreases);
}
