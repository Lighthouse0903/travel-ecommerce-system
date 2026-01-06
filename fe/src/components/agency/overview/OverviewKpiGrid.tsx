import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingBag, CheckCircle2, Clock } from "lucide-react";

type KpiItem = {
  title: string;
  value: string | number;
  helperText?: string;
  icon: React.ReactNode;
};

type OverviewKpiGridProps = {
  loading?: boolean;

  totalOrders: number;
  revenueTotalFormatted: string;
  paidOrders: number;
  pending: number;
  paidWaiting: number;
};

const KpiCard: React.FC<{
  loading?: boolean;
  item: KpiItem;
}> = ({ loading, item }) => {
  return (
    <Card className="p-4 bg-card shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm text-muted-foreground">{item.title}</div>

          <div className="mt-1 text-2xl font-bold">
            {loading ? <Skeleton className="h-7 w-24" /> : item.value}
          </div>

          {item.helperText && (
            <div className="mt-1 text-xs text-muted-foreground">
              {item.helperText}
            </div>
          )}
        </div>

        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
          {item.icon}
        </div>
      </div>
    </Card>
  );
};

const OverviewKpiGrid: React.FC<OverviewKpiGridProps> = ({
  loading,
  totalOrders,
  revenueTotalFormatted,
  paidOrders,
  pending,
  paidWaiting,
}) => {
  const items: KpiItem[] = [
    {
      title: "Tổng doanh thu",
      value: revenueTotalFormatted,
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      title: "Tổng đơn đặt tour",
      value: totalOrders,
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      title: "Đơn đã thanh toán",
      value: paidOrders,
      icon: <CheckCircle2 className="w-5 h-5" />,
    },
    {
      title: "Đơn chờ xử lý",
      value: pending + paidWaiting,
      helperText: `Chờ duyệt: ${pending} • Chờ thanh toán: ${paidWaiting}`,
      icon: <Clock className="w-5 h-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {items.map((it) => (
        <KpiCard key={it.title} loading={loading} item={it} />
      ))}
    </div>
  );
};

export default OverviewKpiGrid;
