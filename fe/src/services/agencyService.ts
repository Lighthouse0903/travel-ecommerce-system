import { useFetchInstance } from "@/hooks/fetchInstance";
import { AgencyResponse, CreateAgency } from "@/types/agency";
import { ApiResponse } from "@/types/common";

export const useAgencyService = () => {
  const { get, post, put, patch, del } = useFetchInstance();

  // gọi hàm đăng kí đại lý
  const register = (
    payload: FormData
  ): Promise<ApiResponse<AgencyResponse>> => {
    return post<AgencyResponse>("/agencies/register/", payload, true);
  };
  return { register };
};
