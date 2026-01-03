export const formatTimeHHMM = (isoString?: string | null): string => {
  if (!isoString) return "";

  const d = new Date(isoString); // tự convert từ UTC → local (VN là +7)
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};
