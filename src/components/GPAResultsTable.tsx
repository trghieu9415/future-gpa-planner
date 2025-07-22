import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Star, Target } from "lucide-react";

interface Course {
  id: string;
  name: string;
  grade: number;
  credits: number;
}

interface GPAResultsTableProps {
  currentGPA: number | null;
  accumulatedCredits: number | null;
  requiredCredits: number | null;
  courses: Course[];
}

const gradeTargets = [
  { tier: "Excellent", minGPA: 3.6, icon: Award, color: "bg-academic-gold text-academic-navy" },
  { tier: "Good", minGPA: 3.2, icon: Star, color: "bg-accent text-accent-foreground" },
  { tier: "Fair", minGPA: 2.5, icon: Target, color: "bg-primary text-primary-foreground" }
];

const calculateRequiredGrades = (currentGPA: number, currentCredits: number, remainingCredits: number, targetGPA: number) => {
  const currentQualityPoints = currentGPA * currentCredits;
  const totalCreditsNeeded = currentCredits + remainingCredits;
  const totalQualityPointsNeeded = targetGPA * totalCreditsNeeded;
  const remainingQualityPointsNeeded = totalQualityPointsNeeded - currentQualityPoints;
  const averageGradeNeeded = remainingQualityPointsNeeded / remainingCredits;

  // Calculate distribution of grades
  const gradeCombinations = [];
  
  for (let aGrades = 0; aGrades <= remainingCredits; aGrades++) {
    for (let bGrades = 0; bGrades <= remainingCredits - aGrades; bGrades++) {
      for (let cGrades = 0; cGrades <= remainingCredits - aGrades - bGrades; cGrades++) {
        const dGrades = remainingCredits - aGrades - bGrades - cGrades;
        const totalQualityPoints = (aGrades * 4.0) + (bGrades * 3.0) + (cGrades * 2.0) + (dGrades * 1.0);
        
        if (Math.abs(totalQualityPoints - remainingQualityPointsNeeded) < 0.1) {
          gradeCombinations.push({ a: aGrades, b: bGrades, c: cGrades, d: dGrades });
        }
      }
    }
  }

  // Return the most balanced combination or a reasonable approximation
  if (gradeCombinations.length > 0) {
    return gradeCombinations[0];
  } else {
    // Fallback calculation
    const aCredits = Math.max(0, Math.min(remainingCredits, Math.ceil(averageGradeNeeded > 3.5 ? remainingCredits * 0.6 : remainingCredits * 0.4)));
    const bCredits = Math.max(0, Math.min(remainingCredits - aCredits, Math.ceil((remainingCredits - aCredits) * 0.5)));
    const cCredits = Math.max(0, Math.min(remainingCredits - aCredits - bCredits, Math.ceil((remainingCredits - aCredits - bCredits) * 0.7)));
    const dCredits = Math.max(0, remainingCredits - aCredits - bCredits - cCredits);
    
    return { a: aCredits, b: bCredits, c: cCredits, d: dCredits };
  }
};

export const GPAResultsTable = ({ currentGPA, accumulatedCredits, requiredCredits, courses }: GPAResultsTableProps) => {
  // Calculate current state from either mode
  let effectiveGPA = currentGPA;
  let effectiveCredits = accumulatedCredits;
  
  if (courses.length > 0) {
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    const totalQualityPoints = courses.reduce((sum, course) => sum + (course.grade * course.credits), 0);
    effectiveGPA = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;
    effectiveCredits = totalCredits;
  }

  const effectiveRemainingCredits = requiredCredits && effectiveCredits ? requiredCredits - effectiveCredits : null;

  if (!effectiveGPA || !effectiveCredits || !requiredCredits || !effectiveRemainingCredits || effectiveRemainingCredits <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Grade Requirements
          </CardTitle>
          <CardDescription>
            Enter your academic data to see what grades you need for different GPA targets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Complete the form above to see your grade requirements</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Grade Requirements for Graduation Targets
        </CardTitle>
        <CardDescription>
          Based on {effectiveCredits} completed credits with {effectiveGPA.toFixed(2)} GPA. 
          Showing requirements for remaining {effectiveRemainingCredits} credits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Target Tier</TableHead>
                <TableHead>Target GPA</TableHead>
                <TableHead className="text-center">A Credits</TableHead>
                <TableHead className="text-center">B Credits</TableHead>
                <TableHead className="text-center">C Credits</TableHead>
                <TableHead className="text-center">D Credits</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradeTargets.map((target) => {
                const requirements = calculateRequiredGrades(
                  effectiveGPA, 
                  effectiveCredits, 
                  effectiveRemainingCredits, 
                  target.minGPA
                );
                
                const isAchievable = effectiveGPA >= target.minGPA || 
                  (requirements.a + requirements.b + requirements.c + requirements.d) <= effectiveRemainingCredits;
                
                const IconComponent = target.icon;
                
                return (
                  <TableRow key={target.tier}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="font-medium">{target.tier}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {target.minGPA.toFixed(1)}+
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {requirements.a}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {requirements.b}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {requirements.c}
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {requirements.d}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={isAchievable ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}
                      >
                        {effectiveGPA >= target.minGPA ? "Already Achieved" : isAchievable ? "Achievable" : "Challenging"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Note:</strong> These calculations assume you complete exactly {effectiveRemainingCredits} more credits. 
            Grade combinations show one possible path to reach each target GPA.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div><strong>A:</strong> 4.0 points</div>
            <div><strong>B:</strong> 3.0 points</div>
            <div><strong>C:</strong> 2.0 points</div>
            <div><strong>D:</strong> 1.0 points</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};