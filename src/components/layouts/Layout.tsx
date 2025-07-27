import { cn } from "@/lib/utils";
import { Calculator, CalendarDays, GraduationCap, MoveUpRight } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { ScrollToTopButton } from "./ScrollToTopButton";

const modeTabs = [
  { icon: Calculator, label: "Tính GPA tốt nghiệp", href: "/calculator" },
  // { icon: MoveUpRight, label: "Kế hoạch cải thiện", href: "/improvement" },
  { icon: CalendarDays, label: "Thời khóa biểu", href: "/scheduler" },
];

export const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-[#18A5A7]/10 rounded-full">
              <GraduationCap className="h-8 w-8 text-[#3472ef]" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r h-16 flex items-center from-[#3472ef] to-[#16a14b] bg-clip-text text-transparent">
              Dự đoán GPA tốt nghiệp
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lên kế hoạch cho hành trình học tập của bạn và ước tính điểm tốt nghiệp một cách chính xác. Tính xem bạn cần
            đạt những điểm số nào để chạm tới mục tiêu của mình!
          </p>
        </div>
        <div className="flex flex-col sm:flex-row p-1 mb-4 rounded-sm max-w-6xl mx-auto bg-white border">
          {modeTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname === tab.href;
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={cn(
                  "flex w-full justify-center items-center gap-x-2 p-2 rounded-sm transition-colors",
                  isActive ? "shadow border-gray-100 border bg-blue-400 text-white" : "bg-transparent"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
      <ScrollToTopButton />
    </div>
  );
};
