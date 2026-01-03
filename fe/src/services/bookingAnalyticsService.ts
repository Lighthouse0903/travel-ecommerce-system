import { useFetchInstance } from "../hooks/fetchInstance";
import { ApiResponse } from "@/types/common";

import type {
  AnalyticsMetric,
  GroupBy,
  BreakdownBy,
  AnalyticsOverviewData,
  OverviewTimeseriesData,
  TimeseriesData,
  TopToursData,
  BreakdownData,
} from "@/types/bookingAnalytics";

type QueryValue = string | number | boolean | null | undefined;
export const useBookingAnalyticsService = () => {
  const { get } = useFetchInstance();

  // helper
  const qs = (params: Record<string, QueryValue>) => {
    const usp = new URLSearchParams();

    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      usp.set(k, String(v));
    });

    const s = usp.toString();
    return s ? `?${s}` : "";
  };

  // GET /api/bookings/analytics/overview/
  const getOverview = (): Promise<ApiResponse<AnalyticsOverviewData>> => {
    return get<AnalyticsOverviewData>("/bookings/analytics/overview/", true);
  };

  //  GET /api/bookings/analytics/overview/timeseries/?metric=&days=
  const getOverviewTimeseries = (params: {
    metric: AnalyticsMetric;
    days: number;
  }): Promise<ApiResponse<OverviewTimeseriesData>> => {
    return get<OverviewTimeseriesData>(
      `/bookings/analytics/overview/timeseries/${qs(params)}`,
      true
    );
  };

  // GET /api/bookings/analytics/timeseries/?metric=&group_by=&from=&to=
  const getTimeseries = (params: {
    metric: AnalyticsMetric;
    group_by: GroupBy;
    from: string; // YYYY-MM-DD
    to: string; // YYYY-MM-DD
  }): Promise<ApiResponse<TimeseriesData>> => {
    return get<TimeseriesData>(
      `/bookings/analytics/timeseries/${qs(params)}`,
      true
    );
  };

  // GET /api/bookings/analytics/top-tours/?metric=&limit=&from=&to=
  const getTopTours = (params: {
    metric: AnalyticsMetric;
    limit?: number;
    from: string;
    to: string;
  }): Promise<ApiResponse<TopToursData>> => {
    return get<TopToursData>(
      `/bookings/analytics/top-tours/${qs({ limit: 5, ...params })}`,
      true
    );
  };

  // GET /api/bookings/analytics/breakdown/?by=&from=&to=
  const getBreakdown = (params: {
    by: BreakdownBy;
    from: string;
    to: string;
  }): Promise<ApiResponse<BreakdownData>> => {
    return get<BreakdownData>(
      `/bookings/analytics/breakdown/${qs(params)}`,
      true
    );
  };
  return {
    getOverview,
    getOverviewTimeseries,
    getTimeseries,
    getTopTours,
    getBreakdown,
  };
};
