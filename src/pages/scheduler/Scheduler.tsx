import { CourseSelect } from "@/pages/scheduler/components/CourseSelect";
import { ScheduleGrid } from "@/pages/scheduler/components/ScheduleGrid";
import { SelectedCourses } from "@/pages/scheduler/components/SelectedCourses";
import { useEffect, useRef } from "react";
import { TabBar } from "./components/TabBar";
import { useCourseStore } from "@/store/useCourseStore";
import { useScheduleStore } from "@/store/useScheduleStore";

export const Scheduler = () => {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const { data, fetchCourses } = useCourseStore();
  const { setWeek } = useScheduleStore();

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.defaultDisplayWeek) {
      setWeek(data.defaultDisplayWeek);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="border rounded-lg p-4 ">
          <CourseSelect />
        </div>
        <div className="border rounded-lg p-4 ">
          <h4 className="text-lg font-bold text-foreground mb-4">Thời khóa biểu</h4>

          <TabBar scheduleRef={scheduleRef} />
          <ScheduleGrid ref={scheduleRef} />
        </div>
        <div className="border rounded-lg p-4 ">
          <SelectedCourses />
        </div>
      </div>
    </div>
  );
};
