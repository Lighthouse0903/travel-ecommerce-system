"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart as LineIcon } from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export type TrendPoint = {
  date: string; // bucket label
  value: number; // VND
};

type Props = {
  loading?: boolean;
  title?: string;
  points: TrendPoint[];
};

const formatMillion = (v: number) => {
  const m = v / 1_000_000;
  if (m === 0) return "0";
  if (m < 1) return `${m.toFixed(2)}tr`;
  if (m < 10) return `${m.toFixed(1)}tr`;
  return `${Math.round(m)}tr`;
};

const RevenueTrendChart: React.FC<Props> = ({
  loading,
  title = "Xu hướng doanh thu",
  points,
}) => {
  return (
    <Card className="p-5 bg-card shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
          <LineIcon className="w-5 h-5 text-slate-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-xs text-muted-foreground">
            Doanh thu theo{" "}
            {points.length ? "khoảng đã chọn" : "khoảng thời gian"}
          </p>
        </div>
      </div>

      <div className="h-80">
        {loading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : points.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu trong khoảng thời gian này.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickMargin={8}
                interval="preserveStartEnd"
              />
              <YAxis
                tickMargin={8}
                tickFormatter={(v) => formatMillion(Number(v))}
              />
              <Tooltip formatter={(val) => formatMillion(Number(val) || 0)} />
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

export default RevenueTrendChart;
