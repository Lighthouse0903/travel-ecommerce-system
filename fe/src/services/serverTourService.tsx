import type { TourListPageType, TourResponse } from "@/types/tour";
import type { PaginationMeta } from "@/types/pagination";

const API_URL = process.env.NEXT_PUBLIC_API_URL! + "/api";

type ServerResponse<T, M = null> = {
  message?: string;
  data: T;
  meta?: M;
};

export const getListPublicTourService = async (
  query?: Record<string, string | number | undefined>
): Promise<{ data: TourListPageType[]; meta: PaginationMeta | null }> => {
  let qs = "";
  if (query) {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== "") params.set(key, String(value));
    });
    const s = params.toString();
    if (s) qs = `?${s}`;
  }

  const res = await fetch(`${API_URL}/tours/${qs}`, {
    next: { tags: ["tours"] },
  });

  if (!res.ok) return { data: [], meta: null };

  try {
    const json = (await res.json()) as ServerResponse<
      TourListPageType[],
      PaginationMeta
    >;
    return { data: json.data ?? [], meta: json.meta ?? null };
  } catch {
    return { data: [], meta: null };
  }
};

export const getDetailPublicTourServer = async (
  id: string
): Promise<TourResponse | null> => {
  const res = await fetch(`${API_URL}/tours/${id}/`, {
    next: { tags: [`tour-${id}`] },
  });

  if (!res.ok) return null;

  try {
    const json = (await res.json()) as ServerResponse<TourResponse>;
    return json.data ?? null;
  } catch {
    return null;
  }
};
