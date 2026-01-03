"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export type BreakdownPoint = { key: string; count: number };

type Props = {
  loading?: boolean;
  providerItems: BreakdownPoint[];
  destinationItems: BreakdownPoint[];
};

const BarBlock: React.FC<{
  title: string;
  subtitle?: string;
  loading?: boolean;
  items: BreakdownPoint[];
}> = ({ title, subtitle, loading, items }) => {
  return (
    <Card className="p-5 bg-slate-50 shadow-md">
      <div className="mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      <div className="h-72">
        {loading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : items.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
            Chưa có dữ liệu.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={items}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="key" tickMargin={8} interval={0} />
              <YAxis tickMargin={8} />
              <Tooltip />
              <Bar dataKey="count" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};

const RevenueBreakdownGrid: React.FC<Props> = ({
  loading,
  providerItems,
  destinationItems,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <BarBlock
        title="Theo phương thức thanh toán"
        subtitle="Số lượng đơn theo cổng thanh toán"
        loading={loading}
        items={providerItems}
      />
      <BarBlock
        title="Theo điểm đến"
        subtitle="Số lượng đơn theo điểm đến"
        loading={loading}
        items={destinationItems}
      />
    </div>
  );
};

export default RevenueBreakdownGrid;
