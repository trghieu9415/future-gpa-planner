import { SignedCourses } from "@/pages/scheduler/types/schedule";
import { CourseBlock } from "./CourseBlock";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { useScheduleStore } from "@/store/useScheduleStore";
import { useEffect, useState, forwardRef } from "react";
import { getWeekDateRange } from "@/utils/u-math";
import { useCourseStore } from "@/store/useCourseStore";

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const periods = [1, 2, 3, 4, 5, "Trưa", 6, 7, 8, 9, 10, "Tối", 11, 12, 13];

export const ScheduleGrid = forwardRef<HTMLDivElement>(({ ..._ }, ref) => {
  const { getActivatedSchedule, sign } = useScheduleStore();
  const { setWeek, week } = useScheduleStore();

  const startDate = useCourseStore((state) => state.data?.startDate);

  const [signedCourses, setSignedCourses] = useState<SignedCourses>([]);

  useEffect(() => {
    const signedCourses = getActivatedSchedule()?.signedCourses ?? [];
    setSignedCourses(signedCourses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sign]);

  return (
    <div className="w-full overflow-x-auto" ref={ref}>
      <div className="min-w-[800px] shadow-lg">
        {/* Header */}
        <div className="grid grid-cols-7 gap-[0.2rem] mb-[0.2rem]">
          <div className="py-1 border bg-white flex items-center justify-center">
            <span className="text-black font-semibold text-sm">Tiết / Ngày</span>
          </div>
          {daysOfWeek.map((day, index) => (
            <div key={index} className="py-1 border bg-[#f6f6ff] flex items-center justify-center">
              <span className="text-black font-semibold text-sm">{day}</span>
            </div>
          ))}
        </div>

        {/* Periods */}
        <div className="relative">
          <div className="grid grid-cols-7 gap-[0.2rem]">
            {periods.map((period) => (
              <div key={`period-${period}`} className="contents">
                {/* Day Cells */}
                {/* Period Label */}
                {typeof period === "number" ? (
                  <>
                    <div className="py-1 border flex items-center justify-center bg-[#f6f6ff]">
                      <span className="text-sm font-semibold text-foreground">Tiết {period}</span>
                    </div>
                    {daysOfWeek.map((_, dayIndex) => (
                      <div key={`${period}-${dayIndex}`} className="py-1 border" />
                    ))}
                  </>
                ) : (
                  <div
                    key={`period-${period}`}
                    className="py-1 border col-span-7 flex items-center justify-center bg-[#8da2bd]"
                  >
                    <span className="text-sm font-semibold text-white">{period}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div
            className="absolute inset-0 grid grid-cols-7 gap-[0.2rem]"
            style={{
              gridTemplateRows: `repeat(15, minmax(0, 1fr))`,
            }}
          >
            <div className="col-span-1" />

            {/* Subject blocks */}
            {signedCourses.flatMap((signedCourse) =>
              signedCourse.schedule.map((scheduleItem) => {
                if (!scheduleItem.studyWeeks.includes(week)) return null;

                const startPeriod = scheduleItem.startPeriod;
                const extraRowAdd = startPeriod > 10 ? 2 : startPeriod > 5 ? 1 : 0;

                let periodCount = scheduleItem.periodCount;

                if (startPeriod + scheduleItem.periodCount > 11 && startPeriod <= 10) {
                  periodCount += 1;
                }

                const gridRow = `${scheduleItem.startPeriod + extraRowAdd} / span ${periodCount}`;
                const gridColumn = scheduleItem.dayOfWeek;

                return (
                  <CourseBlock
                    key={`${signedCourse.courseId}-${scheduleItem.dayOfWeek}-${scheduleItem.startPeriod}`}
                    courseId={signedCourse.courseId}
                    courseName={signedCourse.courseName || "Unknown Course"}
                    groupId={signedCourse.groupId}
                    teacher={scheduleItem.teacher}
                    room={scheduleItem.room}
                    signedCourse={signedCourse}
                    gridRow={gridRow}
                    gridColumn={gridColumn}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 mb-2">
        <Select onValueChange={(value) => setWeek(parseInt(value))} defaultValue={`${week}`}>
          <SelectTrigger className="w-72 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="max-h-[200px] overflow-y-auto">
              {Array.from({ length: 27 }, (_, i) => (
                <SelectItem key={i + 1} value={`${i + 1}`}>
                  Tuần {i + 1}:{" "}
                  <span className="tracking-[0.05rem]">{getWeekDateRange(i + 1, new Date(startDate))}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
});
