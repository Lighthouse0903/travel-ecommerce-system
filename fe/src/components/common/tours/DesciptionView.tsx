"use client";

import React from "react";
import { FileText } from "lucide-react";

interface DescriptionProps {
  description?: string | null;
}

const DesciptionView: React.FC<DescriptionProps> = ({ description }) => {
  const text = (description ?? "").trim();

  return (
    <section className="rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-slate-700" />
        <h2 className="text-lg font-semibold text-slate-900">
          Giới thiệu Tour
        </h2>
      </div>

      {text ? (
        <div className="whitespace-pre-line leading-relaxed text-slate-700">
          {text}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Chưa có mô tả cho tour này.
        </p>
      )}
    </section>
  );
};

export default DesciptionView;
