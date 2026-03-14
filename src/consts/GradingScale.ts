import { GradingSystem } from "@/pages/gpa-calculator/types/grade";

export const LetterSystem: GradingSystem = {
  grades: [
    { letter: "A", value: 4.0 },
    { letter: "B", value: 3.0 },
    { letter: "C", value: 2.0 },
    { letter: "D", value: 1.0 },
  ],
};

export const PlusSystem: GradingSystem = {
  grades: [
    { letter: "A", value: 4.0 },
    { letter: "B+", value: 3.5 },
    { letter: "B", value: 3.0 },
    { letter: "C+", value: 2.5 },
    { letter: "C", value: 2.0 },
    { letter: "D+", value: 1.5 },
    { letter: "D", value: 1.0 },
  ],
};
