import { useFetchInstance } from "../hooks/fetchInstance";
import {
  RegisterPayload,
  RegisterResponse,
  LoginPayload,
  LoginResponse,
  ChangePassword,
  MessageResponse,
} from "@/types/auth";
import { ApiResponse } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";
import { UpdateProfile, UserResponse } from "@/types/user";

export const useAuthService = () => {
  const { get, post, put, patch } = useFetchInstance();
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

  // Hàm gọi API get profile
  const getProfile = async (): Promise<ApiResponse<UserResponse>> => {
    return get<UserResponse>("/users/profile", true);
  };

  // Hàm gọi API cập nhật hồ sơ
  const update = async (
    update: UpdateProfile
  ): Promise<ApiResponse<UserResponse>> => {
    return patch<UserResponse>("/users/profile/", update, true);
  };

  // Hàm gọi API đổi mật khẩu
  const change_password = async (
    resetPassword: ChangePassword
  ): Promise<ApiResponse<MessageResponse>> => {
    return put<MessageResponse>("/users/change-password/", resetPassword, true);
  };

  return { register, login, update, change_password, getProfile };
};
