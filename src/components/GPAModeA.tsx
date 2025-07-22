import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

interface GPAModeAProps {
  currentGPA: number | null;
  setCurrentGPA: (value: number | null) => void;
  accumulatedCredits: number | null;
  setAccumulatedCredits: (value: number | null) => void;
  requiredCredits: number | null;
  setRequiredCredits: (value: number | null) => void;
}

export const GPAModeA = ({ 
  currentGPA, 
  setCurrentGPA, 
  accumulatedCredits, 
  setAccumulatedCredits, 
  requiredCredits, 
  setRequiredCredits 
}: GPAModeAProps) => {
  return (
    <Card className="bg-gradient-to-br from-card to-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Current Academic Status
        </CardTitle>
        <CardDescription>
          Enter your current GPA and credit information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="current-gpa">Current GPA</Label>
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
            <p className="text-sm text-muted-foreground">Scale: 0.0 - 4.0</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accumulated-credits">Accumulated Credits</Label>
            <Input
              id="accumulated-credits"
              type="number"
              placeholder="90"
              min="0"
              value={accumulatedCredits || ""}
              onChange={(e) => setAccumulatedCredits(e.target.value ? parseInt(e.target.value) : null)}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Credits completed</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="required-credits">Required Credits</Label>
            <Input
              id="required-credits"
              type="number"
              placeholder="130"
              min="0"
              value={requiredCredits || ""}
              onChange={(e) => setRequiredCredits(e.target.value ? parseInt(e.target.value) : null)}
              className="text-lg"
            />
            <p className="text-sm text-muted-foreground">Total for graduation</p>
          </div>
        </div>
        
        {currentGPA && accumulatedCredits && requiredCredits && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground">Remaining Credits</p>
                <p className="text-2xl font-bold text-primary">{requiredCredits - accumulatedCredits}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current GPA</p>
                <p className="text-2xl font-bold text-accent">{currentGPA.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <p className="text-2xl font-bold text-academic-green">
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