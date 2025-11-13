import { v4 as uuidv4 } from "uuid";

export interface OpenCourse {
  courseId: string;
  name: string;
  credits: number;
  groups: CourseGroup[];
}

export interface CourseGroup {
  groupId: string;
  classSize: number;
  schedule: GroupSchedule[];
}

export interface GroupSchedule {
  teacher: string;
  dayOfWeek: number;
  startPeriod: number;
  periodCount: number;
  room: string;
  studyWeeks: number[];
}

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
          const hasCampusConflict = signed.schedule.some(
            (item) =>
              item.dayOfWeek === newItem.dayOfWeek &&
              item.room[0] !== newItem.room[0] &&
              item.studyWeeks.some((w) => newItem.studyWeeks.includes(w)) &&
              (item.startPeriod + item.periodCount === newItem.startPeriod ||
                newItem.startPeriod + newItem.periodCount === item.startPeriod) &&
              ![6, 10].includes(newItem.startPeriod) &&
              ![6, 10].includes(item.startPeriod)
          );
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
