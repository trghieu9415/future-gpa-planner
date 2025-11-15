import { GPAModeA } from "@/pages/gpa-calculator/components/GPAModeA";
import { GPAResultsTable } from "@/pages/gpa-calculator/components/GPAResultsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcademicStatus } from "@/components/store/useAcademicStatus";
import { useState } from "react";
import { CustomCreditPlanner } from "@/pages/gpa-calculator/components/CustomCreditPlanner"; // Import component mới

export const GPACalculator = () => {
  const { currentGPA, accumulatedCredits, requiredCredits } = useAcademicStatus();
  const [mode, setMode] = useState<"mode-a" | "mode-b">("mode-a");

  const isDataValid = currentGPA && accumulatedCredits && requiredCredits && requiredCredits > accumulatedCredits;

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 leading-7">Nhập dữ liệu học tập của bạn</CardTitle>
          <CardDescription>Chọn cách nhập dữ liệu bạn muốn để tính GPA tốt nghiệp dự kiến</CardDescription>
        </CardHeader>
        <CardContent>
          <GPAModeA />
        </CardContent>
      </Card>

      <GPAResultsTable
        currentGPA={currentGPA}
        accumulatedCredits={accumulatedCredits}
        requiredCredits={requiredCredits}
      />

      {isDataValid && (
        <CustomCreditPlanner
          currentGPA={currentGPA}
          accumulatedCredits={accumulatedCredits}
          requiredCredits={requiredCredits}
        />
      )}
    </div>
  );
};
