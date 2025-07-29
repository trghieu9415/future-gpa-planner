import { useLayoutEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useCoursesStore } from "@/hooks/useCoursesStore";
import { Course, LetterGrade, letterGradeToPoints } from "@/types";

export const CourseList = () => {
  const { courses, updateCourse, removeCourse } = useCoursesStore();
  const [lastUpdatedId, setLastUpdatedId] = useState<string | null>(null);

  const courseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useLayoutEffect(() => {
    if (!lastUpdatedId) return;

    const target = courseRefs.current[lastUpdatedId];
    if (target) {
      target.scrollIntoView({
        block: "nearest",
      });
    }
  }, [lastUpdatedId]);

  const handleUpdate = (id: string, updated: Partial<Course>) => {
    updateCourse(id, updated);
    setLastUpdatedId(null);
    setTimeout(() => {
      setLastUpdatedId(id);
    }, 100);
  };

  return (
    <div className="h-72 border rounded-lg p-2 overflow-hidden">
      <div className="space-y-2 h-full overflow-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            ref={(el) => (courseRefs.current[course.id] = el)}
            className="flex items-center gap-3 p-3 bg-card border rounded-lg transition-all"
          >
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="flex justify-center items-center font-mono text-slate-500">{course.courseId}</div>

              <Input
                className="sm:col-span-6"
                value={course.name}
                onChange={(e) => handleUpdate(course.id, { name: e.target.value })}
                placeholder="Tên môn học"
              />

              <div className="flex items-center gap-2 xl:col-span-2">
                <div className="text-black">
                  {course.credits} <span className="text-sm">tín chỉ</span>
                </div>
              </div>

              <div className="xl:col-span-2">
                <Select
                  value={course.letterGrade}
                  onValueChange={(e) =>
                    handleUpdate(course.id, {
                      letterGrade: e as LetterGrade,
                      points: letterGradeToPoints[e],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Điểm chữ" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(letterGradeToPoints).map(([letter, points]) => (
                      <SelectItem key={letter} value={letter}>
                        {letter} ({points.toFixed(1)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => removeCourse(course.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
