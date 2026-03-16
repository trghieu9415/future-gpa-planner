import { create } from "zustand";
import { OpenCourseData } from "@/pages/scheduler/types/course";
import { getOpenCourseList } from "@/utils/courseApi";

interface CourseState {
  data: OpenCourseData | null;
  isLoading: boolean;
  error: string | null;
  fetchCourses: () => Promise<void>;
}

export const useCourseStore = create<CourseState>((set, get) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchCourses: async () => {
    if (get().isLoading || get().data) return;

    set({ isLoading: true, error: null });
    try {
      const data = await getOpenCourseList();
      set({ data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
