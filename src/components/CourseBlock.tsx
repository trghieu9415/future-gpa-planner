import { SignedCourse } from "@/types/schedule";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useScheduleStore } from "@/hooks/useScheduleStore";

interface CourseBlockProps {
  courseId: string;
  courseName: string;
  groupId: string;
  teacher: string;
  room: string;
  signedCourse: SignedCourse;
  gridRow: string;
  gridColumn: number;
}

const getSubjectColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    "0": "bg-rose-300 border-rose-400 hover:bg-rose-200",
    "1": "bg-slate-300 border-slate-400 hover:bg-slate-200",
    "2": "bg-emerald-300 border-emerald-400 hover:bg-emerald-100",
    "3": "bg-amber-300 border-amber-400 hover:bg-amber-200",
    "4": "bg-zinc-300 border-zinc-400 hover:bg-zinc-200",
    "5": "bg-violet-300 border-violet-400 hover:bg-violet-200",
    "6": "bg-yellow-400 border-yellow-500 hover:bg-yellow-200",
    "7": "bg-sky-300 border-sky-400 hover:bg-sky-200",
    "8": "bg-green-300 border-green-400 hover:bg-green-200",
    "9": "bg-orange-300 border-orange-400 hover:bg-orange-200",
  };
  return colorMap[color] || colorMap["1"];
};

export const CourseBlock = ({
  courseId,
  groupId,
  courseName,
  teacher,
  room,
  signedCourse,
  gridRow,
  gridColumn,
}: CourseBlockProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const { toggleSign, getActivatedSchedule } = useScheduleStore();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    inputRef.current?.focus();
    inputRef.current?.select();
  };

  const handleSaveChanges = () => {
    signedCourse.courseName = inputRef.current?.value || signedCourse.courseName;
    toggleSign();
    setDialogOpen(false);
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveChanges();
      setDialogOpen(false);
    } else if (e.key === "Escape") {
      setDialogOpen(false);
    }
  };

  const handleRemove = () => {
    getActivatedSchedule()?.removeCourse(signedCourse.courseId);
    toggleSign();
  };

  return (
    <>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Card
              className={cn(
                "px-2 py-1 cursor-pointer transition-all duration-200 hover:shadow-sm",
                "flex flex-col justify-center text-xs rounded-none border-l-4 border-y-0 border-r-0",
                getSubjectColorClass(courseId[5])
              )}
              style={{
                gridRow,
                gridColumn: gridColumn,
              }}
            >
              <div className="text-gray-800 mb-1 leading-4 font-bold line-clamp-2">
                {courseName} ({courseId})
              </div>
              <div className="text-xs text-gray-700">
                <span className="font-bold italic">Phòng: </span>
                {room}
              </div>
            </Card>
          </TooltipTrigger>
          <TooltipContent className="p-4 shadow-lg">
            <div className="text-xs text-left text-gray-900 mb-1 space-y-1">
              <div className="w-[280px] flex">
                <span className="w-[80px] font-bold">Môn học</span>
                <span className="w-[190px] line-clamp-3">{courseName}</span>
              </div>
              <div className="w-[280px] flex">
                <span className="w-[80px] font-bold">Mã</span>
                <span className="w-[190px] line-clamp-3">{courseId}</span>
              </div>
              <div className="w-[280px] flex">
                <span className="w-[80px] font-bold">Nhóm lớp</span>
                <span className="w-[190px] line-clamp-3">{groupId}</span>
              </div>
              <div className="w-[280px] flex">
                <span className="w-[80px] font-bold">Giảng viên</span>
                <span className="w-[190px] line-clamp-3">{teacher}</span>
              </div>
              <div className="w-[280px] flex">
                <span className="!w-[80px] font-bold">Phòng</span>
                <span className="w-[190px] line-clamp-3">{room}</span>
              </div>
            </div>
            <div className="w-full flex justify-end gap-x-2">
              <Button
                onClick={handleRemove}
                variant="outline"
                className="h-5 w-8 text-xs bg-white text-red-500 border-red-500 hover:bg-red-500 hover:text-white"
              >
                Xóa
              </Button>
              <Button
                onClick={() => handleOpenDialog()}
                variant="outline"
                className="h-5 w-8 text-xs bg-white text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white"
              >
                Sửa
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogTitle>
            <div className="text-md font-semibold mb-4">Thông tin chi tiết</div>
          </DialogTitle>
          <DialogDescription className="sr-only">Xem hoặc chỉnh sửa thông tin môn học đã chọn</DialogDescription>
          <div className="flex flex-col gap-y-2">
            <div className="w-full text-sm flex h-6 justify-between items-center">
              <span className="w-28 font-bold">Môn học:</span>
              <Input
                type="text"
                className="border w-full h-6 font-xs"
                defaultValue={courseName}
                ref={inputRef}
                onKeyDown={handleEnterPress}
              />
            </div>
            <div className="w-full text-sm flex h-6 justify-start items-center">
              <span className="w-28 font-bold">Mã môn:</span>
              {courseId}
            </div>
            <div className="w-full text-sm flex h-6 justify-start items-center">
              <span className="w-28 font-bold">Nhóm lớp:</span>
              {groupId}
            </div>
            <div className="w-full text-sm flex h-6 justify-start items-center">
              <span className="w-28 font-bold">Giảng viên:</span>
              {teacher}
            </div>
            <div className="w-full text-sm flex h-6 justify-start items-center">
              <span className="w-28 font-bold">Phòng học:</span>
              {room}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveChanges} className="w-12 h-8 bg-blue-500 text-white hover:bg-blue-600">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
