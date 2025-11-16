"use client";
import React, { useEffect, useState } from "react";
import { Pencil, X, Check } from "lucide-react";

interface DescriptionProps {
  description: string;
  onUpdate?: (newDescription: string) => Promise<void> | void;
  saving?: boolean;
  editable?: boolean;
}

const Description: React.FC<DescriptionProps> = ({
  description,
  onUpdate,
  saving,
  editable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localDesc, setLocalDesc] = useState(description);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const canEdit = editable && typeof onUpdate === "function";

  useEffect(() => {
    if (!isEditing) setLocalDesc(description);
  }, [description, isEditing]);

  const handleSave = async () => {
    if (!canEdit || !onUpdate) return;
    if (!saving) setIsSavingLocal(true);
    try {
      await onUpdate(localDesc.trim());
      setIsEditing(false);
    } finally {
      if (!saving) setIsSavingLocal(false);
    }
  };

  const handleCancel = () => {
    setLocalDesc(description);
    setIsEditing(false);
  };

  const isBusy = saving ?? isSavingLocal;

  return (
    <div>
      <section className="relative bg-white p-6 rounded-2xl shadow-md">
        {/* Nếu được phép chỉnh sửa */}
        {canEdit && (
          <>
            {!isEditing ? (
              <button
                type="button"
                className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border hover:bg-gray-50"
                onClick={() => setIsEditing(true)}
                aria-label="Chỉnh sửa mô tả"
              >
                <Pencil className="w-4 h-4" />
                Chỉnh sửa
              </button>
            ) : (
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm border hover:bg-gray-50"
                  disabled={isBusy}
                  aria-label="Huỷ"
                  title="Esc để huỷ"
                >
                  <X className="w-4 h-4" />
                  Huỷ
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm border bg-black text-white hover:opacity-90 disabled:opacity-60"
                  disabled={isBusy}
                  aria-label="Lưu"
                  title="Ctrl+Enter để lưu"
                >
                  <Check className="w-4 h-4" />
                  {isBusy ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            )}
          </>
        )}

        <h2 className="text-xl font-semibold mb-3 pr-28">Mô tả</h2>

        {!canEdit || !isEditing ? (
          <p className="text-gray-700 leading-relaxed whitespace-pre-line break-words">
            {description || "Chưa có mô tả cho tour này."}
          </p>
        ) : (
          <textarea
            className="w-full min-h-40 rounded-lg border p-3 text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-black/20"
            value={localDesc}
            onChange={(e) => setLocalDesc(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleSave();
              }
            }}
            placeholder="Nhập mô tả tour..."
            disabled={isBusy}
          />
        )}
      </section>
    </div>
  );
};

export default Description;
