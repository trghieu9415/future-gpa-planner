import { getOpenCourseList } from "@/lib/utils";
import { OpenCourse } from "@/types/schedule";
import { useEffect, useState } from "react";
import { Label } from "../../../components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ChevronDown, RotateCcw, Search } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table";
import { Checkbox } from "../../../components/ui/checkbox";
import { useScheduleStore } from "@/components/store/useScheduleStore";
import { toast } from "sonner";
import React from "react";

export const CourseSelect = () => {
  const [courses, setCourses] = useState<OpenCourse[]>([]);
  const [openCourses, setOpenCourses] = useState<OpenCourse[]>([]);
  const [selectedOpenCourse, setSelectedOpenCourse] = useState<OpenCourse>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  const { getActivatedSchedule, toggleSign } = useScheduleStore();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const list = await getOpenCourseList();
        setCourses(list);
        setOpenCourses(list);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (courses) {
      if (searchQuery) {
        const lower = searchQuery.toLowerCase();
        const filteredCourses = courses.filter(
          (course) => course.name.toLowerCase().includes(lower) || course.courseId.toLowerCase().includes(lower)
        );
        setOpenCourses(filteredCourses);
      } else {
        setOpenCourses(courses);
      }
    }
  }, [searchQuery, courses]);

  const handleCourseSelect = (checked: boolean, course: OpenCourse, groupId: string) => {
    if (checked) {
      try {
        getActivatedSchedule().addCourse(course, groupId);
      } catch (error) {
        toast.error(error.message);
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

            <PopoverContent className="md:w-96 w-80 p-0">
              <div className="p-3 border-b">
                <h3 className="font-bold text-foreground">Danh sách môn học</h3>
              </div>

              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm môn học, mã HP"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>

              <ScrollArea className="h-52 md:w-96 w-80 overflow-auto">
                <div className="p-2">
                  {openCourses.map((openCourse) => (
                    <div
                      key={openCourse.courseId}
                      className="flex items-center space-x-2 rounded-sm px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => {
                        setSelectedOpenCourse(openCourse);
                        setPopoverOpen(false);
                      }}
                    >
                      <div className="flex-1">
                        <div className="font-bold">{openCourse.name}</div>
                        <div className="text-xs mt-1 ">
                          <span className="font-semibold italic">Mã: </span>
                          {openCourse.courseId}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
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
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Sĩ số</TableHead>
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
                        key={`${selectedOpenCourse.courseId}${group.groupId}-${index}`}
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
                  <TableCell colSpan={10} className="text-center text-muted-foreground">
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
