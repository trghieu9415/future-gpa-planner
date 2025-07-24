import { useState } from "react";
import { GraduationCap, Calculator, Target, TrendingUp } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GPAModeA } from "@/components/GPAModeA";
import { GPAModeB } from "@/components/GPAModeB";
import { GPAResultsTable } from "@/components/GPAResultsTable";
import { ImprovementPlan } from "@/components/ImprovementPlan";

const Index = () => {
  const [currentGPA, setCurrentGPA] = useState<number | null>(null);
  const [accumulatedCredits, setAccumulatedCredits] = useState<number | null>(null);
  const [requiredCredits, setRequiredCredits] = useState<number | null>(null);
  const [courses, setCourses] = useState<Array<{ id: string; name: string; grade: number; credits: number }>>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              GPA Estimator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Plan your academic journey and estimate your potential graduation GPA with precision. Calculate what grades
            you need to achieve your target.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="calculator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-1/2 lg:mx-auto">
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                <span className="hidden sm:inline">GPA Calculator</span>
                <span className="sm:hidden">Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="improvement" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Improvement Plan</span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calculator" className="space-y-6">
              <Card className="shadow-[var(--shadow-card)]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Input Your Academic Data
                  </CardTitle>
                  <CardDescription>
                    Choose your preferred input method to calculate your potential graduation GPA
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="mode-a" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="mode-a">Current GPA</TabsTrigger>
                      <TabsTrigger value="mode-b">Course List</TabsTrigger>
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
                      <GPAModeB courses={courses} setCourses={setCourses} />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Results Section */}
              <GPAResultsTable
                currentGPA={currentGPA}
                accumulatedCredits={accumulatedCredits}
                requiredCredits={requiredCredits}
                courses={courses}
              />
            </TabsContent>

            <TabsContent value="improvement">
              <ImprovementPlan />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
