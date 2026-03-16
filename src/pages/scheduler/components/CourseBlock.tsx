import { SignedCourse } from "@/pages/scheduler/types/schedule";
import { Card } from "../../../components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "../../../components/ui/button";
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { useScheduleStore } from "@/store/useScheduleStore";
import { BookText, Hash, MapPin, Palette, User, Users } from "lucide-react";
import { Label } from "../../../components/ui/label";

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
  "0": "#e11d48", // rose-600
  "1": "#475569", // slate-600
  "2": "#059669", // emerald-600
  "3": "#d97706", // amber-600
  "4": "#52525b", // zinc-600
  "5": "#7c3aed", // violet-600
  "6": "#ca8a04", // yellow-600
  "7": "#0284c7", // sky-600
  "8": "#16a34a", // green-600
  "9": "#ea580c", // orange-600
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

  const handleConfirmRemove = async () => {
    getActivatedSchedule()?.removeCourse(signedCourse.courseId);
    setTimeout(() => {
      toggleSign();
    }, 50);
    setEditDialogOpen(false);
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
            <Button variant="destructive" onClick={() => handleConfirmRemove()} className="h-8 w-16">
              Xóa
            </Button>
            <Button onClick={handleSaveChanges} className="bg-blue-500 text-white hover:bg-blue-600 h-8 w-16">
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
