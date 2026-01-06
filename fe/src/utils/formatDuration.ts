export function formatDuration(days?: number | null, nights?: number | null) {
  const d = typeof days === "number" && days > 0 ? days : 0;
  const n = typeof nights === "number" && nights > 0 ? nights : 0;

  if (!d && !n) return "N/A";
  if (d && n) return `${d}N${n}Đ`;
  if (d) return `${d}N`;
  return `${n}Đ`;
}
