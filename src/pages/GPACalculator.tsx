import { GPAModeA } from "@/components/GPAModeA";
import { GPAModeB } from "@/components/GPAModeB";
import { GPAResultsTable } from "@/components/GPAResultsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target } from "lucide-react";
import { useState } from "react";

export const GPACalculator = () => {
  const [currentGPA, setCurrentGPA] = useState<number | null>(null);
  const [accumulatedCredits, setAccumulatedCredits] = useState<number | null>(null);
  const [requiredCredits, setRequiredCredits] = useState<number | null>(null);
  const [mode, setMode] = useState<"mode-a" | "mode-b">("mode-a");

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Nhập dữ liệu học tập của bạn
          </CardTitle>
          <CardDescription>Chọn cách nhập dữ liệu bạn muốn để tính GPA tốt nghiệp dự kiến</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="mode-a"
            className="space-y-6"
            onValueChange={(val) => setMode(val as "mode-a" | "mode-b")}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mode-a">GPA hiện tại</TabsTrigger>
              <TabsTrigger value="mode-b">Danh sách môn học</TabsTrigger>
            </TabsList>

            <TabsContent value="mode-a">
              <GPAModeA
                currentGPA={currentGPA}
                setCurrentGPA={setCurrentGPA}
                accumulatedCredits={accumulatedCredits}
                setAccumulatedCredits={setAccumulatedCredits}
                requiredCredits={requiredCredits}
                setRequiredCredits={setRequiredCredits}
              />
            </TabsContent>

            <TabsContent value="mode-b">
              <GPAModeB
                currentGPA={currentGPA}
                setCurrentGPA={setCurrentGPA}
                accumulatedCredits={accumulatedCredits}
                setAccumulatedCredits={setAccumulatedCredits}
                requiredCredits={requiredCredits}
                setRequiredCredits={setRequiredCredits}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results Section */}
      <GPAResultsTable
        currentGPA={currentGPA}
        accumulatedCredits={accumulatedCredits}
        requiredCredits={requiredCredits}
        mode={mode}
      />
    </div>
  );
};
