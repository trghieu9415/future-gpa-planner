import { Course } from "@/types";
import { create } from "zustand";

export const useCoursesStore = create<{
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updatedCourse: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  resetCourses: () => void;
}>((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  resetCourses: () => set({ courses: [] }),
  updateCourse: (id, updatedCourse) =>
    set((state) => ({
      courses: state.courses.map((course) => (course.id === id ? { ...course, ...updatedCourse } : course)),
    })),
  removeCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
    })),
}));
