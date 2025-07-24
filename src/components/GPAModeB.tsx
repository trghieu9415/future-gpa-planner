import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, BookOpenCheck, FileSpreadsheet, X, ChevronDown } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { useCoursesStore } from "@/hooks/useCoursesStore";
import { Course, GPAModeProps, LetterGrade, letterGradeToPoints, Points } from "@/types";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { calculateAcademicStatus, cn, getCourseList, readCourseFromFile } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "./ui/command";
import { useAcademicStatus } from "@/hooks/useAcademicStatus";

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
  const { courses, setCourses, addCourse, updateCourse, removeCourse, resetCourses } = useCoursesStore();

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
        setCourseList([]);
      }
    };
    fetchCourseList();
  }, []);

  useEffect(() => {
    const academicStatus = calculateAcademicStatus(courses);
    setCurrentGPA(parseFloat(academicStatus.currentGPA?.toFixed(2)));
    setAccumulatedCredits(academicStatus.accumulatedCredits);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courses]);

  const handleAddCourse = () => {
    if (!newCourse.id || !newCourse.name || newCourse.credits <= 0 || newCourse.letterGrade === "F") {
      toast.error("Hãy nhập đủ thông tin của học phần.");
      return;
    }
    addCourse(newCourse);
    setNewCourse(initializeNewCourse());
  };

  const handleLoadExcel = () => {
    inputExcelRef.current?.click();
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
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-5 w-5 text-primary" />
            Danh sách môn học
          </div>
          <input ref={inputExcelRef} type="file" accept=".xlsx, .xls" className="hidden" onChange={loadExcelFile} />
          <Button className="flex gap-2 bg-green-600" onClick={() => handleLoadExcel()}>
            <FileSpreadsheet className="size-5" />
            Nhập từ file
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
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
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
                            <div className="flex flex-col gap-y-2">
                              <span className="font-bold">{course.name}</span>
                              <span className="!text-xs">Mã: {course.courseId}</span>
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
            <ScrollArea className="h-72 border rounded-lg p-2">
              <div className="space-y-2">
                {courses.map((course) => (
                  <div key={course.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="flex justify-center items-center font-mono text-slate-500">{course.courseId}</div>
                      <Input
                        className="sm:col-span-6"
                        value={course.name}
                        onChange={(e) => updateCourse(course.id, { ...course, name: e.target.value })}
                        placeholder="Tên môn học"
                      />
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <div className="text-black">
                          {course.credits} <span className="text-sm">tín chỉ</span>
                        </div>
                      </div>
                      <Select
                        value={course.letterGrade}
                        onValueChange={(e) =>
                          updateCourse(course.id, {
                            ...course,
                            letterGrade: e as LetterGrade,
                            points: letterGradeToPoints[e],
                          })
                        }
                      >
                        <SelectTrigger className="sm:col-span-2">
                          <SelectValue placeholder="Điểm chữ" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(letterGradeToPoints).map(([letter, points]) => (
                            <SelectItem value={letter}>
                              {letter} ({points.toFixed(1)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCourse(course.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {currentGPA !== null && accumulatedCredits !== null && requiredCredits !== null && requiredCredits > 0 && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Số tín chỉ còn lại</p>
                    <p className="text-2xl font-bold text-primary">{requiredCredits - accumulatedCredits}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GPA hiện tại</p>
                    <p className="text-2xl font-bold text-accent">{currentGPA.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tiến độ</p>
                    <p className="text-2xl font-bold text-academic-green">
                      {Math.round((accumulatedCredits / requiredCredits) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
