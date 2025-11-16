import { useFetchInstance } from "../hooks/fetchInstance";
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  ResetPassword,
} from "@/types/auth";
import { ApiResponse } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";
import { UpdateProfile } from "@/types/user";

export const useAuthService = () => {
  const { post, put } = useFetchInstance();
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

  // Hàm gọi API cập nhật hồ sơ
  const update = async (
    update: UpdateProfile
  ): Promise<ApiResponse<UpdateProfile>> => {
    return put<UpdateProfile>("/users/profile/", update, true);
  };

  // Hàm gọi API đổi mật khẩu
  const change_password = async (
    resetPassword: ResetPassword
  ): Promise<ApiResponse<ResetPassword>> => {
    return put<ResetPassword>("/users/change-password/", resetPassword, true);
  };

  return { register, login, logout, update, change_password };
};
