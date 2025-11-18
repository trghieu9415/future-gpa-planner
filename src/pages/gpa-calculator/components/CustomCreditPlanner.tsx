import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "../../../components/ui/input";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../../components/ui/button";

interface CustomCreditPlannerProps {
  currentGPA: number;
  accumulatedCredits: number;
  requiredCredits: number;
}

// Lớp CSS để loại bỏ các nút tăng/giảm của input type="number"
const rmtx =
  "appearance-none [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ";

export const CustomCreditPlanner = ({ currentGPA, accumulatedCredits, requiredCredits }: CustomCreditPlannerProps) => {
  // THAY ĐỔI 1: State bây giờ lưu string để cho phép ô input rỗng tạm thời
  const [customCredits, setCustomCredits] = useState({ a: "0", b: "0", c: "0", d: "0" });
  const [improvementCredits, setImprovementCredits] = useState({ onePoint: "0", twoPoints: "0", threePoints: "0" });

  const [finalGraduationGPA, setFinalGraduationGPA] = useState<number | null>(null);
  const [newCumulativeInfo, setNewCumulativeInfo] = useState<{ gpa: number; credits: number } | null>(null);

  // Tính toán các giá trị số từ state (string)
  // Phải thực hiện việc này BÊN NGOÀI useEffect để tính toán cho JSX
  const creditsA = parseInt(customCredits.a, 10) || 0;
  const creditsB = parseInt(customCredits.b, 10) || 0;
  const creditsC = parseInt(customCredits.c, 10) || 0;
  const creditsD = parseInt(customCredits.d, 10) || 0;

  const remainingCredits = requiredCredits - accumulatedCredits;
  const totalEnteredCredits = creditsA + creditsB + creditsC + creditsD;
  const creditsMatch = totalEnteredCredits === remainingCredits;

  useEffect(() => {
    // THAY ĐỔI 2: Parse giá trị từ state (string) sang number để tính toán
    // Coi chuỗi rỗng "" là 0
    const numCreditsA = parseInt(customCredits.a, 10) || 0;
    const numCreditsB = parseInt(customCredits.b, 10) || 0;
    const numCreditsC = parseInt(customCredits.c, 10) || 0;
    const numCreditsD = parseInt(customCredits.d, 10) || 0;

    const numImprove1 = parseInt(improvementCredits.onePoint, 10) || 0;
    const numImprove2 = parseInt(improvementCredits.twoPoints, 10) || 0;
    const numImprove3 = parseInt(improvementCredits.threePoints, 10) || 0;

    const currentQualityPoints = currentGPA * accumulatedCredits;
    const futureQualityPoints = numCreditsA * 4.0 + numCreditsB * 3.0 + numCreditsC * 2.0 + numCreditsD * 1.0;
    const improvementPoints = numImprove1 * 1.0 + numImprove2 * 2.0 + numImprove3 * 3.0;

    const newTotalEnteredCredits = numCreditsA + numCreditsB + numCreditsC + numCreditsD;
    const newCreditsMatch = newTotalEnteredCredits === remainingCredits;

    if (newTotalEnteredCredits > 0 || improvementPoints > 0) {
      const newTotalQualityPoints = currentQualityPoints + futureQualityPoints + improvementPoints;
      const newAccumulatedCredits = accumulatedCredits + newTotalEnteredCredits;
      const newGPA = newAccumulatedCredits > 0 ? newTotalQualityPoints / newAccumulatedCredits : 0;
      setNewCumulativeInfo({ gpa: newGPA, credits: newAccumulatedCredits });

      if (newCreditsMatch) {
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
    customCredits, // State giờ là object chứa string
    improvementCredits, // State giờ là object chứa string
    currentGPA,
    accumulatedCredits,
    requiredCredits,
    remainingCredits, // Thêm dependency này
  ]);

  // THAY ĐỔI 3: onChange chỉ cập nhật string, cho phép số và rỗng
  const handleCreditChange = (grade: "a" | "b" | "c" | "d", value: string) => {
    if (/^[0-9]*$/.test(value)) {
      // Chỉ cho phép nhập số (0-9) hoặc rỗng
      setCustomCredits((prev) => ({
        ...prev,
        [grade]: value,
      }));
    }
  };

  const handleImprovementChange = (type: "onePoint" | "twoPoints" | "threePoints", value: string) => {
    if (/^[0-9]*$/.test(value)) {
      setImprovementCredits((prev) => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  // THAY ĐỔI 4: onBlur để set giá trị "" về "0" khi người dùng click ra ngoài
  const handleBlurCredits = (grade: "a" | "b" | "c" | "d") => {
    if (customCredits[grade] === "") {
      setCustomCredits((prev) => ({ ...prev, [grade]: "0" }));
    }
  };

  const handleBlurImprovement = (type: "onePoint" | "twoPoints" | "threePoints") => {
    if (improvementCredits[type] === "") {
      setImprovementCredits((prev) => ({ ...prev, [type]: "0" }));
    }
  };

  const handleCreditFocus = (grade: "a" | "b" | "c" | "d", value: string) => {
    if (value === "0") {
      setCustomCredits((prev) => ({
        ...prev,
        [grade]: "",
      }));
    }
  };

  const handleImprovementFocus = (type: "onePoint" | "twoPoints" | "threePoints", value: string) => {
    if (value === "0") {
      setImprovementCredits((prev) => ({
        ...prev,
        [type]: "",
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 leading-7">Công cụ lập kế hoạch tín chỉ tùy chỉnh</CardTitle>
        <CardDescription>
          Nhập số tín chỉ dự định đạt được cho mỗi loại điểm và số tín chỉ muốn cải thiện để xem kết quả.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* CỘT 1: Tín chỉ các môn học mới */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm">Tín chỉ các môn học mới</h4>
            {/* ===== DIALOG 1 (Đã khôi phục) ===== */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="h-5 w-5 rounded-full">
                  <HelpCircle className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Giải thích về Tín chỉ các môn học mới</DialogTitle>
                  <DialogDescription className="text-justify flex-col space-y-1 pt-2">
                    <p>
                      Phần này giúp bạn dự đoán kết quả cho các học phần chưa học trong số tín chỉ còn lại của chương
                      trình đào tạo.
                    </p>
                    <p>
                      Nhập tổng số tín chỉ bạn dự kiến sẽ đạt được cho mỗi loại điểm (A, B, C, D). Công cụ sẽ dựa vào đó
                      để tính toán GPA dự kiến của bạn."
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    <li>
                      <span className="font-semibold text-foreground">Điểm A (4.0):</span> Cho các môn bạn tự tin sẽ đạt
                      điểm A.
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">Điểm B (3.0):</span> Cho các môn bạn dự kiến đạt
                      điểm B.
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">Điểm C (2.0):</span> Cho các môn bạn dự kiến đạt
                      điểm C.
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">Điểm D (1.0):</span> Cho các môn bạn chỉ cần qua
                      môn.
                    </li>
                  </ul>
                </div>
              </DialogContent>
            </Dialog>
          </div>
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
                    type="number" // Giữ type="number" để ẩn ký tự chữ
                    min="0"
                    value={customCredits.a} // value từ state (string)
                    onFocus={(e) => handleCreditFocus("a", e.target.value)}
                    onBlur={() => handleBlurCredits("a")} // MỚI
                    onChange={(e) => handleCreditChange("a", e.target.value)} // MỚI
                    className={cn("w-12 h-8 float-right text-left", rmtx)}
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
                    onFocus={(e) => handleCreditFocus("b", e.target.value)}
                    onBlur={() => handleBlurCredits("b")} // MỚI
                    onChange={(e) => handleCreditChange("b", e.target.value)} // MỚI
                    className={cn("w-12 h-8 float-right text-left", rmtx)}
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
                    onFocus={(e) => handleCreditFocus("c", e.target.value)}
                    onBlur={() => handleBlurCredits("c")} // MỚI
                    onChange={(e) => handleCreditChange("c", e.target.value)} // MỚI
                    className={cn("w-12 h-8 float-right text-left", rmtx)}
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
                    onBlur={() => handleBlurCredits("d")}
                    onFocus={(e) => handleCreditFocus("d", e.target.value)}
                    onChange={(e) => handleCreditChange("d", e.target.value)} // MỚI
                    className={cn("w-12 h-8 float-right text-left", rmtx)}
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
            {/* ===== DIALOG 2 (Đã khôi phục) ===== */}
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
                      Nhập tổng số tín chỉ của các môn bạn dự định cải thiện từ{" "}
                      <span className="font-mono font-semibold text-foreground">D</span> lên{" "}
                      <span className="font-mono font-semibold text-foreground">A</span>.
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
                    onFocus={(e) => handleImprovementFocus("onePoint", e.target.value)}
                    onBlur={() => handleBlurImprovement("onePoint")} // MỚI
                    onChange={(e) => handleImprovementChange("onePoint", e.target.value)} // MỚI
                    className={cn("w-12 h-8 float-right text-left", rmtx)}
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
                    onFocus={(e) => handleImprovementFocus("twoPoints", e.target.value)}
                    onBlur={() => handleBlurImprovement("twoPoints")} // MỚI
                    onChange={(e) => handleImprovementChange("twoPoints", e.target.value)} // MỚI
                    className={cn("w-12 h-8 float-right text-left", rmtx)}
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
                    onFocus={(e) => handleImprovementFocus("threePoints", e.target.value)}
                    onBlur={() => handleBlurImprovement("threePoints")} // MỚI
                    onChange={(e) => handleImprovementChange("threePoints", e.target.value)} // MỚI
                    className={cn("w-12 h-8 float-right text-left", rmtx)}
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
