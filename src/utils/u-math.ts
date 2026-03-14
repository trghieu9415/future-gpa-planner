import { TargetCredits } from "@/types";

export const calculateRequiredGrades = (
  currentGpa: number,
  accumulatedCredits: number,
  requiredCredits: number,
  targetGpa: number
): TargetCredits => {
  const currentQualityPoints = currentGpa * accumulatedCredits;
  const remainingCredits = requiredCredits - accumulatedCredits;

  if (remainingCredits <= 0) {
    return { a: 0, b: 0, c: 0, d: 0, finalGpa: currentGpa };
  }

  const minPossiblePoints = currentQualityPoints + remainingCredits * 1.0;
  const maxPossiblePoints = currentQualityPoints + remainingCredits * 4.0;

  const minPossibleGpa = minPossiblePoints / requiredCredits;
  const maxPossibleGpa = maxPossiblePoints / requiredCredits;

  if (targetGpa > maxPossibleGpa) {
    return {
      a: remainingCredits,
      b: 0,
      c: 0,
      d: 0,
      finalGpa: parseFloat(maxPossibleGpa.toFixed(2)),
    };
  }

  if (targetGpa <= minPossibleGpa) {
    return {
      a: 0,
      b: 0,
      c: 0,
      d: remainingCredits,
      finalGpa: parseFloat(minPossibleGpa.toFixed(2)),
    };
  }

  const minRequiredNewPoints = targetGpa * requiredCredits - currentQualityPoints;

  const targetPointOffset = minRequiredNewPoints - remainingCredits * 1.0;

  for (let a = 0; a <= remainingCredits; a++) {
    for (let b = 0; b <= remainingCredits - a; b++) {
      const c = Math.max(0, Math.ceil(targetPointOffset - 3 * a - 2 * b));

      if (a + b + c <= remainingCredits) {
        const d = remainingCredits - a - b - c;

        const newQualityPoints = a * 4.0 + b * 3.0 + c * 2.0 + d * 1.0;
        const finalGpa = (currentQualityPoints + newQualityPoints) / requiredCredits;

        return { a, b, c, d, finalGpa: parseFloat(finalGpa.toFixed(2)) };
      }
    }
  }

  return {
    a: remainingCredits,
    b: 0,
    c: 0,
    d: 0,
    finalGpa: parseFloat(maxPossibleGpa.toFixed(2)),
  };
};

export const getWeekDateRange = (week: number) => {
  const startDate = new Date(2025, 11, 22);
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (week - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
};
