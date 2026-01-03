"use client";

import React, { useMemo } from "react";
import { FaHotel, FaMapMarkerAlt, FaMoon } from "react-icons/fa";

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

  return {
    time: m[1].trim(),
    text: m[2]?.trim() || s,
  };
}

const ItineraryView = ({ itinerary }: ItineraryViewProps) => {
  const days = useMemo(() => itinerary ?? [], [itinerary]);

  if (!days.length) {
    return (
      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Lịch trình</h2>
        <p className="text-sm text-muted-foreground">Chưa có lịch trình.</p>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 border shadow-md rounded-xl p-4 md:p-6">
      <h2 className="text-lg md:text-xl font-semibold mb-4">Lịch trình</h2>

      <Accordion
        type="single"
        collapsible
        defaultValue={`day-${days[0].day}`}
        className="space-y-4"
      >
        {days.map((d) => {
          const value = `day-${d.day}`;
          const activities = (d.activities ?? []).filter(Boolean);

          return (
            <AccordionItem
              key={value}
              value={value}
              className="bg-white border rounded-xl shadow-sm px-4"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col gap-1 text-left">
                  <span className="font-semibold text-slate-800">
                    Ngày {d.day}
                    {d.title ? `: ${d.title}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {activities.length} hoạt động
                    {d.accommodation ? " • Có lưu trú" : ""}
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="pt-3 pb-5 space-y-4">
                {/* Activities */}
                {activities.length ? (
                  <ul className="space-y-2">
                    {activities.map((raw, idx) => {
                      const { time, text } = parseActivity(raw);
                      return (
                        <li
                          key={idx}
                          className="flex gap-3 text-sm text-slate-700"
                        >
                          <span className="w-14 shrink-0 font-medium text-slate-900">
                            {time || "•"}
                          </span>
                          <span className="leading-relaxed">{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Chưa có hoạt động cho ngày này.
                  </p>
                )}

                {/* Accommodation */}
                {d.accommodation && (
                  <div className="bg-slate-50 border rounded-xl p-4 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          <FaHotel />
                        </div>

                        <div className="space-y-1">
                          <div className="font-semibold text-slate-800">
                            {d.accommodation.hotel_name}
                          </div>

                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FaMapMarkerAlt className="text-xs" />
                            <span>{d.accommodation.address}</span>
                          </div>

                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <FaMoon className="text-xs" />
                            <span>{d.accommodation.nights} đêm</span>
                          </div>
                        </div>
                      </div>

                      <StarRating stars={d.accommodation.stars} />
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
};

export default ItineraryView;
