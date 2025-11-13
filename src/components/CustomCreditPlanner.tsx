import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Calculator, HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface CustomCreditPlannerProps {
  currentGPA: number;
  accumulatedCredits: number;
  requiredCredits: number;
}

// Lớp CSS để loại bỏ các nút tăng/giảm của input type="number"
const rmtx =
  "appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ";

export const CustomCreditPlanner = ({ currentGPA, accumulatedCredits, requiredCredits }: CustomCreditPlannerProps) => {
  const [customCredits, setCustomCredits] = useState({ a: 0, b: 0, c: 0, d: 0 });
  const [improvementCredits, setImprovementCredits] = useState({ onePoint: 0, twoPoints: 0, threePoints: 0 });
  const [finalGraduationGPA, setFinalGraduationGPA] = useState<number | null>(null);
  const [newCumulativeInfo, setNewCumulativeInfo] = useState<{ gpa: number; credits: number } | null>(null);

  const remainingCredits = requiredCredits - accumulatedCredits;
  const totalEnteredCredits = customCredits.a + customCredits.b + customCredits.c + customCredits.d;
  const creditsMatch = totalEnteredCredits === remainingCredits;

  useEffect(() => {
    const currentQualityPoints = currentGPA * accumulatedCredits;
    const futureQualityPoints =
      customCredits.a * 4.0 + customCredits.b * 3.0 + customCredits.c * 2.0 + customCredits.d * 1.0;
    const improvementPoints =
      improvementCredits.onePoint * 1.0 + improvementCredits.twoPoints * 2.0 + improvementCredits.threePoints * 3.0;

    if (totalEnteredCredits > 0 || improvementPoints > 0) {
      const newTotalQualityPoints = currentQualityPoints + futureQualityPoints + improvementPoints;
      const newAccumulatedCredits = accumulatedCredits + totalEnteredCredits;
      const newGPA = newAccumulatedCredits > 0 ? newTotalQualityPoints / newAccumulatedCredits : 0;
      setNewCumulativeInfo({ gpa: newGPA, credits: newAccumulatedCredits });

      if (creditsMatch) {
        const calculatedGPA = newTotalQualityPoints / requiredCredits;
        setFinalGraduationGPA(calculatedGPA);
      } else {
        setFinalGraduationGPA(null);
      }
    } else {
      setNewCumulativeInfo(null);
      setFinalGraduationGPA(null);
    }
  }, [
    customCredits,
    improvementCredits,
    totalEnteredCredits,
    creditsMatch,
    currentGPA,
    accumulatedCredits,
    requiredCredits,
  ]);

  const handleCreditChange = (grade: "a" | "b" | "c" | "d", value: string) => {
    const numericValue = parseInt(value, 10);
    setCustomCredits((prev) => ({
      ...prev,
      [grade]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue,
    }));
  };

  const handleImprovementChange = (type: "onePoint" | "twoPoints" | "threePoints", value: string) => {
    const numericValue = parseInt(value, 10);
    setImprovementCredits((prev) => ({
      ...prev,
      [type]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 leading-7">
          <Calculator className="h-5 w-5" />
          Công cụ lập kế hoạch tín chỉ tùy chỉnh
        </CardTitle>
        <CardDescription>
          Nhập số tín chỉ dự định đạt được cho mỗi loại điểm và số tín chỉ muốn cải thiện để xem kết quả.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* CỘT 1: Tín chỉ các môn học mới */}
        <div className="md:col-span-1">
          <h4 className="font-semibold mb-2 text-sm">Tín chỉ các môn học mới</h4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại điểm</TableHead>
                <TableHead className="text-right">Số tín chỉ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Điểm A (4.0)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={customCredits.a}
                    onFocus={(event) => event.target.select()}
                    onChange={(e) => handleCreditChange("a", e.target.value)}
                    className={cn("w-12 h-8 float-right text-right", rmtx)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Điểm B (3.0)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={customCredits.b}
                    onFocus={(event) => event.target.select()}
                    onChange={(e) => handleCreditChange("b", e.target.value)}
                    className={cn("w-12 h-8 float-right text-right", rmtx)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Điểm C (2.0)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={customCredits.c}
                    onFocus={(event) => event.target.select()}
                    onChange={(e) => handleCreditChange("c", e.target.value)}
                    className={cn("w-12 h-8 float-right text-right", rmtx)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Điểm D (1.0)</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={customCredits.d}
                    onFocus={(event) => event.target.select()}
                    onChange={(e) => handleCreditChange("d", e.target.value)}
                    className={cn("w-12 h-8 float-right text-right", rmtx)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* CỘT 2: Tín chỉ cải thiện */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm flex items-center gap-2">Tín chỉ cải thiện</h4>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-5 w-5 rounded-full">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Giải thích về Cải thiện Tín chỉ</DialogTitle>
                  <DialogDescription>
                    Cải thiện điểm là việc bạn đăng ký học lại một học phần đã qua (điểm D, C, B) để có kết quả tốt hơn.
                    Điểm mới (cao hơn) sẽ được dùng để tính lại GPA tích lũy.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Nội dung Dialog giữ nguyên */}
                  <div className="flex flex-col space-y-1">
                    <h5 className="font-semibold">Tăng 1 điểm</h5>
                    <p className="text-sm text-muted-foreground">
                      Nhập tổng số tín chỉ của các môn bạn dự định cải thiện lên 1 bậc điểm.
                      <br />- Từ <span className="font-mono font-semibold text-foreground">B</span> lên{" "}
                      <span className="font-mono font-semibold text-foreground">A</span>
                      <br />- Từ <span className="font-mono font-semibold text-foreground">C</span> lên{" "}
                      <span className="font-mono font-semibold text-foreground">B</span>
                      <br />- Từ <span className="font-mono font-semibold text-foreground">D</span> lên{" "}
                      <span className="font-mono font-semibold text-foreground">C</span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h5 className="font-semibold">Tăng 2 điểm</h5>
                    <p className="text-sm text-muted-foreground">
                      Nhập tổng số tín chỉ của các môn bạn dự định cải thiện lên 2 bậc điểm.
                      <br />- Từ <span className="font-mono font-semibold text-foreground">C</span> lên{" "}
                      <span className="font-mono font-semibold text-foreground">A</span>
                      <br />- Từ <span className="font-mono font-semibold text-foreground">D</span> lên{" "}
                      <span className="font-mono font-semibold text-foreground">B</span>
                    </p>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <h5 className="font-semibold">Tăng 3 điểm</h5>
                    <p className="text-sm text-muted-foreground">
                      Nhập tổng số tín chỉ của các môn bạn dự định cải thiện lên 1 bậc điểm.
                      <br />- Từ <span className="font-mono font-semibold text-foreground">D</span> lên{" "}
                      <span className="font-mono font-semibold text-foreground">A</span>
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mức tăng</TableHead>
                <TableHead className="text-right">Số tín chỉ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-xs">Tăng 1 điểm</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={improvementCredits.onePoint}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleImprovementChange("onePoint", e.target.value)}
                    className={cn("w-12 h-8 float-right text-right", rmtx)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-xs">Tăng 2 điểm</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={improvementCredits.twoPoints}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleImprovementChange("twoPoints", e.target.value)}
                    className={cn("w-12 h-8 float-right text-right", rmtx)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-xs">Tăng 3 điểm</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    value={improvementCredits.threePoints}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => handleImprovementChange("threePoints", e.target.value)}
                    className={cn("w-12 h-8 float-right text-right", rmtx)}
                  />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* CỘT 3 & 4: Kết quả dự kiến */}
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
                totalEnteredCredits > remainingCredits
                  ? "text-orange-500"
                  : creditsMatch
                    ? "text-green-600"
                    : "text-red-600"
              )}
            >
              {totalEnteredCredits}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span>Số tín chỉ chưa nhập:</span>
            <span
              className={cn(
                "font-bold",
                totalEnteredCredits > remainingCredits
                  ? "text-orange-500"
                  : creditsMatch
                    ? "text-green-600"
                    : "text-red-600"
              )}
            >
              {remainingCredits - totalEnteredCredits}
            </span>
          </div>
          <hr />

          {creditsMatch && finalGraduationGPA !== null ? (
            <div className="text-center pt-2">
              <p className="text-sm text-muted-foreground">GPA tốt nghiệp</p>
              <p className="text-4xl font-bold text-[#16a249]">{finalGraduationGPA.toFixed(2)}</p>
            </div>
          ) : newCumulativeInfo ? (
            <div className="pt-2 gap-x-12 flex justify-center">
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground ">Số tín chỉ tích lũy mới:</span>
                <br />
                <span className="text-4xl font-bold text-[#3472ef]">{newCumulativeInfo.credits}</span>
              </div>
              <div className="text-center pt-2">
                <span className="text-sm text-muted-foreground">GPA tích lũy mới:</span>
                <br />
                <span className="text-4xl font-bold text-[#3472ef]">{newCumulativeInfo.gpa.toFixed(2)}</span>
              </div>
            </div>
          ) : (
            <div className="text-center pt-2 text-muted-foreground text-sm">
              Vui lòng nhập số tín chỉ dự kiến để xem kết quả.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
