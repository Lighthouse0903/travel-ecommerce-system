import type { TourRequest } from "@/types/tour";

export const buildTourFormData = (values: TourRequest) => {
  const fd = new FormData();

  if (!values.thumbnail) throw new Error("Thiếu thumbnail");
  if (!values.images?.length) throw new Error("Thiếu ảnh gallery");
  if (!values.categories?.length) throw new Error("Thiếu categories");
  if (!values.itinerary?.length) throw new Error("Thiếu itinerary");

  if (!values.transportation?.length)
    throw new Error("Thiếu phương tiện di chuyển");
  if (!values.services_included?.length)
    throw new Error("Thiếu dịch vụ bao gồm");

  // itinerary: FE dùng activities = {time,text}[]
  // BE vẫn nhận activities = string[] theo format "HH:mm - Mô tả"
  const itineraryForBE = values.itinerary.map((day) => {
    const activities = (day.activities || [])
      .filter((a) => a && a.time?.trim() && a.text?.trim())
      .map((a) => `${a.time.trim()} - ${a.text.trim()}`);

    if (!activities.length) {
      throw new Error(`Ngày ${day.day}: thiếu hoạt động hợp lệ`);
    }

    return {
      ...day,
      activities,
    };
  });

  fd.append("thumbnail", values.thumbnail);
  values.images.forEach((f) => fd.append("images", f));

  fd.append("name", values.name ?? "");
  fd.append("description", values.description ?? "");

  if (values.adult_price != null && values.adult_price !== "")
    fd.append("adult_price", String(values.adult_price));
  if (values.children_price != null && values.children_price !== "")
    fd.append("children_price", String(values.children_price));
  if (values.discount != null && values.discount !== "")
    fd.append("discount", String(values.discount));

  fd.append("duration_days", String(values.duration_days ?? 1));
  fd.append("departure_location", values.departure_location ?? "");
  fd.append("destination", values.destination ?? "");
  fd.append("region", String(values.region ?? 1));

  values.categories.forEach((c) => fd.append("categories", c));

  fd.append("itinerary", JSON.stringify(itineraryForBE));
  fd.append("transportation", JSON.stringify(values.transportation));
  fd.append("services_included", JSON.stringify(values.services_included));
  fd.append(
    "services_excluded",
    JSON.stringify(values.services_excluded ?? [])
  );
  fd.append("policy", JSON.stringify(values.policy ?? {}));

  fd.append("is_active", String(Boolean(values.is_active)));

  return fd;
};

export const logTourFormData = (fd: FormData) => {
  console.group("TOUR FORM DATA");
  for (const [key, value] of fd.entries()) {
    if (value instanceof File) {
      console.log(key, {
        name: value.name,
        size: value.size,
        type: value.type,
      });
    } else {
      console.log(key, value);
    }
  }
  console.groupEnd();
};
