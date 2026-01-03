import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAgencyService } from "@/services/agencyService";
import { RegisterAgencyFormValues } from "@/types/agency";
import { buildRegisterAgencyFormData } from "@/app/(customer)/dashboard/register_agency/apply/formData";
import { useAgencyProfile } from "@/contexts/AgencyProfileContext";
import { useCallback } from "react";
import { buildUpdateAgencyFormData } from "@/app/agency/dashboard/edit_profile/formData";
import { EditAgencyFormValues } from "@/app/agency/dashboard/edit_profile/formSchema";

export const useAgencyAction = () => {
  const router = useRouter();
  const { refresh, profile } = useAgencyProfile();
  const { registerAgency, getAgencyProfile, updateAgencyProfile } =
    useAgencyService();

  // Xử lý sự kiện click nút đăng kí
  const submitRegisterAgency = async (values: RegisterAgencyFormValues) => {
    const formData = buildRegisterAgencyFormData(values);

    const shouldPatch = profile?.status === "rejected";
    const res = shouldPatch
      ? await updateAgencyProfile(formData)
      : await registerAgency(formData);

    console.log("Api registeragency response: ", res);

    if (res.success) {
      toast.success(
        res.message ||
          (shouldPatch
            ? "Cập nhật hồ sơ thành công"
            : "Đăng kí đại lý thành công")
      );
      await refresh();
      localStorage.removeItem("agency_register_draft_v1");
      router.replace("/dashboard/register_agency/status");
      return true;
    }
    // Xử lý lỗi
    const errors = res.error?.errors;
    const firstKey = errors ? Object.keys(errors)[0] : null;
    const msg =
      errors?.non_field_errors?.[0] ||
      (firstKey && errors?.[firstKey]?.[0]) ||
      res.error?.message ||
      res.message ||
      "Thao tác thất bại";

    toast.error(msg);
    return false;
  };

  // bảo vệ trang đăng kí
  const guardRegisterAgencyPage = useCallback(async () => {
    const res = await getAgencyProfile();
    if (!res.success) return { allow: true };

    const status = res.data.status;

    if (status === "approved") {
      router.replace("/agency/dashboard");
      return { allow: false };
    }

    if (status === "pending") {
      router.replace("/dashboard/register_agency/status");
      return { allow: false };
    }

    return { allow: true };
  }, [getAgencyProfile, router]);

  // Chặn khi vào trang terms khi đã đăng kí rồi
  const guardRegisterAgencyTermsPage = async () => {
    const res = await getAgencyProfile();
    if (!res.success) return { allow: true };

    const status = res.data.status;

    if (status === "approved") {
      router.replace("/agency/dashboard");
      return { allow: false };
    }

    router.replace("/dashboard/register_agency/status");
    return { allow: false };
  };

  // Xử lý sự kiện edit profile
  const submitUpdateAgencyProfile = async (values: EditAgencyFormValues) => {
    const formData = buildUpdateAgencyFormData(values);
    const res = await updateAgencyProfile(formData);

    console.log("Api updateagency response: ", res);

    if (res.success) {
      toast.success(res.message || "Cập nhật hồ sơ đại lý thành công");
      await refresh();
      router.push("/agency/dashboard/profile");
      return true;
    }

    const errors = res.error?.errors;
    const firstKey = errors ? Object.keys(errors)[0] : null;
    const msg =
      errors?.non_field_errors?.[0] ||
      (firstKey && errors?.[firstKey]?.[0]) ||
      res.error?.message ||
      res.message ||
      "Cập nhật thất bại";

    toast.error(msg);
    return false;
  };

  return {
    submitRegisterAgency,
    guardRegisterAgencyPage,
    guardRegisterAgencyTermsPage,
    submitUpdateAgencyProfile,
  };
};
