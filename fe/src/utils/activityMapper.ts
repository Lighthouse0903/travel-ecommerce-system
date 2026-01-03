export type ItineraryActivity = { time: string; text: string };

export const parseActivityString = (s: string): ItineraryActivity => {
  const trimmed = (s ?? "").trim();

  // chấp nhận "HH:mm - text" hoặc "HH:mm: text"
  const m = trimmed.match(/^(\d{2}:\d{2})\s*[-:]\s*(.+)$/);
  if (m) return { time: m[1], text: m[2].trim() };

  // fallback nếu data cũ không đúng format
  return { time: "07:00", text: trimmed };
};

export const toActivityString = (a: ItineraryActivity) =>
  `${a.time} - ${a.text}`.trim();
