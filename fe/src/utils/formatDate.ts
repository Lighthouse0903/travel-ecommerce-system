export const formatDateVN = (dateStr?: string) =>
  dateStr ? new Date(dateStr).toLocaleDateString("vi-VN") : "";
