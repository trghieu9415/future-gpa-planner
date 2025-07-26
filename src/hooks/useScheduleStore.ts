import { create } from "zustand";
import { Schedule } from "@/types/schedule";

export const useScheduleStore = create<{
  schedules: Schedule[];
  activatedScheduleId?: string;
  sign: boolean;
  addSchedule: (scheduleName: string) => void;
  removeSchedule: (scheduleId: string) => void;
  setActivatedSchedule: (scheduleId: string) => void;
  getActivatedSchedule: () => Schedule | undefined;
  toggleSign: () => void;
}>((set, get) => ({
  schedules: [],
  activatedScheduleId: undefined,
  sign: false,
  addSchedule: (scheduleName) => {
    const newSchedule = new Schedule(scheduleName);

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
