import { GPAModeA } from "@/components/GPAModeA";
import { GPAResultsTable } from "@/components/GPAResultsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAcademicStatus } from "@/hooks/useAcademicStatus";
import { useState } from "react";
import { CustomCreditPlanner } from "@/components/CustomCreditPlanner"; // Import component mới

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
          {/* <Tabs
            defaultValue="mode-a"
            className="space-y-6"
            onValueChange={(val) => setMode(val as "mode-a" | "mode-b")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mode-a">GPA hiện tại</TabsTrigger>
              <TabsTrigger value="mode-b">Danh sách môn học</TabsTrigger>
            </TabsList>

            <TabsContent value="mode-a">
            </TabsContent>

            <TabsContent value="mode-b">
              <GPAModeB />
            </TabsContent>
          </Tabs> */}
        </CardContent>
      </Card>

      {/* Results Section */}
      <GPAResultsTable
        currentGPA={currentGPA}
        accumulatedCredits={accumulatedCredits}
        requiredCredits={requiredCredits}
      />

      {/* Custom Planner Section - Thêm vào đây */}
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
