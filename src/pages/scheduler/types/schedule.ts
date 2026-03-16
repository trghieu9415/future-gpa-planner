import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { GroupSchedule, OpenCourse } from "./course";

export interface SignedCourse {
  courseId: string;
  courseName?: string;
  credits?: number;
  groupId: string;
  schedule: GroupSchedule[];
  color?: string;
}

export type SignedCourses = SignedCourse[];

export class Schedule {
  id: string;
  name: string;
  signedCourses: SignedCourses;

  constructor(name: string) {
    this.id = uuidv4();
    this.name = name;
    this.signedCourses = [];
  }

  addCourse(course: OpenCourse, groupId: string) {
    const group = course.groups.find((g) => g.groupId === groupId);
    if (!group) {
      throw new Error(`Nhóm có ID ${groupId} không tồn tại trong học phần ${course.name}`);
    }

    const existing = this.signedCourses.find((c) => c.courseId === course.courseId);

    // Nếu cùng course và cùng group → đã tồn tại → bỏ qua
    if (existing && existing.groupId === groupId) return;

    // Kiểm tra trùng lịch với các course khác
    this.signedCourses.forEach((signed) => {
      if (signed.courseId !== course.courseId) {
        group.schedule.forEach((newItem) => {
          const isConflict = signed.schedule.some(
            (item) =>
              item.dayOfWeek === newItem.dayOfWeek &&
              item.startPeriod + item.periodCount > newItem.startPeriod &&
              item.startPeriod < newItem.startPeriod + newItem.periodCount &&
              item.studyWeeks.some((w) => newItem.studyWeeks.includes(w))
          );
          if (isConflict) {
            throw new Error(`"${course.name}" trùng với lịch học "${signed.courseName}"`);
          }
          const hasCampusConflict = signed.schedule.some((item) => {
            if (
              item.dayOfWeek !== newItem.dayOfWeek ||
              item.room[0] === newItem.room[0] ||
              !item.studyWeeks.some((w) => newItem.studyWeeks.includes(w))
            ) {
              return false;
            }

            const campusWarningWeek: number[] = item.studyWeeks.filter((w) => newItem.studyWeeks.includes(w));
            const campusWarningWeeksStr = campusWarningWeek.join(", ");

            const thisEnd2NewStart3 = item.startPeriod == 1 && item.periodCount == 2 && newItem.startPeriod == 3;
            const newEnd2ThisStart3 = newItem.startPeriod == 1 && newItem.periodCount == 2 && item.startPeriod == 3;
            const thisEnd7NewStart8 = item.startPeriod == 6 && item.periodCount == 2 && newItem.startPeriod == 8;
            const newEnd7ThisStart8 = newItem.startPeriod == 6 && newItem.periodCount == 2 && item.startPeriod == 8;

            if (thisEnd2NewStart3 || newEnd2ThisStart3 || thisEnd7NewStart8 || newEnd7ThisStart8) {
              toast.warning(
                `Lưu ý: Bạn chỉ có 20 phút để di chuyển giữa hai cơ sở của môn "${signed.courseName}" và "${course.name}" vào các tuần ${campusWarningWeeksStr}.`
              );
              return false;
            }

            if (item.startPeriod + item.periodCount === newItem.startPeriod) {
              return ![6, 10].includes(newItem.startPeriod);
            }

            if (newItem.startPeriod + newItem.periodCount === item.startPeriod) {
              return ![6, 10].includes(item.startPeriod);
            }

            return false;
          });
          if (hasCampusConflict) {
            throw new Error(
              `"${course.name}" và "${signed.courseName}" không thể đăng ký do khác cơ sở học trong cùng một buổi`
            );
          }
        });
      }
    });

    // Nếu course đã tồn tại nhưng chọn group khác → cập nhật
    if (existing) {
      existing.groupId = groupId;
      existing.schedule = group.schedule;
      return;
    }

    // Thêm mới
    this.signedCourses.push({
      courseId: course.courseId,
      courseName: course.name,
      groupId,
      credits: course.credits,
      schedule: group.schedule,
    });
  }

  removeCourse(courseId: string) {
    this.signedCourses = this.signedCourses.filter((c) => c.courseId !== courseId);
  }

  clearCourses() {
    this.signedCourses = [];
  }

  hasCourseGroup(courseId: string, groupId: string): boolean {
    return this.signedCourses.some((c) => c.courseId === courseId && c.groupId === groupId);
  }
}
