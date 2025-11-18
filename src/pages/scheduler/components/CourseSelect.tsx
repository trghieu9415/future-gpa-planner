import { getOpenCourseList } from "@/lib/utils";
import { OpenCourse } from "@/types/schedule";
import { useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { ChevronDown, RotateCcw } from "lucide-react"; // Search đã được tích hợp trong CommandInput
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Checkbox } from "../../../components/ui/checkbox";
import { useScheduleStore } from "@/components/store/useScheduleStore";
import { toast } from "sonner";
import React from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"; // <-- THÊM MỚI

export const CourseSelect = () => {
  const [courses, setCourses] = useState<OpenCourse[]>([]);
  // const [openCourses, setOpenCourses] = useState<OpenCourse[]>([]); // <-- XÓA BỎ
  const [selectedOpenCourse, setSelectedOpenCourse] = useState<OpenCourse | null>(null); // <-- SỬA (Thêm | null)
  // const [searchQuery, setSearchQuery] = useState(""); // <-- XÓA BỎ
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { getActivatedSchedule, toggleSign } = useScheduleStore();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const list = await getOpenCourseList();
        setCourses(list);
        // setOpenCourses(list); // <-- XÓA BỎ
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // <-- XÓA BỎ HOÀN TOÀN useEffect LỌC MÔN HỌC (Command sẽ làm)

  const handleCourseSelect = (checked: boolean, course: OpenCourse, groupId: string) => {
    if (checked) {
      try {
        getActivatedSchedule().addCourse(course, groupId);
      } catch (error) {
        toast.error((error as Error).message); // <-- Sửa nhỏ: ép kiểu error
      }
    } else {
      getActivatedSchedule().removeCourse(course.courseId);
    }
    toggleSign();
  };

  return (
    <div className="w-full">
      <div className="mt-2 mb-4">
        <Label className="text-md font-bold text-foreground mb-2 mr-2 block">Môn học:</Label>
        <div className="flex items-center space-x-2">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="md:w-96 w-80 justify-between h-8"
                role="combobox"
                aria-expanded={popoverOpen}
              >
                {selectedOpenCourse ? (
                  <span className="truncate">{selectedOpenCourse.name}</span>
                ) : (
                  <span className="text-muted-foreground">Chọn môn học...</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>

            {/* v v v THAY ĐỔI NỘI DUNG POPOVER v v v */}
            <PopoverContent className="md:w-96 w-80 p-0">
              <Command>
                <div className="p-3 border-b">
                  <h3 className="font-bold text-foreground">Danh sách môn học</h3>
                </div>

                <div className="p-3 border-b">
                  {/* CommandInput đã tích hợp sẵn icon Search và logic lọc */}
                  <CommandInput placeholder="Tìm kiếm môn học, mã HP" />
                </div>

                <CommandEmpty>Không tìm thấy môn học.</CommandEmpty>

                <CommandList className="h-52 md:w-96 w-80 overflow-auto">
                  <CommandGroup>
                    {courses.map((openCourse) => (
                      <CommandItem
                        key={openCourse.courseId}
                        // value là giá trị để CommandInput lọc
                        value={`${openCourse.name} ${openCourse.courseId}`}
                        // onSelect sẽ được gọi khi Enter hoặc Click
                        onSelect={() => {
                          setSelectedOpenCourse(openCourse);
                          setPopoverOpen(false);
                        }}
                      >
                        {/* Giữ nguyên cấu trúc hiển thị của bạn */}
                        <div className="flex-1">
                          <div className="font-bold">{openCourse.name}</div>
                          <div className="text-xs mt-1 ">
                            <span className="font-semibold italic">Mã: </span>
                            {openCourse.courseId}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
            {/* ^ ^ ^ KẾT THÚC THAY ĐỔI ^ ^ ^ */}
          </Popover>
          <Button variant="outline" className="size-8" onClick={() => setSelectedOpenCourse(null)}>
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>
      <div className="my-4">
        <Label className="text-md font-bold text-foreground mb-2 mr-2 block">Danh sách nhóm tổ:</Label>
        <div className="overflow-auto">
          <Table className="table-auto border border-gray-200">
            <TableHeader>
              <TableRow className="divide-x divide">
                <TableHead className="whitespace-nowrap px-2 py-1.5" />
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Mã</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Tên môn</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Số TC</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Nhóm</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">SLCL</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Giảng viên</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Thứ</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Tiết BĐ</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Số tiết</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Phòng</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Tuần</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {selectedOpenCourse && selectedOpenCourse.groups.length > 0 ? (
                selectedOpenCourse.groups.map((group) => (
                  <React.Fragment key={`${selectedOpenCourse.courseId}${group.groupId}`}>
                    <TableRow
                      key={`${selectedOpenCourse.courseId}${group.groupId}-0`}
                      className="divide-x divide-border"
                    >
                      <TableCell rowSpan={group.schedule.length} className="!px-2">
                        <div className="w-full flex justify-center items-center">
                          <Checkbox
                            checked={getActivatedSchedule().hasCourseGroup(selectedOpenCourse.courseId, group.groupId)}
                            onCheckedChange={(checked) =>
                              handleCourseSelect(checked === true, selectedOpenCourse, group.groupId)
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell rowSpan={group.schedule.length} className="whitespace-nowrap px-2 py-1.5 text-center">
                        {selectedOpenCourse.courseId}
                      </TableCell>
                      <TableCell rowSpan={group.schedule.length} className="whitespace-nowrap px-2 py-1.5 text-center">
                        {selectedOpenCourse.name}
                      </TableCell>
                      <TableCell rowSpan={group.schedule.length} className="whitespace-nowrap px-2 py-1.5 text-center">
                        {selectedOpenCourse.credits}
                      </TableCell>
                      <TableCell rowSpan={group.schedule.length} className="whitespace-nowrap px-2 py-1.5 text-center">
                        {group.groupId}
                      </TableCell>{" "}
                      <TableCell rowSpan={group.schedule.length} className="whitespace-nowrap px-2 py-1.5 text-center">
                        {group.classSize}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-1.5 text-start">
                        {group.schedule[0].teacher}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">
                        {group.schedule[0].dayOfWeek}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">
                        {group.schedule[0].startPeriod}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">
                        {group.schedule[0].periodCount}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">
                        {group.schedule[0].room}
                      </TableCell>
                      <TableCell className="whitespace-nowrap px-2 py-1.5 text-start">
                        {group.schedule[0].studyWeeks.join(", ")}
                      </TableCell>
                    </TableRow>
                    {group.schedule.slice(1).map((scheduleItem, index) => (
                      <TableRow
                        key={`${selectedOpenCourse.courseId}${group.groupId}-${index}`} // Sửa: index + 1 để key không bị trùng
                        className="divide-x divide-border"
                      >
                        <TableCell className="whitespace-nowrap px-2 py-1.5 text-start">
                          {scheduleItem.teacher}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">
                          {scheduleItem.dayOfWeek}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">
                          {scheduleItem.startPeriod}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">
                          {scheduleItem.periodCount}
                        </TableCell>
                        <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">{scheduleItem.room}</TableCell>
                        <TableCell className="whitespace-nowrap px-2 py-1.5 text-start">
                          {scheduleItem.studyWeeks.join(", ")}
                        </TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12} className="text-center text-muted-foreground">
                    {/* Sửa: colSpan thành 12 để khớp số cột */}
                    Không có nhóm tổ nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
