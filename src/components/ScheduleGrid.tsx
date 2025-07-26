import { SignedCourses } from "@/types/schedule";
import { CourseBlock } from "./CourseBlock";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { getWeekDateRange } from "@/lib/utils";
import { useScheduleStore } from "@/hooks/useScheduleStore";
import { useEffect, useState } from "react";

const daysOfWeek = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
const periods = [1, 2, 3, 4, 5, "Trưa", 6, 7, 8, 9, 10, "Tối", 11, 12, 13];

export const ScheduleGrid = () => {
  const { getActivatedSchedule, sign } = useScheduleStore();
  const [signedCourses, setSignedCourses] = useState<SignedCourses>([]);

  useEffect(() => {
    const signedCourses = getActivatedSchedule()?.signedCourses ?? [];
    setSignedCourses(signedCourses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sign]);

  return (
    <div className="w-full overflow-x-auto">
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
                      <span className="text-sm font-medium text-foreground">Tiết {period}</span>
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
                    <span className="font-medium text-sm text-white">{period}</span>
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
                const startPeriod = scheduleItem.startPeriod;
                const extraRowAdd = startPeriod > 10 ? 2 : startPeriod > 5 ? 1 : 0;

                const gridRow = `${scheduleItem.startPeriod + extraRowAdd} / span ${scheduleItem.periodCount}`;
                const gridColumn = scheduleItem.dayOfWeek;

                return (
                  <CourseBlock
                    key={`${signedCourse.courseId}-${scheduleItem.dayOfWeek}-${scheduleItem.startPeriod}`}
                    courseId={signedCourse.courseId}
                    courseName={signedCourse.courseName || "Unknown Course"}
                    groupId={signedCourse.groupId}
                    teacher={scheduleItem.teacher}
                    room={scheduleItem.room}
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
        <Select onValueChange={(value) => {}} defaultValue="1">
          <SelectTrigger className="w-72 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: 20 }, (_, i) => (
                <SelectItem key={i + 1} value={`${i + 1}`}>
                  Tuần {i + 1} [{getWeekDateRange(i + 1)}]
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
