import { Course } from "@/types";
import { create } from "zustand";

const sortCourses = (courses: Course[]) => {
  return [...courses].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    return a.name.localeCompare(b.name);
  });
};

export const useCoursesStore = create<{
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  resetCourses: () => void;
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updatedCourse: Partial<Course>) => void;
  removeCourse: (id: string) => void;
  totalState: { totalA: number; totalB: number; totalC: number; totalD: number };
  setTotalState: (totalState: { totalA: number; totalB: number; totalC: number; totalD: number }) => void;
}>((set) => ({
  courses: [],
  setCourses: (courses) => set({ courses: sortCourses(courses) }),
  resetCourses: () => set({ courses: [] }),
  addCourse: (course) =>
    set((state) => ({
      courses: sortCourses([...state.courses, course]),
    })),
  updateCourse: (id, updatedCourse) =>
    set((state) => ({
      courses: sortCourses(
        state.courses.map((course) => (course.id === id ? { ...course, ...updatedCourse } : course))
      ),
    })),
  removeCourse: (id) =>
    set((state) => ({
      courses: sortCourses(state.courses.filter((course) => course.id !== id)),
    })),
  totalState: { totalA: 0, totalB: 0, totalC: 0, totalD: 0 },
  setTotalState: (totalState) => set({ totalState: { ...totalState } }),
}));
