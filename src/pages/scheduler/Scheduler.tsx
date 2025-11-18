import { CourseSelect } from "@/pages/scheduler/components/CourseSelect";
import { ScheduleGrid } from "@/pages/scheduler/components/ScheduleGrid";
import { SelectedCourses } from "@/pages/scheduler/components/SelectedCourses";
import { useRef, useState } from "react";
import { TabBar } from "./components/TabBar";

export const Scheduler = () => {
  const scheduleRef = useRef<HTMLDivElement>(null);
  const [week, setWeek] = useState(4);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-6">
        <div className="border rounded-lg p-4 ">
          <CourseSelect />
        </div>
        <div className="border rounded-lg p-4 ">
          <h4 className="text-lg font-bold text-foreground mb-4">Thời khóa biểu</h4>

          <TabBar scheduleRef={scheduleRef} />
          <ScheduleGrid ref={scheduleRef} week={week} setWeek={setWeek} />
        </div>
        <div className="border rounded-lg p-4 ">
          <SelectedCourses />
        </div>
      </div>
    </div>
  );
};
