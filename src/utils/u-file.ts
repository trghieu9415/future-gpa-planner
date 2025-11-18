import { Schedule } from "@/types/schedule";
import { toBlob, toPng } from "html-to-image";

export const downloadElementScreenshot = async (element: HTMLDivElement, fileName: string) => {
  const wrapper = document.createElement("div");

  wrapper.style.padding = "5px";
  wrapper.style.backgroundColor = "white";
  wrapper.style.width = "1200px";

  const cloned = element.cloneNode(true) as HTMLElement;
  wrapper.appendChild(cloned);

  document.body.appendChild(wrapper);

  try {
    const dataUrl = await toPng(wrapper, {
      backgroundColor: "white",
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${fileName}.png`;
    link.click();
  } finally {
    document.body.removeChild(wrapper);
  }
  return `${fileName}.png`;
};

export const copyElementScreenshot = async (element: HTMLDivElement): Promise<boolean> => {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "5px";
  wrapper.style.backgroundColor = "white";
  wrapper.style.width = "1200px";

  const cloned = element.cloneNode(true) as HTMLElement;
  wrapper.appendChild(cloned);
  document.body.appendChild(wrapper);

  try {
    const blob = await toBlob(wrapper, {
      backgroundColor: "white",
      cacheBust: true,
    });

    if (!blob) {
      throw new Error("Could not create blob from element");
    }

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    return true;
  } catch (err) {
    console.error("Failed to copy image: ", err);
    return false;
  } finally {
    document.body.removeChild(wrapper);
  }
};

export const scheduleToJson = (schedule: Schedule) => {
  const json = JSON.stringify(schedule);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${schedule.name}.json`;
  link.click();

  URL.revokeObjectURL(url);
};

export const jsonToSchedule = async (file: File): Promise<Schedule> => {
  const text = await file.text();
  try {
    const json = JSON.parse(text);
    const schedule = new Schedule(json.name);
    schedule.id = json.id;
    schedule.signedCourses = json.signedCourses ?? [];
    return schedule;
  } catch (err) {
    throw new Error("Invalid JSON format.");
  }
};
