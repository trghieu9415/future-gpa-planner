import { Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { useEffect, useState } from "react";
import { Course, ImprovementCourse, ImprovementPriority, LetterGrade } from "@/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { calculateRequiredGrades } from "@/lib/utils";
import { useCoursesStore } from "@/hooks/useCoursesStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useAcademicStatus } from "@/hooks/useAcademicStatus";
import {
  IMPROVEMENT_PRIORITY_BY_EASE,
  IMPROVEMENT_PRIORITY_BY_FEASIBILITY,
  IMPROVEMENT_PRIORITY_BY_IMPACT,
} from "@/types/const";
import { Badge } from "./ui/badge";

const getImprovableCourses = (courses: Course[]) => {
  return {
    bCourses: courses
      .filter((course) => course.letterGrade === "B")
      .sort((course1, course2) => course2.credits - course1.credits),
    cCourses: courses
      .filter((course) => course.letterGrade === "C")
      .sort((course1, course2) => course2.credits - course1.credits),
    dCourses: courses
      .filter((course) => course.letterGrade === "D")
      .sort((course1, course2) => course2.credits - course1.credits),
  };
};

const getImproveList = (courses: Course[], improvementPriority: ImprovementPriority, neededPoints: number) => {
  const { bCourses, cCourses, dCourses } = getImprovableCourses(courses);

  if (neededPoints <= 0) return [];

  const improveMap = new Map<string, ImprovementCourse>();

  for (const rule of improvementPriority) {
    const courseList = rule.from === "B" ? bCourses : rule.from === "C" ? cCourses : rule.from === "D" ? dCourses : [];

    for (const course of courseList) {
      const existing = improveMap.get(course.id);

      if (!existing) {
        improveMap.set(course.id, { course, rule, impact: course.credits * rule.points });
      } else if (existing.rule.points < rule.points) {
        improveMap.set(course.id, { course, rule, impact: course.credits * rule.points });
      }

      const totalImpact = Array.from(improveMap.values()).reduce(
        (sum, { course, rule }) => sum + course.credits * rule.points,
        0
      );

      if (totalImpact >= neededPoints) {
        return Array.from(improveMap.values());
      }
    }
  }

  return Array.from(improveMap.values());
};

const getGradeStyles = (grade: LetterGrade) => {
  const gradeStyles = {
    A: "bg-grade-a-bg text-grade-a border-grade-a/20",
    B: "bg-grade-b-bg text-grade-b border-grade-b/20",
    C: "bg-grade-c-bg text-grade-c border-grade-c/20",
    D: "bg-grade-d-bg text-grade-d border-grade-d/20",
  };
  return gradeStyles[grade];
};

const calculateNeededPoints = (finalGPA: number, targetGPA: number, requiredCredits: number) => {
  if (finalGPA >= targetGPA) return 0;

  const totalPoints = targetGPA * requiredCredits;
  const achievablePoint = finalGPA * requiredCredits;

  return totalPoints - achievablePoint;
};

export const ImprovementTable = () => {
  const { courses } = useCoursesStore();
  const { currentGPA, accumulatedCredits, requiredCredits } = useAcademicStatus();

  const [targetGPAString, setTargetGPAString] = useState<string>("a-target");
  const [priorityTypeString, setPriorityTypeString] = useState<string>("impact");
  const [improvedCourses, setImprovedCourses] = useState<ImprovementCourse[]>([]);

  const [totalCourses, setTotalCourses] = useState<number>(0);
  const [totalCredits, setTotalCredits] = useState<number>(0);
  const [totalImpactCurrent, setTotalImpactCurrent] = useState<number>(0);
  const [totalImpactGraduation, setTotalImpactGraduation] = useState<number>(0);

  // const [totalCourses, setTotalCourses] = useState<number>(0);

  useEffect(() => {
    const targetGPA = targetGPAString === "a-target" ? 3.6 : targetGPAString === "b-target" ? 3.2 : 2.5;
    const priorityType =
      priorityTypeString === "ease"
        ? IMPROVEMENT_PRIORITY_BY_EASE
        : priorityTypeString === "impact"
          ? IMPROVEMENT_PRIORITY_BY_IMPACT
          : IMPROVEMENT_PRIORITY_BY_FEASIBILITY;

    const { finalGPA } = calculateRequiredGrades(currentGPA, accumulatedCredits, requiredCredits, targetGPA);
    const neededPoints = calculateNeededPoints(finalGPA, targetGPA, requiredCredits);
    const improvementList = getImproveList(courses, priorityType, neededPoints);

    setImprovedCourses(improvementList);

    setTotalCourses(improvedCourses.length);
    setTotalCredits(improvedCourses.reduce((sum, item) => sum + item.course.credits, 0));
    setTotalImpactCurrent(improvedCourses.reduce((sum, item) => sum + item.impact / accumulatedCredits, 0));
    setTotalImpactGraduation(improvedCourses.reduce((sum, item) => sum + item.impact / requiredCredits, 0));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetGPAString, priorityTypeString, courses]);

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 leading-7">
            <Target className="h-5 w-5 text-primary" />
            Bảng cải thiện GPA
          </CardTitle>
          <CardDescription>
            Dựa trên dữ liệu học tập của bạn, chúng tôi sẽ cung cấp các tổ hợp điểm cần đạt được để cải thiện GPA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full flex items-center justify-between">
            <RadioGroup defaultValue="a-target" className="flex gap-4" onValueChange={(val) => setTargetGPAString(val)}>
              <div className="flex items-center gap-x-2">
                <RadioGroupItem value="a-target" id="a-t" />
                <Label htmlFor="a-t">A (3.6+)</Label>
              </div>
              <div className="flex items-center gap-x-2">
                <RadioGroupItem value="b-target" id="b-t" />
                <Label htmlFor="b-t">B (3.2+)</Label>
              </div>
              <div className="flex items-center gap-x-2">
                <RadioGroupItem value="c-target" id="c-t" />
                <Label htmlFor="c-t">C (2.5+)</Label>
              </div>
            </RadioGroup>
            <RadioGroup
              defaultValue="impact"
              className="flex gap-4"
              onValueChange={(val) => setPriorityTypeString(val)}
            >
              <div className="flex items-center gap-x-2">
                <RadioGroupItem value="ease" id="ease" />
                <Label htmlFor="ease">Dễ đạt trước</Label>
              </div>
              <div className="flex items-center gap-x-2">
                <RadioGroupItem value="impact" id="impact" />
                <Label htmlFor="impact">Điểm càng cao càng tốt</Label>
              </div>
              <div className="flex items-center gap-x-2">
                <RadioGroupItem value="feasibility" id="feasibility" />
                <Label htmlFor="feasibility">Khả thi và phù hợp</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="my-4">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-muted/50">
                    <TableHead className="w-[200px]">Tên môn học</TableHead>
                    <TableHead className="text-center">Số tín chỉ</TableHead>
                    <TableHead className="text-center">Điểm hiện tại</TableHead>
                    <TableHead className="text-center">Cải thiện</TableHead>
                    <TableHead className="text-center">Tác động GPA hiện tại</TableHead>
                    <TableHead className="text-center">Tác động GPA tốt nghiệp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {improvedCourses.map((item) => (
                    <TableRow key={item.course.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-bold">{item.course.name}</TableCell>
                      <TableCell className="text-center">{item.course.credits}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={getGradeStyles(item.course.letterGrade)}>{item.course.letterGrade}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={getGradeStyles(item.rule.to)}>{item.rule.to}</Badge>
                      </TableCell>
                      <TableCell className="text-center font-semibold text-foreground">
                        +{(item.impact / accumulatedCredits).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center font-semibold text-foreground">
                        +{(item.impact / requiredCredits).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                  {improvedCourses.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        Không có môn học nào cần cải thiện
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            {totalCourses > 0 && (
              <div className="rounded-lg p-4 my-4 bg-[#f3f6fd] border border-[#ccdcfa]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Số môn cần cải thiện</div>
                    <div className="text-2xl font-bold text-blue-600">{totalCourses}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Tổng tín chỉ cải thiện</div>
                    <div className="text-2xl font-bold text-green-600">{totalCredits}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Tác động GPA hiện tại</div>
                    <div className="text-2xl font-bold text-yellow-600">+{totalImpactCurrent.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">GPA sau cải thiện</div>
                    <div className="text-2xl font-bold text-green-600">
                      {(currentGPA + totalImpactCurrent).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Tác động GPA tốt nghiệp</div>
                    <div className="text-2xl font-bold text-yellow-600">+{totalImpactGraduation.toFixed(2)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">GPA tốt nghiệp sau cải thiện</div>
                    <div className="text-2xl font-bold text-green-600">
                      {(targetGPAString === "a-target"
                        ? 3.6
                        : targetGPAString === "b-target"
                          ? 3.2
                          : 2.5 + totalImpactGraduation
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
