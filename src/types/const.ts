export const IGNORE_COURSE_IDS = ["862101", "862406", "862407", "862408", "862409"];
export const LETTER_GRADES = ["A", "B", "C", "D"];

// Ưu tiên cải thiện dễ đạt trước (nhảy điểm ít nhưng dễ)
export const IMPROVEMENT_PRIORITY_BY_EASE = [
  { from: "D", to: "C", points: 1 },
  { from: "C", to: "B", points: 1 },
  { from: "D", to: "B", points: 2 },
  { from: "B", to: "A", points: 1 },
  { from: "C", to: "A", points: 2 },
  { from: "D", to: "A", points: 3 },
];

// Ưu tiên cải thiện nhảy điểm càng cao càng tốt (được nhiều điểm hơn)
export const IMPROVEMENT_PRIORITY_BY_IMPACT = [
  { from: "D", to: "A", point: 3 },
  { from: "D", to: "B", point: 2 },
  { from: "C", to: "A", point: 2 },
  { from: "D", to: "C", point: 1 },
  { from: "C", to: "B", point: 1 },
  { from: "B", to: "A", point: 1 },
];
