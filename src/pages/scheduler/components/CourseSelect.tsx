import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useScheduleStore } from "@/store/useScheduleStore";
import { toast } from "sonner";
import React from "react";
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { courseFilter } from "@/utils/u-query";
import { OpenCourse } from "../types/course";
import { useCourseStore } from "@/store/useCourseStore";

export const CourseSelect = () => {
  const { data } = useCourseStore();

  const [selectedOpenCourse, setSelectedOpenCourse] = useState<OpenCourse | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const courses = useMemo(() => {
    return data?.courses || [];
  }, [data]);

  const filteredCourses = useMemo(() => {
    return courseFilter(courses, inputValue);
  }, [inputValue, courses]);

  const { getActivatedSchedule, toggleSign } = useScheduleStore();

  const handleCourseSelect = (checked: boolean, course: OpenCourse, groupId: string) => {
    const schedule = getActivatedSchedule();
    if (!schedule) {
      toast.error("Chưa có thời khóa biểu nào được kích hoạt. Vui lòng tạo TKB mới.");
      return;
    }

    if (checked) {
      try {
        schedule.addCourse(course, groupId);
      } catch (error) {
        toast.error((error as Error).message);
      }
    } else {
      schedule.removeCourse(course.courseId);
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

            <PopoverContent className="md:w-96 w-80 p-0">
              <Command shouldFilter={false}>
                <div className="p-3 border-b">
                  <h3 className="font-bold text-foreground">Danh sách môn học</h3>
                </div>

                <div className="p-3 border-b">
                  <CommandInput
                    placeholder="Tìm kiếm môn học, mã HP"
                    value={inputValue}
                    onValueChange={setInputValue}
                  />
                </div>

                <CommandList className="h-52 md:w-96 w-80 overflow-auto">
                  <CommandGroup heading={`Tìm thấy ${filteredCourses.length} môn học`}>
                    {filteredCourses.map((openCourse) => (
                      <CommandItem
                        key={openCourse.courseId}
                        value={`${openCourse.name} (${openCourse.courseId})`}
                        onSelect={() => {
                          setSelectedOpenCourse(openCourse);
                          setPopoverOpen(false);
                        }}
                      >
                        <div className="flex-1">
                          <div className="font-bold">{openCourse.name}</div>
                          <div className="text-xs mt-1 ">
                            <span className="font-semibold italic">Mã: </span>
                            {openCourse.courseId}
                            <span className="font-semibold italic"> - Số TC: </span>
                            {openCourse.credits}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
                {/* <-- KẾT THÚC SỬA 3 --> */}
              </Command>
            </PopoverContent>
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
                            // <-- SỬA 4: THÊM OPTIONAL CHAINING VÀ NULL COALESCING -->
                            checked={
                              getActivatedSchedule()?.hasCourseGroup(selectedOpenCourse.courseId, group.groupId) ??
                              false
                            }
                            // <-- KẾT THÚC SỬA 4 -->
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
                        key={`${selectedOpenCourse.courseId}${group.groupId}-${index + 1}`} // Sửa nhỏ: index -> index + 1
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
