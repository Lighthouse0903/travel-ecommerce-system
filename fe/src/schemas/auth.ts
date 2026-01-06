import { z } from "zod";

// Login
export const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(1, "Vui lòng nhập email hoặc tên đăng nhập")
    .refine(
      (value) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
        /^[a-zA-Z0-9_]+$/.test(value),
      "Vui lòng nhập tên đăng nhập hoặc email hợp lệ"
    ),
  password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// register
export const registerSchema = z
  .object({
    full_name: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự").max(50),
    username: z
      .string()
      .min(2, "Tên người dùng phải có ít nhất 2 ký tự")
      .max(30),
    email: z.string().email("Email không hợp lệ"),
    password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa (A-Z)")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường (a-z)")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 số")
      .regex(/[^a-zA-Z0-9]/, "Phải chứa ít nhất 1 ký tự đặc biệt"),
    confirmPassword: z
      .string()
      .min(8, "Xác nhận mật khẩu phải có ít nhất 8 ký tự")
      .max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

// Change password
export const changePasswordSchema = z
  .object({
    current_password: z.string().min(8, "Mật khẩu phải có ít nhất 8 kí tự"),
    new_password: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/[A-Z]/, "Phải chứa ít nhất 1 chữ hoa (A-Z)")
      .regex(/[a-z]/, "Phải chứa ít nhất 1 chữ thường (a-z)")
      .regex(/[0-9]/, "Phải chứa ít nhất 1 số")
      .regex(/[^a-zA-Z0-9]/, "Phải chứa ít nhất 1 ký tự đặc biệt"),
    confirm_password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirm_password"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
