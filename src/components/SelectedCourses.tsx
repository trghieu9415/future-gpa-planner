import { useScheduleStore } from "@/hooks/useScheduleStore";
import { SignedCourses } from "@/types/schedule";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Label } from "./ui/label";
import { Trash2, X } from "lucide-react";

export const SelectedCourses = () => {
  const { getActivatedSchedule, sign, toggleSign } = useScheduleStore();
  const [signedCourses, setSignedCourses] = useState<SignedCourses>([]);

  useEffect(() => {
    const signedCourses = getActivatedSchedule()?.signedCourses ?? [];
    setSignedCourses(signedCourses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sign]);

  const handleRemoveCourse = (courseId: string) => {
    getActivatedSchedule()?.removeCourse(courseId);
    toggleSign();
  };
  const handleResetCourses = () => {
    getActivatedSchedule().clearCourses();
    toggleSign();
  };
  return (
    <div className="w-full">
      <div className="my-4">
        <Label className="text-md font-bold text-foreground mb-2 mr-2 block">Danh sách nhóm tổ:</Label>
        <div className="overflow-x-auto">
          <Table className="table-auto border border-gray-200">
            <TableHeader>
              <TableRow className="divide-x divide">
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Mã</TableHead>
                <TableHead className="whitespace-nowrap px-2 py-1.5 text-center">Tên môn</TableHead>
                <TableHead className="whitespace-nowrap w-[30px] px-2 py-1.5 text-center">Nhóm</TableHead>
                <TableHead className="whitespace-nowrap w-[30px] px-2 py-1.5 text-center">Số TC</TableHead>
                <TableHead className="w-[30px] px-2 py-1.5 text-center">Xóa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {signedCourses && signedCourses.length > 0 ? (
                signedCourses.map((signedCourse) => (
                  <TableRow key={signedCourse.courseId} className="divide-x divide-border">
                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-center">{signedCourse.courseId}</TableCell>
                    <TableCell className="whitespace-nowrap px-2 py-1.5 text-start">
                      {signedCourse.courseName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap w-[30px] px-2 py-1.5 text-center">
                      {signedCourse.groupId}
                    </TableCell>
                    <TableCell className="whitespace-nowrap w-[30px] px-2 py-1.5 text-center">
                      {signedCourse.credits}
                    </TableCell>
                    <TableCell className="w-[30px] px-2 py-1.5 text-center">
                      <div className="w-full h-6 flex items-center justify-center">
                        <X
                          className="size-5 hover:text-red-500 cursor-pointer transition"
                          onClick={() => handleRemoveCourse(signedCourse.courseId)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground">
                    Chưa có nhóm tổ nào
                  </TableCell>
                </TableRow>
              )}
              <TableRow className="divide-x divide-border">
                <TableCell colSpan={3} className="px-2 py-1.5 text-center font-bold">
                  Tổng số tín chỉ
                </TableCell>
                <TableCell className="px-2 py-1.5 text-center font-bold">
                  {signedCourses.reduce((total, course) => total + (course.credits || 0), 0)}
                </TableCell>
                {signedCourses.length > 0 && (
                  <TableCell className="px-2 py-1.5 text-center">
                    <div className="w-full h-6 flex items-center justify-center">
                      <Trash2
                        className="size-5 hover:text-red-500 cursor-pointer transition"
                        onClick={() => handleResetCourses()}
                      />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
