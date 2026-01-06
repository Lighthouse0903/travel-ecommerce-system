"use client";

import React from "react";

interface FieldRowProps {
  icon: React.ReactNode;
  label: string;
  value?: React.ReactNode;
}

const FieldRow: React.FC<FieldRowProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="shrink-0 text-slate-500">{icon}</div>

      <div className="min-w-0">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="text-sm text-slate-900 break-all">{value ?? "—"}</p>
      </div>
    </div>
  );
};

export default FieldRow;
