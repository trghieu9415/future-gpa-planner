import { create } from "zustand";
import { Schedule } from "@/types/schedule";

export const useScheduleStore = create<{
  schedules: Schedule[];
  activatedScheduleId?: string;
  addSchedule: (scheduleName: string) => void;
  removeSchedule: (scheduleId: string) => void;
  setActivatedSchedule: (scheduleId: string) => void;
  getActivatedSchedule: () => Schedule | undefined;
  renameSchedule: (id: string, newName: string) => void;
}>((set, get) => ({
  schedules: [],
  activatedScheduleId: undefined,

  addSchedule: (scheduleName) => {
    const newSchedule = new Schedule(scheduleName);

    set((state) => ({
      schedules: [...state.schedules, newSchedule],
      activatedScheduleId: newSchedule.id,
    }));
  },

  removeSchedule: (scheduleId) =>
    set((state) => {
      const filtered = state.schedules.filter((s) => s.id !== scheduleId);
      const isRemovedActive = state.activatedScheduleId === scheduleId;

      return {
        schedules: filtered,
        activatedScheduleId: isRemovedActive ? filtered[0]?.id : state.activatedScheduleId,
      };
    }),

  setActivatedSchedule: (scheduleId) => set({ activatedScheduleId: scheduleId }),

  getActivatedSchedule: () => get().schedules.find((s) => s.id === get().activatedScheduleId),

  renameSchedule: (id, newName) =>
    set((state) => {
      const updatedSchedules = state.schedules.map((s) => {
        if (s.id === id) {
          s.name = newName;
        }
        return s;
      });
      return { schedules: updatedSchedules };
    }),
}));
