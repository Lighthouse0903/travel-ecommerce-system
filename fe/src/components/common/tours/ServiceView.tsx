import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface ServiceViewProps {
  included?: string[];
  excluded?: string[];
}

function cleanList(arr: string[]) {
  return (arr ?? []).map((x) => (x ?? "").trim()).filter(Boolean);
}

const ServiceView = ({ included = [], excluded = [] }: ServiceViewProps) => {
  const inc = cleanList(included);
  const exc = cleanList(excluded);

  return (
    <section className="bg-slate-50 p-5 rounded-xl border shadow-md">
      <div className="flex items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Dịch vụ
          </h2>
          <p className="text-sm text-muted-foreground">
            Các hạng mục bao gồm và không bao gồm trong tour
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* các dịch vụ bao gồm*/}
        <div className="rounded-2xl bg-white p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </span>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Bao gồm</h3>
              <p className="text-xs text-muted-foreground">
                Những dịch vụ đã nằm trong giá tour
              </p>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
              {inc.length}
            </span>
          </div>

          {inc.length === 0 ? (
            <div className="text-sm text-muted-foreground rounded-xl border border-dashed p-4">
              Chưa có thông tin dịch vụ bao gồm.
            </div>
          ) : (
            <ul className="space-y-2">
              {inc.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Các dịch vụ ko bao gồm */}
        <div className="rounded-2xl bg-white  p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 border border-rose-100">
              <XCircle className="w-5 h-5 text-rose-600" />
            </span>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Không bao gồm</h3>
              <p className="text-xs text-muted-foreground">
                Các chi phí phát sinh khách tự chi trả
              </p>
            </div>

            <span className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
              {exc.length}
            </span>
          </div>

          {exc.length === 0 ? (
            <div className="text-sm text-muted-foreground rounded-xl border border-dashed p-4">
              Chưa có thông tin dịch vụ không bao gồm.
            </div>
          ) : (
            <ul className="space-y-2">
              {exc.map((item, idx) => (
                <li key={idx} className="flex gap-3 text-gray-700">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
export default ServiceView;
