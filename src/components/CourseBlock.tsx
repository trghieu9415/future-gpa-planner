import { SignedCourse } from "@/types/schedule";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useScheduleStore } from "@/hooks/useScheduleStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BookText, Hash, MapPin, Palette, User, Users } from "lucide-react";
import { Label } from "./ui/label";

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

// Bảng màu mặc định (dạng hex) nếu người dùng chưa tùy chỉnh
const defaultHexPalette: Record<string, string> = {
  "0": "#fecaca", // rose-300
  "1": "#d1d5db", // slate-300
  "2": "#a7f3d0", // emerald-300
  "3": "#fde68a", // amber-300
  "4": " #d4d4d8", // zinc-300
  "5": "#ddd6fe", // violet-300
  "6": "#facc15", // yellow-400
  "7": "#bae6fd", // sky-300
  "8": "#86efac", // green-300
  "9": "#fed7aa", // orange-300
};

// Component con để hiển thị thông tin
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="flex items-center gap-3 py-1.5 border-b border-dashed">
    <div className="text-muted-foreground">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-muted-foreground">{label}</p>
      <div className="font-semibold text-sm">{value}</div>
    </div>
  </div>
);

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
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  // State giờ sẽ lưu mã màu hex
  const [selectedColor, setSelectedColor] = useState(
    signedCourse.color || defaultHexPalette[courseId[5]] || defaultHexPalette["1"]
  );

  const { toggleSign, getActivatedSchedule } = useScheduleStore();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOpenEditDialog = () => {
    // Khởi tạo màu khi mở dialog
    setSelectedColor(signedCourse.color || defaultHexPalette[courseId[5]] || defaultHexPalette["1"]);
    setEditDialogOpen(true);
    setTimeout(() => {
      inputRef.current?.blur();
    }, 100);
  };

  const handleSaveChanges = () => {
    const schedule = getActivatedSchedule();
    if (schedule) {
      const course = schedule.signedCourses.find((c) => c.courseId === signedCourse.courseId);
      if (course) {
        course.courseName = inputRef.current?.value || course.courseName;
        course.color = selectedColor; // Lưu mã màu hex
      }
      toggleSign();
    }
    setEditDialogOpen(false);
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSaveChanges();
    else if (e.key === "Escape") setEditDialogOpen(false);
  };

  const handleConfirmRemove = () => {
    getActivatedSchedule()?.removeCourse(signedCourse.courseId);
    toggleSign();
    setEditDialogOpen(false);
    setIsAlertOpen(false);
  };

  // Lấy màu cuối cùng để hiển thị (ưu tiên màu tùy chỉnh)
  const finalColor = signedCourse.color || defaultHexPalette[courseId[5]] || defaultHexPalette["1"];

  return (
    <>
      <div
        style={{
          gridRow: gridRow,
          gridColumn: gridColumn,
          backgroundColor: "white",
        }}
      ></div>
      <Card
        onClick={handleOpenEditDialog}
        className={cn(
          "px-2 py-1 cursor-pointer transition-all duration-200 hover:shadow-sm",
          "flex flex-col justify-center text-xs rounded-none border-l-4 border-y-0 border-r-0"
        )}
        style={{
          gridRow: gridRow,
          gridColumn: gridColumn,
          backgroundColor: `${finalColor}33`, // Thêm độ trong suốt 20% cho màu nền
          borderLeftColor: finalColor,
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thông tin chi tiết môn học</DialogTitle>
            <DialogDescription className="sr-only">Xem hoặc chỉnh sửa thông tin môn học đã chọn</DialogDescription>
          </DialogHeader>
          <div className="pt-2">
            <InfoRow
              icon={<BookText size={18} />}
              label="Môn học"
              value={
                <Input
                  type="text"
                  className="border w-full h-8 mt-1 text-sm font-semibold"
                  defaultValue={courseName}
                  ref={inputRef}
                  onKeyDown={handleEnterPress}
                />
              }
            />
            <InfoRow icon={<Hash size={18} />} label="Mã môn" value={courseId} />
            <InfoRow icon={<Users size={18} />} label="Nhóm lớp" value={groupId} />
            <InfoRow icon={<User size={18} />} label="Giảng viên" value={teacher} />
            <InfoRow icon={<MapPin size={18} />} label="Phòng học" value={room} />
          </div>

          <div className="space-y-2 pt-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-2">
              <Palette size={16} /> Màu tùy chỉnh
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="h-10 w-10 p-1 rounded-md cursor-pointer"
              />
              <div className="font-mono text-sm p-2 bg-muted rounded-md w-full">{selectedColor.toUpperCase()}</div>
            </div>
          </div>

          <DialogFooter className="justify-end flex-row gap-2 sm:gap-0">
            <Button variant="destructive" onClick={() => setIsAlertOpen(true)} className="h-8 w-16">
              Xóa
            </Button>
            <Button onClick={handleSaveChanges} className="bg-blue-500 text-white hover:bg-blue-600 h-8 w-16">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa môn học "{courseName}" khỏi thời khóa biểu này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
