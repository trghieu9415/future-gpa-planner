import { CourseSelect } from "@/components/CourseSelect";
import { ScheduleGrid } from "@/components/ScheduleGrid";
import { SelectedCourses } from "@/components/SelectedCourses";
import { TabsChanger } from "@/components/TabsChanger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScheduleStore } from "@/hooks/useScheduleStore";
import { downloadElementScreenshot, getWeekDateRange, jsonToSchedule, scheduleToJson } from "@/lib/utils";
import { Camera, Import, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Scheduler = () => {
  const { schedules, getActivatedSchedule, addSchedule, setActivatedSchedule, toggleSign } = useScheduleStore();
  const [week, setWeek] = useState(1);

  const scheduleGridRef = useRef<HTMLDivElement>(null);
  const inputJsonRef = useRef<HTMLInputElement | null>(null);

  const handleScreenshot = async () => {
    toast.promise(downloadElementScreenshot(scheduleGridRef.current, getActivatedSchedule()?.name || "schedule"), {
      loading: "Đang lưu...",
      success: "Đã lưu ảnh!",
      error: "Lưu ảnh thất bại!",
    });
  };

  const handleExportFile = async () => {
    const schedule = getActivatedSchedule();
    if (!schedule) return;

    scheduleToJson(schedule);
    toast.success(`Đã tải về`, { description: `${schedule?.name}.json` });
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const schedule = await jsonToSchedule(file);
    if (!schedule) return;
    addSchedule("", schedule);
    setActivatedSchedule(schedule.id);
    e.target.value = "";
    toggleSign();
    console.log("Imported schedule:", getActivatedSchedule());
  };

  const handleImportClick = () => {
    inputJsonRef.current?.click();
  };

  useEffect(() => {
    if (schedules.length === 0) {
      addSchedule("tkb_1");
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
        <CardHeader className="flex">
          <CardTitle className="flex items-center justify-between gap-2">
            <div className="w-full flex-col-reverse flex  items-start sm:items-center sm:justify-between sm:flex-row">
              <div className="flex items-center gap-2">Thời khóa biểu</div>
              <div className="flex items-center gap-2 sm:mb-0 mb-4">
                <Button
                  variant="outline"
                  className="hover:bg-red-500 bg-red-400 !text-white"
                  onClick={handleImportClick}
                >
                  <Import className="size 4" /> <span className="hidden sm:flex">Nhập file</span>
                </Button>
                <input ref={inputJsonRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

                <Button
                  variant="outline"
                  className="hover:bg-emerald-600 bg-emerald-500 !text-white"
                  onClick={() => handleExportFile()}
                >
                  <Upload className="size 4" /> <span className="hidden sm:flex">Xuất file</span>
                </Button>
                <Button
                  variant="outline"
                  className="hover:bg-zinc-600 bg-zinc-500 !text-white"
                  onClick={() => handleScreenshot()}
                >
                  <Camera className="size 4" />
                </Button>
              </div>
            </div>
          </CardTitle>
          <CardDescription>
            Tuần {week}: {getWeekDateRange(week)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TabsChanger />
          <ScheduleGrid ref={scheduleGridRef} week={week} setWeek={setWeek} />
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
