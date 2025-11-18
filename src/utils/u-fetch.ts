import { OpenCourse } from "@/types/schedule";

export const getOpenCourseList = async (): Promise<OpenCourse[]> => {
  const courses = (await fetch(COURSES_SE_URL).then((res) => res.json())) as OpenCourse[];
  return courses;
};

const COURSES_SE_URL = "https://raw.githubusercontent.com/trghieu9415/cauhinh_dns_centos/main/courses-se.json";
