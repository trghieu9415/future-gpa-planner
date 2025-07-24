import { GPAModeB } from "@/components/GPAModeB";
import { ImprovementTable } from "@/components/ImprovementTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export const Improvement = () => {
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
          <GPAModeB />
        </CardContent>
      </Card>
      <ImprovementTable />
    </div>
  );
};
