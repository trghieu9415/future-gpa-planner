import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Medal, BadgeCheck, Target } from "lucide-react";
import { calculateRequiredGrades, cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "./ui/input";

interface GPAResultsTableProps {
  currentGPA: number | null;
  accumulatedCredits: number | null;
  requiredCredits: number | null;
}

const gradeTargets = [
  { tier: "Xuất sắc", minGPA: 3.6, icon: Medal, color: "text-yellow-500" },
  { tier: "Giỏi", minGPA: 3.2, icon: Award, color: "text-emerald-500" },
  { tier: "Khá", minGPA: 2.5, icon: BadgeCheck, color: "text-blue-500" },
];

export const GPAResultsTable = ({ currentGPA, accumulatedCredits, requiredCredits }: GPAResultsTableProps) => {
  const [customTargetGPA, setCustomTargetGPA] = useState<number | null>(null);
  const remainingCredits = requiredCredits && accumulatedCredits ? requiredCredits - accumulatedCredits : null;

  if (!currentGPA || !accumulatedCredits || !requiredCredits || !remainingCredits || remainingCredits <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Yêu cầu về điểm</CardTitle>
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

  const customRequirements =
    customTargetGPA && customTargetGPA > 0 && customTargetGPA <= 4
      ? calculateRequiredGrades(currentGPA, accumulatedCredits, requiredCredits, customTargetGPA)
      : null;

  const isCustomAchievable = customRequirements ? customRequirements.finalGPA >= customTargetGPA : false;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">Yêu cầu điểm số để đạt các mục tiêu tốt nghiệp</CardTitle>
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
                  Số tín chỉ
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
                        <IconComponent className={cn("h-4 w-4 hidden md:flex", styleComponent)} />
                        <span className="font-bold text-center">{target.tier}</span>
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
                          className={cn(
                            "cursor-default",
                            isAchieved
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : isAchievable
                                ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                                : "bg-slate-200 hover:bg-slate-300 text-gray-600"
                          )}
                        >
                          {isAchieved ? "Cần duy trì" : isAchievable ? "Có thể đạt" : "Phải cải thiện"}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {/* Custom GPA Row */}
              <TableRow>
                <TableCell>
                  <div className="flex items-center justify-center gap-2">
                    <Target className={cn("h-4 w-4 hidden md:flex", "text-gray-500")} />
                    <span className="font-bold text-center">Tùy chỉnh</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    <Input
                      type="number"
                      placeholder="3.85"
                      min="0"
                      max="4.0"
                      step="0.01"
                      className="h-8 w-16 text-center font-mono 
												appearance-none	[-moz-appearance:textfield]
												[&::-webkit-inner-spin-button]:appearance-none
												[&::-webkit-outer-spin-button]:appearance-none"
                      value={customTargetGPA ?? ""}
                      onFocus={(event) => event.target.select()}
                      onChange={(e) => {
                        const parsed = parseFloat(e.target.value);
                        setCustomTargetGPA(isNaN(parsed) ? null : parsed);
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center font-mono">{customRequirements?.a ?? "-"}</TableCell>
                <TableCell className="text-center font-mono">{customRequirements?.b ?? "-"}</TableCell>
                <TableCell className="text-center font-mono">{customRequirements?.c ?? "-"}</TableCell>
                <TableCell className="text-center font-mono">{customRequirements?.d ?? "-"}</TableCell>
                <TableCell className="text-center font-mono">
                  {customRequirements ? customRequirements.finalGPA.toFixed(2) : "-"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {customRequirements && (
                      <Badge
                        className={cn(
                          "cursor-default",
                          isCustomAchievable
                            ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                            : "bg-slate-200 hover:bg-slate-300 text-gray-600"
                        )}
                      >
                        {isCustomAchievable ? "Có thể đạt" : "Phải cải thiện"}
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Lưu ý:</strong>
            <br />- Các phép tính này giả định rằng bạn sẽ hoàn thành chính xác {remainingCredits} tín chỉ còn lại và
            các học phần đều được tính vào tích lũy.
            <br />- Tiêu chí lựa chọn tổ hợp là tối <strong>thiểu hóa số tín chỉ có điểm A </strong> và{" "}
            <strong>tối đa hóa số tín chỉ có điểm D</strong>.
            <br />- Các tổ hợp điểm chỉ là một trong nhiều cách có thể để đạt được từng mức GPA mục tiêu.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
