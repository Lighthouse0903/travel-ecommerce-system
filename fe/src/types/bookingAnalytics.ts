export type AnalyticsMetric = "revenue" | "paid_orders" | "orders";
export type GroupBy = "day" | "week" | "month";
export type BreakdownBy = "status" | "provider" | "destination";

// overview
export type AnalyticsOverviewData = {
  orders: {
    pending: number;
    paid_waiting: number;
    paid: number;
    rejected: number;
  };
  revenue: {
    total: string;
    paid_orders: number;
  };
};

// overview theo timeseries
// backend: { metric, days, from, to, points: [{date, value}] }
export type OverviewTimeseriesPoint = {
  date: string; // YYYY-MM-DD
  value: string | number; // revenue là string, còn count là number
};

export type OverviewTimeseriesData = {
  metric: AnalyticsMetric;
  days: number;
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  points: OverviewTimeseriesPoint[];
};

// timeseries
export type TimeseriesPoint = {
  bucket: string; // day: YYYY-MM-DD, week/month: backend format theo view của bạn
  value: string | number; // revenue là string, còn count là number
};

export type TimeseriesData = {
  metric: AnalyticsMetric;
  group_by: GroupBy;
  from: string;
  to: string;
  points: TimeseriesPoint[];
};

// top tour bán chạy
export type TopTourItemBase = {
  tour_id: string;
  tour_name: string;
  destination?: string | null;
  value: string | number; // revenue string, counts number
};

export type TopTourItem = TopTourItemBase & {
  // khi metric=revenue: có paid_orders
  paid_orders?: number;
  // khi metric=paid_orders: có revenue
  revenue?: string;
};

export type TopToursData = {
  metric: AnalyticsMetric;
  limit: number;
  from: string;
  to: string;
  items: TopTourItem[];
};

// breakdown
export type BreakdownItem = {
  key: string; // status/provider/destination
  count: number;
  revenue?: string; // provider/destination có thể có revenue
};

export type BreakdownData = {
  by: BreakdownBy;
  from: string;
  to: string;
  items: BreakdownItem[];
};
