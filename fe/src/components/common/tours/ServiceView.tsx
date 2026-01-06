import React, { useMemo } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface ServiceViewProps {
  included?: string[];
  excluded?: string[];
}

function cleanList(arr?: string[]) {
  return (arr ?? []).map((x) => (x ?? "").trim()).filter(Boolean);
}

const ServiceView = ({ included = [], excluded = [] }: ServiceViewProps) => {
  const inc = useMemo(() => cleanList(included), [included]);
  const exc = useMemo(() => cleanList(excluded), [excluded]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-card p-4 shadow-sm md:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
          Dịch vụ
        </h2>
        <p className="text-sm text-muted-foreground">
          Các hạng mục bao gồm và không bao gồm trong tour
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-start gap-3 border-b border-slate-200 bg-emerald-50/60 px-4 py-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-emerald-600 ring-1 ring-emerald-200">
              <CheckCircle2 className="h-5 w-5" />
            </span>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">Bao gồm</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  {inc.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Những dịch vụ đã nằm trong giá tour
              </p>
            </div>
          </div>

          <div className="px-4 py-4">
            {inc.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-muted-foreground">
                Chưa có thông tin dịch vụ bao gồm.
              </div>
            ) : (
              <ul className="space-y-2">
                {inc.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-start gap-3 border-b border-slate-200 bg-rose-50/60 px-4 py-4">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-600 ring-1 ring-rose-200">
              <XCircle className="h-5 w-5" />
            </span>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-slate-900">Không bao gồm</h3>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                  {exc.length}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Các chi phí phát sinh khách tự chi trả
              </p>
            </div>
          </div>

          <div className="px-4 py-4">
            {exc.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-muted-foreground">
                Chưa có thông tin dịch vụ không bao gồm.
              </div>
            ) : (
              <ul className="space-y-2">
                {exc.map((item, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-slate-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceView;
