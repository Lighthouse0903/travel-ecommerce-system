"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export type RevenuePoint = {
  date: string;
  value: number;
};

type OverviewRevenueChartCardProps = {
  loading?: boolean;
  title?: string;
  points: RevenuePoint[];
  valueFormatter?: (v: number) => string;
};

const OverviewRevenueChartCard: React.FC<OverviewRevenueChartCardProps> = ({
  loading,
  title = "Biểu đồ doanh thu",
  points,
  valueFormatter,
}) => {
  console.log("Dữ liệu báo cáo doanh thu: ", points);
  return (
    <Card className="p-5 bg-card shadow-md">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-xs text-muted-foreground">
              Doanh thu theo ngày (mặc định 7 ngày gần nhất)
            </p>
          </div>
        </div>
      </div>

      <div className="h-72">
        {loading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : points.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickMargin={8} />
              <YAxis
                tickMargin={8}
                tickFormatter={(v) => `${(Number(v) / 1_000_000).toFixed(1)}tr`}
              />

              <Tooltip
                formatter={(val) => {
                  const n = Number(val) || 0;
                  return `${(n / 1_000_000).toFixed(2)}tr`;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

export default OverviewRevenueChartCard;
