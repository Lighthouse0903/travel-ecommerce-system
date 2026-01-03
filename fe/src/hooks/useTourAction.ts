import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTourService } from "@/services/tourService";
import { TourRequest } from "@/types/tour";
import { buildTourFormData } from "@/app/agency/dashboard/tours/create/formData";

export const useTourAction = () => {
  const router = useRouter();
  const { createTour } = useTourService();

  const submitCreateTour = async (values: TourRequest) => {
    const formData = buildTourFormData(values);

    const res = await createTour(formData);
    console.log("Api create response: ", res);

    if (res.success) {
      toast.success(res.message || "Tạo mới tour thành công");
      try {
        localStorage.removeItem("tour_create_draft_v1");
      } catch {}

      const createdId = res?.data?.tour_id;
      if (createdId) router.push(`/agency/dashboard/tours/${createdId}`);
      return true;
    }

    // xử lý lỗi
    const errors = res.error?.errors;
    const firstKey = errors ? Object.keys(errors)[0] : null;

    const finalMsg =
      errors?.non_field_errors?.[0] ||
      (firstKey && errors?.[firstKey]?.[0]) ||
      res.error?.message ||
      res.message ||
      "Thao tác thất bại";

    toast.error(finalMsg);
    return false;
  };

  return { submitCreateTour };
};
