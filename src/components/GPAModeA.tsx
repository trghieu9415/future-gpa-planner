import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { useAcademicStatus } from "@/hooks/useAcademicStatus";

export const GPAModeA = () => {
  const { currentGPA, setCurrentGPA, accumulatedCredits, setAccumulatedCredits, requiredCredits, setRequiredCredits } =
    useAcademicStatus();
  return (
    <Card className="bg-gradient-to-br from-card to-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Tình trạng học tập hiện tại
        </CardTitle>
        <CardDescription>Nhập GPA hiện tại và thông tin về số tín chỉ</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="current-gpa">GPA hiện tại</Label>
            <Input
              id="current-gpa"
              type="number"
              placeholder="3.5"
              min="0"
              max="4.0"
              step="0.01"
              value={currentGPA || ""}
              onChange={(e) => setCurrentGPA(e.target.value ? parseFloat(e.target.value) : null)}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Phạm vi: 0.00 - 4.00</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accumulated-credits">Số tín chỉ tích lũy</Label>
            <Input
              id="accumulated-credits"
              type="number"
              placeholder="98"
              min="0"
              value={accumulatedCredits || ""}
              onChange={(e) => setAccumulatedCredits(e.target.value ? parseInt(e.target.value) : null)}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Số tính chỉ đã hoàn thành</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="required-credits">Số tính chỉ yêu cầu</Label>
            <Input
              id="required-credits"
              type="number"
              placeholder="132"
              min="0"
              value={requiredCredits || ""}
              onChange={(e) => setRequiredCredits(e.target.value ? parseInt(e.target.value) : null)}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Số tín chỉ tối thiểu để tốt nghiệp</p>
          </div>
        </div>

        {currentGPA && accumulatedCredits && requiredCredits && (
          <div className="mt-6 p-4 bg-[#f3f6fc] rounded-lg border border-[#cdddfb]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-[#7e7280]">Số tín chỉ còn lại</p>
                <p className="text-2xl font-bold text-[#3472ef]">{requiredCredits - accumulatedCredits}</p>
              </div>
              <div>
                <p className="text-sm text-[#7e7280]">GPA hiện tại</p>
                <p className="text-2xl font-bold text-[#16a249]">{currentGPA?.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-[#7e7280]">Tiến độ</p>
                <p className="text-2xl font-bold text-[#16a249]">
                  {Math.round((accumulatedCredits / requiredCredits) * 100)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
