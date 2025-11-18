import { useEffect, useRef, useState } from "react";
import { useScheduleStore } from "@/components/store/useScheduleStore";
import { Plus, X } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { toast } from "sonner";
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
import { Schedule } from "@/types/schedule";

export const TabsChanger = () => {
  const { schedules, getActivatedSchedule, addSchedule, removeSchedule, setActivatedSchedule } = useScheduleStore();

  const [editingTabId, setEditingTabId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // State cho dialog xác nhận xóa
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);

  useEffect(() => {
    if (editingTabId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingTabId]);

  useEffect(() => {
    if (!getActivatedSchedule()) {
      addSchedule(`tkb_1`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabDoubleClick = (e: React.MouseEvent<HTMLDivElement>, tabId: string, currentName: string) => {
    e.currentTarget.focus();
    setEditingTabId(tabId);
    setEditingName(currentName);
  };

  const handleRename = (tabId: string) => {
    const schedule = schedules.find((s) => s.id === tabId);
    if (schedule && editingName.trim()) {
      schedule.name = editingName.trim();
    }
    setEditingTabId(null);
    setEditingName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === "Enter") {
      handleRename(tabId);
    } else if (e.key === "Escape") {
      setEditingTabId(null);
      setEditingName("");
    }
  };

  // Xử lý khi nhấn nút xóa
  const handleDeleteClick = (schedule: Schedule) => {
    // Nếu tab không có môn học nào, xóa ngay lập tức
    if (!schedule.signedCourses || schedule.signedCourses.length === 0) {
      removeSchedule(schedule.id);
    } else {
      // Nếu có môn học, mở dialog xác nhận
      setScheduleToDelete(schedule);
      setIsDeleteDialogOpen(true);
    }
  };

  // Xử lý khi xác nhận xóa từ dialog
  const confirmDelete = () => {
    if (scheduleToDelete) {
      const scheduleName = scheduleToDelete.name;
      removeSchedule(scheduleToDelete.id);
      setScheduleToDelete(null);
      toast.success(`Đã xóa tab "${scheduleName}" thành công.`);
    }
  };

  return (
    <>
      <div className="w-full grid md:grid-cols-6 grid-cols-3 gap-1">
        {schedules.length > 0 &&
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className={`flex items-center justify-between p-1 px-2 rounded-none border-b h-8 cursor-pointer border ${
                getActivatedSchedule()?.id === schedule.id ? "bg-white border-b-0" : "bg-[#cccccc]"
              }`}
              onClick={() => setActivatedSchedule(schedule.id)}
              onDoubleClick={(e) => handleTabDoubleClick(e, schedule.id, schedule.name)}
            >
              {editingTabId === schedule.id ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, schedule.id)}
                  onBlur={() => handleRename(schedule.id)}
                  className="border text-sm rounded px-2 py-1 w-full border-none focus:outline-none"
                />
              ) : (
                <span className="font-semibold truncate text-sm">{schedule.name}</span>
              )}
              <button
                className="text-gray-500 hover:text-gray-700 ml-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClick(schedule);
                }}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        {schedules.length <= 5 && (
          <Button
            variant="link"
            className="h-8 w-8 border-none group text-gray-500 hover:text-gray-700"
            onClick={() => addSchedule(`tkb_${schedules.length + 1}`)}
          >
            <Plus className="size-4" />
          </Button>
        )}
      </div>

      {/* Dialog xác nhận xóa */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa "{scheduleToDelete?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Các môn học đã thêm nằm trong tab này sẽ bị xóa. Bạn sẽ không thể hoàn tác hành động này.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setScheduleToDelete(null)}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
