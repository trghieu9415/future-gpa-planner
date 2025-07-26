import { CourseSelect } from "@/components/CourseSelect";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { SelectedCourses } from "@/components/SelectedCourses";
import { TabsChanger } from "@/components/TabsChanger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScheduleStore } from "@/hooks/useScheduleStore";
import { getOpenCourseList, getWeekDateRange } from "@/lib/utils";
import { SignedCourse } from "@/types/schedule";
import { Calendar } from "lucide-react";
import { useEffect } from "react";

export const Scheduler = () => {
  const { schedules, getActivatedSchedule, addSchedule } = useScheduleStore();

  useEffect(() => {
    if (schedules.length === 0) {
      addSchedule("Tab mới");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules]);

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Danh sách môn học</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseSelect />
        </CardContent>
      </Card>
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Thời khóa biểu
            </div>
          </CardTitle>
          <CardDescription>
            Tuần {4}: {getWeekDateRange(4)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsChanger />
          <ScheduleGrid />
        </CardContent>
      </Card>

      {/* Placeholder for future schedule management features */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Danh sách môn học đã chọn</CardTitle>
        </CardHeader>
        <CardContent>
          <SelectedCourses />
        </CardContent>
      </Card>
    </div>
  );
};
