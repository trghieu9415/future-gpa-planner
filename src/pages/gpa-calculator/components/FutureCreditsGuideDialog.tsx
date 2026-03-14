import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export const FutureCreditsGuideDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-5 w-5 rounded-full">
          <HelpCircle className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Giải thích về Tín chỉ các môn học mới</DialogTitle>
          <DialogDescription className="text-justify flex-col space-y-1 pt-2">
            <p>
              Phần này giúp bạn dự đoán kết quả cho các học phần chưa học trong số tín chỉ còn lại của chương trình đào
              tạo.
            </p>
            <p>
              Nhập tổng số tín chỉ bạn dự kiến sẽ đạt được cho mỗi loại điểm (A, B, C, D). Công cụ sẽ dựa vào đó để tính
              toán GPA dự kiến của bạn."
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-semibold text-foreground">Điểm A (4.0):</span> Cho các môn bạn tự tin sẽ đạt điểm A.
            </li>
            <li>
              <span className="font-semibold text-foreground">Điểm B (3.0):</span> Cho các môn bạn dự kiến đạt điểm B.
            </li>
            <li>
              <span className="font-semibold text-foreground">Điểm C (2.0):</span> Cho các môn bạn dự kiến đạt điểm C.
            </li>
            <li>
              <span className="font-semibold text-foreground">Điểm D (1.0):</span> Cho các môn bạn chỉ cần qua môn.
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
