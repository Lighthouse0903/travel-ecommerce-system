"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export type BreakdownUIItem = {
  key: string;
  count: number;
};

type OverviewBreakdownCardProps = {
  loading?: boolean;
  title?: string;
  statusItems: BreakdownUIItem[];
  providerItems: BreakdownUIItem[];
  destinationItems?: BreakdownUIItem[];
};

const OverviewBreakdownCard: React.FC<OverviewBreakdownCardProps> = ({
  loading,
  title = "Phân loại",
  statusItems,
  providerItems,
  destinationItems = [],
}) => {
  const hasDestination = destinationItems.length > 0;

  const PieBlock = ({ data }: { data: BreakdownUIItem[] }) => (
    <div className="h-72">
      {loading ? (
        <Skeleton className="h-full w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
          Chưa có dữ liệu.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip />
            <Pie
              data={data}
              dataKey="count"
              nameKey="key"
              innerRadius={55}
              outerRadius={85}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  const BarBlock = ({ data }: { data: BreakdownUIItem[] }) => (
    <div className="h-72">
      {loading ? (
        <Skeleton className="h-full w-full rounded-xl" />
      ) : data.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
          Chưa có dữ liệu.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="key" tickMargin={8} />
            <YAxis tickMargin={8} />
            <Tooltip />
            <Bar dataKey="count" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );

  return (
    <Card className="p-5 bg-slate-50 shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-xs text-muted-foreground">
          Cơ cấu theo trạng thái / thanh toán{" "}
          {hasDestination ? "/ điểm đến" : ""}
        </p>
      </div>

      <Tabs defaultValue="status" className="w-full">
        <TabsList
          className={`grid w-full ${
            hasDestination ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          <TabsTrigger value="status">Trạng thái</TabsTrigger>
          <TabsTrigger value="provider">Thanh toán</TabsTrigger>
          {hasDestination && (
            <TabsTrigger value="destination">Điểm đến</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="status" className="mt-4">
          <PieBlock data={statusItems} />
        </TabsContent>

        <TabsContent value="provider" className="mt-4">
          <BarBlock data={providerItems} />
        </TabsContent>

        {hasDestination && (
          <TabsContent value="destination" className="mt-4">
            <BarBlock data={destinationItems} />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
};

export default OverviewBreakdownCard;
