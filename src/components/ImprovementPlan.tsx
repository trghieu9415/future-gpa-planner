import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, RefreshCw, TrendingUp, Calendar, CheckCircle2 } from "lucide-react";

export const ImprovementPlan = () => {
  const improvementStrategies = [
    {
      id: 1,
      title: "Retake Low-Grade Courses",
      description: "Identify courses with grades below B and consider retaking for higher GPA",
      impact: "High",
      timeframe: "1-2 semesters",
      difficulty: "Medium",
      status: "recommended"
    },
    {
      id: 2,
      title: "Grade Replacement Policy",
      description: "Use your institution's grade replacement policy for failed courses",
      impact: "Very High",
      timeframe: "Next semester",
      difficulty: "Low",
      status: "available"
    },
    {
      id: 3,
      title: "Credit Overload Strategy",
      description: "Take additional credits in subjects where you excel to boost overall GPA",
      impact: "Medium",
      timeframe: "2-3 semesters",
      difficulty: "High",
      status: "planning"
    },
    {
      id: 4,
      title: "Summer Course Enhancement",
      description: "Enroll in summer courses to improve grades in specific subject areas",
      impact: "Medium",
      timeframe: "Summer session",
      difficulty: "Medium",
      status: "available"
    }
  ];

  const milestones = [
    { title: "Identify Target Courses", completed: true, date: "Week 1" },
    { title: "Meet with Academic Advisor", completed: true, date: "Week 2" },
    { title: "Register for Retake Courses", completed: false, date: "Week 3" },
    { title: "Develop Study Schedule", completed: false, date: "Week 4" },
    { title: "Mid-semester Progress Check", completed: false, date: "Week 8" },
    { title: "Final Grade Assessment", completed: false, date: "Week 16" }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Very High": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "recommended": return "bg-primary text-primary-foreground";
      case "available": return "bg-accent text-accent-foreground";
      case "planning": return "bg-secondary text-secondary-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Academic Improvement Plan
          </CardTitle>
          <CardDescription className="text-base">
            Strategic planning tools to help you improve your GPA and achieve your academic goals. 
            These features will help you track progress and make informed decisions about course selection.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Improvement Strategies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-accent" />
              Improvement Strategies
            </CardTitle>
            <CardDescription>
              Recommended approaches to boost your GPA
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {improvementStrategies.map((strategy) => (
              <div key={strategy.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm">{strategy.title}</h3>
                  <Badge className={getStatusColor(strategy.status)}>
                    {strategy.status}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {strategy.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getImpactColor(strategy.impact)}>
                    Impact: {strategy.impact}
                  </Badge>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {strategy.timeframe}
                  </Badge>
                  <Badge variant="outline">
                    Difficulty: {strategy.difficulty}
                  </Badge>
                </div>
                
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Progress Tracking */}
        <div className="space-y-6">
          {/* Milestone Tracker */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent" />
                Improvement Milestones
              </CardTitle>
              <CardDescription>
                Track your progress through the improvement process
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">2 of 6 completed</span>
                </div>
                <Progress value={33} className="h-2" />
                
                <div className="space-y-3 mt-4">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                        milestone.completed 
                          ? 'bg-accent text-accent-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        {milestone.completed && <CheckCircle2 className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${milestone.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {milestone.title}
                        </p>
                        <p className="text-xs text-muted-foreground">{milestone.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="default">
                Schedule Advisor Meeting
              </Button>
              <Button className="w-full" variant="outline">
                View Course Catalog
              </Button>
              <Button className="w-full" variant="outline">
                Check Grade Policies
              </Button>
              <Button className="w-full" variant="outline">
                Export Improvement Plan
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Coming Soon Banner */}
      <Card className="border-dashed border-2 border-muted-foreground/25">
        <CardContent className="text-center py-8">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Enhanced Features Coming Soon</h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We're working on advanced features including personalized study schedules, 
                grade prediction algorithms, and integration with your university's course management system.
              </p>
            </div>
            <Badge variant="secondary" className="mt-4">
              In Development
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};