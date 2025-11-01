import { useFetchInstance } from "./fetchInstance";
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
} from "@/types/auth";
import { ApiResponse } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthService = () => {
  const { post } = useFetchInstance();
  const { setAccess, setUser } = useAuth();

  // Hàm gọi API đăng ký
  const register = (
    payload: RegisterPayload
  ): Promise<ApiResponse<RegisterResponse>> => {
    return post<RegisterResponse>("/users/register/", payload);
  };

  // Hàm gọi API đăng nhập
  const login = async (
    payload: LoginPayload
  ): Promise<ApiResponse<LoginResponse>> => {
    const res = await post<LoginResponse>("/users/login/", payload);
    if (res.success && res.data) {
      const { access, user } = res.data;
      setAccess(access);
      if (user) setUser(user);
    }
    return res;
  };

  // Hàm gọi API đăng xuất
  const logout = async (): Promise<ApiResponse<any>> => {
    const res = await post("/users/logout/", {}, true);
    setAccess(null);
    setUser(null);
    return res;
  };
  return { register, login, logout };
};
