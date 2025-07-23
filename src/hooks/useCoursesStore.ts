import { Course } from "@/types";
import { create } from "zustand";

export const useCoursesStore = create<{
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  resetCourses: () => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updatedCourse: Partial<Course>) => void;
  removeCourse: (id: string) => void;
}>((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses }),
  resetCourses: () => set({ courses: [] }),
  addCourse: (course) => set((state) => ({ courses: [...state.courses, course] })),
  updateCourse: (id, updatedCourse) =>
    set((state) => ({
      courses: state.courses.map((course) => (course.id === id ? { ...course, ...updatedCourse } : course)),
    })),
  removeCourse: (id) =>
    set((state) => ({
      courses: state.courses.filter((course) => course.id !== id),
    })),
}));
