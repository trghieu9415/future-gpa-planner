import { Course, LetterGrade, Points, TargetCredits } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { IGNORE_COURSE_IDS, LETTER_GRADES } from "@/types/const";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCourseList = async (): Promise<{ courseId: string; name: string; credits: number }[]> => {
  const courses = await fetch("/course-list.json").then((res) => res.json());
  return courses;
};

export const readCourseFromFile = (file: File): Promise<Course[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        const courses: Course[] = [];

        json.forEach((row) => {
          const courseId = row[1]?.toString().trim();
          if (
            /^8\d{5}$/.test(courseId) &&
            !IGNORE_COURSE_IDS.includes(courseId) &&
            LETTER_GRADES.includes(row[7]?.toString().trim())
          ) {
            courses.push({
              id: uuidv4(),
              courseId,
              name: row[3]?.toString().trim(),
              credits: parseInt(row[4]),
              points: parseFloat(row[6]) as Points,
              letterGrade: row[7]?.toString().trim() as LetterGrade,
            });
          }
        });

        resolve(courses);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const calculateRequiredGrades = (
  currentGPA: number,
  accumulatedCredits: number,
  requiredCredits: number,
  targetGPA: number
): TargetCredits => {
  const currentQualityPoints = currentGPA * accumulatedCredits;
  const remainingCredits = requiredCredits - accumulatedCredits;

  if (remainingCredits <= 0) {
    return { a: 0, b: 0, c: 0, d: 0, finalGPA: currentGPA };
  }

  for (let a = 0; a <= remainingCredits; a++) {
    for (let b = 0; b <= remainingCredits - a; b++) {
      for (let c = 0; c <= remainingCredits - a - b; c++) {
        const d = remainingCredits - a - b - c;
        const totalQualityPoints = a * 4.0 + b * 3.0 + c * 2.0 + d * 1.0;

        const finalGPA = parseFloat(((currentQualityPoints + totalQualityPoints) / requiredCredits).toFixed(2));
        if (finalGPA >= targetGPA) {
          return { a, b, c, d, finalGPA };
        }
      }
    }
  }

  return {
    a: remainingCredits,
    b: 0,
    c: 0,
    d: 0,
    finalGPA: (currentGPA * accumulatedCredits + remainingCredits * 4.0) / requiredCredits,
  };
};
