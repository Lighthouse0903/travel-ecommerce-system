"use client";

import React from "react";
import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export type RangePreset = "today" | "7d" | "this_month";

type OverviewHeaderProps = {
  preset: RangePreset;
  onChangePreset: (preset: RangePreset) => void;
  title?: string;
  subtitle?: string;
};

const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  preset,
  onChangePreset,
  title = "Tổng quan Đại lý",
  subtitle = "Chào mừng quay trở lại, đây là tình hình kinh doanh gần đây.",
}) => {
  return (
    <Card className="p-4 sm:p-5 bg-card shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm">Lọc:</span>
          </div>

          <Button
            size="sm"
            variant={preset === "today" ? "default" : "outline"}
            onClick={() => onChangePreset("today")}
            type="button"
          >
            Hôm nay
          </Button>

          <Button
            size="sm"
            variant={preset === "7d" ? "default" : "outline"}
            onClick={() => onChangePreset("7d")}
            type="button"
          >
            7 ngày qua
          </Button>

          <Button
            size="sm"
            variant={preset === "this_month" ? "default" : "outline"}
            onClick={() => onChangePreset("this_month")}
            type="button"
          >
            Tháng này
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OverviewHeader;
