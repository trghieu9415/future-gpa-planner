import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Schedule } from "@/types/schedule";

export const useScheduleStore = create(
  persist<{
    schedules: Schedule[];
    activatedScheduleId?: string;
    sign: boolean;
    addSchedule: (scheduleName: string, schedule?: Schedule) => void;
    removeSchedule: (scheduleId: string) => void;
    setActivatedSchedule: (scheduleId: string) => void;
    getActivatedSchedule: () => Schedule | undefined;
    toggleSign: () => void;
  }>(
    (set, get) => ({
      schedules: [],
      activatedScheduleId: undefined,
      sign: false,
      addSchedule: (scheduleName, schedule) => {
        let newSchedule = new Schedule(scheduleName);
        if (schedule) {
          newSchedule = schedule;
        }

        set((state) => ({
          schedules: [...state.schedules, newSchedule],
          activatedScheduleId: newSchedule.id,
          sign: !get().sign,
        }));
      },

      removeSchedule: (scheduleId) =>
        set((state) => {
          const filtered = state.schedules.filter((s) => s.id !== scheduleId);
          const isRemovedActive = state.activatedScheduleId === scheduleId;

          if (filtered.length === 0) {
            const schedule = new Schedule("TKB_1");
            return { schedules: [schedule], activatedScheduleId: schedule.id, sign: !get().sign };
          }

          return {
            schedules: filtered,
            activatedScheduleId: isRemovedActive ? filtered[0]?.id : state.activatedScheduleId,
            sign: !get().sign,
          };
        }),

      setActivatedSchedule: (scheduleId) => set({ activatedScheduleId: scheduleId, sign: !get().sign }),

      getActivatedSchedule: () => get().schedules.find((s) => s.id === get().activatedScheduleId),
      toggleSign: () => set((state) => ({ sign: !state.sign })),
    }),
    {
      name: "schedule-storage", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage, {
        // Hàm reviver để chuyển đổi đối tượng JSON thô thành instance của lớp Schedule
        reviver: (key, value) => {
          if (key === "schedules" && Array.isArray(value)) {
            return value.map((s) => {
              const schedule = new Schedule(s.name);
              schedule.id = s.id;
              schedule.signedCourses = s.signedCourses;
              return schedule;
            });
          }
          return value;
        },
      }),
    }
  )
);
