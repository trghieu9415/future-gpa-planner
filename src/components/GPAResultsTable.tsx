import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Medal, BadgeCheck } from "lucide-react";
import { Course, TargetCredits } from "@/types";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface GPAResultsTableProps {
  currentGPA: number | null;
  accumulatedCredits: number | null;
  requiredCredits: number | null;
  mode: "mode-a" | "mode-b";
}

const gradeTargets = [
  { tier: "Xuất sắc", minGPA: 3.6, icon: Medal, color: "text-yellow-500" },
  { tier: "Giỏi", minGPA: 3.2, icon: Award, color: "text-emerald-500" },
  { tier: "Khá", minGPA: 2.5, icon: BadgeCheck, color: "text-blue-500" },
];

const calculateRequiredGrades = (
  currentGPA: number,
  accumulatedCredits: number,
  requiredCredits: number,
  targetGPA: number
): TargetCredits => {
  const currentQualityPoints = currentGPA * accumulatedCredits;
  const targetQualityPoints = targetGPA * requiredCredits;
  const requiredQualityPoints = targetQualityPoints - currentQualityPoints;
  const remainingCredits = requiredCredits - accumulatedCredits;

  if (remainingCredits <= 0) {
    return { a: 0, b: 0, c: 0, d: 0, finalGPA: currentGPA };
  }

  for (let a = 0; a <= remainingCredits; a++) {
    for (let b = 0; b <= remainingCredits - a; b++) {
      for (let c = 0; c <= remainingCredits - a - b; c++) {
        const d = remainingCredits - a - b - c;
        const totalQualityPoints = a * 4.0 + b * 3.0 + c * 2.0 + d * 1.0;

        if (totalQualityPoints >= requiredQualityPoints) {
          const finalGPA = (currentQualityPoints + totalQualityPoints) / requiredCredits;
          return { a, b, c, d, finalGPA };
        }
      }
    }
  }

  return {
    a: remainingCredits,
    b: 0,
    c: 0,
    d: 0,
    finalGPA: (currentGPA * accumulatedCredits + remainingCredits * 4.0) / requiredCredits,
  };
};

export const GPAResultsTable = ({ currentGPA, accumulatedCredits, requiredCredits, mode }: GPAResultsTableProps) => {
  if (mode === "mode-b") {
    console.warn("GPAResultsTable is not applicable for mode-b. Please implement the logic for mode-b.");
  }

  const remainingCredits = requiredCredits && accumulatedCredits ? requiredCredits - accumulatedCredits : null;

  if (!currentGPA || !accumulatedCredits || !requiredCredits || !remainingCredits || remainingCredits <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Yêu cầu về điểm
          </CardTitle>
          <CardDescription>
            Nhập dữ liệu học tập của bạn để xem cần đạt những điểm số nào cho từng mục tiêu GPA khác nhau.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Điền đầy đủ thông tin bên trên để xem bạn cần đạt những điểm số nào.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Yêu cầu điểm số để đạt các mục tiêu tốt nghiệp
        </CardTitle>
        <CardDescription>
          Dựa trên {accumulatedCredits} tín chỉ đã hoàn thành với GPA hiện tại là {currentGPA.toFixed(2)}. Hiển thị yêu
          cầu điểm số cho {remainingCredits} tín chỉ còn lại.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead rowSpan={2} className="text-center min-w-30">
                  Xếp loại tốt nghiệp
                </TableHead>
                <TableHead rowSpan={2} className="text-center">
                  GPA mục tiêu
                </TableHead>
                <TableHead colSpan={4} className="text-center">
                  Số tính chỉ
                </TableHead>
                <TableHead rowSpan={2} className="text-center">
                  GPA tốt nghiệp
                </TableHead>
                <TableHead rowSpan={2} className="text-center min-w-40">
                  Trạng thái
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead className="text-center">A</TableHead>
                <TableHead className="text-center">B</TableHead>
                <TableHead className="text-center">C</TableHead>
                <TableHead className="text-center">D</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradeTargets.map((target) => {
                const requirements = calculateRequiredGrades(
                  currentGPA,
                  accumulatedCredits,
                  requiredCredits,
                  target.minGPA
                );

                const isAchieved = currentGPA >= target.minGPA;
                const isAchievable = requirements.finalGPA >= target.minGPA;

                const IconComponent = target.icon;
                const styleComponent = target.color;

                return (
                  <TableRow key={target.tier}>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <IconComponent className={cn("h-4 w-4", styleComponent)} />
                        <span className="font-medium">{target.tier}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Badge variant="outline" className="font-mono ">
                          {target.minGPA.toFixed(1)}+
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">{requirements.a}</TableCell>
                    <TableCell className="text-center font-mono">{requirements.b}</TableCell>
                    <TableCell className="text-center font-mono">{requirements.c}</TableCell>
                    <TableCell className="text-center font-mono">{requirements.d}</TableCell>
                    <TableCell className="text-center font-mono">{requirements.finalGPA.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center">
                        <Badge
                          className={
                            isAchieved
                              ? "bg-accent text-accent-foreground"
                              : isAchievable
                                ? "bg-yellow-400 text-black"
                                : "bg-muted text-muted-foreground"
                          }
                        >
                          {isAchieved ? "Cần duy trì" : isAchievable ? "Có thể đạt" : "Cần học cải thiện"}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Lưu ý:</strong>
            <br />- Các phép tính này giả định rằng bạn sẽ hoàn thành chính xác {remainingCredits} tín chỉ còn lại.
            <br />- Các tổ hợp điểm chỉ là một trong nhiều cách có thể để đạt được từng mức GPA mục tiêu.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <strong>A:</strong> 4.0
            </div>
            <div>
              <strong>B:</strong> 3.0
            </div>
            <div>
              <strong>C:</strong> 2.0
            </div>
            <div>
              <strong>D:</strong> 1.0
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
