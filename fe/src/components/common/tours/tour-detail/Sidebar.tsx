import React, { useEffect, useState } from "react";
import { TourResponse } from "@/types/tour";
import {
  Building2,
  Phone,
  Mail,
  Bus,
  Pencil,
  X,
  Check,
  Plus,
  Trash2,
  Star,
} from "lucide-react";

interface SidebarProps {
  tour: TourResponse;
  onUpdate?: (partial: {
    agency_name?: string;
    hotline?: string;
    email_agency?: string;
    transportation?: string[];
  }) => Promise<any> | void;
  saving?: boolean;
  editable?: boolean; // 👈 bật/tắt quyền chỉnh sửa
}

const Sidebar: React.FC<SidebarProps> = ({
  tour,
  onUpdate,
  saving,
  editable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // local state cho các field sidebar quản lý
  const [agencyName, setAgencyName] = useState(tour.agency_name || "");
  const [hotline, setHotline] = useState(tour.hotline || "");
  const [email, setEmail] = useState(tour.email_agency || "");
  const [transportation, setTransportation] = useState<string[]>(
    tour.transportation || []
  );
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  const canEdit = editable && typeof onUpdate === "function";
  const isBusy = saving ?? isSavingLocal;

  // đồng bộ lại khi thoát edit hoặc khi tour thay đổi
  useEffect(() => {
    if (!isEditing) {
      setAgencyName(tour.agency_name || "");
      setHotline(tour.hotline || "");
      setEmail(tour.email_agency || "");
      setTransportation(tour.transportation || []);
    }
  }, [tour, isEditing]);

  const normalizeLines = (txt: string) =>
    txt
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

  const addTransportRow = () => setTransportation((prev) => [...prev, ""]);

  const updateTransportRow = (index: number, value: string) =>
    setTransportation((prev) => prev.map((t, i) => (i === index ? value : t)));

  const removeTransportRow = (index: number) =>
    setTransportation((prev) => prev.filter((_, i) => i !== index));

  const handleSave = async () => {
    if (!canEdit || !onUpdate) return;
    if (!saving) setIsSavingLocal(true);
    try {
      await onUpdate({
        agency_name: agencyName,
        hotline,
        email_agency: email,
        transportation,
      });
      setIsEditing(false);
    } finally {
      if (!saving) setIsSavingLocal(false);
    }
  };

  const handleCancel = () => {
    setAgencyName(tour.agency_name || "");
    setHotline(tour.hotline || "");
    setEmail(tour.email_agency || "");
    setTransportation(tour.transportation || []);
    setIsEditing(false);
  };

  return (
    <aside className="space-y-4 sticky top-6">
      {/* Thông tin liên hệ */}
      <div className="relative bg-white p-4 rounded-2xl shadow-sm">
        {/* nút chỉnh sửa chung cho sidebar */}
        {canEdit && !isEditing && (
          <button
            type="button"
            className="absolute right-3 top-3 inline-flex items-center gap-1 px-2 py-1 text-xs border rounded-lg hover:bg-gray-50"
            onClick={() => setIsEditing(true)}
            disabled={isBusy}
          >
            <Pencil className="w-3 h-3" />
            Chỉnh sửa
          </button>
        )}
        {canEdit && isEditing && (
          <div className="absolute right-3 top-3 flex gap-2">
            <button
              type="button"
              className="px-2 py-1 text-xs border rounded hover:bg-gray-50 disabled:opacity-60"
              onClick={handleCancel}
              disabled={isBusy}
            >
              <X className="w-3 h-3" />
            </button>
            <button
              type="button"
              className="px-2 py-1 text-xs bg-black text-white rounded hover:opacity-90 disabled:opacity-60"
              onClick={handleSave}
              disabled={isBusy}
            >
              <Check className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="text-sm text-gray-500">Thông tin liên hệ</div>

        {!canEdit || !isEditing ? (
          <>
            <div className="font-medium flex items-center gap-2 mt-2">
              <Building2 className="w-4 h-4 text-gray-500" />
              {tour.agency_name}
            </div>
            <div className="text-gray-600 mt-2 space-y-1">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {tour.hotline}
              </div>
              <div className="flex items-center gap-2 break-all">
                <Mail className="w-4 h-4" />
                {tour.email_agency}
              </div>
            </div>
          </>
        ) : (
          <form className="mt-2 space-y-2" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="text-xs text-gray-500">Tên đại lý</label>
              <input
                className="mt-1 w-full border rounded-lg px-2 py-1 text-sm"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                disabled={isBusy}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Hotline</label>
              <input
                className="mt-1 w-full border rounded-lg px-2 py-1 text-sm"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                disabled={isBusy}
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Email</label>
              <input
                className="mt-1 w-full border rounded-lg px-2 py-1 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isBusy}
              />
            </div>
          </form>
        )}
      </div>

      {/* Đánh giá (thường không cho sửa trực tiếp) */}
      <div className="bg-white p-4 rounded-2xl shadow-sm">
        <div className="text-sm text-gray-500">Đánh giá</div>
        <div className="flex items-center gap-2 mt-2">
          <div className="text-2xl font-bold text-rose-600">{tour.rating}</div>
          <Star className="w-5 h-5 text-yellow-400" />
          <div className="text-sm text-gray-600">
            ({tour.reviews_count} đánh giá)
          </div>
        </div>
      </div>

      {/* Phương tiện di chuyển */}
      <div className="bg-white p-4 rounded-2xl shadow-sm text-gray-600">
        <div className="text-sm text-gray-500 mb-2">Phương tiện di chuyển</div>

        {!canEdit || !isEditing ? (
          <ul className="list-disc ml-5 space-y-1">
            {(tour.transportation || []).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        ) : (
          <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
            <textarea
              className="w-full border rounded-lg p-2 text-sm min-h-20 leading-relaxed"
              placeholder="Mỗi dòng một phương tiện..."
              value={transportation.join("\n")}
              onChange={(e) =>
                setTransportation(normalizeLines(e.target.value))
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

            <div className="space-y-2 pt-1">
              {transportation.map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    className="flex-1 border rounded px-2 py-1 text-sm"
                    value={t}
                    onChange={(e) => updateTransportRow(i, e.target.value)}
                    disabled={isBusy}
                  />
                  <button
                    type="button"
                    className="p-1 border rounded hover:bg-gray-50 disabled:opacity-60"
                    onClick={() => removeTransportRow(i)}
                    disabled={isBusy}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addTransportRow}
                className="text-xs px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-60"
                disabled={isBusy}
              >
                <Plus className="w-3 h-3 inline-block mr-1" />
                Thêm dòng
              </button>
            </div>
          </form>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
