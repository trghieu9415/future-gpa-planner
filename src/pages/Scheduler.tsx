import { ScheduleGrid } from "@/components/ScheduleGrid";
import { TabsChanger } from "@/components/TabsChanger";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getWeekDateRange } from "@/lib/utils";
import { SignedCourse } from "@/types/schedule";
import { Calendar } from "lucide-react";

const tmpCourse = {
  courseId: "111",
  courseName: "Toán cao cấp",
  groupId: "1",
  schedule: [
    {
      teacher: "Nguyễn Văn A",
      room: "101",
      dayOfWeek: 2,
      startPeriod: 1,
      periodCount: 2,
      studyWeeks: [1, 2, 3, 4],
    },
    {
      teacher: "Nguyễn Văn A",
      room: "101",
      dayOfWeek: 4,
      startPeriod: 3,
      periodCount: 3,
      studyWeeks: [1, 2, 3, 4],
    },
  ],
} as SignedCourse;

export const Scheduler = () => {
  return (
    <div className="space-y-6">
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
          <ScheduleGrid signedCourses={[tmpCourse]} />
        </CardContent>
      </Card>

      {/* Placeholder for future schedule management features */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle>Chức năng sẽ sớm ra mắt</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Chúng tôi đang làm việc chăm chỉ để mang đến cho bạn trải nghiệm quản lý thời khóa biểu tốt nhất. Hãy quay
            lại sau!
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
