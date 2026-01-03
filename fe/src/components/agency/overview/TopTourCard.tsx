import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export type TopTourUI = {
  tour_id: string;
  tour_name: string;
  destination?: string | null;
  valueFormatted: string;
};

type TopToursCardProps = {
  loading?: boolean;
  title?: string;
  items: TopTourUI[];
};

const TopToursCard: React.FC<TopToursCardProps> = ({
  loading,
  title = "Top tour bán chạy",
  items,
}) => {
  console.log("Top tour bán chạy: ", items);
  return (
    <Card className="p-5 bg-slate-50 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-lg" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-sm text-muted-foreground">Chưa có dữ liệu.</div>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t.tour_id}
              className="flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="font-medium truncate">{t.tour_name}</div>
                {t.destination && (
                  <div className="text-xs text-muted-foreground truncate">
                    {t.destination}
                  </div>
                )}
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">
                {t.valueFormatted}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default TopToursCard;
