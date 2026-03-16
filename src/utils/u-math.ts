export const getWeekDateRange = (week: number, startDate: Date) => {
  const weekStart = new Date(startDate);
  weekStart.setDate(startDate.getDate() + (week - 1) * 7);

  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
};
