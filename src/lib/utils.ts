import { Course } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCourseList = async (): Promise<{ courseId: string; name: string }[]> => {
  const courses = await fetch("/course-list.json").then((res) => res.json());
  return courses;
};

export const readCourseFromFile = (file: File): Promise<Course[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      try {
        const courses: Course[] = JSON.parse(text);
        resolve(courses);
      } catch (error) {
        reject(new Error("Invalid file format. Please upload a valid JSON file."));
      }
    };
    reader.onerror = () => {
      reject(new Error("Error reading file."));
    };
    reader.readAsText(file);
  });
};
