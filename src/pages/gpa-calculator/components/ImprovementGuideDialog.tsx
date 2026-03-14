import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const GradeTag = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono font-semibold text-foreground">{children}</span>
);

const IMPROVEMENT_GUIDES = [
  {
    title: "Tăng 1 điểm",
    description: "Nhập tổng số tín chỉ của các môn dự định cải thiện lên 1 bậc:",
    paths: [
      { from: "B", to: "A" },
      { from: "C", to: "B" },
      { from: "D", to: "C" },
    ],
  },
  {
    title: "Tăng 2 điểm",
    description: "Nhập tổng số tín chỉ của các môn dự định cải thiện lên 2 bậc:",
    paths: [
      { from: "C", to: "A" },
      { from: "D", to: "B" },
    ],
  },
  {
    title: "Tăng 3 điểm",
    description: "Nhập tổng số tín chỉ của các môn dự định cải thiện lên 3 bậc:",
    paths: [{ from: "D", to: "A" }],
  },
];

export const ImprovementGuideDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-5 w-5 rounded-full shrink-0">
          <HelpCircle className="h-3 w-3" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giải thích về Cải thiện Tín chỉ</DialogTitle>
          <DialogDescription>
            Cải thiện điểm là việc bạn đăng ký học lại một học phần đã qua (điểm D, C, B) để có kết quả tốt hơn. Điểm
            mới (cao hơn) sẽ được dùng để tính lại GPA tích lũy.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-y-4 ">
          {IMPROVEMENT_GUIDES.map((guide, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <h5 className="font-semibold">{guide.title}</h5>
              <p className="text-sm text-muted-foreground">
                {guide.description}
                {guide.paths.map((path, pIndex) => (
                  <span key={pIndex} className="mx-1 inline-flex items-center gap-1">
                    <GradeTag>{path.from}</GradeTag> → <GradeTag>{path.to}</GradeTag>
                  </span>
                ))}
                <span>
                  <br />
                  Hoặc các mức tăng tương tự
                </span>
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
