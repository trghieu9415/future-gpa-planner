import { useEffect, useRef, useState } from "react";
import { Plus, FileSpreadsheet, X, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useCoursesStore } from "@/hooks/useCoursesStore";
import { Course, LetterGrade, letterGradeToPoints } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { calculateAcademicStatus, cn, getCourseList, readCourseFromFile } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { useAcademicStatus } from "@/hooks/useAcademicStatus";
import { CourseList } from "./CourseList";

const initializeNewCourse = () => {
  return {
    id: uuidv4(),
    courseId: "000000",
    name: "",
    credits: 1,
    points: 0,
    letterGrade: "F",
  } as Course;
};

export const GPAModeB = () => {
  const { currentGPA, setCurrentGPA, accumulatedCredits, setAccumulatedCredits, requiredCredits, setRequiredCredits } =
    useAcademicStatus();
  const { courses, setCourses, addCourse, resetCourses, totalState, setTotalState } = useCoursesStore();

  const [newCourse, setNewCourse] = useState<Course>(initializeNewCourse());
  const [courseList, setCourseList] = useState<{ courseId: string; name: string; credits: number }[]>([]);
  const [courseListOpen, setCourseListOpen] = useState(false);
  const inputExcelRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchCourseList = async () => {
      try {
        const courses = await getCourseList();
        setCourseList(courses);
      } catch (error) {
        console.error("Error fetching course list:", error);
        setCourseList([]);
      }
    };
    fetchCourseList();
  }, []);

  useEffect(() => {
    const academicStatus = calculateAcademicStatus(courses);
    setTotalState(academicStatus.totalState);
    setCurrentGPA(parseFloat(academicStatus.currentGPA?.toFixed(2)));
    setAccumulatedCredits(academicStatus.accumulatedCredits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);

  const handleAddCourse = () => {
    if (!newCourse.id || !newCourse.name || newCourse.credits <= 0) {
      toast.error("Hãy nhập đủ thông tin của học phần.");
      return;
    }
    if (newCourse.letterGrade === "F") {
      toast.error("Điểm F sẽ không được tính vào tích lũy.");
      return;
    }
    if (!requiredCredits) {
      toast.error("Vui lòng nhập số tín chỉ yêu cầu trước khi thêm môn học.");
      return;
    }
    addCourse(newCourse);
    setNewCourse(initializeNewCourse());
  };

  const handleLoadExcel = () => {
    inputExcelRef.current?.click();
    inputExcelRef.current.value = "";
  };

  const loadExcelFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      toast.error("Vui lòng chọn một file Excel.");
      return;
    }
    try {
      const courses = await readCourseFromFile(file);
      setCourses(courses);
    } catch (err) {
      console.error("Lỗi đọc file:", err);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">Danh sách môn học</div>
          <input ref={inputExcelRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={loadExcelFile} />
          <Button className="flex gap-2 hover:bg-green-600 bg-green-500" onClick={() => handleLoadExcel()}>
            <FileSpreadsheet className="size-5" />
            Nhập từ Excel
          </Button>
        </CardTitle>
        <CardDescription>Thêm môn học mà bạn đã hoàn thành để tính GPA</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Course Form */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <div className="w-full py-2 flex justify-between">
            <h3 className="font-semibold flex items-center">Thêm môn học mới</h3>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-semibold">Số tín chỉ cần</Label>
              <Input
                type="number"
                min="0"
                value={requiredCredits}
                onChange={(e) => setRequiredCredits(e.target.value ? parseInt(e.target.value) : null)}
                className={cn(
                  "w-20 text-lg text-center bg-white",
                  requiredCredits === null && "border-red-500 border-2"
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="space-y-2 sm:col-span-6">
              <Label htmlFor="course-name">Tên môn học</Label>
              <Popover open={courseListOpen} onOpenChange={setCourseListOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-full justify-between">
                    {newCourse.name || "Chọn học phần"}
                    <span className="ml-2">
                      <ChevronDown className="size-5" />
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[19rem] sm:w-[15rem] md:w-[20rem] lg:w-[26rem] xl:w-[31rem] p-0">
                  <Command>
                    <CommandInput placeholder="Tìm học phần..." />
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="max-h-60 overflow-auto">
                        {courseList.map((course) => (
                          <CommandItem
                            key={course.courseId}
                            value={`${course.name} ${course.courseId}`}
                            onSelect={() => {
                              setNewCourse({
                                ...newCourse,
                                name: course.name,
                                courseId: course.courseId,
                                credits: course.credits,
                              });
                              setCourseListOpen(false);
                            }}
                            className="flex items-center"
                          >
                            <div className="flex flex-col gap-y-2 w-full">
                              <span className="font-bold line-clamp-2 overflow-auto">{course.name}</span>
                              <span className="!text-xs text-slate-500">
                                <span className="font-bold italic">Mã: </span>
                                {course.courseId} // <span className="font-bold italic">Số TC: </span>
                                {course.credits}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </ScrollArea>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="grade-select">Điểm</Label>
              <Select
                value={newCourse.letterGrade}
                onValueChange={(e) =>
                  setNewCourse({
                    ...newCourse,
                    letterGrade: e as LetterGrade,
                    points: letterGradeToPoints[e],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Điểm chữ" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(letterGradeToPoints).map(([letter, points]) => (
                    <SelectItem key={letter} value={letter}>
                      {letter} ({points.toFixed(1)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-1">
              <Label htmlFor="credits">Số tín chỉ</Label>
              <Button disabled={true} className="w-full bg-slate-400 text-black">
                {newCourse.credits}
              </Button>
            </div>

            <div className="flex items-end sm:col-span-3">
              <Button onClick={() => handleAddCourse()} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Thêm môn học
              </Button>
            </div>
          </div>
        </div>

        {/* Course List */}
        {courses.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Danh sách học phần đã học ({courses.length})</h3>
              <Button
                className="bg-transparent border hover:bg-red-500 text-black hover:text-white flex items-center"
                onClick={() => resetCourses()}
              >
                <X className="size-5" />
                Xóa tất cả
              </Button>
            </div>
            <CourseList />

            {currentGPA > 0 && accumulatedCredits > 0 && requiredCredits > 0 && (
              <>
                <div className="flex gap-x-10 mx-4">
                  <div className="flex gap-x-2">
                    <span className="font-bold">Số tín chỉ A:</span>
                    <span>{totalState.totalA ?? ""}</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="font-bold">Số tín chỉ B:</span>
                    <span>{totalState.totalB ?? ""}</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="font-bold">Số tín chỉ C:</span>
                    <span>{totalState.totalC ?? ""}</span>
                  </div>
                  <div className="flex gap-x-2">
                    <span className="font-bold">Số tín chỉ D:</span>
                    <span>{totalState.totalD ?? ""}</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-[#f3f6fc] rounded-lg border border-[#cdddfb]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-[#7e7280]">Số tín chỉ còn lại</p>
                      <p className="text-2xl font-bold text-[#3472ef]">{requiredCredits - accumulatedCredits}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#7e7280]">GPA hiện tại</p>
                      <p className="text-2xl font-bold text-[#16a249]">{currentGPA?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#7e7280]">Tiến độ</p>
                      <p className="text-2xl font-bold text-[#16a249]">
                        {Math.round((accumulatedCredits / requiredCredits) * 100)}%
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
