"use client";

import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { useAuthService } from "@/services/authService";
import { ApiFieldErrors } from "@/types/common";
import { useAuth } from "@/contexts/AuthContext";
import { LoginFormValues, RegisterFormValues } from "@/schemas/auth";

export const useAuthActions = () => {
  const { login, register, getProfile } = useAuthService();
  const { setUser } = useAuth();

  // sự kiện login
  const loginAction = async (
    values: LoginFormValues,
    form: UseFormReturn<LoginFormValues>,
    onSucces?: () => void
  ) => {
    toast.dismiss();
    const payload = {
      login: values.usernameOrEmail,
      password: values.password,
    };

    const res = await login(payload);
    console.log("API login response: ", res);

    if (res.success) {
      const me = await getProfile();
      setUser(me.data);
      toast.success(res.message || "Đăng nhập thành công!");
      onSucces?.();
      return;
    }
    // Xử lý lỗi
    const apiError = res.error;
    const errors = (apiError.errors ?? []) as ApiFieldErrors;
    toast.error(res.message || apiError.message || "Đăng nhập thất bại");

    // lỗi field login map về usernameOrEmail
    if (errors.login?.[0]) {
      form.setError("usernameOrEmail", {
        type: "server",
        message: errors.login[0],
      });
    }

    // lỗi field password
    if (errors.password?.[0]) {
      form.setError("password", {
        type: "server",
        message: errors.password[0],
      });
    }

    if (errors.non_field_errors?.[0]) {
      console.warn("non_field_errors (login):", errors.non_field_errors[0]);
    }
  };

  // sự kiện Register
  const registerAction = async (
    values: RegisterFormValues,
    form: UseFormReturn<RegisterFormValues>,
    onSuccess?: () => void
  ) => {
    toast.dismiss();

    const payload = {
      full_name: values.full_name,
      username: values.username,
      email: values.email,
      password: values.password,
    };

    const res = await register(payload);
    console.log("API register trả về: ", res);

    if (res.success) {
      toast.success(
        res.message || "Đăng ký thành công! Vui lòng đăng nhập để tiếp tục."
      );
      form.reset();
      onSuccess?.();
      return;
    }

    // xử lý lỗi
    const apiError = res.error;
    const errors = (apiError.errors ?? {}) as ApiFieldErrors;
    toast.error(res.message || apiError.message || "Đăng ký thất bại.");

    if (errors.full_name?.[0]) {
      form.setError("full_name", {
        type: "server",
        message: errors.full_name[0],
      });
    }
    if (errors.username?.[0]) {
      form.setError("username", {
        type: "server",
        message: errors.username[0],
      });
    }
    if (errors.email?.[0]) {
      form.setError("email", {
        type: "server",
        message: errors.email[0],
      });
    }
    if (errors.password?.[0]) {
      form.setError("password", {
        type: "server",
        message: errors.password[0],
      });
    }

    if (errors.non_field_errors?.[0]) {
      console.warn("non_field_errors (register):", errors.non_field_errors[0]);
    }
  };
  return {
    loginAction,
    registerAction,
  };
};
