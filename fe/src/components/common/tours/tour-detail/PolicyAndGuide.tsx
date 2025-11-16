import React, { useEffect, useState } from "react";
import {
  Shield,
  BadgeCheck,
  Phone,
  PiggyBank,
  Undo2,
  Pencil,
  X,
  Check,
} from "lucide-react";
import type { Guide, Policy } from "@/types/tour";

interface PolicyAndGuideProps {
  policy: Policy;
  guide: Guide;
  onUpdate?: (partial: { policy: Policy; guide: Guide }) => Promise<any> | void;
  saving?: boolean;
  editable?: boolean; // 👈 thêm quyền chỉnh sửa
}

const PolicyAndGuide: React.FC<PolicyAndGuideProps> = ({
  policy,
  guide,
  onUpdate,
  saving,
  editable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localPolicy, setLocalPolicy] = useState<Policy>(policy);
  const [localGuide, setLocalGuide] = useState<Guide>(guide);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const canEdit = editable && typeof onUpdate === "function";
  const isBusy = saving ?? isSavingLocal;

  useEffect(() => {
    if (!isEditing) {
      setLocalPolicy(policy);
      setLocalGuide(guide);
    }
  }, [policy, guide, isEditing]);

  const handleSave = async () => {
    if (!canEdit || !onUpdate) return;

    if (!saving) setIsSavingLocal(true);
    try {
      // ép kiểu số cho các field số
      const patched: { policy: Policy; guide: Guide } = {
        policy: {
          ...localPolicy,
          deposit_percent: Number(localPolicy.deposit_percent) || 0,
        },
        guide: {
          ...localGuide,
          experience_years: Number(localGuide.experience_years) || 0,
        },
      };
      await onUpdate(patched);
      setIsEditing(false);
    } finally {
      if (!saving) setIsSavingLocal(false);
    }
  };

  const handleCancel = () => {
    setLocalPolicy(policy);
    setLocalGuide(guide);
    setIsEditing(false);
  };

  return (
    <section className="relative bg-white p-6 rounded-2xl shadow-md">
      {/* Action buttons */}
      {canEdit && !isEditing && (
        <button
          type="button"
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border hover:bg-gray-50"
          onClick={() => setIsEditing(true)}
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

      <h2 className="text-xl font-semibold mb-5 pr-28">
        Chính sách & Hướng dẫn viên
      </h2>

      {/* VIEW MODE */}
      {!canEdit || !isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Policy card */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5" />
              <h3 className="font-medium">Chính sách</h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <div className="flex items-start gap-2">
                <Undo2 className="w-4 h-4 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Hoàn tiền</div>
                  <div className="font-medium break-words">
                    {policy?.refund_policy || "—"}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <PiggyBank className="w-4 h-4 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Đặt cọc</div>
                  <div className="font-medium">
                    {Number(policy?.deposit_percent ?? 0)}%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <BadgeCheck className="w-4 h-4 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Phí huỷ</div>
                  <div className="font-medium break-words">
                    {policy?.cancellation_fee || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guide card */}
          <div className="border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <BadgeCheck className="w-5 h-5" />
              <h3 className="font-medium">Hướng dẫn viên</h3>
            </div>
            <div className="text-gray-700 space-y-2">
              <div className="flex items-start gap-2">
                <div>
                  <div className="text-sm text-gray-500">Tên & Kinh nghiệm</div>
                  <div className="font-medium">
                    {guide?.name_guide || "—"} •{" "}
                    {Number(guide?.experience_years ?? 0)} năm
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1" />
                <div>
                  <div className="text-sm text-gray-500">Liên hệ</div>
                  <div className="font-medium break-words">
                    {guide?.phone_guide || "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // EDIT MODE
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          onSubmit={(e) => e.preventDefault()}
        >
          {/* Policy editor */}
          <div className="border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <h3 className="font-medium">Chính sách</h3>
            </div>

            <div>
              <label className="text-sm text-gray-600">Hoàn tiền</label>
              <textarea
                className="mt-1 w-full min-h-24 border rounded-lg p-2 leading-relaxed focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="Ví dụ: Hoàn 100% trước 7 ngày khởi hành…"
                value={localPolicy?.refund_policy ?? ""}
                onChange={(e) =>
                  setLocalPolicy((p) => ({
                    ...p,
                    refund_policy: e.target.value,
                  }))
                }
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Đặt cọc (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  value={localPolicy?.deposit_percent ?? 0}
                  onChange={(e) =>
                    setLocalPolicy((p) => ({
                      ...p,
                      deposit_percent: Number(e.target.value) || 0,
                    }))
                  }
                  disabled={isBusy}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Phí huỷ</label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  placeholder="Ví dụ: 30% trước 3 ngày…"
                  value={localPolicy?.cancellation_fee ?? ""}
                  onChange={(e) =>
                    setLocalPolicy((p) => ({
                      ...p,
                      cancellation_fee: e.target.value,
                    }))
                  }
                  disabled={isBusy}
                />
              </div>
            </div>
          </div>

          {/* Guide editor */}
          <div className="border rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <BadgeCheck className="w-5 h-5" />
              <h3 className="font-medium">Hướng dẫn viên</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">
                  Tên hướng dẫn viên
                </label>
                <input
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  value={localGuide?.name_guide ?? ""}
                  onChange={(e) =>
                    setLocalGuide((g) => ({ ...g, name_guide: e.target.value }))
                  }
                  disabled={isBusy}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Kinh nghiệm (năm)
                </label>
                <input
                  type="number"
                  min={0}
                  className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                  value={localGuide?.experience_years ?? 0}
                  onChange={(e) =>
                    setLocalGuide((g) => ({
                      ...g,
                      experience_years: Number(e.target.value) || 0,
                    }))
                  }
                  disabled={isBusy}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Số điện thoại</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/20"
                placeholder="VD: 090x xxx xxx"
                value={localGuide?.phone_guide ?? ""}
                onChange={(e) =>
                  setLocalGuide((g) => ({
                    ...g,
                    phone_guide: e.target.value,
                  }))
                }
                disabled={isBusy}
              />
            </div>
          </div>
        </form>
      )}
    </section>
  );
};

export default PolicyAndGuide;
