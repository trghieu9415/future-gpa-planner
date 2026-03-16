export interface OpenCourseData {
  startDate: string;
  defaultDisplayWeek: number;
  courses: OpenCourse[];
}

export interface OpenCourse {
  courseId: string;
  name: string;
  credits: number;
  faculty: string[];
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
