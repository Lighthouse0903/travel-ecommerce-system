import { useFetchInstance } from "@/hooks/fetchInstance";
import { AgencyResponse, CreateAgency, UpdateAgency } from "@/types/agency";
import { ApiResponse } from "@/types/common";

export const useAgencyService = () => {
  const { get, post, put, patch, del } = useFetchInstance();

  // hàm gọi API đăng kí đại lý
  const registerAgency = (
    payload: FormData
  ): Promise<ApiResponse<AgencyResponse>> => {
    return post<AgencyResponse>("/agencies/register/", payload, true);
  };

  // hàm gọi API lấy thông tin đại lý
  const getInforAgency = (): Promise<ApiResponse<AgencyResponse>> => {
    return get<AgencyResponse>(`/agencies/profile/`, true);
  };

  // hàm gọi API cập nhật thông tin đại lý
  const updateInforAgency = (
    payload: UpdateAgency
  ): Promise<ApiResponse<AgencyResponse>> => {
    return patch<AgencyResponse>(`/agencies/profile/`, payload, true);
  };

  return { registerAgency, getInforAgency, updateInforAgency };
};
