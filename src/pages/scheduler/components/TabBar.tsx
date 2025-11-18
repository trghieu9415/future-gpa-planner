import { Label } from "@radix-ui/react-label";
import { Camera, Copy, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScheduleStore } from "@/components/store/useScheduleStore";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { copyElementScreenshot, downloadElementScreenshot, jsonToSchedule, scheduleToJson } from "@/utils/u-file";
import { TabsChanger } from "./TabsChanger";

interface Props {
  scheduleRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const TabBar = ({ scheduleRef }: Props) => {
  const { schedules, getActivatedSchedule, addSchedule } = useScheduleStore();

  const handleDownloadScreenshot = async () => {
    if (scheduleRef.current) {
      const schedule = getActivatedSchedule();
      if (!schedule) return;
      await downloadElementScreenshot(scheduleRef.current, schedule.name);
      toast.success(`Đã tải xuống ảnh ${schedule.name}.png!`);
    }
  };

  const handleCopyScreenshot = async () => {
    if (scheduleRef.current) {
      const success = await copyElementScreenshot(scheduleRef.current);
      if (success) {
        toast.success("Đã sao chép ảnh vào clipboard!");
      } else {
        toast.error("Sao chép thất bại. Trình duyệt của bạn có thể không hỗ trợ.");
      }
    }
  };

  const handleExport = () => {
    const schedule = getActivatedSchedule();
    if (schedule) {
      scheduleToJson(schedule);
      toast.success(`Đã xuất thời khóa biểu ${schedule.name}.json!`);
    }
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (schedules.length >= 5) {
          toast.warning("Bạn chỉ có thể có tối đa 5 thời khóa biểu. Vui lòng xóa bớt trước khi nhập.");
          return;
        }
        const schedule = await jsonToSchedule(file);
        addSchedule(schedule.name, schedule);
        toast.success(`Đã nhập thời khóa biểu ${schedule.name} thành công!`);
      } catch (err) {
        toast.error("Nhập thất bại. Tệp JSON không hợp lệ.");
      }
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 justify-between items-center">
      <TabsChanger />
      <div className="flex gap-2">
        <Button variant="outline" size="icon" className="mb-1" onClick={handleDownloadScreenshot}>
          <Camera className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleCopyScreenshot}>
          <Copy className="size-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleExport}>
          <Download className="size-4" />
        </Button>
        <Button variant="outline" size="icon" asChild>
          <Label htmlFor="import-schedule">
            <Upload className="size-4" />
            <input
              type="file"
              id="import-schedule"
              className="hidden"
              accept=".json"
              onChange={handleImport}
              onClick={(e) => ((e.target as HTMLInputElement).value = "")}
            />
          </Label>
        </Button>
      </div>
    </div>
  );
};
