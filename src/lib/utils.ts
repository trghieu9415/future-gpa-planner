import { Course, LetterGrade, Points, TargetCredits } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { v4 as uuidv4 } from "uuid";
import { IGNORE_COURSE_IDS, LETTER_GRADES } from "@/types/const";
import { OpenCourse, Schedule } from "@/types/schedule";
import { toPng } from "html-to-image";

const COURSE_LIST_URL = "https://raw.githubusercontent.com/trghieu9415/cauhinh_dns_centos/main/course-list.json";
const COURSES_SE_URL = "https://raw.githubusercontent.com/trghieu9415/cauhinh_dns_centos/main/courses-se.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCourseList = async (): Promise<Course[]> => {
  const courses: Course[] = await fetch(COURSE_LIST_URL).then((res) => res.json());
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
            const course = courses.find((c) => c.courseId === courseId);

            if (course) {
              const points = parseFloat(row[6]);
              if (course.points < points) {
                course.points = points as Points;
                course.letterGrade = row[7]?.toString().trim() as LetterGrade;
              }
            } else {
              courses.push({
                id: uuidv4(),
                courseId,
                name: row[3]?.toString().trim(),
                credits: parseInt(row[4]),
                points: parseFloat(row[6]) as Points,
                letterGrade: row[7]?.toString().trim() as LetterGrade,
              });
            }
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

export const calculateAcademicStatus = (courses: Course[]) => {
  const totalPoints = courses.reduce((sum, course) => sum + course.points * course.credits, 0);
  const accumulatedCredits = courses.reduce((sum, course) => sum + course.credits, 0);
  const currentGPA = accumulatedCredits > 0 ? totalPoints / accumulatedCredits : 0.0;

  const totalA = courses.reduce((count, course) => count + (course.letterGrade === "A" ? course.credits : 0), 0);
  const totalB = courses.reduce((count, course) => count + (course.letterGrade === "B" ? course.credits : 0), 0);
  const totalC = courses.reduce((count, course) => count + (course.letterGrade === "C" ? course.credits : 0), 0);
  const totalD = courses.reduce((count, course) => count + (course.letterGrade === "D" ? course.credits : 0), 0);

  return {
    totalState: {
      totalA,
      totalB,
      totalC,
      totalD,
    },
    currentGPA,
    accumulatedCredits,
  };
};

//---------------------------------------------------------------------------------------------------------------------------------------

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

export const getOpenCourseList = async (): Promise<OpenCourse[]> => {
  const courses = (await fetch(COURSES_SE_URL).then((res) => res.json())) as OpenCourse[];
  return courses;
};

export const downloadElementScreenshot = async (element: HTMLDivElement, fileName: string) => {
  const wrapper = document.createElement("div");

  wrapper.style.padding = "5px";
  wrapper.style.backgroundColor = "white";
  wrapper.style.width = "1200px";

  const cloned = element.cloneNode(true) as HTMLElement;
  wrapper.appendChild(cloned);

  document.body.appendChild(wrapper);

  try {
    const dataUrl = await toPng(wrapper, {
      backgroundColor: "white",
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    link.click();
  } finally {
    document.body.removeChild(wrapper);
  }
  return `${fileName}.png`;
};

export const scheduleToJson = (schedule: Schedule) => {
  const json = JSON.stringify(schedule);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${schedule.name}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export const jsonToSchedule = async (file: File): Promise<Schedule> => {
  const text = await file.text();
  try {
    const json = JSON.parse(text);
    const schedule = new Schedule(json.name);
    schedule.id = json.id;
    schedule.signedCourses = json.signedCourses ?? [];
    return schedule;
  } catch (err) {
    throw new Error("Invalid JSON format.");
  }
};
