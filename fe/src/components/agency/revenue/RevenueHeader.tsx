import React from "react";
import { Card } from "@/components/ui/card";

type Props = {
  title?: string;
  subtitle?: string;
};

const RevenueHeader: React.FC<Props> = ({
  title = "Báo cáo Doanh thu",
  subtitle = "Xem xu hướng doanh thu và thống kê theo khoảng thời gian.",
}) => {
  return (
    <Card className="p-4 sm:p-5 bg-slate-50 shadow-md">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
    </Card>
  );
};

export default RevenueHeader;
