import { useFetchInstance } from "@/hooks/fetchInstance";
import { AgencyProfile, RegisterAgencyFormValues } from "@/types/agency";
import { ApiResponse } from "@/types/common";

export const useAgencyService = () => {
  const { get, post, patch } = useFetchInstance();

  // hàm gọi API đăng kí đại lý
  const registerAgency = (
    payload: FormData
  ): Promise<ApiResponse<AgencyProfile>> => {
    return post<AgencyProfile>("/agencies/register/", payload, true);
  };

  // hàm gọi API lấy thông tin đại lý
  const getAgencyProfile = (): Promise<ApiResponse<AgencyProfile>> => {
    return get<AgencyProfile>(`/agencies/profile/`, true);
  };

  // hàm gọi APi cập nhật lại hồ sơ đại lý
  const updateAgencyProfile = (
    payload: FormData
  ): Promise<ApiResponse<AgencyProfile>> => {
    return patch<AgencyProfile>("/agencies/profile/", payload, true);
  };

  return { registerAgency, getAgencyProfile, updateAgencyProfile };
};
