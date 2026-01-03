"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useBookingAnalyticsService } from "@/services/bookingAnalyticsService";
import { formatMoneyVND } from "@/utils/formatPrice";
import OverviewHeader, {
  RangePreset,
} from "@/components/agency/overview/OverviewHeader";
import OverviewKpiGrid from "@/components/agency/overview/OverviewKpiGrid";
import OverviewRevenueChartCard, {
  RevenuePoint,
} from "@/components/agency/overview/OverviewRevenueChartCard";
import OverviewBreakdownCard, {
  BreakdownUIItem,
} from "@/components/agency/overview/OverviewBreakdownCard";

import type {
  AnalyticsOverviewData,
  OverviewTimeseriesPoint,
  TopTourItem,
  BreakdownItem,
} from "@/types/bookingAnalytics";
import TopToursCard, {
  TopTourUI,
} from "@/components/agency/overview/TopTourCard";
import { toYMD } from "@/utils/formatDate";
import MotionFlow, { MotionItem } from "@/components/common/motion/MotionFlow";

type DateRange = { from: string; to: string };

const getRangeFromPreset = (preset: RangePreset): DateRange => {
  // hôm này
  const now = new Date();
  if (preset === "today") {
    const today = toYMD(now);
    return { from: today, to: today };
  }

  // tuần này
  if (preset === "7d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 6);
    return { from: toYMD(start), to: toYMD(now) };
  }

  // tháng này
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  return { from: toYMD(first), to: toYMD(now) };
};

const safeNumber = (v: unknown) => {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : 0;
  return Number.isFinite(n) ? n : 0;
};

const DashboardPage: React.FC = () => {
  const { getOverview, getOverviewTimeseries, getTopTours, getBreakdown } =
    useBookingAnalyticsService();

  const [preset, setPreset] = useState<RangePreset>("today");
  const range = useMemo(() => getRangeFromPreset(preset), [preset]);

  const [loading, setLoading] = useState<boolean>(true);

  const [overview, setOverview] = useState<AnalyticsOverviewData | null>(null);
  const [revenue7dPoints, setRevenue7dPoints] = useState<RevenuePoint[]>([]);
  const [topTours, setTopTours] = useState<TopTourUI[]>([]);
  const [statusItems, setStatusItems] = useState<BreakdownUIItem[]>([]);
  const [providerItems, setProviderItems] = useState<BreakdownUIItem[]>([]);
  const [destinationItems, setDestinationItems] = useState<BreakdownUIItem[]>(
    []
  );

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Chart vẫn dùng 7 ngày gần nhất (đúng tinh thần "overview")
        // log range trước
        console.log("RANGE", range);

        const [ovRes, tsRes, topRes, stRes, pvRes, dstRes] = await Promise.all([
          getOverview(),
          getOverviewTimeseries({ metric: "revenue", days: 7 }),
          getTopTours({
            metric: "revenue",
            limit: 5,
            from: range.from,
            to: range.to,
          }),
          getBreakdown({ by: "status", from: range.from, to: range.to }),
          getBreakdown({ by: "provider", from: range.from, to: range.to }),
          getBreakdown({ by: "destination", from: range.from, to: range.to }),
        ]);
        // console.log("TOP", topRes);
        // console.log("STATUS", stRes);
        // console.log("PROVIDER", pvRes);
        // console.log("DEST", dstRes);
        // console.log("OVERVIEW", ovRes);
        // console.log("TS7D", tsRes);

        if (!mounted) return;
        setOverview(ovRes.data);

        const rawPoints: OverviewTimeseriesPoint[] = tsRes.data?.points || [];
        const chartPoints: RevenuePoint[] = rawPoints.map((p) => ({
          date: p.date,
          value: safeNumber(p.value),
        }));
        setRevenue7dPoints(chartPoints);
        const rawTop: TopTourItem[] = topRes.data?.items || [];
        const topUI = rawTop.map((t) => ({
          tour_id: t.tour_id,
          tour_name: t.tour_name,
          destination: t.destination ?? null,
          valueFormatted:
            typeof t.value === "string"
              ? formatMoneyVND(t.value)
              : formatMoneyVND(String(t.value)),
        }));
        setTopTours(topUI);
        const mapBreakdown = (items: BreakdownItem[] = []): BreakdownUIItem[] =>
          items.map((x) => ({ key: x.key, count: x.count }));

        setStatusItems(mapBreakdown(stRes.data?.items || []));
        setProviderItems(mapBreakdown(pvRes.data?.items || []));
        setDestinationItems(mapBreakdown(dstRes.data?.items || []));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [preset, range.from, range.to]);

  const totalOrders = useMemo(() => {
    const o = overview?.orders;
    if (!o) return 0;
    return (
      (o.pending || 0) +
      (o.paid_waiting || 0) +
      (o.paid || 0) +
      (o.rejected || 0)
    );
  }, [overview]);

  const revenueTotalFormatted = useMemo(() => {
    const total = overview?.revenue?.total ?? "0";
    return formatMoneyVND(total);
  }, [overview]);

  const paidOrders = overview?.revenue?.paid_orders ?? 0;
  const pending = overview?.orders?.pending ?? 0;
  const paidWaiting = overview?.orders?.paid_waiting ?? 0;

  return (
    <MotionFlow>
      <div className="space-y-4 bg-white">
        {/* header */}
        <MotionItem>
          <OverviewHeader preset={preset} onChangePreset={setPreset} />
        </MotionItem>

        {/* Kpi */}
        <MotionItem>
          <OverviewKpiGrid
            loading={loading}
            totalOrders={totalOrders}
            revenueTotalFormatted={revenueTotalFormatted}
            paidOrders={paidOrders}
            pending={pending}
            paidWaiting={paidWaiting}
          />
        </MotionItem>

        <MotionItem>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <OverviewRevenueChartCard
                loading={loading}
                points={revenue7dPoints}
                valueFormatter={(v) => formatMoneyVND(String(v))}
              />
            </div>

            <div className="xl:col-span-1">
              <OverviewBreakdownCard
                loading={loading}
                statusItems={statusItems}
                providerItems={providerItems}
                destinationItems={destinationItems}
              />
            </div>
          </div>
        </MotionItem>
        <MotionItem>
          <TopToursCard loading={loading} items={topTours} />
        </MotionItem>
      </div>
    </MotionFlow>
  );
};

export default DashboardPage;
