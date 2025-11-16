import React, { useEffect, useState } from "react";
import { FaHotel } from "react-icons/fa";
import { Pencil, X, Check } from "lucide-react";
import StarRating from "../../rating/StarRating";

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

interface ItineraryProps {
  itinerary: DayItinerary[];
  onUpdate?: (partial: { itinerary: DayItinerary[] }) => Promise<any> | void;
  saving?: boolean;
  editable?: boolean;
}

const Itinerary: React.FC<ItineraryProps> = ({
  itinerary,
  onUpdate,
  saving,
  editable = false,
}) => {
  if (!itinerary?.length) return null;

  const [isEditing, setIsEditing] = useState(false);
  const [local, setLocal] = useState<DayItinerary[]>(itinerary);
  const [isSavingLocal, setIsSavingLocal] = useState(false);

  // chỉ cho phép chỉnh nếu vừa bật editable vừa có onUpdate
  const canEdit = editable && typeof onUpdate === "function";
  const isBusy = saving ?? isSavingLocal;

  useEffect(() => {
    if (!isEditing) setLocal(itinerary);
  }, [itinerary, isEditing]);

  const updateDay = (idx: number, patch: Partial<DayItinerary>) => {
    setLocal((prev) =>
      prev.map((d, i) => (i === idx ? { ...d, ...patch } : d))
    );
  };

  const updateAccommodation = (
    idx: number,
    patch: Partial<NonNullable<DayItinerary["accommodation"]>>
  ) => {
    setLocal((prev) =>
      prev.map((d, i) =>
        i === idx
          ? {
              ...d,
              accommodation: d.accommodation
                ? { ...d.accommodation, ...patch }
                : {
                    hotel_name: "",
                    stars: 0,
                    nights: 0,
                    address: "",
                    ...patch,
                  },
            }
          : d
      )
    );
  };

  const handleSave = async () => {
    if (!canEdit || !onUpdate) return;
    if (!saving) setIsSavingLocal(true);
    try {
      await onUpdate({ itinerary: local });
      setIsEditing(false);
    } finally {
      if (!saving) setIsSavingLocal(false);
    }
  };

  const handleCancel = () => {
    setLocal(itinerary);
    setIsEditing(false);
  };

  return (
    <section className="relative bg-white p-3 md:p-6 rounded-2xl shadow-md">
      {/* action buttons */}
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
            onClick={handleCancel}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm border hover:bg-gray-50"
            disabled={isBusy}
          >
            <X className="w-4 h-4" />
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm border bg-black text-white hover:opacity-90 disabled:opacity-60"
            disabled={isBusy}
            title="Ctrl+Enter để lưu"
          >
            <Check className="w-4 h-4" />
            {isBusy ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      )}

      <h2 className="text-base md:text-xl font-semibold mb-4 pr-28">
        Lịch trình
      </h2>

      {/* VIEW MODE */}
      {!canEdit || !isEditing ? (
        <div className="space-y-4">
          {itinerary.map((day) => (
            <div key={day.day} className="p-4 border rounded-lg">
              <div className="font-semibold">
                Ngày {day.day}: {day.title}
              </div>
              <ul className="list-disc ml-5 mt-2 text-gray-600">
                {day.activities.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
              {day.accommodation && (
                <div className="flex items-center text-gray-600 mt-3 gap-3">
                  <div className="flex items-center">
                    <FaHotel className="mr-2" />
                    {day.accommodation.hotel_name}
                  </div>
                  <StarRating stars={day.accommodation.stars} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        // EDIT MODE
        <div className="space-y-4">
          {local.map((day, idx) => (
            <div key={day.day} className="p-4 border rounded-lg space-y-3">
              <div className="font-semibold flex items-center gap-2">
                <span>Ngày {day.day}:</span>
                <input
                  className="flex-1 border rounded px-2 py-1"
                  value={day.title}
                  onChange={(e) => updateDay(idx, { title: e.target.value })}
                  placeholder="Tiêu đề ngày..."
                />
              </div>

              {/* activities: mỗi dòng là 1 input */}
              <div>
                <label className="text-sm text-gray-600">
                  Hoạt động trong ngày
                </label>
                <div className="mt-2 space-y-2">
                  {day.activities.map((a, actIdx) => (
                    <div key={actIdx} className="flex gap-2 items-center">
                      <input
                        className="flex-1 border rounded px-2 py-1"
                        value={a}
                        onChange={(e) => {
                          const newActs = [...day.activities];
                          newActs[actIdx] = e.target.value;
                          updateDay(idx, { activities: newActs });
                        }}
                        placeholder={`Hoạt động ${actIdx + 1}`}
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => {
                          const newActs = day.activities.filter(
                            (_, i) => i !== actIdx
                          );
                          updateDay(idx, { activities: newActs });
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:underline mt-1"
                    onClick={() => {
                      const newActs = [...day.activities, ""];
                      updateDay(idx, { activities: newActs });
                    }}
                  >
                    + Thêm hoạt động
                  </button>
                </div>
              </div>

              {/* accommodation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600">Khách sạn</label>
                  <input
                    className="mt-1 w-full border rounded px-2 py-1"
                    value={day.accommodation?.hotel_name ?? ""}
                    onChange={(e) =>
                      updateAccommodation(idx, { hotel_name: e.target.value })
                    }
                    placeholder="Hotel name"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Sao</label>
                  <input
                    type="number"
                    min={0}
                    max={5}
                    className="mt-1 w-full border rounded px-2 py-1"
                    value={day.accommodation?.stars ?? 0}
                    onChange={(e) =>
                      updateAccommodation(idx, {
                        stars: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Số đêm</label>
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full border rounded px-2 py-1"
                    value={day.accommodation?.nights ?? 0}
                    onChange={(e) =>
                      updateAccommodation(idx, {
                        nights: Number(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Địa chỉ</label>
                  <input
                    className="mt-1 w-full border rounded px-2 py-1"
                    value={day.accommodation?.address ?? ""}
                    onChange={(e) =>
                      updateAccommodation(idx, { address: e.target.value })
                    }
                    placeholder="Địa chỉ khách sạn"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Itinerary;
