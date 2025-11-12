import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

interface CustomCreditPlannerProps {
  currentGPA: number;
  accumulatedCredits: number;
  requiredCredits: number;
}

const rmtx =
  "appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ";

export const CustomCreditPlanner = ({ currentGPA, accumulatedCredits, requiredCredits }: CustomCreditPlannerProps) => {
  const [customCredits, setCustomCredits] = useState({ a: 0, b: 0, c: 0, d: 0 });
  const [finalGraduationGPA, setFinalGraduationGPA] = useState<number | null>(null);
  const [newCumulativeInfo, setNewCumulativeInfo] = useState<{ gpa: number; credits: number } | null>(null);

  const remainingCredits = requiredCredits - accumulatedCredits;
  const totalEnteredCredits = customCredits.a + customCredits.b + customCredits.c + customCredits.d;
  const creditsMatch = totalEnteredCredits === remainingCredits;

  useEffect(() => {
    const currentQualityPoints = currentGPA * accumulatedCredits;
    const futureQualityPoints =
      customCredits.a * 4.0 + customCredits.b * 3.0 + customCredits.c * 2.0 + customCredits.d * 1.0;

    if (totalEnteredCredits > 0) {
      // Luôn tính toán GPA và tín chỉ tích lũy mới khi người dùng nhập
      const newAccumulated = accumulatedCredits + totalEnteredCredits;
      const newTotalQualityPoints = currentQualityPoints + futureQualityPoints;
      const newGPA = newTotalQualityPoints / newAccumulated;
      setNewCumulativeInfo({ gpa: newGPA, credits: newAccumulated });

      // Nếu số tín chỉ khớp, tính GPA tốt nghiệp cuối cùng
      if (creditsMatch) {
        const totalQualityPoints = currentQualityPoints + futureQualityPoints;
        const calculatedGPA = totalQualityPoints / requiredCredits;
        setFinalGraduationGPA(calculatedGPA);
      } else {
        setFinalGraduationGPA(null);
      }
    } else {
      // Reset lại nếu không có tín chỉ nào được nhập
      setNewCumulativeInfo(null);
      setFinalGraduationGPA(null);
    }
  }, [customCredits, totalEnteredCredits, creditsMatch, currentGPA, accumulatedCredits, requiredCredits]);

  const handleCreditChange = (grade: "a" | "b" | "c" | "d", value: string) => {
    const numericValue = parseInt(value, 10);
    setCustomCredits((prev) => ({
      ...prev,
      [grade]: isNaN(numericValue) || numericValue < 0 ? 0 : numericValue,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Công cụ lập kế hoạch tín chỉ tùy chỉnh
        </CardTitle>
        <CardDescription>
          Nhập số tín chỉ bạn dự định đạt được cho mỗi loại điểm trong số {remainingCredits} tín chỉ còn lại để xem GPA
          tốt nghiệp của bạn sẽ thay đổi như thế nào.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        <div className="md:col-span-1">
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
          ) : newCumulativeInfo && totalEnteredCredits > 0 ? (
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
