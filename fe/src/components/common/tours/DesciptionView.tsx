"use client";

import React from "react";
import { FileText } from "lucide-react";

interface DescriptionProps {
  description?: string | null;
}

const DesciptionView: React.FC<DescriptionProps> = ({ description }) => {
  const text = (description ?? "").trim();

  return (
    <section className="p-5 rounded-xl shadow-md bg-slate-50 border">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-slate-700" />
        <h2 className="text-lg font-semibold text-gray-900">Giới thiệu Tour</h2>
      </div>

      {text ? (
        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
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
