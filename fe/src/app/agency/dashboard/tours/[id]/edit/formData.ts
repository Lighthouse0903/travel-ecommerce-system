import { toActivityString } from "./activityMapper";
import { EditTourFormValues } from "./formSchema";

export const buildTourFormDataForEdit = (values: EditTourFormValues) => {
  const fd = new FormData();

  fd.append("name", values.name ?? "");
  fd.append("description", values.description ?? "");
  fd.append("departure_location", values.departure_location ?? "");
  fd.append("destination", values.destination ?? "");
  fd.append("duration_days", String(values.duration_days ?? 1));
  fd.append("region", String(values.region ?? 1));

  fd.append("adult_price", String(values.adult_price ?? 0));
  fd.append("children_price", String(values.children_price ?? 0));
  fd.append(
    "discount",
    values.discount === "" || values.discount == null
      ? ""
      : String(values.discount)
  );

  values.categories.forEach((c) => fd.append("categories", c));

  const itineraryForBE = (values.itinerary ?? []).map((d) => ({
    ...d,
    activities: (d.activities ?? []).map(toActivityString), // {time,text}[] -> string[]
  }));

  fd.append("itinerary", JSON.stringify(itineraryForBE));
  fd.append("transportation", JSON.stringify(values.transportation ?? []));
  fd.append(
    "services_included",
    JSON.stringify(values.services_included ?? [])
  );
  fd.append(
    "services_excluded",
    JSON.stringify(values.services_excluded ?? [])
  );
  fd.append("policy", JSON.stringify(values.policy ?? {}));

  if (typeof values.is_active === "boolean") {
    fd.append("is_active", String(values.is_active));
  }

  if (values.thumbnail instanceof File) {
    fd.append("thumbnail", values.thumbnail);
  }
  if (Array.isArray(values.images) && values.images.length > 0) {
    values.images.forEach((f) => {
      if (f instanceof File) fd.append("images", f);
    });
  }

  return fd;
};
