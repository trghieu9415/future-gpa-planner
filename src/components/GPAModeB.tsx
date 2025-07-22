import { useState } from "react";
import { Plus, Trash2, BookOpenCheck } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Course {
  id: string;
  name: string;
  grade: number;
  credits: number;
}

interface GPAModeBProps {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
}

const gradeToPoints: { [key: string]: number } = {
  "A": 4.0,
  "A-": 3.7,
  "B+": 3.3,
  "B": 3.0,
  "B-": 2.7,
  "C+": 2.3,
  "C": 2.0,
  "C-": 1.7,
  "D+": 1.3,
  "D": 1.0,
  "F": 0.0
};

export const GPAModeB = ({ courses, setCourses }: GPAModeBProps) => {
  const [newCourse, setNewCourse] = useState({ name: "", grade: 0, credits: 3 });

  const addCourse = () => {
    if (newCourse.grade >= 0 && newCourse.credits > 0) {
      const course: Course = {
        id: Date.now().toString(),
        name: newCourse.name || `Course ${courses.length + 1}`,
        grade: newCourse.grade,
        credits: newCourse.credits
      };
      setCourses([...courses, course]);
      setNewCourse({ name: "", grade: 0, credits: 3 });
    }
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string | number) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, [field]: value } : course
    ));
  };

  const calculateGPA = () => {
    if (courses.length === 0) return 0;
    const totalPoints = courses.reduce((sum, course) => sum + (course.grade * course.credits), 0);
    const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const setGradeFromLetter = (grade: string) => {
    setNewCourse({ ...newCourse, grade: gradeToPoints[grade] });
  };

  return (
    <Card className="bg-gradient-to-br from-card to-secondary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpenCheck className="h-5 w-5 text-primary" />
          Course History
        </CardTitle>
        <CardDescription>
          Add your completed courses to calculate your GPA
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add Course Form */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold">Add New Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="course-name">Course Name</Label>
              <Input
                id="course-name"
                placeholder="e.g., Calculus I"
                value={newCourse.name}
                onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade-select">Grade</Label>
              <Select onValueChange={setGradeFromLetter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(gradeToPoints).map(([letter, points]) => (
                    <SelectItem key={letter} value={letter}>
                      {letter} ({points.toFixed(1)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="credits">Credits</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="6"
                value={newCourse.credits}
                onChange={(e) => setNewCourse({ ...newCourse, credits: parseInt(e.target.value) || 0 })}
              />
            </div>
            
            <div className="flex items-end">
              <Button onClick={addCourse} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>
          </div>
        </div>

        {/* Course List */}
        {courses.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">Your Courses ({courses.length})</h3>
            <div className="space-y-2">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center gap-3 p-3 bg-card border rounded-lg">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                      placeholder="Course name"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium w-16">
                        {Object.entries(gradeToPoints).find(([_, points]) => points === course.grade)?.[0] || course.grade.toFixed(1)}
                      </span>
                      <span className="text-xs text-muted-foreground">({course.grade.toFixed(1)} pts)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        max="6"
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, "credits", parseInt(e.target.value) || 0)}
                        className="w-20"
                      />
                      <span className="text-sm text-muted-foreground">credits</span>
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
            
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold text-primary">
                    {courses.reduce((sum, course) => sum + course.credits, 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current GPA</p>
                  <p className="text-2xl font-bold text-accent">{calculateGPA().toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality Points</p>
                  <p className="text-2xl font-bold text-academic-green">
                    {courses.reduce((sum, course) => sum + (course.grade * course.credits), 0).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};