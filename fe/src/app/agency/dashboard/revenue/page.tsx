"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useBookingAnalyticsService } from "@/services/bookingAnalyticsService";
import { formatMoneyVND } from "@/utils/formatPrice";

import RevenueHeader from "@/components/agency/revenue/RevenueHeader";
import RevenueFilterBar, {
  RevenueGroupBy,
  RevenuePreset,
} from "@/components/agency/revenue/RevenueFilterBar";
import RevenueKpiGrid from "@/components/agency/revenue/RevenueKpiGrid";
import RevenueTrendChart, {
  TrendPoint,
} from "@/components/agency/revenue/RevenueTrendChart";
import RevenueBreakdownGrid, {
  BreakdownPoint,
} from "@/components/agency/revenue/RevenueBreakdownGrid";
import RevenueTopTours, {
  TopTourRow,
} from "@/components/agency/revenue/RevenueTopTours";

import type {
  BreakdownItem,
  TopTourItem,
  TimeseriesPoint,
} from "@/types/bookingAnalytics";
import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";

type DateRange = { from: string; to: string };

const toYMD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const rangeFromPreset = (preset: RevenuePreset): DateRange => {
  const now = new Date();

  if (preset === "7d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return { from: toYMD(start), to: toYMD(now) };
  }

  if (preset === "30d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 29);
    return { from: toYMD(start), to: toYMD(now) };
  }

  if (preset === "this_month") {
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: toYMD(first), to: toYMD(now) };
  }

  // custom: page sẽ giữ from/to state riêng
  return { from: toYMD(now), to: toYMD(now) };
};

const safeNumber = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
};

const sumValues = (points: Array<{ value: unknown }>) =>
  points.reduce((acc, p) => acc + safeNumber(p.value), 0);

const mapBreakdown = (items: BreakdownItem[] = []): BreakdownPoint[] =>
  items.map((x) => ({ key: x.key, count: x.count }));

const RevenuePage: React.FC = () => {
  const { getTimeseries, getBreakdown, getTopTours } =
    useBookingAnalyticsService();

  const [preset, setPreset] = useState<RevenuePreset>("this_month");
  const [groupBy, setGroupBy] = useState<RevenueGroupBy>("day");

  // date inputs
  const presetRange = useMemo(() => rangeFromPreset(preset), [preset]);
  const [from, setFrom] = useState<string>(presetRange.from);
  const [to, setTo] = useState<string>(presetRange.to);

  // sync from/to when preset changes (trừ custom)
  useEffect(() => {
    if (preset !== "custom") {
      setFrom(presetRange.from);
      setTo(presetRange.to);
    }
  }, [preset, presetRange.from, presetRange.to]);

  const [loading, setLoading] = useState(false);

  const [trend, setTrend] = useState<TrendPoint[]>([]);
  const [provider, setProvider] = useState<BreakdownPoint[]>([]);
  const [destination, setDestination] = useState<BreakdownPoint[]>([]);
  const [topTours, setTopTours] = useState<TopTourRow[]>([]);

  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalPaidOrders, setTotalPaidOrders] = useState<number>(0);

  const onApply = async () => {
    setLoading(true);

    const [tsRevenueRes, tsPaidRes, pvRes, dstRes, topRes] = await Promise.all([
      getTimeseries({ metric: "revenue", group_by: groupBy, from, to }),
      getTimeseries({ metric: "paid_orders", group_by: groupBy, from, to }),
      getBreakdown({ by: "provider", from, to }),
      getBreakdown({ by: "destination", from, to }),
      getTopTours({ metric: "revenue", limit: 10, from, to }),
    ]);

    // Nếu fetchInstance của bạn luôn success/data/message, thì check success:
    if (!tsRevenueRes.success)
      toast.error(tsRevenueRes.message || "Không tải được timeseries revenue");
    if (!tsPaidRes.success)
      toast.error(tsPaidRes.message || "Không tải được timeseries paid_orders");
    if (!pvRes.success)
      toast.error(pvRes.message || "Không tải được breakdown provider");
    if (!dstRes.success)
      toast.error(dstRes.message || "Không tải được breakdown destination");
    if (!topRes.success)
      toast.error(topRes.message || "Không tải được top tours");

    // trend chart
    const revenuePoints: TimeseriesPoint[] = tsRevenueRes.data?.points || [];
    setTrend(
      revenuePoints.map((p) => ({
        date: p.bucket,
        value: safeNumber(p.value),
      }))
    );

    // KPIs from sum
    setTotalRevenue(sumValues(revenuePoints));

    const paidPoints: TimeseriesPoint[] = tsPaidRes.data?.points || [];
    setTotalPaidOrders(Math.round(sumValues(paidPoints)));

    // breakdowns
    setProvider(mapBreakdown(pvRes.data?.items || []));
    setDestination(mapBreakdown(dstRes.data?.items || []));

    // top tours
    const rawTop: TopTourItem[] = topRes.data?.items || [];
    setTopTours(
      rawTop.map((t) => ({
        tour_id: t.tour_id,
        tour_name: t.tour_name,
        destination: t.destination ?? null,
        valueFormatted:
          typeof t.value === "string"
            ? formatMoneyVND(t.value)
            : formatMoneyVND(String(t.value)),
      }))
    );

    setLoading(false);
  };

  const totalRevenueFormatted = useMemo(
    () => formatMoneyVND(String(totalRevenue)),
    [totalRevenue]
  );

  const aovFormatted = useMemo(() => {
    if (!totalPaidOrders) return formatMoneyVND("0");
    return formatMoneyVND(String(Math.round(totalRevenue / totalPaidOrders)));
  }, [totalRevenue, totalPaidOrders]);

  // auto load lần đầu
  useEffect(() => {
    onApply();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-4 bg-white p-4 border border-border rounded-xl">
      {/* header */}
      <RevenueHeader />
      <RevenueFilterBar
        preset={preset}
        onChangePreset={setPreset}
        groupBy={groupBy}
        onChangeGroupBy={setGroupBy}
        from={from}
        to={to}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onApply={onApply}
        loading={loading}
      />

      <RevenueKpiGrid
        loading={loading}
        totalRevenueFormatted={totalRevenueFormatted}
        totalPaidOrders={totalPaidOrders}
        aovFormatted={aovFormatted}
      />
      <RevenueTrendChart loading={loading} points={trend} />
      <RevenueBreakdownGrid
        loading={loading}
        providerItems={provider}
        destinationItems={destination}
      />
      <RevenueTopTours loading={loading} items={topTours} />
    </div>
  );
};

export default RevenuePage;
