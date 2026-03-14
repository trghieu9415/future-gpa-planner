import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { rmtx } from "@/consts/CustomCss";
import { FutureCreditsGuideDialog } from "./FutureCreditsGuideDialog";
import { ImprovementGuideDialog } from "./ImprovementGuideDialog";
import { useAcademicStatus } from "@/store/useAcademicStatus";
import { useEffect, useMemo, useState } from "react";
import { ImprovementPlan, NewCoursePlan } from "@/pages/gpa-calculator/types/gpaSimulation";
import { getGradeImprovements } from "@/pages/gpa-calculator/math/getGradeImprovements";
import { simulateNewGpa } from "@/pages/gpa-calculator/math/simulateNewGpa";

export const CustomCreditPlanner = () => {
  const { currentGpa, accumulatedCredits, requiredCredits, gradingSystem } = useAcademicStatus();

  const remainingCredits = useMemo(() => {
    if (!currentGpa || !accumulatedCredits || !requiredCredits) return 0;
    return Math.max(requiredCredits - accumulatedCredits, 0);
  }, [currentGpa, accumulatedCredits, requiredCredits]);

  const [newCourses, setNewCourses] = useState<Record<number, NewCoursePlan>>({});
  const [improvements, setImprovements] = useState<Record<number, ImprovementPlan>>({});

  useEffect(() => {
    if (!gradingSystem || !gradingSystem.grades) return;

    const initialNewCourses: Record<number, NewCoursePlan> = {};
    const initialImprovements: Record<number, ImprovementPlan> = {};

    gradingSystem.grades.forEach((grade) => {
      initialNewCourses[grade.value] = { credits: 0, expectedGrade: grade.value };
    });

    const improvementLevels = getGradeImprovements(gradingSystem);
    improvementLevels.forEach((level) => {
      initialImprovements[level] = { credits: 0, increaseAmount: level };
    });

    setNewCourses(initialNewCourses);
    setImprovements(initialImprovements);
  }, [gradingSystem]);

  const handleUpdateNewCourse = (expectedGrade: number, credits: number) => {
    setNewCourses((prev) => ({
      ...prev,
      [expectedGrade]: { ...prev[expectedGrade], credits: credits },
    }));
  };

  const handleUpdateImprovement = (increaseAmount: number, credits: number) => {
    setImprovements((prev) => ({
      ...prev,
      [increaseAmount]: { credits, increaseAmount },
    }));
  };

  const simulatedResult = useMemo(() => {
    if (!currentGpa || !accumulatedCredits || !requiredCredits) return null;
    return simulateNewGpa({
      currentGpa,
      accumulatedCredits,
      requiredCredits,
      newCourses: Object.values(newCourses),
      improvements: Object.values(improvements),
    });
  }, [currentGpa, accumulatedCredits, requiredCredits, newCourses, improvements]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 leading-7">Công cụ lập kế hoạch tín chỉ tùy chỉnh</CardTitle>
        <CardDescription>
          Nhập số tín chỉ dự định đạt được cho mỗi loại điểm và số tín chỉ muốn cải thiện để xem kết quả.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm">Tín chỉ các môn học mới</h4>
            <FutureCreditsGuideDialog />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại điểm</TableHead>
                <TableHead className="text-right">Số tín chỉ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradingSystem.grades.map((grade) => (
                <TableRow>
                  <TableCell className="font-medium">
                    {grade.letter} ({grade.value})
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      min="0"
                      value={newCourses[grade.value]?.credits || 0}
                      onFocus={(event) => event.target.select()}
                      onChange={(e) => handleUpdateNewCourse(grade.value, Number(e.target.value))}
                      className={cn("w-12 h-8 float-right text-center", rmtx)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">Tín chỉ cải thiện</h4>
            <ImprovementGuideDialog />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mức tăng</TableHead>
                <TableHead className="text-right">Số tín chỉ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(improvements)
                .sort((a, b) => b[1].increaseAmount - a[1].increaseAmount)
                .map(([increaseAmount, plan]) => (
                  <TableRow key={increaseAmount}>
                    <TableCell className="font-medium">Tăng {increaseAmount} điểm</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={plan.credits}
                        onFocus={(event) => event.target.select()}
                        onChange={(e) => handleUpdateImprovement(Number(increaseAmount), Number(e.target.value))}
                        className={cn("w-12 h-8 float-right text-center", rmtx)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        <div className="md:col-span-2 p-4 bg-muted/50 rounded-lg space-y-4">
          <h4 className="font-semibold text-lg">Kết quả dự kiến</h4>
          <div className="flex justify-between items-center text-sm">
            <span>Số tín chỉ còn lại:</span>
            <span className="font-bold">{remainingCredits}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Số tín chỉ đã nhập:</span>
            <span
              className={cn(
                "font-bold",
                simulatedResult.addedCredits > remainingCredits
                  ? "text-orange-500"
                  : simulatedResult.addedCredits === remainingCredits
                    ? "text-green-600"
                    : "text-red-600"
              )}
            >
              {simulatedResult.addedCredits}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Số tín chỉ chưa nhập:</span>
            <span
              className={cn(
                "font-bold",
                simulatedResult.addedCredits > remainingCredits
                  ? "text-orange-500"
                  : simulatedResult.addedCredits === remainingCredits
                    ? "text-green-600"
                    : "text-red-600"
              )}
            >
              {remainingCredits - simulatedResult.addedCredits}
            </span>
          </div>
          <hr />

          {simulatedResult.addedCredits === remainingCredits ? (
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">GPA tốt nghiệp</p>
              <p className="text-4xl font-bold text-[#16a249]">{simulatedResult.newGpa.toFixed(2)}</p>
            </div>
          ) : (
            <div className="pt-2 gap-x-12 flex justify-center">
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground ">Số tín chỉ tích lũy mới:</span>
                <br />
                <span className="text-4xl font-bold text-[#3472ef]">{simulatedResult.newTotalCredits}</span>
              </div>
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground">GPA tích lũy mới:</span>
                <br />
                <span className="text-4xl font-bold text-[#3472ef]">{simulatedResult.newGpa.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
