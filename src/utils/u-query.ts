export function parseSearchQuery(query: string) {
  const lowerQuery = query.toLowerCase();

  const tcRegex = /tc\s*:\s*(\d+)/i;
  const khoaRegex = /khoa\s*:\s*(.*?)(?=\s+(?:gv|tc)\s*:|$)/i;
  const gvRegex = /gv\s*:\s*(.*?)(?=\s+(?:khoa|tc)\s*:|$)/i;

  const creditsMatch = query.match(tcRegex);
  const facultyMatch = query.match(khoaRegex);
  const teacherMatch = query.match(gvRegex);

  if (facultyMatch) {
    facultyMatch[1] = facultyMatch[1].trim();
  }
  if (teacherMatch) {
    teacherMatch[1] = teacherMatch[1].trim();
  }

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
