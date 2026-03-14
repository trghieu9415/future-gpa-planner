import { cn } from "@/lib/utils";
import { SigmaSquare, Sun, GraduationCap } from "lucide-react"; // Đã sửa 'SquareSigma' thành 'SigmaSquare' cho đúng tên icon
import { Link, Outlet, useLocation } from "react-router-dom";
import { ScrollToTopButton } from "./ScrollToTopButton";
import { Footer } from "./Footer";

const modeTabs = [
  { icon: SigmaSquare, label: "Tính GPA tốt nghiệp", href: "/calculator" },
  { icon: Sun, label: "Thời khóa biểu", href: "/scheduler" },
];

const pageInfoMap: Record<string, { title: string; description: string }> = {
  "/calculator": {
    title: "Tính GPA tốt nghiệp",
    description: "Lên kế hoạch học tập của bạn và tính ra điểm GPA tốt nghiệp!",
  },
  "/scheduler": {
    title: "Xếp Thời khóa biểu",
    description: "Tổ chức và xem lịch học của bạn một cách trực quan.",
  },
  default: {
    title: "Công cụ học tập",
    description: "Lựa chọn một chức năng bên dưới để bắt đầu.",
  },
};

const gradient = "from-[#3472ef] to-[#16a14b]";

export const Layout = () => {
  const location = useLocation();
  const pageInfo = pageInfoMap[location.pathname] || pageInfoMap.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8" key={location.pathname}>
          {" "}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-full hidden sm:block">
              <GraduationCap className="h-8 w-8 text-[#3472ef]" />
            </div>
            <h1
              className={cn(
                "text-4xl font-bold bg-gradient-to-r flex h-20 items-center bg-clip-text text-transparent",
                "animate-in fade-in-50  duration-700",
                gradient
              )}
            >
              {pageInfo.title}
            </h1>
          </div>
          <p
            className={cn(
              "text-lg text-muted-foreground max-w-2xl mx-auto",
              "animate-in fade-in-50 duration-700" // <-- THÊM HIỆU ỨNG VỚI DELAY
            )}
          >
            {pageInfo.description}
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
                  isActive ? "shadow border-gray-100 border bg-blue-400 text-white" : "hover:bg-blue-50"
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
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};
