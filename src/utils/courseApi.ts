import { OpenCourseData } from "@/pages/scheduler/types/course";

const COURSES_SE_URL = "https://raw.githubusercontent.com/trghieu9415/cauhinh_dns_centos/main/courses-se.json";
export const getOpenCourseList = async (): Promise<OpenCourseData> => {
  const courses = (await fetch(COURSES_SE_URL).then((res) => res.json())) as OpenCourseData;
  return courses;
};
