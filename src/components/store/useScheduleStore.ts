import { create } from "zustand";
import { Schedule } from "@/types/schedule";

export const useScheduleStore = create<{
  schedules: Schedule[];
  activatedScheduleId?: string;
  sign: boolean;
  addSchedule: (scheduleName: string, schedule?: Schedule) => void;
  removeSchedule: (scheduleId: string) => void;
  setActivatedSchedule: (scheduleId: string) => void;
  getActivatedSchedule: () => Schedule | undefined;
  toggleSign: () => void;
}>((set, get) => ({
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
        const schedule = new Schedule("tkb_1");
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
}));
