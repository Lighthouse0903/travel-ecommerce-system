export const REGION_LABELS: Record<number, string> = {
  1: "Miền Bắc",
  2: "Miền Trung",
  3: "Miền Nam",
};

export function getRegionLabel(region?: number | null) {
  if (typeof region !== "number") return "";
  return REGION_LABELS[region] ?? "";
}
