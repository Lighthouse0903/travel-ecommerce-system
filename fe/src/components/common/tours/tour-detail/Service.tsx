import React, { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
} from "lucide-react";

interface ServiceProps {
  included?: string[];
  excluded?: string[];
  onUpdate?: (partial: {
    services_included: string[];
    services_excluded: string[];
  }) => Promise<any> | void;
  saving?: boolean;
  editable?: boolean;
}

const Service: React.FC<ServiceProps> = ({
  included = [],
  excluded = [],
  onUpdate,
  saving,
  editable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inc, setInc] = useState<string[]>(included);
  const [exc, setExc] = useState<string[]>(excluded);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const canEdit = editable && typeof onUpdate === "function";
  const isBusy = saving ?? isSavingLocal;

  // 🔧 chỉ sync lại khi thoát edit (hoặc mới mount)
  useEffect(() => {
    if (!isEditing) {
      setInc(included);
      setExc(excluded);
    }
  }, [isEditing]); // ⬅️ bỏ included, excluded khỏi deps

  const hasIncluded = useMemo(() => inc.length > 0, [inc]);
  const hasExcluded = useMemo(() => exc.length > 0, [exc]);

  const norm = (lines: string) =>
    lines
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSave = async () => {
    if (!canEdit || !onUpdate) return;
    if (!saving) setIsSavingLocal(true);
    try {
      await onUpdate({
        services_included: inc,
        services_excluded: exc,
      });
      setIsEditing(false);
    } finally {
      if (!saving) setIsSavingLocal(false);
    }
  };

  const handleCancel = () => {
    setInc(included);
    setExc(excluded);
    setIsEditing(false);
  };

  const addRow = (type: "inc" | "exc") =>
    type === "inc" ? setInc((a) => [...a, ""]) : setExc((a) => [...a, ""]);

  const updateRow = (type: "inc" | "exc", i: number, v: string) =>
    type === "inc"
      ? setInc((arr) => arr.map((x, idx) => (idx === i ? v : x)))
      : setExc((arr) => arr.map((x, idx) => (idx === i ? v : x)));

  const removeRow = (type: "inc" | "exc", i: number) =>
    type === "inc"
      ? setInc((arr) => arr.filter((_, idx) => idx !== i))
      : setExc((arr) => arr.filter((_, idx) => idx !== i));

  return (
    <section className="relative bg-white p-6 rounded-2xl shadow-md">
      {/* Action buttons */}
      {canEdit && !isEditing && (
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border hover:bg-gray-50"
          onClick={() => setIsEditing(true)}
          disabled={isBusy}
        >
          <Pencil className="w-4 h-4" />
          Chỉnh sửa
        </button>
      )}

      {canEdit && isEditing && (
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm border hover:bg-gray-50"
            onClick={handleCancel}
            disabled={isBusy}
          >
            <X className="w-4 h-4" />
            Huỷ
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm border bg-black text-white hover:opacity-90 disabled:opacity-60"
            onClick={handleSave}
            disabled={isBusy}
            title="Ctrl/Cmd + Enter để lưu"
          >
            <Check className="w-4 h-4" />
            {isBusy ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-5 pr-28">Dịch vụ</h2>

      {/* VIEW MODE */}
      {!canEdit || !isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bao gồm */}
          <div
            aria-label="Dịch vụ bao gồm"
            className="rounded-xl border border-green-100 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-base font-medium text-green-700">Bao gồm</h3>
            </div>
            {hasIncluded ? (
              <ul className="mt-2 list-disc ml-5 text-gray-700 leading-relaxed space-y-1">
                {inc.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Không có mục nào.</p>
            )}
          </div>

          {/* Không bao gồm */}
          <div
            aria-label="Dịch vụ không bao gồm"
            className="rounded-xl border border-red-100 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <h3 className="text-base font-medium text-red-700">
                Không bao gồm
              </h3>
            </div>
            {hasExcluded ? (
              <ul className="mt-2 list-disc ml-5 text-gray-700 leading-relaxed space-y-1">
                {exc.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Không có mục nào.</p>
            )}
          </div>
        </div>
      ) : (
        // EDIT MODE
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Bao gồm - editor */}
          <div className="rounded-xl border border-green-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="text-base font-medium text-green-700">
                  Bao gồm
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm border hover:bg-gray-50"
                onClick={() => addRow("inc")}
                disabled={isBusy}
              >
                <Plus className="w-4 h-4" /> Thêm dòng
              </button>
            </div>

            <textarea
              className="w-full min-h-28 border rounded p-2 text-sm leading-relaxed"
              placeholder="Mỗi dòng một mục..."
              value={inc.join("\n")}
              onChange={(e) => setInc(norm(e.target.value))}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === "Enter") {
                  e.stopPropagation();
                }
              }}
              disabled={isBusy}
            />

            <div className="mt-3 space-y-2">
              {inc.map((val, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    value={val}
                    onChange={(e) => updateRow("inc", i, e.target.value)}
                    placeholder={`Mục #${i + 1}`}
                    disabled={isBusy}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded border px-2"
                    onClick={() => removeRow("inc", i)}
                    title="Xoá"
                    disabled={isBusy}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Không bao gồm - editor */}
          <div className="rounded-xl border border-red-100 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-medium text-red-700">
                  Không bao gồm
                </h3>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded px-2 py-1 text-sm border hover:bg-gray-50"
                onClick={() => addRow("exc")}
                disabled={isBusy}
              >
                <Plus className="w-4 h-4" /> Thêm dòng
              </button>
            </div>

            <textarea
              className="w-full min-h-28 border rounded p-2 text-sm leading-relaxed"
              placeholder="Mỗi dòng một mục..."
              value={exc.join("\n")}
              onChange={(e) => setExc(norm(e.target.value))}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                } else if (e.key === "Enter") {
                  e.stopPropagation();
                }
              }}
              disabled={isBusy}
            />

            <div className="mt-3 space-y-2">
              {exc.map((val, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    value={val}
                    onChange={(e) => updateRow("exc", i, e.target.value)}
                    placeholder={`Mục #${i + 1}`}
                    disabled={isBusy}
                  />
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded border px-2"
                    onClick={() => removeRow("exc", i)}
                    title="Xoá"
                    disabled={isBusy}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default Service;
