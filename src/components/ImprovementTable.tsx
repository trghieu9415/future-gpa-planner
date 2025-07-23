import { Target } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { useState } from "react";
import { Course } from "@/types";

const getImprovableCourses = (courses: Course[]) => {
  return {
    bCourses: courses.filter((course) => course.letterGrade === "B"),
    cCourses: courses.filter((course) => course.letterGrade === "C"),
    dCourses: courses.filter((course) => course.letterGrade === "D"),
  };
};

export const ImprovementTable = () => {
  const [bCourses, setBCourses] = useState<Course[]>([]);
  const [cCourses, setCCourses] = useState<Course[]>([]);
  const [dCourses, setDCourses] = useState<Course[]>([]);

  return (
    <div className="space-y-6">
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Bảng cải thiện GPA
          </CardTitle>
          <CardDescription>
            Dựa trên dữ liệu học tập của bạn, chúng tôi sẽ cung cấp các tổ hợp điểm cần đạt được để cải thiện GPA.
          </CardDescription>
        </CardHeader>
        <CardContent>{/* Improvement logic will go here */}</CardContent>
      </Card>
    </div>
  );
};
