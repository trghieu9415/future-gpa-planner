import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { OpenCourse, CourseGroup, GroupSchedule } from "@/types/schedule";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Trash, Plus } from "lucide-react";

const parseStudyWeeks = (input: string): number[] => {
  if (!input) return [];
  const parts = input.split(",");
  const weeks: number[] = [];
  parts.forEach((p) => {
    if (p.includes("-")) {
      const [start, end] = p.split("-").map(Number);
      for (let i = start; i <= end; i++) weeks.push(i);
    } else {
      weeks.push(Number(p));
    }
  });
  return weeks.filter((n) => !isNaN(n));
};

const defaultGroup = (): CourseGroup => ({
  groupId: uuidv4(),
  classSize: 50,
  schedule: [],
});

const DAYS = [
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "CN" },
];

export default function CourseCreate() {
  const [courseCode, setCourseCode] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(3);
  const [color, setColor] = useState("#3b82f6"); // default blue
  const [groups, setGroups] = useState<CourseGroup[]>([defaultGroup()]);

  // dialog state
  const [openGroupDialog, setOpenGroupDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [teacher, setTeacher] = useState("");
  const [room, setRoom] = useState("");
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [startPeriod, setStartPeriod] = useState(1);
  const [periodCount, setPeriodCount] = useState(3);
  const [studyWeeksInput, setStudyWeeksInput] = useState("");
  const [targetGroupId, setTargetGroupId] = useState<string | null>(null);

  const handleAddSchedule = (groupId: string) => {
    setTargetGroupId(groupId);
    setOpenScheduleDialog(true);
  };

  const saveSchedule = () => {
    if (!targetGroupId) return;

    const newSchedule: GroupSchedule[] = selectedDays.map((d) => ({
      teacher,
      room,
      dayOfWeek: d,
      startPeriod,
      periodCount,
      studyWeeks: parseStudyWeeks(studyWeeksInput),
    }));

    setGroups((prev) =>
      prev.map((g) => (g.groupId === targetGroupId ? { ...g, schedule: [...g.schedule, ...newSchedule] } : g))
    );

    // reset state
    setTeacher("");
    setRoom("");
    setSelectedDays([]);
    setStartPeriod(1);
    setPeriodCount(3);
    setStudyWeeksInput("");
    setOpenScheduleDialog(false);
  };

  const handleRemoveSchedule = (groupId: string, index: number) => {
    setGroups((prev) =>
      prev.map((g) => (g.groupId === groupId ? { ...g, schedule: g.schedule.filter((_, i) => i !== index) } : g))
    );
  };

  const handleAddGroup = () => {
    setGroups((prev) => [...prev, defaultGroup()]);
  };

  const handleSubmit = () => {
    const course: OpenCourse & { courseCode: string; color: string } = {
      courseId: uuidv4(),
      courseCode,
      name,
      credits,
      color,
      groups,
    };

    console.log("Created Course:", course);
    alert("Tạo học phần thành công! Xem console log.");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Tạo học phần</CardTitle>
          <CardDescription>Điền thông tin học phần, mã môn và thêm nhóm học.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Course Info */}
          <div className="space-y-2">
            <Label>Mã môn học</Label>
            <Input value={courseCode} onChange={(e) => setCourseCode(e.target.value)} placeholder="VD: 841431" />
          </div>

          <div className="space-y-2">
            <Label>Tên học phần</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Quản lý dự án phần mềm" />
          </div>

          <div className="space-y-2">
            <Label>Số tín chỉ</Label>
            <Input
              type="number"
              value={credits}
              onChange={(e) => setCredits(Number(e.target.value))}
              min={1}
              max={10}
            />
          </div>

          <div className="space-y-2">
            <Label>Màu hiển thị</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded border"
              />
              <span className="px-3 py-1 rounded text-white" style={{ backgroundColor: color }}>
                Preview
              </span>
            </div>
          </div>

          {/* Button mở dialog quản lý nhóm */}
          <Button variant="outline" className="w-full" onClick={() => setOpenGroupDialog(true)}>
            Quản lý nhóm học
          </Button>

          <Button className="w-full" onClick={handleSubmit}>
            Lưu học phần
          </Button>
        </CardContent>
      </Card>

      {/* Dialog Nhóm học */}
      <Dialog open={openGroupDialog} onOpenChange={setOpenGroupDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Quản lý nhóm học</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {groups.map((group) => (
              <Card key={group.groupId} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Nhóm học</h3>
                  <Button variant="outline" size="sm" onClick={() => handleAddSchedule(group.groupId)}>
                    <Plus className="h-4 w-4 mr-1" /> Thêm lịch học
                  </Button>
                </div>

                {/* Schedule Summary */}
                <div className="space-y-2">
                  {group.schedule.length === 0 && <p className="text-sm text-muted-foreground">Chưa có lịch học</p>}
                  {group.schedule.map((s, i) => (
                    <div key={i} className="flex justify-between items-center border rounded-md p-2">
                      <div>
                        <p className="font-medium">
                          {s.teacher} - {s.room}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Thứ {s.dayOfWeek === 8 ? "CN" : s.dayOfWeek}, Tiết {s.startPeriod} →{" "}
                          {s.startPeriod + s.periodCount - 1}, Tuần: {s.studyWeeks.join(", ")}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveSchedule(group.groupId, i)}>
                        <Trash className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            ))}

            <Button variant="secondary" onClick={handleAddGroup}>
              <Plus className="h-4 w-4 mr-1" /> Thêm nhóm học
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Thêm lịch */}
      <Dialog open={openScheduleDialog} onOpenChange={setOpenScheduleDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Thêm lịch học</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Giảng viên</Label>
              <Input value={teacher} onChange={(e) => setTeacher(e.target.value)} />
            </div>
            <div>
              <Label>Phòng</Label>
              <Input value={room} onChange={(e) => setRoom(e.target.value)} />
            </div>

            <div>
              <Label>Chọn thứ</Label>
              <div className="flex gap-2 mt-2">
                {DAYS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                      selectedDays.includes(d.value) ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                    }`}
                    onClick={() =>
                      setSelectedDays((prev) =>
                        prev.includes(d.value) ? prev.filter((x) => x !== d.value) : [...prev, d.value]
                      )
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <div>
                <Label>Tiết bắt đầu</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={startPeriod}
                  onChange={(e) => setStartPeriod(Number(e.target.value))}
                />
              </div>
              <div>
                <Label>Số tiết</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={periodCount}
                  onChange={(e) => setPeriodCount(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label>Tuần học</Label>
              <Input
                placeholder="VD: 1-8 hoặc 3,5,7"
                value={studyWeeksInput}
                onChange={(e) => setStudyWeeksInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={saveSchedule}>Lưu lịch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
