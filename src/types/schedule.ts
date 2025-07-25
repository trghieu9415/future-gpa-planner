import { v4 as uuidv4 } from "uuid";

export interface OpenCourse {
  id: string;
  courseId: string;
  name: string;
  credits: number;
  groups: CourseGroup[];
}

export interface CourseGroup {
  groupId: string;
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
  groupId: string;
  schedule: GroupSchedule[];
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

    const existing = this.signedCourses.find((c) => c.courseId === course.id);

    // Nếu cùng course và cùng group → đã tồn tại → bỏ qua
    if (existing && existing.groupId === groupId) return;

    // Kiểm tra trùng lịch với các course khác
    this.signedCourses.forEach((signed) => {
      if (signed.courseId !== course.id) {
        group.schedule.forEach((newItem) => {
          const isConflict = signed.schedule.some(
            (item) =>
              item.dayOfWeek === newItem.dayOfWeek &&
              item.studyWeeks.some((w) => newItem.studyWeeks.includes(w)) &&
              item.startPeriod < newItem.startPeriod + newItem.periodCount &&
              item.startPeriod + item.periodCount > newItem.startPeriod
          );
          if (isConflict) {
            throw new Error(`Lịch học của học phần ${course.name} trùng với lịch học đã có trong lịch "${this.name}"`);
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
      courseId: course.id,
      courseName: course.name,
      groupId,
      schedule: group.schedule,
    });
  }

  removeCourse(courseId: string) {
    this.signedCourses = this.signedCourses.filter((c) => c.courseId !== courseId);
  }
}
