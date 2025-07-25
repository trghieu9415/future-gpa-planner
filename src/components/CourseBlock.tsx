import { SignedCourse } from "@/types/schedule";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface CourseBlockProps {
  courseId: string;
  courseName: string;
  teacher: string;
  room: string;
  gridRow: string;
  gridColumn: number;
}

const getSubjectColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    "1": "bg-slate-300 border-slate-400 hover:bg-slate-200",
    "2": "bg-emerald-300 border-emerald-400 hover:bg-emerald-100",
    "3": "bg-amber-300 border-amber-400 hover:bg-amber-200",
    "4": "bg-zinc-300 border-zinc-400 hover:bg-zinc-200",
    "5": "bg-violet-300 border-violet-400 hover:bg-violet-200",
    "6": "bg-yellow-400 border-yellow-500 hover:bg-yellow-200",
    "7": "bg-sky-300 border-sky-400 hover:bg-sky-200",
    "8": "bg-green-300 border-green-400 hover:bg-green-200",
  };
  return colorMap[color] || colorMap["1"];
};

export const CourseBlock = ({ courseId, courseName, teacher, room, gridRow, gridColumn }: CourseBlockProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className={cn(
              "p-2 cursor-pointer transition-all duration-200 hover:shadow-sm",
              "flex flex-col justify-center text-xs rounded-none border-l-4 border-y-0 border-r-0",
              getSubjectColorClass((Math.floor(Math.random() * 8) + 1).toString())
            )}
            style={{
              gridRow,
              gridColumn: gridColumn,
            }}
          >
            <div className="text-gray-800 mb-1 leading-tight font-bold line-clamp-2">
              {courseName} ({courseId})
            </div>
            <div className="text-xs text-gray-700">
              <span className="font-bold italic">Phòng: </span>
              {room}
            </div>
          </Card>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px] text-xs text-left text-gray-900">
          <p>
            <strong>Môn học:</strong> {courseName}
          </p>
          <p>
            <strong>Mã:</strong> {courseId}
          </p>
          <p>
            <strong>Giảng viên:</strong> {teacher}
          </p>
          <p>
            <strong>Phòng:</strong> {room}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
