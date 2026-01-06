import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { DollarSign, ShoppingBag, BarChart3 } from "lucide-react";

type Props = {
  loading?: boolean;
  totalRevenueFormatted: string;
  totalPaidOrders: number;
  aovFormatted: string;
};

const KpiCard: React.FC<{
  loading?: boolean;
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  helper?: string;
}> = ({ loading, title, value, icon, helper }) => {
  return (
    <Card className="p-4 bg-card shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="mt-1 text-2xl font-bold">
            {loading ? <Skeleton className="h-7 w-28" /> : value}
          </div>
          {helper && (
            <div className="mt-1 text-xs text-muted-foreground">{helper}</div>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-700">
          {icon}
        </div>
      </div>
    </Card>
  );
};

const RevenueKpiGrid: React.FC<Props> = ({
  loading,
  totalRevenueFormatted,
  totalPaidOrders,
  aovFormatted,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      <KpiCard
        loading={loading}
        title="Tổng doanh thu (trong kỳ)"
        value={totalRevenueFormatted}
        icon={<DollarSign className="w-5 h-5" />}
      />
      <KpiCard
        loading={loading}
        title="Đơn đã thanh toán (trong kỳ)"
        value={totalPaidOrders}
        icon={<ShoppingBag className="w-5 h-5" />}
      />
      <KpiCard
        loading={loading}
        title="Doanh thu TB / đơn (AOV)"
        value={aovFormatted}
        icon={<BarChart3 className="w-5 h-5" />}
      />
    </div>
  );
};

export default RevenueKpiGrid;
