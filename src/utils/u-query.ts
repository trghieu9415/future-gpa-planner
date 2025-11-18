export function parseSearchQuery(query: string) {
  const lowerQuery = query.toLowerCase();

  const creditsMatch = lowerQuery.match(/tc\[(\d+)\]/);
  const facultyMatch = lowerQuery.match(/khoa\[(.*?)\]/);
  const teacherMatch = lowerQuery.match(/gv\[(.*?)\]/);

  let cleanText = lowerQuery;
  if (creditsMatch) cleanText = cleanText.replace(creditsMatch[0], "");
  if (facultyMatch) cleanText = cleanText.replace(facultyMatch[0], "");
  if (teacherMatch) cleanText = cleanText.replace(teacherMatch[0], "");

  return {
    credits: creditsMatch ? parseInt(creditsMatch[1]) : null,
    faculty: facultyMatch ? facultyMatch[1] : null,
    teacher: teacherMatch ? teacherMatch[1] : null,
    text: cleanText.trim(),
  };
}

export function removeVietnameseTones(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

export function getAcronym(str: string) {
  const cleanStr = removeVietnameseTones(str);
  return cleanStr
    .split(" ")
    .map((word) => word[0])
    .join("");
}
