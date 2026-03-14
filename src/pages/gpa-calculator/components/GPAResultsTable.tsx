import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Medal, BadgeCheck, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useAcademicStatus } from "@/store/useAcademicStatus";
import { useDeferredValue, useMemo, useState } from "react";
import { rmtx } from "@/consts/CustomCss";
import { getGpaStrategy } from "@/pages/gpa-calculator/math/getGpaStrategy";
import { GradingSystemSelector } from "./GradingSystemSelector";

const gradeTargets = [
  { tier: "Xuất sắc", minGpa: 3.6, icon: Medal, color: "text-yellow-500" },
  { tier: "Giỏi", minGpa: 3.2, icon: Award, color: "text-emerald-500" },
  { tier: "Khá", minGpa: 2.5, icon: BadgeCheck, color: "text-blue-500" },
];

export const GpaResultsTable = () => {
  const { currentGpa, accumulatedCredits, requiredCredits, gradingSystem } = useAcademicStatus();

  const grades = gradingSystem ? gradingSystem.grades : [];

  const [customTargetGpa, setCustomTargetGpa] = useState<number | null>(4);
  const deferredCustomGpa = useDeferredValue(customTargetGpa);

  const baseStrategies = useMemo(() => {
    if (!currentGpa || !accumulatedCredits || !requiredCredits || !gradingSystem) return [];

    return gradeTargets.map((target) => ({
      ...target,
      strategy: getGpaStrategy({
        currentGpa,
        accumulatedCredits,
        requiredCredits,
        targetGpa: target.minGpa,
        gradingSystem,
      }),
    }));
  }, [currentGpa, accumulatedCredits, requiredCredits, gradingSystem]);

  const customStrategy = useMemo(() => {
    if (!currentGpa || !accumulatedCredits || !requiredCredits || !gradingSystem || !deferredCustomGpa) return null;

    return {
      tier: "Tùy chỉnh",
      minGpa: deferredCustomGpa,
      icon: Target,
      color: "text-gray-500",
      strategy: getGpaStrategy({
        currentGpa,
        accumulatedCredits,
        requiredCredits,
        targetGpa: deferredCustomGpa,
        gradingSystem,
      }),
    };
  }, [currentGpa, accumulatedCredits, requiredCredits, gradingSystem, deferredCustomGpa]);

  const strategies = customStrategy ? [...baseStrategies, customStrategy] : baseStrategies;

  if (!currentGpa || !accumulatedCredits || !requiredCredits || !gradingSystem) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Yêu cầu về điểm</CardTitle>
          <CardDescription>Nhập dữ liệu học tập và hệ điểm của bạn để xem kịch bản tối ưu.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Vui lòng điền đầy đủ thông tin bên trên để tính toán.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (isPossible: boolean, targetGpa: number) => {
    if (!isPossible) {
      return { label: "Phải cải thiện", color: "bg-red-500 hover:bg-red-600 text-white" };
    }
    if (currentGpa >= targetGpa) {
      return { label: "Cần duy trì", color: "bg-green-600 hover:bg-green-700 text-white" };
    }
    return { label: "Có thể đạt", color: "bg-yellow-400 hover:bg-yellow-500 text-black" };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 leading-7">
          Yêu cầu điểm số để đạt các mục tiêu tốt nghiệp
        </CardTitle>
        <CardDescription>
          Dựa trên {accumulatedCredits} tín chỉ đã hoàn thành với GPA hiện tại là {currentGpa.toFixed(2)}. Bảng dưới đây
          tính toán cho {requiredCredits - accumulatedCredits} tín chỉ còn lại.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GradingSystemSelector />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className="text-center min-w-30">
                  Xếp loại
                </TableHead>
                <TableHead rowSpan={2} className="text-center">
                  GPA mục tiêu
                </TableHead>
                {/* colSpan tự động co giãn theo số lượng điểm của hệ thống */}
                <TableHead colSpan={grades.length} className="text-center border-b">
                  Tổ hợp số tín chỉ đề xuất
                </TableHead>
                <TableHead rowSpan={2} className="text-center">
                  GPA cuối cùng
                </TableHead>
                <TableHead rowSpan={2} className="text-center min-w-40">
                  Trạng thái
                </TableHead>
              </TableRow>
              <TableRow>
                {/* Render số lượng cột tự động dựa trên gradingSystem */}
                {grades.map((grade) => (
                  <TableHead key={grade.letter} className="text-center font-bold text-primary">
                    {grade.letter}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies.map((target) => {
                const badgeInfo = getStatusBadge(target.strategy.isPossible, target.minGpa);

                return (
                  <TableRow key={target.tier}>
                    <TableCell>
                      <div className="flex items-center justify-start md:justify-center gap-2">
                        <target.icon className={cn("h-4 w-4 hidden md:flex", target.color)} />
                        <span className="font-bold whitespace-nowrap">{target.tier}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {target.tier !== "Tùy chỉnh" ? (
                        <div className="flex items-center justify-center">
                          <Badge variant="outline" className="font-mono text-base">
                            {target.minGpa.toFixed(1)}+
                          </Badge>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Input
                            type="number"
                            placeholder="3.85"
                            min="2"
                            max="4.0"
                            step="0.01"
                            className={cn("w-20 h-8 text-center font-mono font-bold", rmtx)}
                            value={customTargetGpa ?? ""}
                            onFocus={(e) => e.target.select()}
                            onBlur={() => {
                              if (customTargetGpa && customTargetGpa > 4) setCustomTargetGpa(4.0);
                              else if (customTargetGpa && customTargetGpa < 2) setCustomTargetGpa(2.0);
                            }}
                            onChange={(e) => {
                              const parsed = parseFloat(e.target.value);
                              setCustomTargetGpa(isNaN(parsed) ? null : parsed);
                            }}
                          />
                        </div>
                      )}
                    </TableCell>

                    {/* Render chính xác số tín chỉ tương ứng với từng cột điểm */}
                    {target.strategy.combinations.map((combination) => (
                      <TableCell key={combination.gradeLetter} className="text-center font-medium">
                        {combination.credits > 0 ? combination.credits : "-"}
                      </TableCell>
                    ))}

                    <TableCell className="text-center font-mono font-bold">
                      {target.strategy.finalGpa.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Badge className={cn("cursor-default whitespace-nowrap", badgeInfo.color)}>
                          {badgeInfo.label}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
