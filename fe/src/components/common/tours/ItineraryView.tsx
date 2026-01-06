"use client";

import React, { useMemo } from "react";
import { Hotel, MapPin, Moon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import StarRating from "../rating/StarRating";

interface DayItinerary {
  day: number;
  title: string;
  activities: string[];
  accommodation: {
    hotel_name: string;
    stars: number;
    nights: number;
    address: string;
  } | null;
}

interface ItineraryViewProps {
  itinerary: DayItinerary[];
}

function parseActivity(raw: string) {
  const s = (raw ?? "").trim();
  if (!s) return { time: "", text: "" };

  const m = s.match(/^(\d{1,2}:\d{2})\s*(?:-|–|—|:|\|)?\s*(.*)$/);
  if (!m) return { time: "", text: s };

  return { time: m[1].trim(), text: m[2]?.trim() || s };
}

const ItineraryView = ({ itinerary }: ItineraryViewProps) => {
  const days = useMemo(() => itinerary ?? [], [itinerary]);

  if (!days.length) {
    return (
      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Lịch trình</h2>
        <p className="text-sm text-muted-foreground">Chưa có lịch trình.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-card p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
          Lịch trình
        </h2>
        <span className="text-sm text-slate-500">{days.length} ngày</span>
      </div>

      <Accordion
        type="single"
        collapsible
        defaultValue={`day-${days[0].day}`}
        className="space-y-3"
      >
        {days.map((d) => {
          const value = `day-${d.day}`;
          const activities = (d.activities ?? []).filter(Boolean);

          return (
            <AccordionItem
              key={value}
              value={value}
              className={[
                "overflow-hidden rounded-2xl border border-slate-200 transition",
                "bg-slate-50",
                "data-[state=open]:bg-white data-[state=open]:shadow-sm data-[state=open]:border-blue-200",
              ].join(" ")}
            >
              <AccordionTrigger className="px-4 py-4 hover:no-underline data-[state=open]:border-b data-[state=open]:border-slate-200">
                <div className="flex w-full items-start justify-between gap-4 text-left">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-7 items-center rounded-lg bg-blue-50 px-2 text-xs font-semibold text-blue-700">
                        Ngày {d.day}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {d.title ? d.title : `Ngày ${d.day}`}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500">
                      {activities.length} hoạt động
                      {d.accommodation ? " • Có lưu trú" : ""}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-0 pb-4 pt-0">
                <div className="px-4 pt-3">
                  {activities.length ? (
                    <ul className="divide-y divide-slate-200 rounded-xl bg-transparent">
                      {activities.map((raw, idx) => {
                        const { time, text } = parseActivity(raw);
                        return (
                          <li key={idx} className="flex gap-4 py-3 text-sm">
                            <span className="w-16 shrink-0 font-semibold text-slate-900">
                              {time || "•"}
                            </span>
                            <span className="leading-relaxed text-slate-700">
                              {text}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Chưa có hoạt động cho ngày này.
                    </p>
                  )}

                  {d.accommodation && (
                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-blue-600">
                            <Hotel className="h-5 w-5" />
                          </div>

                          <div className="space-y-1">
                            <div className="font-semibold text-slate-900">
                              {d.accommodation.hotel_name}
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="h-4 w-4 text-slate-500" />
                              <span>{d.accommodation.address}</span>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Moon className="h-4 w-4 text-slate-500" />
                              <span>{d.accommodation.nights} đêm</span>
                            </div>
                          </div>
                        </div>

                        <StarRating stars={d.accommodation.stars} />
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
};

export default ItineraryView;
