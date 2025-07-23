import { GPAModeA } from "@/components/GPAModeA";
import { GPAModeB } from "@/components/GPAModeB";
import { GPAResultsTable } from "@/components/GPAResultsTable";
import { ImprovementTable } from "@/components/ImprovementTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target } from "lucide-react";
import { useState } from "react";

export const Improvement = () => {
  const [currentGPA, setCurrentGPA] = useState<number | null>(null);
  const [accumulatedCredits, setAccumulatedCredits] = useState<number | null>(null);
  const [requiredCredits, setRequiredCredits] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Dữ liệu học tập của bạn
          </CardTitle>
          <CardDescription>Cung cấp danh sách môn học để có thể đưa ra kế hoạch học cải thiện</CardDescription>
        </CardHeader>
        <CardContent>
          <GPAModeB
            currentGPA={currentGPA}
            setCurrentGPA={setCurrentGPA}
            accumulatedCredits={accumulatedCredits}
            setAccumulatedCredits={setAccumulatedCredits}
            requiredCredits={requiredCredits}
            setRequiredCredits={setRequiredCredits}
          />
        </CardContent>
      </Card>
      <ImprovementTable />
    </div>
  );
};
